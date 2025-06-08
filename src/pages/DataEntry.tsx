import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { DiseaseForm } from '../components/DataEntry/DiseaseForm';
import { PestForm } from '../components/DataEntry/PestForm';
import { RemedyForm } from '../components/DataEntry/RemedyForm';
import {
  Upload,
  Leaf,
  Bug,
  Heart,
  Plus,
  CheckCircle
} from 'lucide-react';

export function DataEntry() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'disease' | 'pest' | 'remedy'>('disease');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const tabs = [
    { id: 'disease', name: 'Disease Report', icon: Leaf, color: 'text-green-600' },
    { id: 'pest', name: 'Pest Report', icon: Bug, color: 'text-orange-600' },
    { id: 'remedy', name: 'Natural Remedy', icon: Heart, color: 'text-blue-600' }
  ];

  const handleSubmissionSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  if (!user || (user.role !== 'admin' && user.role !== 'data_entry')) {
    return (
      <div className="text-center py-12">
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500">You don't have permission to access data entry features</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Entry</h1>
          <p className="text-gray-600 mt-1">Submit new reports for diseases, pests, and natural remedies</p>
        </div>
        {showSuccessMessage && (
          <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Report submitted successfully!</span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
                      ? `border-b-2 border-current ${tab.color}`
                      : 'text-gray-500 hover:text-gray-700'
                  } whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-sm flex items-center transition-colors`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'disease' && <DiseaseForm onSuccess={handleSubmissionSuccess} />}
          {activeTab === 'pest' && <PestForm onSuccess={handleSubmissionSuccess} />}
          {activeTab === 'remedy' && <RemedyForm onSuccess={handleSubmissionSuccess} />}
        </div>
      </div>
    </div>
  );
}