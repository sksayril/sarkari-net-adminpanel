import React from 'react';
import { Grid3X3, TrendingUp, Eye, Edit2, Plus, Users, Briefcase } from 'lucide-react';

const TopCategory: React.FC = () => {
  const categories = [
    {
      id: 1,
      name: 'Railway Jobs',
      description: 'Indian Railways recruitment and job opportunities',
      jobCount: 250,
      applicants: 125000,
      popularity: 95,
      isActive: true,
      growth: '+12%'
    },
    {
      id: 2,
      name: 'Banking Jobs',
      description: 'Public and private sector banking opportunities',
      jobCount: 180,
      applicants: 89000,
      popularity: 88,
      isActive: true,
      growth: '+8%'
    },
    {
      id: 3,
      name: 'SSC Jobs',
      description: 'Staff Selection Commission exam and jobs',
      jobCount: 320,
      applicants: 156000,
      popularity: 92,
      isActive: true,
      growth: '+15%'
    },
    {
      id: 4,
      name: 'UPSC Jobs',
      description: 'Union Public Service Commission opportunities',
      jobCount: 45,
      applicants: 78000,
      popularity: 85,
      isActive: true,
      growth: '+5%'
    },
    {
      id: 5,
      name: 'State PSC',
      description: 'State Public Service Commission jobs',
      jobCount: 150,
      applicants: 65000,
      popularity: 78,
      isActive: true,
      growth: '+7%'
    },
    {
      id: 6,
      name: 'Teaching Jobs',
      description: 'Government teaching and education positions',
      jobCount: 200,
      applicants: 95000,
      popularity: 82,
      isActive: true,
      growth: '+10%'
    },
  ];

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-600';
    if (popularity >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPopularityBg = (popularity: number) => {
    if (popularity >= 90) return 'bg-green-500';
    if (popularity >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Top Categories</h1>
          <p className="text-gray-600">Manage job categories and their performance</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Categories</h3>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <Grid3X3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Categories</h3>
              <p className="text-2xl font-bold text-green-600">
                {categories.filter(cat => cat.isActive).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Jobs</h3>
              <p className="text-2xl font-bold text-blue-600">
                {categories.reduce((sum, cat) => sum + cat.jobCount, 0)}
              </p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Applicants</h3>
              <p className="text-2xl font-bold text-purple-600">
                {categories.reduce((sum, cat) => sum + cat.applicants, 0).toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Grid3X3 className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                category.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{category.description}</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Jobs Available:</span>
                <span className="font-medium">{category.jobCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Applicants:</span>
                <span className="font-medium">{category.applicants.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Growth:</span>
                <span className="font-medium text-green-600">{category.growth}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Popularity</span>
                <span className={getPopularityColor(category.popularity)}>{category.popularity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPopularityBg(category.popularity)}`}
                  style={{ width: `${category.popularity}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Eye className="w-4 h-4 inline mr-1" />
                View
              </button>
              <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
                <Edit2 className="w-4 h-4 inline mr-1" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jobs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Popularity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Grid3X3 className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {category.jobCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {category.applicants.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span className={getPopularityColor(category.popularity)}>{category.popularity}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                        <div 
                          className={`h-2 rounded-full ${getPopularityBg(category.popularity)}`}
                          style={{ width: `${category.popularity}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {category.growth}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-green-600 hover:text-green-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopCategory;