import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, FileText, Calendar, Users, Plus, Edit, Trash2, Save, X, EyeOff, Star, TrendingUp } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import DefaultContentTemplate from '../components/DefaultContentTemplate';
import ApiService from '../api';

interface ImportanceData {
  _id: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  metaTags: string[];
  keywords: string[];
  contentTitle: string;
  contentDescription: string;
  content?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: ImportanceData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const Importance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [importantItems, setImportantItems] = useState<ImportanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ImportanceData | null>(null);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const [formData, setFormData] = useState({
    category: 'Importance',
    metaTitle: '',
    metaDescription: '',
    metaTags: '',
    keywords: '',
    contentTitle: '',
    contentDescription: '',
    content: '',
    isActive: true
  });

  // Fetch important items from API
  const fetchImportantItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3110/latest-jobs/public/Importance');
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setImportantItems(data.data);
      } else {
        setError('Failed to fetch important items');
      }
    } catch (err) {
      setError('Error fetching important items');
      console.error('Error fetching important items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('adminToken') !== null;
  };

  useEffect(() => {
    fetchImportantItems();
  }, []);

  // Filter important items based on search term
  const filteredImportantItems = importantItems.filter(item =>
    item.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.metaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission for adding/editing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setError('Please login to perform this action');
      return;
    }
    
    try {
      const itemData = {
        ...formData,
        metaTags: formData.metaTags.split(',').map(tag => tag.trim()),
        keywords: formData.keywords.split(',').map(keyword => keyword.trim())
      };

      if (editingItem) {
        // Update existing item
        const response = await fetch(`http://localhost:3110/latest-jobs/admin/${editingItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          },
          body: JSON.stringify(itemData)
        });

        if (response.ok) {
          await fetchImportantItems();
          setEditingItem(null);
          setShowAddForm(false);
          resetForm();
        } else {
          setError('Failed to update important item');
        }
      } else {
        // Add new item
        const response = await fetch('http://localhost:3110/latest-jobs/admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          },
          body: JSON.stringify(itemData)
        });

        if (response.ok) {
          await fetchImportantItems();
          setShowAddForm(false);
          resetForm();
        } else {
          setError('Failed to add important item');
        }
      }
    } catch (err) {
      setError('Error saving important item');
      console.error('Error saving important item:', err);
    }
  };

  // Delete important item
  const handleDelete = async (id: string) => {
    if (!isAuthenticated()) {
      setError('Please login to perform this action');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this important item?')) {
      try {
        const response = await fetch(`http://localhost:3110/latest-jobs/admin/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          }
        });

        if (response.ok) {
          await fetchImportantItems();
        } else {
          setError('Failed to delete important item');
        }
      } catch (err) {
        setError('Error deleting important item');
        console.error('Error deleting important item:', err);
      }
    }
  };

  // Edit important item
  const handleEdit = (item: ImportanceData) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      metaTags: item.metaTags.join(', '),
      keywords: item.keywords.join(', '),
      contentTitle: item.contentTitle,
      contentDescription: item.contentDescription,
      content: item.content || '',
      isActive: item.isActive
    });
    setShowAddForm(true);
  };

  // Edit content
  const handleEditContent = (item: ImportanceData) => {
    setEditingItem(item);
    setCurrentContent(item.content || '');
    setShowContentEditor(true);
  };

  // Save content
  const handleSaveContent = async () => {
    if (!isAuthenticated()) {
      setError('Please login to perform this action');
      return;
    }
    
    if (editingItem) {
      try {
        const response = await fetch(`http://localhost:3110/latest-jobs/admin/${editingItem._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          },
          body: JSON.stringify({
            ...editingItem,
            content: currentContent
          })
        });

        if (response.ok) {
          await fetchImportantItems();
          setShowContentEditor(false);
          setEditingItem(null);
          setCurrentContent('');
        } else {
          setError('Failed to update content');
        }
      } catch (err) {
        setError('Error saving content');
        console.error('Error saving content:', err);
      }
    }
  };

  // Use template
  const handleUseTemplate = (template: string) => {
    setCurrentContent(template);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      category: 'Importance',
      metaTitle: '',
      metaDescription: '',
      metaTags: '',
      keywords: '',
      contentTitle: '',
      contentDescription: '',
      content: '',
      isActive: true
    });
  };

  // Cancel form
  const handleCancel = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setShowContentEditor(false);
    resetForm();
    setCurrentContent('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading important items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={fetchImportantItems}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Important Notifications</h1>
          <p className="text-gray-600">Manage high-priority announcements and updates</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Important Notice
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search important items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingItem ? 'Edit Important Item' : 'Add New Important Item'}
            </h2>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
                <input
                  type="text"
                  value={formData.contentTitle}
                  onChange={(e) => setFormData({ ...formData, contentTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Active Status</label>
                <select
                  value={formData.isActive.toString()}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Description</label>
              <div className="space-y-2">
                <DefaultContentTemplate onUseTemplate={(template) => setFormData({ ...formData, contentDescription: template })} />
                <RichTextEditor
                  value={formData.contentDescription}
                  onChange={(value) => setFormData({ ...formData, contentDescription: value })}
                  placeholder="Enter content description here..."
                  rows={6}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.metaTags}
                  onChange={(e) => setFormData({ ...formData, metaTags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="UPSC, Civil Services, Important, 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="UPSC, Civil Services, Important, Government Jobs"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingItem ? 'Update Important Item' : 'Add Important Item'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content Editor */}
      {showContentEditor && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Edit Content - {editingItem?.contentTitle}
            </h2>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <DefaultContentTemplate onUseTemplate={handleUseTemplate} />
            
            <RichTextEditor
              value={currentContent}
              onChange={setCurrentContent}
              placeholder="Enter important item content here..."
              rows={15}
            />
            
            <div className="flex gap-2">
              <button
                onClick={handleSaveContent}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Content
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Important Items Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredImportantItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.contentTitle}</div>
                        <div className="text-sm text-gray-500">{item.metaTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditContent(item)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit Content"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Important Items</h3>
          <p className="text-2xl font-bold text-gray-900">{importantItems.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-green-600">{importantItems.filter(i => i.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Inactive</h3>
          <p className="text-2xl font-bold text-red-600">{importantItems.filter(i => !i.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(importantItems.map(i => i.category)).size}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Importance;