import React, { useState, useEffect } from 'react';
import { Bot, Trash2, Edit3, Plus, AlertCircle } from 'lucide-react';
import ApiService, { SystemPrompt, CreateSystemPromptRequest, UpdateSystemPromptRequest } from '../api';
import SystemPromptModal from '../components/SystemPromptModal';

const AiBot: React.FC = () => {
  // System Prompt state
  const [systemPrompt, setSystemPrompt] = useState<SystemPrompt | null>(null);
  const [isLoadingSystemPrompt, setIsLoadingSystemPrompt] = useState(false);
  const [isCreatingSystemPrompt, setIsCreatingSystemPrompt] = useState(false);
  const [isUpdatingSystemPrompt, setIsUpdatingSystemPrompt] = useState(false);
  const [isDeletingSystemPrompt, setIsDeletingSystemPrompt] = useState(false);
  const [showSystemPromptModal, setShowSystemPromptModal] = useState(false);
  const [showEditSystemPromptModal, setShowEditSystemPromptModal] = useState(false);
  const [systemPromptError, setSystemPromptError] = useState('');







  // System Prompt API functions
  const loadSystemPrompt = async () => {
    try {
      setIsLoadingSystemPrompt(true);
      setSystemPromptError('');
      const response = await ApiService.getSystemPrompt();
      setSystemPrompt(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('No system prompt found')) {
        setSystemPrompt(null);
      } else {
        setSystemPromptError(error instanceof Error ? error.message : 'Failed to load system prompt');
      }
    } finally {
      setIsLoadingSystemPrompt(false);
    }
  };

  const handleCreateSystemPrompt = async (data: CreateSystemPromptRequest) => {
    try {
      setIsCreatingSystemPrompt(true);
      setSystemPromptError('');
      await ApiService.createSystemPrompt(data);
      await loadSystemPrompt();
      setShowSystemPromptModal(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create system prompt';
      setSystemPromptError(errorMessage);
      throw error;
    } finally {
      setIsCreatingSystemPrompt(false);
    }
  };

  const handleUpdateSystemPrompt = async (data: UpdateSystemPromptRequest) => {
    if (!systemPrompt) return;
    
    try {
      setIsUpdatingSystemPrompt(true);
      setSystemPromptError('');
      await ApiService.updateSystemPrompt(systemPrompt._id, data);
      await loadSystemPrompt();
      setShowEditSystemPromptModal(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update system prompt';
      setSystemPromptError(errorMessage);
      throw error;
    } finally {
      setIsUpdatingSystemPrompt(false);
    }
  };

  const handleDeleteSystemPrompt = async () => {
    if (!systemPrompt || !confirm('Are you sure you want to delete the system prompt? This will disable the AI bot.')) {
      return;
    }
    
    try {
      setIsDeletingSystemPrompt(true);
      setSystemPromptError('');
      await ApiService.deleteSystemPrompt(systemPrompt._id);
      setSystemPrompt(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete system prompt';
      setSystemPromptError(errorMessage);
    } finally {
      setIsDeletingSystemPrompt(false);
    }
  };

  // Load system prompt on component mount
  useEffect(() => {
    loadSystemPrompt();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Bot Management</h1>
          <p className="text-gray-600">Manage AI assistant and user interactions</p>
        </div>
        <div className="flex gap-2">
          {!systemPrompt && (
            <button 
              onClick={() => setShowSystemPromptModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create System Prompt
          </button>
          )}
        </div>
      </div>



      {/* System Prompt Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Prompt Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Prompt Status</h3>
            {systemPrompt && (
              <button
                onClick={() => setShowEditSystemPromptModal(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
            )}
          </div>
          
          {isLoadingSystemPrompt ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading system prompt...</p>
            </div>
          ) : systemPrompt ? (
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  systemPrompt.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {systemPrompt.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
                <p className="text-sm text-gray-700">{systemPrompt.description}</p>
      </div>

                <div>
                <p className="text-sm font-medium text-gray-900 mb-2">System Prompt</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-700 font-mono">{systemPrompt.systemPrompt}</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Created by {systemPrompt.createdBy.name} on {new Date(systemPrompt.createdAt).toLocaleDateString()}
          </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleDeleteSystemPrompt}
                  disabled={isDeletingSystemPrompt}
                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
          </div>
          ) : (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No System Prompt</h3>
              <p className="text-sm text-gray-600 mb-4">Create a system prompt to configure the AI bot</p>
              <button
                onClick={() => setShowSystemPromptModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create System Prompt
              </button>
            </div>
          )}
          
          {systemPromptError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700">{systemPromptError}</p>
            </div>
          </div>
          )}
        </div>

        {/* System Prompt Actions */}
        <div className="space-y-6">
          {/* System Prompt Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Prompt Info</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  systemPrompt && systemPrompt.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {systemPrompt && systemPrompt.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created By</span>
                <span className="text-sm font-medium">
                  {systemPrompt ? systemPrompt.createdBy.name : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created Date</span>
                <span className="text-sm font-medium">
                  {systemPrompt ? new Date(systemPrompt.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium">
                  {systemPrompt ? new Date(systemPrompt.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* System Prompt Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              {!systemPrompt ? (
                <button
                  onClick={() => setShowSystemPromptModal(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create System Prompt
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowEditSystemPromptModal(true)}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit System Prompt
                  </button>
                  <button
                    onClick={handleDeleteSystemPrompt}
                    disabled={isDeletingSystemPrompt}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete System Prompt
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* System Prompt Modals */}
      <SystemPromptModal
        isOpen={showSystemPromptModal}
        onClose={() => setShowSystemPromptModal(false)}
        onSubmit={async (data) => {
          if ('systemPrompt' in data && data.systemPrompt) {
            await handleCreateSystemPrompt(data as CreateSystemPromptRequest);
          }
        }}
        isLoading={isCreatingSystemPrompt}
        error={systemPromptError}
      />

      <SystemPromptModal
        isOpen={showEditSystemPromptModal}
        onClose={() => setShowEditSystemPromptModal(false)}
        onSubmit={async (data) => {
          await handleUpdateSystemPrompt(data as UpdateSystemPromptRequest);
        }}
        isLoading={isUpdatingSystemPrompt}
        systemPrompt={systemPrompt}
        error={systemPromptError}
      />
    </div>
  );
};

export default AiBot;