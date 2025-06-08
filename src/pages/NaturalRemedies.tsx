import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart,
  Search,
  Filter,
  Leaf,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Users,
  Calendar,
  Target
} from 'lucide-react';

export function NaturalRemedies() {
  const { remedies } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEffectiveness, setSelectedEffectiveness] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredRemedies = remedies.filter(remedy => {
    const matchesSearch = remedy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remedy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remedy.effectiveAgainst.some(target => 
                           target.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = !selectedCategory || remedy.category === selectedCategory;
    const matchesEffectiveness = !selectedEffectiveness || remedy.effectiveness === selectedEffectiveness;
    const matchesStatus = !selectedStatus || remedy.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesEffectiveness && matchesStatus;
  });

  const getEffectivenessColor = (effectiveness: string) => {
    const colors = {
      low: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-green-100 text-green-800'
    };
    return colors[effectiveness as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      organic: 'bg-green-100 text-green-800',
      biological: 'bg-blue-100 text-blue-800',
      mechanical: 'bg-purple-100 text-purple-800',
      cultural: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

  const getEffectivenessStars = (effectiveness: string) => {
    const stars = effectiveness === 'high' ? 3 : effectiveness === 'medium' ? 2 : 1;
    return Array.from({ length: 3 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Natural Remedies</h1>
          <p className="text-gray-600 mt-1">Eco-friendly solutions for plant health and pest management</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search remedies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none focus:outline-none text-sm w-48"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Categories</option>
              <option value="organic">Organic</option>
              <option value="biological">Biological</option>
              <option value="mechanical">Mechanical</option>
              <option value="cultural">Cultural</option>
            </select>
            <select
              value={selectedEffectiveness}
              onChange={(e) => setSelectedEffectiveness(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Effectiveness</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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
        {filteredRemedies.map((remedy) => (
          <div key={remedy.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Heart className="h-5 w-5 text-green-600 mr-2" />
                    {remedy.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(remedy.category)}`}>
                      {remedy.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getEffectivenessStars(remedy.effectiveness)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(remedy.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffectivenessColor(remedy.effectiveness)}`}>
                    {remedy.effectiveness}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{remedy.description}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <Target className="h-4 w-4 mr-1 text-blue-600" />
                    Effective Against
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {remedy.effectiveAgainst.slice(0, 3).map((target, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {target}
                      </span>
                    ))}
                    {remedy.effectiveAgainst.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{remedy.effectiveAgainst.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-green-600" />
                    Key Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {remedy.ingredients.slice(0, 3).map((ingredient, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {ingredient}
                      </span>
                    ))}
                    {remedy.ingredients.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{remedy.ingredients.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Preparation Steps
                </h4>
                <ol className="text-xs text-green-800 space-y-1">
                  {remedy.preparation.slice(0, 2).map((step, index) => (
                    <li key={index} className="flex">
                      <span className="font-medium mr-2">{index + 1}.</span>
                      <span className="line-clamp-1">{step}</span>
                    </li>
                  ))}
                  {remedy.preparation.length > 2 && (
                    <li className="text-gray-600 italic">+{remedy.preparation.length - 2} more steps...</li>
                  )}
                </ol>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-purple-600" />
                    Application Method
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {remedy.application.slice(0, 2).map((method, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {method}
                      </span>
                    ))}
                    {remedy.application.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{remedy.application.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-yellow-900 mb-1 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Safety Notes
                  </h4>
                  <div className="text-xs text-yellow-800">
                    {remedy.safetyNotes.slice(0, 2).map((note, index) => (
                      <div key={index} className="flex items-start mb-1">
                        <span className="w-1 h-1 bg-yellow-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span className="line-clamp-1">{note}</span>
                      </div>
                    ))}
                    {remedy.safetyNotes.length > 2 && (
                      <div className="text-gray-600 italic">+{remedy.safetyNotes.length - 2} more safety notes...</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(remedy.reportedAt).toLocaleDateString()}</span>
                </div>
                <span className="capitalize">{remedy.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRemedies.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No natural remedies found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}