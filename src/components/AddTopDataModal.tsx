import React, { useState, useEffect } from 'react';
import { X, Save, Palette } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import DefaultContentTemplate from './DefaultContentTemplate';
import { TopData, CreateTopDataRequest, UpdateTopDataRequest } from '../api';

interface AddTopDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTopDataRequest | UpdateTopDataRequest) => Promise<void>;
  isLoading: boolean;
  topData?: TopData | null; // For editing mode
}

const AddTopDataModal: React.FC<AddTopDataModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  topData
}) => {
  const [formData, setFormData] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: [] as string[],
    tags: [] as string[],
    contentTitle: '',
    contentDescription: '',
    colorCode: '#000000'
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Initialize form data when editing
  useEffect(() => {
    if (topData) {
      setFormData({
        metaTitle: topData.metaTitle,
        metaDescription: topData.metaDescription,
        keywords: topData.keywords,
        tags: topData.tags,
        contentTitle: topData.contentTitle,
        contentDescription: topData.contentDescription,
        colorCode: topData.colorCode
      });
    } else {
      // Reset form for new data
      setFormData({
        metaTitle: '',
        metaDescription: '',
        keywords: [],
        tags: [],
        contentTitle: '',
        contentDescription: '',
        colorCode: '#000000'
      });
    }
  }, [topData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {topData ? 'Edit Top Data' : 'Add New Top Data'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title *
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter meta title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Title *
              </label>
              <input
                type="text"
                value={formData.contentTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, contentTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter content title"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter meta description"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Code
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.colorCode}
                onChange={(e) => setFormData(prev => ({ ...prev, colorCode: e.target.value }))}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.colorCode}
                onChange={(e) => setFormData(prev => ({ ...prev, colorCode: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="#000000"
              />
              <Palette className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addKeyword)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add keyword and press Enter"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addTag)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rich Text Editor for Content Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Description *
            </label>
            
            {/* Template Section */}
            <DefaultContentTemplate 
              onUseTemplate={(template) => setFormData(prev => ({ ...prev, contentDescription: template }))}
            />
            
            <RichTextEditor
              value={formData.contentDescription}
              onChange={(value) => setFormData(prev => ({ ...prev, contentDescription: value }))}
              placeholder="Enter content description with rich formatting..."
              className="min-h-[200px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.metaTitle || !formData.contentTitle || !formData.contentDescription}
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
                  {topData ? 'Update' : 'Create'} Top Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTopDataModal; 