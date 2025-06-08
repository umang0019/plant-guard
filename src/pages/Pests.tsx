import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Bug,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Leaf,
  Shield,
  Target,
  Info
} from 'lucide-react';

export function Pests() {
  const { pests } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');

  const filteredPests = pests.filter(pest => {
    const matchesSearch = pest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pest.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !selectedSeverity || pest.severity === selectedSeverity;
    const matchesStatus = !selectedStatus || pest.status === selectedStatus;
    const matchesSeason = !selectedSeason || pest.seasonality.includes(selectedSeason);
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesSeason;
  });

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getHarmIcon = (harmType: string) => {
    switch (harmType) {
      case 'plants':
        return '🌱';
      case 'humans':
        return '👤';
      case 'animals':
        return '🐾';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plant Pests</h1>
          <p className="text-gray-600 mt-1">Identify, monitor, and manage plant pests effectively</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search pests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none focus:outline-none text-sm w-48"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Seasons</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPests.map((pest) => (
          <div key={pest.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {pest.images.length > 0 && (
              <div className="h-48 bg-gray-200">
                <img
                  src={pest.images[0]}
                  alt={pest.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Bug className="h-5 w-5 text-orange-600 mr-2" />
                    {pest.name}
                  </h3>
                  <p className="text-sm text-gray-500 italic">{pest.scientificName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(pest.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(pest.severity)}`}>
                    {pest.severity}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pest.description}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-green-600" />
                    Affected Plants
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {pest.affectedPlants.slice(0, 3).map((plant, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {plant}
                      </span>
                    ))}
                    {pest.affectedPlants.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{pest.affectedPlants.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
                    Symptoms
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {pest.symptoms.slice(0, 3).map((symptom, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {symptom}
                      </span>
                    ))}
                    {pest.symptoms.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{pest.symptoms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-orange-900 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Lifecycle & Behavior
                </h4>
                <p className="text-xs text-orange-800">{pest.lifecycle}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-blue-600" />
                    Prevention
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {pest.prevention.slice(0, 2).map((method, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {method}
                      </span>
                    ))}
                    {pest.prevention.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{pest.prevention.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <Target className="h-4 w-4 mr-1 text-purple-600" />
                    Treatment
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {pest.treatment.slice(0, 2).map((treatment, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {treatment}
                      </span>
                    ))}
                    {pest.treatment.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{pest.treatment.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Harmful to:</span>
                    {pest.harmfulTo.map((harm, index) => (
                      <span key={index} className="text-sm" title={harm}>
                        {getHarmIcon(harm)}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pest.seasonality.map((season, index) => (
                      <span key={index} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        {season}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(pest.reportedAt).toLocaleDateString()}</span>
                </div>
                <span className="capitalize">{pest.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPests.length === 0 && (
        <div className="text-center py-12">
          <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pests found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}