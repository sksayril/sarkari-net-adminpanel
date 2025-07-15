import React from 'react';
import { Users, Briefcase, FileText, TrendingUp, Calendar, Award, Bell, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Total Employees', value: '1,234', icon: Users, color: 'bg-blue-500', change: '+12%' },
    { title: 'Active Jobs', value: '567', icon: Briefcase, color: 'bg-green-500', change: '+8%' },
    { title: 'Results Published', value: '89', icon: FileText, color: 'bg-purple-500', change: '+23%' },
    { title: 'Applications', value: '2,345', icon: TrendingUp, color: 'bg-orange-500', change: '+15%' },
  ];

  const recentActivities = [
    { title: 'New job posting published', time: '2 hours ago', type: 'job' },
    { title: 'Result declared for SSC CGL', time: '4 hours ago', type: 'result' },
    { title: 'Admit card released', time: '1 day ago', type: 'admit' },
    { title: 'New employee registered', time: '2 days ago', type: 'employee' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-blue-100">Here's what's happening with your platform today.</p>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <Bell className="w-5 h-5 text-gray-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
              <Briefcase className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Add Job</p>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
              <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Publish Result</p>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
              <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Add Certificate</p>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
              <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-orange-900">Manage Users</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;