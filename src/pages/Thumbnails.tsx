import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Download, 
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Calendar,
  User,
  FileText,
  HardDrive
} from 'lucide-react';
import ApiService, { 
  Thumbnail, 
  CreateThumbnailRequest, 
  UpdateThumbnailRequest 
} from '../api';
import AddThumbnailModal from '../components/AddThumbnailModal';
import EditThumbnailModal from '../components/EditThumbnailModal';
import { toast } from 'react-hot-toast';

const Thumbnails: React.FC = () => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [filteredThumbnails, setFilteredThumbnails] = useState<Thumbnail[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<Thumbnail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load thumbnails on component mount
  useEffect(() => {
    loadThumbnails();
  }, []);

  // Filter thumbnails based on search term
  useEffect(() => {
    const filtered = thumbnails.filter(thumbnail =>
      thumbnail.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thumbnail.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thumbnail.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thumbnail.originalFileName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredThumbnails(filtered);
  }, [thumbnails, searchTerm]);

  const loadThumbnails = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getThumbnails();
      setThumbnails(response.data);
    } catch (error) {
      console.error('Error loading thumbnails:', error);
      toast.error('Failed to load thumbnails');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThumbnail = async (data: CreateThumbnailRequest) => {
    try {
      await ApiService.createThumbnail(data);
      toast.success('Thumbnail created successfully');
      setShowAddModal(false);
      loadThumbnails();
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      toast.error('Failed to create thumbnail');
    }
  };

  const handleUpdateThumbnail = async (id: string, data: UpdateThumbnailRequest) => {
    try {
      await ApiService.updateThumbnail(id, data);
      toast.success('Thumbnail updated successfully');
      setShowEditModal(false);
      setSelectedThumbnail(null);
      loadThumbnails();
    } catch (error) {
      console.error('Error updating thumbnail:', error);
      toast.error('Failed to update thumbnail');
    }
  };

  const handleDeleteThumbnail = async (id: string) => {
    if (!confirm('Are you sure you want to delete this thumbnail?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await ApiService.deleteThumbnail(id);
      toast.success('Thumbnail deleted successfully');
      loadThumbnails();
    } catch (error) {
      console.error('Error deleting thumbnail:', error);
      toast.error('Failed to delete thumbnail');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (thumbnail: Thumbnail) => {
    setSelectedThumbnail(thumbnail);
    setShowEditModal(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:3119${imageUrl}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Thumbnail Management</h1>
              <p className="text-gray-600 mt-2">Manage and organize your thumbnail images</p>
            </div>
                         {thumbnails.length === 0 ? (
               <button
                 onClick={() => setShowAddModal(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               >
                 <Plus className="w-5 h-5" />
                 Add Thumbnail
               </button>
             ) : (
               <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                 <Plus className="w-5 h-5" />
                 Add Thumbnail (Max 1 Allowed)
               </div>
             )}
          </div>
        </div>

        {/* Search and Stats */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search thumbnails by title, description, URL, or filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Thumbnails</p>
                  <p className="text-2xl font-bold text-gray-900">{thumbnails.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {thumbnails.filter(t => t.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <HardDrive className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatFileSize(thumbnails.reduce((acc, t) => acc + t.fileSize, 0))}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <LinkIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">With URLs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {thumbnails.filter(t => t.url).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails Grid */}
        {filteredThumbnails.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No thumbnails found' : 'No thumbnails yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Get started by adding your first thumbnail'
              }
            </p>
                         {!searchTerm && thumbnails.length === 0 && (
               <button
                 onClick={() => setShowAddModal(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
               >
                 <Plus className="w-5 h-5" />
                 Add First Thumbnail
               </button>
             )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredThumbnails.map((thumbnail) => (
              <div
                key={thumbnail._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={getImageUrl(thumbnail.imageUrl)}
                    alt={thumbnail.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUMxMDkuNDU2IDgxIDExOCA4OS41NDQgMTE4IDEwMEMxMTggMTEwLjQ1NiAxMDkuNDU2IDExOSA5OSAxMTlDODguNTQ0IDExOSA4MCAxMTAuNDU2IDgwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE2MCAxMjBIMTQwVjEwMEgxNjBWMTIwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTYwIDE0MEgxNDBWMTIwSDE2MFYxNDBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNjAgMTYwSDE0MFYxNDBIMTYwVjE2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTE0MCAxNjBIMTIwVjE0MEgxNDBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDE2MEg4MFYxNDBIMTAwVjE2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTYwIDE2MEg0MFYxNDBINjBWMTYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      thumbnail.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {thumbnail.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {thumbnail.title}
                  </h3>
                  
                  {thumbnail.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {thumbnail.description}
                    </p>
                  )}

                  {/* File Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FileText className="w-3 h-3" />
                      <span>{thumbnail.originalFileName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <HardDrive className="w-3 h-3" />
                      <span>{formatFileSize(thumbnail.fileSize)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(thumbnail.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User className="w-3 h-3" />
                      <span>{thumbnail.createdBy.name}</span>
                    </div>
                  </div>

                  {/* URL if exists */}
                  {thumbnail.url && (
                    <div className="mb-4">
                      <a
                        href={thumbnail.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <LinkIcon className="w-3 h-3" />
                        <span className="truncate">View URL</span>
                      </a>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(thumbnail)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteThumbnail(thumbnail._id)}
                      disabled={isDeleting}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

             {/* Add Thumbnail Modal */}
       <AddThumbnailModal
         isOpen={showAddModal}
         onClose={() => setShowAddModal(false)}
         onSubmit={handleCreateThumbnail}
         isLoading={false}
         hasExistingThumbnail={thumbnails.length > 0}
       />

      {/* Edit Thumbnail Modal */}
      {selectedThumbnail && (
        <EditThumbnailModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedThumbnail(null);
          }}
                     onSubmit={(data: UpdateThumbnailRequest) => handleUpdateThumbnail(selectedThumbnail._id, data)}
          isLoading={false}
          thumbnail={selectedThumbnail}
        />
      )}
    </div>
  );
};

export default Thumbnails; 