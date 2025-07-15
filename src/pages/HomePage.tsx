import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Users, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Edit3, 
  Plus, 
  Folder, 
  FolderOpen,
  FileText,
  Settings,
  RefreshCw,
  Trash2,
  Palette,
  Eye,
  EyeOff,
  Home,
  Link,
  MessageCircle
} from 'lucide-react';
import ApiService, { 
  MainCategory, 
  CreateMainCategoryRequest, 
  SubCategory, 
  CreateSubCategoryRequest, 
  UpdateSubCategoryRequest,
  TopData,
  CreateTopDataRequest,
  UpdateTopDataRequest,
  HomeContent,
  CreateHomeContentRequest,
  UpdateHomeContentRequest
} from '../api';
import AddMainCategoryModal from '../components/AddMainCategoryModal';
import AddSubCategoryModal from '../components/AddSubCategoryModal';
import EditSubCategoryModal from '../components/EditSubCategoryModal';
import AddTopDataModal from '../components/AddTopDataModal';
import HomeContentModal from '../components/HomeContentModal';
import Notification from '../components/Notification';



// Using MainCategory and SubCategory from API types

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home-content' | 'top-data' | 'main-categories' | 'sub-categories'>('home-content');
  const [isLoading, setIsLoading] = useState(false);

  // Load categories when component mounts or tab changes
  useEffect(() => {
    if (activeTab === 'home-content') {
      loadHomeContent();
    } else if (activeTab === 'top-data') {
      loadTopData();
    } else if (activeTab === 'main-categories') {
      loadMainCategories();
    } else if (activeTab === 'sub-categories') {
      loadSubCategories();
    }
  }, [activeTab]);

  const loadHomeContent = async () => {
    try {
      setIsLoadingHomeContent(true);
      setError('');
      const response = await ApiService.getHomeContentList();
      setHomeContentList(response.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load home content');
    } finally {
      setIsLoadingHomeContent(false);
    }
  };

  const loadTopData = async () => {
    try {
      setIsLoadingTopData(true);
      setError('');
      const response = await ApiService.getTopDataList();
      setTopDataList(response.topDataList);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load top data');
    } finally {
      setIsLoadingTopData(false);
    }
  };

  const loadSubCategories = async () => {
    try {
      setIsLoadingSubCategories(true);
      setError('');
      const response = await ApiService.getSubCategories();
      setSubCategories(response.subCategories);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load sub categories');
    } finally {
      setIsLoadingSubCategories(false);
    }
  };

  const handleCreateSubCategory = async (categoryData: CreateSubCategoryRequest) => {
    try {
      setIsCreatingSubCategory(true);
      setError('');
      await ApiService.createSubCategory(categoryData);
      // Reload sub categories after successful creation
      await loadSubCategories();
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Sub category created successfully!',
        isVisible: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create sub category';
      setError(errorMessage);
      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
      throw error; // Re-throw to keep modal open
    } finally {
      setIsCreatingSubCategory(false);
    }
  };

  const handleUpdateSubCategory = async (id: string, categoryData: UpdateSubCategoryRequest) => {
    try {
      setIsUpdatingSubCategory(true);
      setError('');
      await ApiService.updateSubCategory(id, categoryData);
      // Reload sub categories after successful update
      await loadSubCategories();
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Sub category updated successfully!',
        isVisible: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update sub category';
      setError(errorMessage);
      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
      throw error; // Re-throw to keep modal open
    } finally {
      setIsUpdatingSubCategory(false);
    }
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setShowEditSubCategoryModal(true);
  };

  // Top Data CRUD functions
  const handleCreateTopData = async (data: CreateTopDataRequest) => {
    try {
      setIsCreatingTopData(true);
      setError('');
      await ApiService.createTopData(data);
      await loadTopData();
      setShowAddTopDataModal(false);
      setNotification({
        type: 'success',
        message: 'Top data created successfully!',
        isVisible: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create top data';
      setError(errorMessage);
      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
      throw error;
    } finally {
      setIsCreatingTopData(false);
    }
  };

  const handleUpdateTopData = async (data: UpdateTopDataRequest) => {
    if (!selectedTopData) return;
    
    try {
      setIsUpdatingTopData(true);
      setError('');
      await ApiService.updateTopData(selectedTopData._id, data);
      await loadTopData();
      setShowEditTopDataModal(false);
      setSelectedTopData(null);
      setNotification({
        type: 'success',
        message: 'Top data updated successfully!',
        isVisible: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update top data';
      setError(errorMessage);
      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
      throw error;
    } finally {
      setIsUpdatingTopData(false);
    }
  };

  const handleDeleteTopData = async (id: string) => {
    if (!confirm('Are you sure you want to delete this top data?')) return;
    
    try {
      setIsDeletingTopData(true);
      setError('');
      await ApiService.deleteTopData(id);
      await loadTopData();
      setNotification({
        type: 'success',
        message: 'Top data deleted successfully!',
        isVisible: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete top data';
      setError(errorMessage);
      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
    } finally {
      setIsDeletingTopData(false);
    }
  };

  const handleEditTopData = (topData: TopData) => {
    setSelectedTopData(topData);
    setShowEditTopDataModal(true);
  };

  // Home Content CRUD functions
  const handleCreateHomeContent = async (data: CreateHomeContentRequest) => {
    try {
      setIsCreatingHomeContent(true);
      setError('');
      await ApiService.createHomeContent(data);
      await loadHomeContent();
      setShowAddHomeContentModal(false);
      setNotification({
        type: 'success',
        message: 'Home content created successfully!',
        isVisible: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create home content';
      setError(errorMessage);
      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
      throw error;
    } finally {
      setIsCreatingHomeContent(false);
    }
  };

  const handleUpdateHomeContent = async (data: UpdateHomeContentRequest) => {
    if (!selectedHomeContent) return;
    
    try {
      setIsUpdatingHomeContent(true);
      setError('');
      await ApiService.updateHomeContent(selectedHomeContent._id, data);
      await loadHomeContent();
      setShowEditHomeContentModal(false);
      setSelectedHomeContent(null);
      setNotification({
        type: 'success',
        message: 'Home content updated successfully!',
        isVisible: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update home content';
      setError(errorMessage);
      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
      throw error;
    } finally {
      setIsUpdatingHomeContent(false);
    }
  };

  const handleDeleteHomeContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this home content?')) return;
    
    try {
      setIsDeletingHomeContent(true);
      setError('');
      await ApiService.deleteHomeContent(id);
      await loadHomeContent();
      setNotification({
        type: 'success',
        message: 'Home content deleted successfully!',
        isVisible: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete home content';
      setError(errorMessage);
      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
    } finally {
      setIsDeletingHomeContent(false);
    }
  };

  const handleEditHomeContent = (homeContent: HomeContent) => {
    setSelectedHomeContent(homeContent);
    setShowEditHomeContentModal(true);
  };

  const loadMainCategories = async () => {
    try {
      setIsLoadingMainCategories(true);
      setError('');
      const response = await ApiService.getMainCategories();
      setMainCategories(response.categories);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load main categories');
    } finally {
      setIsLoadingMainCategories(false);
    }
  };

  const handleCreateMainCategory = async (categoryData: CreateMainCategoryRequest) => {
    try {
      setIsCreatingCategory(true);
      setError('');
      await ApiService.createMainCategory(categoryData);
      // Reload categories after successful creation
      await loadMainCategories();
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Main category created successfully!',
        isVisible: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create main category';
      setError(errorMessage);
      setNotification({
        type: 'error',
        message: errorMessage,
        isVisible: true
      });
      throw error; // Re-throw to keep modal open
    } finally {
      setIsCreatingCategory(false);
    }
  };



  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [isLoadingMainCategories, setIsLoadingMainCategories] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    isVisible: boolean;
  }>({
    type: 'success',
    message: '',
    isVisible: false
  });

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  const [isCreatingSubCategory, setIsCreatingSubCategory] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  const [isUpdatingSubCategory, setIsUpdatingSubCategory] = useState(false);
  const [showEditSubCategoryModal, setShowEditSubCategoryModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

  // Top Data state
  const [topDataList, setTopDataList] = useState<TopData[]>([]);
  const [isLoadingTopData, setIsLoadingTopData] = useState(false);
  const [isCreatingTopData, setIsCreatingTopData] = useState(false);
  const [isUpdatingTopData, setIsUpdatingTopData] = useState(false);
  const [isDeletingTopData, setIsDeletingTopData] = useState(false);
  const [showAddTopDataModal, setShowAddTopDataModal] = useState(false);
  const [showEditTopDataModal, setShowEditTopDataModal] = useState(false);
  const [selectedTopData, setSelectedTopData] = useState<TopData | null>(null);

  // Home Content state
  const [homeContentList, setHomeContentList] = useState<HomeContent[]>([]);
  const [isLoadingHomeContent, setIsLoadingHomeContent] = useState(false);
  const [isCreatingHomeContent, setIsCreatingHomeContent] = useState(false);
  const [isUpdatingHomeContent, setIsUpdatingHomeContent] = useState(false);
  const [isDeletingHomeContent, setIsDeletingHomeContent] = useState(false);
  const [showAddHomeContentModal, setShowAddHomeContentModal] = useState(false);
  const [showEditHomeContentModal, setShowEditHomeContentModal] = useState(false);
  const [selectedHomeContent, setSelectedHomeContent] = useState<HomeContent | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Management</h1>
          <p className="text-gray-600">Configure and manage your website's homepage content</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsLoading(true)}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Edit3 className="w-4 h-4" />
          Edit Homepage
        </button>
      </div>
          </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('home-content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'home-content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home Content
            </div>
            </button>
            <button
              onClick={() => setActiveTab('top-data')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'top-data'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Top Data
            </div>
            </button>
            <button
              onClick={() => setActiveTab('main-categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'main-categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Main Categories
            </div>
            </button>
            <button
              onClick={() => setActiveTab('sub-categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sub-categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Sub Categories
            </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Home Content Tab */}
          {activeTab === 'home-content' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Home Content Management</h3>
                <button 
                  onClick={() => setShowAddHomeContentModal(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Home Content
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {isLoadingHomeContent ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading home content...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {homeContentList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No home content found. Create your first home content!
                    </div>
                  ) : (
                    homeContentList.map((item) => (
                      <div key={item._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Created by {item.createdBy.name}</span>
                              <span>•</span>
                              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        {/* Social Links */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Link className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-blue-600">{item.telegramLink}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">{item.whatsappLink}</span>
                          </div>
                        </div>
                        
                        {/* FAQs Preview */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">FAQs ({item.faqs.length})</p>
                          <div className="space-y-2">
                            {item.faqs.slice(0, 2).map((faq, index) => (
                              <div key={index} className="text-sm">
                                <p className="font-medium text-gray-900">Q: {faq.question}</p>
                                <p className="text-gray-600">A: {faq.answer}</p>
                              </div>
                            ))}
                            {item.faqs.length > 2 && (
                              <p className="text-xs text-gray-500">+{item.faqs.length - 2} more FAQs</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Home className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Home Content</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditHomeContent(item)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteHomeContent(item._id)}
                              disabled={isDeletingHomeContent}
                              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Top Data Tab */}
          {activeTab === 'top-data' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Top Data Management</h3>
                <button 
                  onClick={() => setShowAddTopDataModal(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Top Data
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {isLoadingTopData ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading top data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topDataList.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No top data found. Create your first top data!
                    </div>
                  ) : (
                    topDataList.map((item) => (
                      <div key={item._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div 
                                className="w-4 h-4 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: item.colorCode }}
                              ></div>
                              <h4 className="font-semibold text-gray-900">{item.contentTitle}</h4>
                            </div>
                            <p className="text-sm text-gray-500">
                              Meta: {item.metaTitle}
                            </p>
                            <p className="text-sm text-gray-500">
                              Created by {item.createdBy.name} on {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-gray-700 line-clamp-2">{item.metaDescription}</p>
                        </div>
                        
                        {/* Keywords and Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.keywords.slice(0, 3).map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {keyword}
                            </span>
                          ))}
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500 font-mono">{item.colorCode}</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditTopData(item)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteTopData(item._id)}
                              disabled={isDeletingTopData}
                              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Main Categories Tab */}
          {activeTab === 'main-categories' && (
        <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Main Categories</h3>
                <button 
                  onClick={() => setShowAddCategoryModal(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {isLoadingMainCategories ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading main categories...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mainCategories.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No main categories found. Create your first category!
                    </div>
                  ) : (
                    mainCategories.map((category) => (
                      <div key={category._id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <Folder className="w-6 h-6 text-blue-600" />
                          <span className="text-xs text-gray-500">
                            Created by {category.createdBy.name}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{category.title}</h4>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-500">
                            Created: {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                        </div>
              <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit
                </button>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                            View Sub-categories
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sub Categories Tab */}
          {activeTab === 'sub-categories' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Sub Categories</h3>
                <button 
                  onClick={() => setShowAddSubCategoryModal(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Sub Category
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {isLoadingSubCategories ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading sub categories...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subCategories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No sub categories found. Create your first sub category!
                    </div>
                  ) : (
                    subCategories.map((subCategory) => (
                      <div key={subCategory._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{subCategory.contentTitle}</h4>
                            <p className="text-sm text-blue-600 mt-1">
                              Parent: {subCategory.mainCategory.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Meta: {subCategory.metaTitle}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500">
                              Created by {subCategory.createdBy.name}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3 line-clamp-2">{subCategory.metaDescription}</p>
                        
                        {/* Keywords and Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {subCategory.keywords.slice(0, 3).map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {keyword}
                            </span>
                          ))}
                          {subCategory.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Created: {new Date(subCategory.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditSubCategory(subCategory)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Main Category Modal */}
      <AddMainCategoryModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSubmit={handleCreateMainCategory}
        isLoading={isCreatingCategory}
      />

      {/* Add Sub Category Modal */}
      <AddSubCategoryModal
        isOpen={showAddSubCategoryModal}
        onClose={() => setShowAddSubCategoryModal(false)}
        onSubmit={handleCreateSubCategory}
        isLoading={isCreatingSubCategory}
        mainCategories={mainCategories}
      />

      {/* Edit Sub Category Modal */}
      <EditSubCategoryModal
        isOpen={showEditSubCategoryModal}
        onClose={() => {
          setShowEditSubCategoryModal(false);
          setSelectedSubCategory(null);
        }}
        onSubmit={handleUpdateSubCategory}
        isLoading={isUpdatingSubCategory}
        subCategory={selectedSubCategory}
      />

      {/* Add Top Data Modal */}
      <AddTopDataModal
        isOpen={showAddTopDataModal}
        onClose={() => setShowAddTopDataModal(false)}
        onSubmit={async (data) => {
          if ('metaTitle' in data && data.metaTitle) {
            await handleCreateTopData(data as CreateTopDataRequest);
          }
        }}
        isLoading={isCreatingTopData}
      />

      {/* Edit Top Data Modal */}
      <AddTopDataModal
        isOpen={showEditTopDataModal}
        onClose={() => {
          setShowEditTopDataModal(false);
          setSelectedTopData(null);
        }}
        onSubmit={async (data) => {
          await handleUpdateTopData(data as UpdateTopDataRequest);
        }}
        isLoading={isUpdatingTopData}
        topData={selectedTopData}
      />

      {/* Add Home Content Modal */}
      <HomeContentModal
        isOpen={showAddHomeContentModal}
        onClose={() => setShowAddHomeContentModal(false)}
        onSubmit={async (data) => {
          if ('title' in data && data.title) {
            await handleCreateHomeContent(data as CreateHomeContentRequest);
          }
        }}
        isLoading={isCreatingHomeContent}
        error={error}
      />

      {/* Edit Home Content Modal */}
      <HomeContentModal
        isOpen={showEditHomeContentModal}
        onClose={() => {
          setShowEditHomeContentModal(false);
          setSelectedHomeContent(null);
        }}
        onSubmit={async (data) => {
          await handleUpdateHomeContent(data as UpdateHomeContentRequest);
        }}
        isLoading={isUpdatingHomeContent}
        homeContent={selectedHomeContent}
        error={error}
      />

      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default HomePage;