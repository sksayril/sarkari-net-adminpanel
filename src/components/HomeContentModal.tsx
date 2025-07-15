import React, { useState, useEffect } from 'react';
import { X, Save, Home, Plus, Trash2, AlertCircle, Link, MessageCircle } from 'lucide-react';
import { HomeContent, CreateHomeContentRequest, UpdateHomeContentRequest, FAQ } from '../api';

interface HomeContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHomeContentRequest | UpdateHomeContentRequest) => Promise<void>;
  isLoading: boolean;
  homeContent?: HomeContent | null; // For editing mode
  error?: string;
}

const HomeContentModal: React.FC<HomeContentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  homeContent,
  error
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    telegramLink: '',
    whatsappLink: '',
    faqs: [{ question: '', answer: '' }] as FAQ[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when editing
  useEffect(() => {
    if (homeContent) {
      setFormData({
        title: homeContent.title,
        description: homeContent.description,
        telegramLink: homeContent.telegramLink,
        whatsappLink: homeContent.whatsappLink,
        faqs: homeContent.faqs.length > 0 ? homeContent.faqs : [{ question: '', answer: '' }]
      });
    } else {
      // Reset form for new home content
      setFormData({
        title: '',
        description: '',
        telegramLink: '',
        whatsappLink: '',
        faqs: [{ question: '', answer: '' }]
      });
    }
    setErrors({});
  }, [homeContent, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.telegramLink.trim()) {
      newErrors.telegramLink = 'Telegram link is required';
    } else if (!formData.telegramLink.startsWith('https://t.me/')) {
      newErrors.telegramLink = 'Telegram link must start with https://t.me/';
    }

    if (!formData.whatsappLink.trim()) {
      newErrors.whatsappLink = 'WhatsApp link is required';
    } else if (!formData.whatsappLink.startsWith('https://wa.me/')) {
      newErrors.whatsappLink = 'WhatsApp link must start with https://wa.me/';
    }

    // Validate FAQs
    formData.faqs.forEach((faq, index) => {
      if (!faq.question.trim()) {
        newErrors[`faq-${index}-question`] = 'Question is required';
      }
      if (!faq.answer.trim()) {
        newErrors[`faq-${index}-answer`] = 'Answer is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      telegramLink: '',
      whatsappLink: '',
      faqs: [{ question: '', answer: '' }]
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFormData(prev => ({ ...prev, faqs: newFaqs }));
    
    const errorKey = `faq-${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFAQ = (index: number) => {
    if (formData.faqs.length > 1) {
      setFormData(prev => ({
        ...prev,
        faqs: prev.faqs.filter((_, i) => i !== index)
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {homeContent ? 'Edit Home Content' : 'Create Home Content'}
              </h2>
              <p className="text-sm text-gray-600">
                {homeContent 
                  ? 'Update the homepage content and FAQs' 
                  : 'Create new homepage content with FAQs'
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-1">Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter homepage title"
            />
            {errors.title && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.title}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter homepage description"
            />
            {errors.description && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.description}</p>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telegram Link *
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={formData.telegramLink}
                  onChange={(e) => handleInputChange('telegramLink', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.telegramLink ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://t.me/yourchannel"
                />
              </div>
              {errors.telegramLink && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600">{errors.telegramLink}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Link *
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={formData.whatsappLink}
                  onChange={(e) => handleInputChange('whatsappLink', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.whatsappLink ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://wa.me/1234567890"
                />
              </div>
              {errors.whatsappLink && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600">{errors.whatsappLink}</p>
                </div>
              )}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                FAQs *
              </label>
              <button
                type="button"
                onClick={addFAQ}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add FAQ
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">FAQ {index + 1}</h4>
                    {formData.faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFAQ(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Question *
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                          errors[`faq-${index}-question`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter question"
                      />
                      {errors[`faq-${index}-question`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`faq-${index}-question`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Answer *
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                        rows={2}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                          errors[`faq-${index}-answer`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter answer"
                      />
                      {errors[`faq-${index}-answer`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`faq-${index}-answer`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {homeContent ? 'Update' : 'Create'} Home Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomeContentModal; 