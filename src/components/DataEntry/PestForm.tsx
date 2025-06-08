import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Pest } from '../../types';
import { Plus, X, Link } from 'lucide-react';

interface PestFormProps {
  onSuccess: () => void;
}

export function PestForm({ onSuccess }: PestFormProps) {
  const { user } = useAuth();
  const { addPest, diseases, remedies } = useData();
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    images: [''],
    affectedPlants: [''],
    symptoms: [''],
    lifecycle: '',
    prevention: [''],
    treatment: [''],
    naturalRemedies: [''],
    harmfulTo: ['plants'] as ('plants' | 'humans' | 'animals')[],
    severity: 'medium' as const,
    seasonality: [] as string[],
    relatedDiseases: [] as string[],
    relatedRemedies: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pestData: Omit<Pest, 'id' | 'reportedAt'> = {
      ...formData,
      images: formData.images.filter(i => i.trim()),
      affectedPlants: formData.affectedPlants.filter(p => p.trim()),
      symptoms: formData.symptoms.filter(s => s.trim()),
      prevention: formData.prevention.filter(p => p.trim()),
      treatment: formData.treatment.filter(t => t.trim()),
      naturalRemedies: formData.naturalRemedies.filter(r => r.trim()),
      reportedBy: user!.id,
      status: 'pending'
    };

    addPest(pestData);
    onSuccess();
    
    // Reset form
    setFormData({
      name: '',
      scientificName: '',
      description: '',
      images: [''],
      affectedPlants: [''],
      symptoms: [''],
      lifecycle: '',
      prevention: [''],
      treatment: [''],
      naturalRemedies: [''],
      harmfulTo: ['plants'],
      severity: 'medium',
      seasonality: [],
      relatedDiseases: [],
      relatedRemedies: []
    });
  };

  const addArrayField = (field: 'images' | 'affectedPlants' | 'symptoms' | 'prevention' | 'treatment' | 'naturalRemedies') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'images' | 'affectedPlants' | 'symptoms' | 'prevention' | 'treatment' | 'naturalRemedies', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field: 'images' | 'affectedPlants' | 'symptoms' | 'prevention' | 'treatment' | 'naturalRemedies', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const harmOptions = ['plants', 'humans', 'animals'] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pest Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., Aphids"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Scientific Name</label>
          <input
            type="text"
            value={formData.scientificName}
            onChange={(e) => setFormData(prev => ({ ...prev, scientificName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="e.g., Aphidoidea"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Detailed description of the pest..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Lifecycle & Behavior *</label>
        <textarea
          required
          rows={2}
          value={formData.lifecycle}
          onChange={(e) => setFormData(prev => ({ ...prev, lifecycle: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Describe the pest's lifecycle, reproduction, and behavior patterns..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
          <select
            required
            value={formData.severity}
            onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Harmful To *</label>
          <div className="space-y-2">
            {harmOptions.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.harmfulTo.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        harmfulTo: [...prev.harmfulTo, option]
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        harmfulTo: prev.harmfulTo.filter(h => h !== option)
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <span className="capitalize">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Active Seasons</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {seasons.map(season => (
            <label key={season} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.seasonality.includes(season)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      seasonality: [...prev.seasonality, season]
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      seasonality: prev.seasonality.filter(s => s !== season)
                    }));
                  }
                }}
                className="mr-2"
              />
              <span>{season}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dynamic Arrays */}
      {(['images', 'affectedPlants', 'symptoms', 'prevention', 'treatment', 'naturalRemedies'] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {field === 'affectedPlants' ? 'Affected Plants' : 
             field === 'naturalRemedies' ? 'Natural Remedies' : field} *
          </label>
          {formData[field].map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type={field === 'images' ? 'url' : 'text'}
                required
                value={item}
                onChange={(e) => updateArrayField(field, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={
                  field === 'images' ? 'https://example.com/image.jpg' :
                  field === 'affectedPlants' ? 'e.g., Tomatoes' :
                  field === 'naturalRemedies' ? 'e.g., Neem oil spray' :
                  `Enter ${field.slice(0, -1)}...`
                }
              />
              {formData[field].length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(field, index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField(field)}
            className="flex items-center text-sm text-orange-600 hover:text-orange-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add {field === 'affectedPlants' ? 'Plant' : 
                 field === 'naturalRemedies' ? 'Remedy' : 
                 field.slice(0, -1)}
          </button>
        </div>
      ))}

      {/* Interlinking Section */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Link className="h-5 w-5 mr-2" />
          Related Items (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Related Diseases</label>
            <select
              multiple
              value={formData.relatedDiseases}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                relatedDiseases: Array.from(e.target.selectedOptions, option => option.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
            >
              {diseases.map(disease => (
                <option key={disease.id} value={disease.id}>{disease.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Remedies</label>
            <select
              multiple
              value={formData.relatedRemedies}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                relatedRemedies: Array.from(e.target.selectedOptions, option => option.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
            >
              {remedies.map(remedy => (
                <option key={remedy.id} value={remedy.id}>{remedy.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
        >
          Submit Pest Report
        </button>
      </div>
    </form>
  );
}