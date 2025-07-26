import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, FileText, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Thumbnail, UpdateThumbnailRequest } from '../api';

interface EditThumbnailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateThumbnailRequest) => Promise<void>;
  isLoading: boolean;
  thumbnail: Thumbnail;
}

const EditThumbnailModal: React.FC<EditThumbnailModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  thumbnail
}) => {
  const [formData, setFormData] = useState({
    title: thumbnail.title,
    description: thumbnail.description || '',
    url: thumbnail.url || '',
    isActive: thumbnail.isActive
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when thumbnail changes
  useEffect(() => {
    setFormData({
      title: thumbnail.title,
      description: thumbnail.description || '',
      url: thumbnail.url || '',
      isActive: thumbnail.isActive
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setErrors({});
  }, [thumbnail]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'File size must be less than 5MB' }));
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({ ...prev, image: '' }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'File size must be less than 5MB' }));
        return;
      }
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, image: '' }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updateData: UpdateThumbnailRequest = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      url: formData.url.trim() || undefined,
      isActive: formData.isActive
    };

    // Add image if a new one was selected
    if (selectedFile) {
      updateData.image = selectedFile;
    }

    await onSubmit(updateData);
  };

  const handleClose = () => {
    setFormData({
      title: thumbnail.title,
      description: thumbnail.description || '',
      url: thumbnail.url || '',
      isActive: thumbnail.isActive
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const getImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:3119${imageUrl}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Thumbnail</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Image
            </label>
            <div className="border border-gray-200 rounded-lg p-4">
              <img
                src={getImageUrl(thumbnail.imageUrl)}
                alt={thumbnail.title}
                className="mx-auto max-h-32 rounded-lg shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUMxMDkuNDU2IDgxIDExOCA4OS41NDQgMTE4IDEwMEMxMTggMTEwLjQ1NiAxMDkuNDU2IDExOSA5OSAxMTlDODguNTQ0IDExOSA4MCAxMTAuNDU2IDgwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2MCAxMjBIMTQwVjEwMEgxNjBWMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTYwIDE0MEgxNDBWMTIwSDE2MFYxNDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNjAgMTYwSDE0MFYxNDBIMTYwVjE2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE0MCAxNjBIMTIwVjE0MEgxNDBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDE2MEg4MFYxNDBIMTAwVjE2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTYwIDE2MEg0MFYxNDBINjBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                }}
              />
              <div className="mt-2 text-center text-sm text-gray-600">
                <p className="font-medium">{thumbnail.originalFileName}</p>
                <p>{(thumbnail.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </div>

          {/* New Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Replace Image (Optional)
            </label>
            
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                errors.image 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto max-h-48 rounded-lg shadow-sm"
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{selectedFile?.name}</p>
                    <p>{(selectedFile?.size || 0 / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove New Image
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p>PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
            
            {errors.image && (
              <div className="flex items-center gap-1 mt-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.image}</p>
              </div>
            )}
          </div>

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
              placeholder="Enter thumbnail title"
              maxLength={100}
            />
            {errors.title && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.title}</p>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter thumbnail description (optional)"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Associated URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.url ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com (optional)"
              />
            </div>
            {errors.url && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-600">{errors.url}</p>
              </div>
            )}
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
              {formData.isActive ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Active thumbnails will be visible to users
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
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Update Thumbnail
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditThumbnailModal; 