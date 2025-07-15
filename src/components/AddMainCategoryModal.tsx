import React, { useState } from 'react';
import { X, Folder, AlertCircle } from 'lucide-react';
import { CreateMainCategoryRequest } from '../api';

interface AddMainCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryData: CreateMainCategoryRequest) => Promise<void>;
  isLoading: boolean;
}

const AddMainCategoryModal: React.FC<AddMainCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<CreateMainCategoryRequest>({
    title: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Category title is required';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Category title must be at least 2 characters';
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'Category title must be less than 50 characters';
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
    setFormData({ title: '' });
    setErrors({});
    onClose();
  };

  const handleInputChange = (value: string) => {
    setFormData({ title: value });
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Folder className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add Main Category</h3>
              <p className="text-sm text-gray-600">Create a new main category</p>
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* Category Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Title
            </label>
            <div className="relative">
              <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter category title"
                maxLength={50}
              />
            </div>
            {errors.title && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.title}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/50 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
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
                'Create Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMainCategoryModal; 