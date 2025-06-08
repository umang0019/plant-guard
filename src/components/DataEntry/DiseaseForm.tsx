import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Disease } from '../../types';
import { MapPin, Thermometer, Droplets, Wind, Plus, X, Link } from 'lucide-react';

interface DiseaseFormProps {
  onSuccess: () => void;
}

export function DiseaseForm({ onSuccess }: DiseaseFormProps) {
  const { user } = useAuth();
  const { addDisease, pests, remedies } = useData();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symptoms: [''],
    images: [''],
    location: {
      latitude: 0,
      longitude: 0,
      address: '',
      region: '',
      country: ''
    },
    weather: {
      temperature: 0,
      humidity: 0,
      rainfall: 0,
      windSpeed: 0,
      conditions: '',
      date: new Date()
    },
    causedBy: 'fungal' as const,
    severity: 'medium' as const,
    treatment: [''],
    prevention: [''],
    relatedPests: [] as string[],
    relatedRemedies: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const diseaseData: Omit<Disease, 'id' | 'reportedAt'> = {
      ...formData,
      symptoms: formData.symptoms.filter(s => s.trim()),
      images: formData.images.filter(i => i.trim()),
      treatment: formData.treatment.filter(t => t.trim()),
      prevention: formData.prevention.filter(p => p.trim()),
      reportedBy: user!.id,
      status: 'pending'
    };

    addDisease(diseaseData);
    onSuccess();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      symptoms: [''],
      images: [''],
      location: {
        latitude: 0,
        longitude: 0,
        address: '',
        region: '',
        country: ''
      },
      weather: {
        temperature: 0,
        humidity: 0,
        rainfall: 0,
        windSpeed: 0,
        conditions: '',
        date: new Date()
      },
      causedBy: 'fungal',
      severity: 'medium',
      treatment: [''],
      prevention: [''],
      relatedPests: [],
      relatedRemedies: []
    });
  };

  const addArrayField = (field: 'symptoms' | 'images' | 'treatment' | 'prevention') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'symptoms' | 'images' | 'treatment' | 'prevention', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field: 'symptoms' | 'images' | 'treatment' | 'prevention', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Disease Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Tomato Late Blight"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Caused By *</label>
          <select
            required
            value={formData.causedBy}
            onChange={(e) => setFormData(prev => ({ ...prev, causedBy: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="fungal">Fungal</option>
            <option value="bacterial">Bacterial</option>
            <option value="viral">Viral</option>
            <option value="pest">Pest</option>
            <option value="weather">Weather</option>
            <option value="nutrient">Nutrient Deficiency</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Detailed description of the disease..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
        <select
          required
          value={formData.severity}
          onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value as any }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Dynamic Arrays */}
      {(['symptoms', 'images', 'treatment', 'prevention'] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {field} *
          </label>
          {formData[field].map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type={field === 'images' ? 'url' : 'text'}
                required
                value={item}
                onChange={(e) => updateArrayField(field, index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={field === 'images' ? 'https://example.com/image.jpg' : `Enter ${field.slice(0, -1)}...`}
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
            className="flex items-center text-sm text-green-600 hover:text-green-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add {field.slice(0, -1)}
          </button>
        </div>
      ))}

      {/* Location Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Location Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
            <input
              type="text"
              required
              value={formData.location.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, address: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region *</label>
            <input
              type="text"
              required
              value={formData.location.region}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, region: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <input
              type="text"
              required
              value={formData.location.country}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, country: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.location.latitude}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, latitude: parseFloat(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.location.longitude}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, longitude: parseFloat(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weather Information */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Thermometer className="h-5 w-5 mr-2" />
          Weather Conditions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C) *</label>
            <input
              type="number"
              required
              value={formData.weather.temperature}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                weather: { ...prev.weather, temperature: parseFloat(e.target.value) || 0 }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%) *</label>
            <input
              type="number"
              required
              min="0"
              max="100"
              value={formData.weather.humidity}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                weather: { ...prev.weather, humidity: parseFloat(e.target.value) || 0 }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (mm)</label>
            <input
              type="number"
              min="0"
              value={formData.weather.rainfall}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                weather: { ...prev.weather, rainfall: parseFloat(e.target.value) || 0 }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wind Speed (km/h)</label>
            <input
              type="number"
              min="0"
              value={formData.weather.windSpeed}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                weather: { ...prev.weather, windSpeed: parseFloat(e.target.value) || 0 }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Weather Conditions</label>
          <input
            type="text"
            value={formData.weather.conditions}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              weather: { ...prev.weather, conditions: e.target.value }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Humid, overcast"
          />
        </div>
      </div>

      {/* Interlinking Section */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Link className="h-5 w-5 mr-2" />
          Related Items (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Related Pests</label>
            <select
              multiple
              value={formData.relatedPests}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                relatedPests: Array.from(e.target.selectedOptions, option => option.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
            >
              {pests.map(pest => (
                <option key={pest.id} value={pest.id}>{pest.name}</option>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
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
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Submit Disease Report
        </button>
      </div>
    </form>
  );
}