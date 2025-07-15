import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, FileText, Calendar, Users, Plus, Edit, Trash2, Save, X, EyeOff } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import DefaultContentTemplate from '../components/DefaultContentTemplate';
import ApiService from '../api';

interface ResultData {
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
  data: ResultData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const Results: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<ResultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResult, setEditingResult] = useState<ResultData | null>(null);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const [formData, setFormData] = useState({
    category: 'Results',
    metaTitle: '',
    metaDescription: '',
    metaTags: '',
    keywords: '',
    contentTitle: '',
    contentDescription: '',
    content: '',
    isActive: true
  });

  // Fetch results from API
  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3110/latest-jobs/public/Results');
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setResults(data.data);
      } else {
        setError('Failed to fetch results');
      }
    } catch (err) {
      setError('Error fetching results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('adminToken') !== null;
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // Filter results based on search term
  const filteredResults = results.filter(result =>
    result.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.metaTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission for adding/editing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setError('Please login to perform this action');
      return;
    }
    
    try {
      const resultData = {
        ...formData,
        metaTags: formData.metaTags.split(',').map(tag => tag.trim()),
        keywords: formData.keywords.split(',').map(keyword => keyword.trim())
      };

              if (editingResult) {
          // Update existing result
          const response = await fetch(`http://localhost:3110/latest-jobs/admin/${editingResult._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
            },
            body: JSON.stringify(resultData)
          });

          if (response.ok) {
            await fetchResults();
            setEditingResult(null);
            setShowAddForm(false);
            resetForm();
          } else {
            setError('Failed to update result');
          }
        } else {
          // Add new result
          const response = await fetch('http://localhost:3110/latest-jobs/admin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
            },
            body: JSON.stringify(resultData)
          });

          if (response.ok) {
            await fetchResults();
            setShowAddForm(false);
            resetForm();
          } else {
            setError('Failed to add result');
          }
        }
    } catch (err) {
      setError('Error saving result');
      console.error('Error saving result:', err);
    }
  };

  // Delete result
  const handleDelete = async (id: string) => {
    if (!isAuthenticated()) {
      setError('Please login to perform this action');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        const response = await fetch(`http://localhost:3110/latest-jobs/admin/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          }
        });

        if (response.ok) {
          await fetchResults();
        } else {
          setError('Failed to delete result');
        }
      } catch (err) {
        setError('Error deleting result');
        console.error('Error deleting result:', err);
      }
    }
  };

  // Edit result
  const handleEdit = (result: ResultData) => {
    setEditingResult(result);
    setFormData({
      category: result.category,
      metaTitle: result.metaTitle,
      metaDescription: result.metaDescription,
      metaTags: result.metaTags.join(', '),
      keywords: result.keywords.join(', '),
      contentTitle: result.contentTitle,
      contentDescription: result.contentDescription,
      content: result.content || '',
      isActive: result.isActive
    });
    setShowAddForm(true);
  };

  // Edit content
  const handleEditContent = (result: ResultData) => {
    setEditingResult(result);
    setCurrentContent(result.content || '');
    setShowContentEditor(true);
  };

  // Save content
  const handleSaveContent = async () => {
    if (!isAuthenticated()) {
      setError('Please login to perform this action');
      return;
    }
    
    if (editingResult) {
      try {
        const response = await fetch(`http://localhost:3110/latest-jobs/admin/${editingResult._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          },
          body: JSON.stringify({
            ...editingResult,
            content: currentContent
          })
        });

        if (response.ok) {
          await fetchResults();
          setShowContentEditor(false);
          setEditingResult(null);
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
      category: 'Results',
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
    setEditingResult(null);
    setShowAddForm(false);
    setShowContentEditor(false);
    resetForm();
    setCurrentContent('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={fetchResults}
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
          <h1 className="text-2xl font-bold text-gray-900">Results Management</h1>
          <p className="text-gray-600">Manage exam results and publications</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Result
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search results..."
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
              {editingResult ? 'Edit Result' : 'Add New Result'}
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
                  placeholder="UPSC, Civil Services, Results, 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="UPSC, Civil Services, Results, Government Jobs"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingResult ? 'Update Result' : 'Add Result'}
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
              Edit Content - {editingResult?.contentTitle}
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
              placeholder="Enter result content here..."
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

      {/* Results Table */}
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
              {filteredResults.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{result.contentTitle}</div>
                        <div className="text-sm text-gray-500">{result.metaTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      result.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      {new Date(result.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditContent(result)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit Content"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(result)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(result._id)}
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
          <h3 className="text-sm font-medium text-gray-500">Total Results</h3>
          <p className="text-2xl font-bold text-gray-900">{results.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Active</h3>
          <p className="text-2xl font-bold text-green-600">{results.filter(r => r.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Inactive</h3>
          <p className="text-2xl font-bold text-red-600">{results.filter(r => !r.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(results.map(r => r.category)).size}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;