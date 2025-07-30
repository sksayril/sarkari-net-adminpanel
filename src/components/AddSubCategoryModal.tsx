import React, { useState, useEffect } from 'react';
import { X, FolderOpen, AlertCircle, Plus, X as XIcon } from 'lucide-react';
import { CreateSubCategoryRequest, MainCategory } from '../api';
import RichTextEditor from './RichTextEditor';
import DefaultContentTemplate from './DefaultContentTemplate';

interface AddSubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryData: CreateSubCategoryRequest) => Promise<void>;
  isLoading: boolean;
  mainCategories: MainCategory[];
}

const AddSubCategoryModal: React.FC<AddSubCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  mainCategories
}) => {
  const [formData, setFormData] = useState<CreateSubCategoryRequest>({
    mainCategory: '',
    metaTitle: 'Sarkari Result 2025 | Sarkari Result Jobs',
    metaDescription: 'SaarkariResult.com for Sarkari Result, Sarkari Result jobs, Sarkari Result admit cards & Sarkari Result online forms. Sarkari Result 2025 live updates',
    keywords: [
      'sarkari result',
      'sarkari result.com',
      'sarkari result 2025',
      'saarkariresult',
      'sarkari result.in',
      'sarkari results 2025',
      'sarkariresult',
      'Sarkari Result',
      'Sarkari Results',
      'Sarkari Result 2025',
      'Sarkari Naukri',
      'Sarkari Job',
      'Government Jobs 2025',
      'Free Job Alert 2025',
      'saarkariresult.com Sarkari Naukri',
      'saarkariresult.com Sarkari Result',
      'Bank Recruitment 2025',
      'Railway Recruitment 2025',
      'saarkariresult.com',
      'Sarkari Exam Portal',
      'saarkariresult.com Admit Card',
      'saarkariresult.com Answer Keys',
      'SSC Recruitment 2025',
      'UPSC Exam Notifications 2025',
      'Police Recruitment 2025',
      'Defence Recruitment 2025'
    ],
    tags: [
      'sarkari result',
      'sarkari result.com',
      'sarkari result 2025',
      'saarkariresult',
      'sarkari result.in',
      'sarkari results 2025',
      'sarkariresult',
      'Sarkari Result',
      'Sarkari Results',
      'Sarkari Result 2025',
      'Sarkari Naukri',
      'Sarkari Job',
      'Government Jobs 2025',
      'Free Job Alert 2025',
      'saarkariresult.com Sarkari Naukri',
      'saarkariresult.com Sarkari Result',
      'Bank Recruitment 2025',
      'Railway Recruitment 2025',
      'saarkariresult.com',
      'Sarkari Exam Portal',
      'saarkariresult.com Admit Card',
      'saarkariresult.com Answer Keys',
      'SSC Recruitment 2025',
      'UPSC Exam Notifications 2025',
      'Police Recruitment 2025',
      'Defence Recruitment 2025'
    ],
    contentTitle: '',
    contentDescription: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.mainCategory) {
      newErrors.mainCategory = 'Main category is required';
    }

    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = 'Meta title is required';
    } else if (formData.metaTitle.trim().length < 3) {
      newErrors.metaTitle = 'Meta title must be at least 3 characters';
    } else if (formData.metaTitle.trim().length > 60) {
      newErrors.metaTitle = 'Meta title must be less than 60 characters';
    }

    if (!formData.metaDescription.trim()) {
      newErrors.metaDescription = 'Meta description is required';
    } else if (formData.metaDescription.trim().length < 10) {
      newErrors.metaDescription = 'Meta description must be at least 10 characters';
    } else if (formData.metaDescription.trim().length > 160) {
      newErrors.metaDescription = 'Meta description must be less than 160 characters';
    }

    if (formData.keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (!formData.contentTitle.trim()) {
      newErrors.contentTitle = 'Content title is required';
    } else if (formData.contentTitle.trim().length < 3) {
      newErrors.contentTitle = 'Content title must be at least 3 characters';
    }

    if (!formData.contentDescription.trim()) {
      newErrors.contentDescription = 'Content description is required';
    } else if (formData.contentDescription.trim().length < 50) {
      newErrors.contentDescription = 'Content description must be at least 50 characters';
    }

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
      mainCategory: '',
      metaTitle: 'Sarkari Result 2025 | Sarkari Result Jobs',
      metaDescription: 'SaarkariResult.com for Sarkari Result, Sarkari Result jobs, Sarkari Result admit cards & Sarkari Result online forms. Sarkari Result 2025 live updates',
      keywords: [
        'sarkari result',
        'sarkari result.com',
        'sarkari result 2025',
        'saarkariresult',
        'sarkari result.in',
        'sarkari results 2025',
        'sarkariresult',
        'Sarkari Result',
        'Sarkari Results',
        'Sarkari Result 2025',
        'Sarkari Naukri',
        'Sarkari Job',
        'Government Jobs 2025',
        'Free Job Alert 2025',
        'saarkariresult.com Sarkari Naukri',
        'saarkariresult.com Sarkari Result',
        'Bank Recruitment 2025',
        'Railway Recruitment 2025',
        'saarkariresult.com',
        'Sarkari Exam Portal',
        'saarkariresult.com Admit Card',
        'saarkariresult.com Answer Keys',
        'SSC Recruitment 2025',
        'UPSC Exam Notifications 2025',
        'Police Recruitment 2025',
        'Defence Recruitment 2025'
      ],
      tags: [
        'sarkari result',
        'sarkari result.com',
        'sarkari result 2025',
        'saarkariresult',
        'sarkari result.in',
        'sarkari results 2025',
        'sarkariresult',
        'Sarkari Result',
        'Sarkari Results',
        'Sarkari Result 2025',
        'Sarkari Naukri',
        'Sarkari Job',
        'Government Jobs 2025',
        'Free Job Alert 2025',
        'saarkariresult.com Sarkari Naukri',
        'saarkariresult.com Sarkari Result',
        'Bank Recruitment 2025',
        'Railway Recruitment 2025',
        'saarkariresult.com',
        'Sarkari Exam Portal',
        'saarkariresult.com Admit Card',
        'saarkariresult.com Answer Keys',
        'SSC Recruitment 2025',
        'UPSC Exam Notifications 2025',
        'Police Recruitment 2025',
        'Defence Recruitment 2025'
      ],
      contentTitle: '',
      contentDescription: ''
    });
    setErrors({});
    setKeywordInput('');
    setTagInput('');
    onClose();
  };

  const handleInputChange = (field: keyof CreateSubCategoryRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim();
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData(prev => ({ ...prev, keywords: [...prev.keywords, keyword] }));
      setKeywordInput('');
      if (errors.keywords) {
        setErrors(prev => ({ ...prev, keywords: '' }));
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({ ...prev, keywords: prev.keywords.filter(k => k !== keyword) }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
      if (errors.tags) {
        setErrors(prev => ({ ...prev, tags: '' }));
      }
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const resetMetaToDefaults = () => {
    handleInputChange('metaTitle', 'Sarkari Result 2025 | Sarkari Result Jobs');
    handleInputChange('metaDescription', 'SaarkariResult.com for Sarkari Result, Sarkari Result jobs, Sarkari Result admit cards & Sarkari Result online forms. Sarkari Result 2025 live updates');
  };

  const resetKeywordsToDefaults = () => {
    const defaultKeywords = [
      'sarkari result',
      'sarkari result.com',
      'sarkari result 2025',
      'saarkariresult',
      'sarkari result.in',
      'sarkari results 2025',
      'sarkariresult',
      'Sarkari Result',
      'Sarkari Results',
      'Sarkari Result 2025',
      'Sarkari Naukri',
      'Sarkari Job',
      'Government Jobs 2025',
      'Free Job Alert 2025',
      'saarkariresult.com Sarkari Naukri',
      'saarkariresult.com Sarkari Result',
      'Bank Recruitment 2025',
      'Railway Recruitment 2025',
      'saarkariresult.com',
      'Sarkari Exam Portal',
      'saarkariresult.com Admit Card',
      'saarkariresult.com Answer Keys',
      'SSC Recruitment 2025',
      'UPSC Exam Notifications 2025',
      'Police Recruitment 2025',
      'Defence Recruitment 2025'
    ];
    setFormData(prev => ({ ...prev, keywords: defaultKeywords }));
    if (errors.keywords) {
      setErrors(prev => ({ ...prev, keywords: '' }));
    }
  };

  const resetTagsToDefaults = () => {
    const defaultTags = [
      'sarkari result',
      'sarkari result.com',
      'sarkari result 2025',
      'saarkariresult',
      'sarkari result.in',
      'sarkari results 2025',
      'sarkariresult',
      'Sarkari Result',
      'Sarkari Results',
      'Sarkari Result 2025',
      'Sarkari Naukri',
      'Sarkari Job',
      'Government Jobs 2025',
      'Free Job Alert 2025',
      'saarkariresult.com Sarkari Naukri',
      'saarkariresult.com Sarkari Result',
      'Bank Recruitment 2025',
      'Railway Recruitment 2025',
      'saarkariresult.com',
      'Sarkari Exam Portal',
      'saarkariresult.com Admit Card',
      'saarkariresult.com Answer Keys',
      'SSC Recruitment 2025',
      'UPSC Exam Notifications 2025',
      'Police Recruitment 2025',
      'Defence Recruitment 2025'
    ];
    setFormData(prev => ({ ...prev, tags: defaultTags }));
    if (errors.tags) {
      setErrors(prev => ({ ...prev, tags: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add Sub Category</h3>
              <p className="text-sm text-gray-600">Create a new sub category with rich content</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Category *
            </label>
            <select
              value={formData.mainCategory}
              onChange={(e) => handleInputChange('mainCategory', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.mainCategory ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a main category</option>
              {mainCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            {errors.mainCategory && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.mainCategory}</p>
              </div>
            )}
          </div>

          {/* Meta Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Meta Title *
              </label>
              <button
                type="button"
                onClick={() => handleInputChange('metaTitle', 'Sarkari Result 2025 | Sarkari Result Jobs')}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Use Default
              </button>
            </div>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.metaTitle ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter meta title for SEO"
              maxLength={60}
            />
            {errors.metaTitle && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.metaTitle}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.metaTitle.length}/60 characters
            </p>
          </div>

          {/* Reset Both Meta Fields Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={resetMetaToDefaults}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              Reset Both Meta Fields to Defaults
            </button>
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Meta Description *
              </label>
              <button
                type="button"
                onClick={() => handleInputChange('metaDescription', 'SaarkariResult.com for Sarkari Result, Sarkari Result jobs, Sarkari Result admit cards & Sarkari Result online forms. Sarkari Result 2025 live updates')}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Use Default
              </button>
            </div>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.metaDescription ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter meta description for SEO"
              maxLength={160}
            />
            {errors.metaDescription && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.metaDescription}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.metaDescription.length}/160 characters
            </p>
          </div>

          {/* Keywords */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Keywords *
              </label>
              <button
                type="button"
                onClick={resetKeywordsToDefaults}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Use Default Keywords
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addKeyword)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter keyword and press Enter"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.keywords && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.keywords}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags *
              </label>
              <button
                type="button"
                onClick={resetTagsToDefaults}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Use Default Tags
              </button>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTag)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.tags && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.tags}</p>
              </div>
            )}
          </div>

          {/* Content Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Title *
            </label>
            <input
              type="text"
              value={formData.contentTitle}
              onChange={(e) => handleInputChange('contentTitle', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.contentTitle ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter content title"
            />
            {errors.contentTitle && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.contentTitle}</p>
              </div>
            )}
          </div>

          {/* Content Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Description *
            </label>
            
            {/* Template Section */}
            <DefaultContentTemplate 
              onUseTemplate={(template) => handleInputChange('contentDescription', template)}
            />
            
            <RichTextEditor
              value={formData.contentDescription}
              onChange={(value) => handleInputChange('contentDescription', value)}
              placeholder="Enter content description..."
              rows={8}
            />
            {errors.contentDescription && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.contentDescription}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Use the toolbar to format your content. Press Ctrl+Enter to toggle preview.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Sub Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategoryModal; 