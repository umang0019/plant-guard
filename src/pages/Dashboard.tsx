import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bug,
  Leaf,
  Heart,
  MapPin
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { diseases, pests, remedies } = useData();

  const stats = {
    totalDiseases: diseases.length,
    totalPests: pests.length,
    totalRemedies: remedies.length,
    pendingApprovals: [...diseases, ...pests, ...remedies].filter(item => item.status === 'pending').length,
    criticalIssues: [...diseases, ...pests].filter(item => item.severity === 'critical').length,
    recentReports: [...diseases, ...pests, ...remedies]
      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
      .slice(0, 5)
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor, textColor }: any) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm border border-opacity-20`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor} opacity-80`}>{title}</p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getItemTypeIcon = (item: any) => {
    if (item.hasOwnProperty('symptoms')) {
      return item.hasOwnProperty('causedBy') ? Leaf : Bug;
    }
    return Heart;
  };

  const getItemType = (item: any) => {
    if (item.hasOwnProperty('symptoms')) {
      return item.hasOwnProperty('causedBy') ? 'Disease' : 'Pest';
    }
    return 'Remedy';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your plant health monitoring system</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Location</p>
          <p className="text-gray-900 font-medium flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {user?.location}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Diseases"
          value={stats.totalDiseases}
          icon={Leaf}
          color="bg-green-500"
          bgColor="bg-green-50"
          textColor="text-green-900"
        />
        <StatCard
          title="Total Pests"
          value={stats.totalPests}
          icon={Bug}
          color="bg-orange-500"
          bgColor="bg-orange-50"
          textColor="text-orange-900"
        />
        <StatCard
          title="Natural Remedies"
          value={stats.totalRemedies}
          icon={Heart}
          color="bg-blue-500"
          bgColor="bg-blue-50"
          textColor="text-blue-900"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={Clock}
          color="bg-yellow-500"
          bgColor="bg-yellow-50"
          textColor="text-yellow-900"
        />
      </div>

      {/* Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.recentReports.map((item: any) => {
              const Icon = getItemTypeIcon(item);
              return (
                <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg mr-3">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{getItemType(item)} • {new Date(item.reportedAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : item.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts and Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Critical Alerts</h2>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {stats.criticalIssues > 0 ? (
              <div className="flex items-start p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    {stats.criticalIssues} Critical Issues Detected
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Immediate attention required for high-severity plant health issues
                  </p>
                </div>
              </div>
            ) : null}
            
            {stats.pendingApprovals > 0 && (user?.role === 'admin' || user?.role === 'approver') ? (
              <div className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    {stats.pendingApprovals} Items Awaiting Approval
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    New submissions require your review and approval
                  </p>
                </div>
              </div>
            ) : null}
            
            <div className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">System Status: Healthy</p>
                <p className="text-xs text-green-700 mt-1">
                  All monitoring systems are operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {(user?.role === 'admin' || user?.role === 'data_entry') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Leaf className="h-6 w-6 text-green-600 mr-3" />
              <span className="text-sm font-medium text-green-900">Report Disease</span>
            </button>
            <button className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <Bug className="h-6 w-6 text-orange-600 mr-3" />
              <span className="text-sm font-medium text-orange-900">Report Pest</span>
            </button>
            <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Heart className="h-6 w-6 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-blue-900">Add Remedy</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}