import React, { useState, useEffect } from 'react';
import { X, Save, Bot, AlertCircle } from 'lucide-react';
import { SystemPrompt, CreateSystemPromptRequest, UpdateSystemPromptRequest } from '../api';

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSystemPromptRequest | UpdateSystemPromptRequest) => Promise<void>;
  isLoading: boolean;
  systemPrompt?: SystemPrompt | null; // For editing mode
  error?: string;
}

const SystemPromptModal: React.FC<SystemPromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  systemPrompt,
  error
}) => {
  const [formData, setFormData] = useState({
    systemPrompt: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when editing
  useEffect(() => {
    if (systemPrompt) {
      setFormData({
        systemPrompt: systemPrompt.systemPrompt,
        description: systemPrompt.description
      });
    } else {
      // Reset form for new system prompt
      setFormData({
        systemPrompt: '',
        description: ''
      });
    }
    setErrors({});
  }, [systemPrompt, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.systemPrompt.trim()) {
      newErrors.systemPrompt = 'System prompt is required';
    } else if (formData.systemPrompt.trim().length < 50) {
      newErrors.systemPrompt = 'System prompt must be at least 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
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
      systemPrompt: '',
      description: ''
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {systemPrompt ? 'Edit System Prompt' : 'Create System Prompt'}
              </h2>
              <p className="text-sm text-gray-600">
                {systemPrompt 
                  ? 'Update the AI bot system prompt' 
                  : 'Create a new system prompt for the AI bot'
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

        {/* Important Notice */}
        {!systemPrompt && (
          <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Important Notice</h4>
                <p className="text-sm text-yellow-700">
                  Only one system prompt can be active at a time. If a system prompt already exists, 
                  you must update the existing one instead of creating a new one.
                </p>
              </div>
            </div>
          </div>
        )}

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
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter a description for this system prompt"
            />
            {errors.description && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.description}</p>
              </div>
            )}
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Prompt *
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
              rows={12}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm ${
                errors.systemPrompt ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter the system prompt for the AI bot..."
            />
            {errors.systemPrompt && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.systemPrompt}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.systemPrompt.length} characters (minimum 50)
            </p>
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
              disabled={isLoading || !formData.systemPrompt.trim() || !formData.description.trim()}
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
                  {systemPrompt ? 'Update' : 'Create'} System Prompt
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemPromptModal; 