import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Leaf,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react';

export function Diseases() {
  const { diseases } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredDiseases = diseases.filter(disease => {
    const matchesSearch = disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disease.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !selectedSeverity || disease.severity === selectedSeverity;
    const matchesStatus = !selectedStatus || disease.status === selectedStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
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

  const getCauseIcon = (cause: string) => {
    switch (cause) {
      case 'pest':
        return '🐛';
      case 'weather':
        return '🌦️';
      case 'fungal':
        return '🍄';
      case 'bacterial':
        return '🦠';
      case 'viral':
        return '🧬';
      case 'nutrient':
        return '🧪';
      default:
        return '❓';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plant Diseases</h1>
          <p className="text-gray-600 mt-1">Monitor and track plant disease occurrences</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search diseases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none focus:outline-none text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
        {filteredDiseases.map((disease) => (
          <div key={disease.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {disease.images.length > 0 && (
              <div className="h-48 bg-gray-200">
                <img
                  src={disease.images[0]}
                  alt={disease.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Leaf className="h-5 w-5 text-green-600 mr-2" />
                  {disease.name}
                </h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(disease.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(disease.severity)}`}>
                    {disease.severity}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{disease.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="text-lg mr-2">{getCauseIcon(disease.causedBy)}</span>
                  <span>Caused by {disease.causedBy}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{disease.location.region}, {disease.location.country}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(disease.reportedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Weather Conditions</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Thermometer className="h-3 w-3 mr-1" />
                    <span>{disease.weather.temperature}°C</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-3 w-3 mr-1" />
                    <span>{disease.weather.humidity}%</span>
                  </div>
                  <div className="flex items-center">
                    <Wind className="h-3 w-3 mr-1" />
                    <span>{disease.weather.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-3 w-3 mr-1" />
                    <span>{disease.weather.rainfall}mm</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Symptoms</h4>
                  <div className="flex flex-wrap gap-1">
                    {disease.symptoms.slice(0, 3).map((symptom, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {symptom}
                      </span>
                    ))}
                    {disease.symptoms.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{disease.symptoms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Treatment</h4>
                  <div className="flex flex-wrap gap-1">
                    {disease.treatment.slice(0, 2).map((treatment, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {treatment}
                      </span>
                    ))}
                    {disease.treatment.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{disease.treatment.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDiseases.length === 0 && (
        <div className="text-center py-12">
          <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No diseases found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}