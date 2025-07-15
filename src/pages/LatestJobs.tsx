import React, { useState } from 'react';
import { Search, Plus, Calendar, MapPin, Building, Clock } from 'lucide-react';

const LatestJobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const jobs = [
    {
      id: 1,
      title: 'Software Engineer',
      organization: 'Railway Corporation',
      location: 'New Delhi',
      type: 'Full-time',
      deadline: '2024-02-15',
      applicants: 1250,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Bank Manager',
      organization: 'State Bank of India',
      location: 'Mumbai',
      type: 'Full-time',
      deadline: '2024-02-20',
      applicants: 890,
      status: 'Active'
    },
    {
      id: 3,
      title: 'Tax Inspector',
      organization: 'Income Tax Department',
      location: 'Bangalore',
      type: 'Full-time',
      deadline: '2024-01-30',
      applicants: 2150,
      status: 'Expired'
    },
    {
      id: 4,
      title: 'Police Constable',
      organization: 'Delhi Police',
      location: 'Delhi',
      type: 'Full-time',
      deadline: '2024-03-01',
      applicants: 3200,
      status: 'Active'
    },
  ];

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Latest Jobs</h1>
          <p className="text-gray-600">Manage job postings and applications</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Job
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Building className="w-4 h-4 mr-1" />
                  <span className="text-sm">{job.organization}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{job.location}</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                job.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {job.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Deadline: {job.deadline}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{job.type}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {job.applicants} applicants
              </span>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View
                </button>
                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Jobs</h3>
          <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
          <p className="text-2xl font-bold text-green-600">{jobs.filter(j => j.status === 'Active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Total Applicants</h3>
          <p className="text-2xl font-bold text-blue-600">{jobs.reduce((sum, job) => sum + job.applicants, 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Expired Jobs</h3>
          <p className="text-2xl font-bold text-red-600">{jobs.filter(j => j.status === 'Expired').length}</p>
        </div>
      </div>
    </div>
  );
};

export default LatestJobs;