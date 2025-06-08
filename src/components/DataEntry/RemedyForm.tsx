import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { NaturalRemedy } from '../../types';
import { Plus, X, Link } from 'lucide-react';

interface RemedyFormProps {
  onSuccess: () => void;
}

export function RemedyForm({ onSuccess }: RemedyFormProps) {
  const { user } = useAuth();
  const { addRemedy, diseases, pests } = useData();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: [''],
    preparation: [''],
    application: [''],
    effectiveAgainst: [''],
    safetyNotes: [''],
    effectiveness: 'medium' as const,
    category: 'organic' as const,
    relatedDiseases: [] as string[],
    relatedPests: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const remedyData: Omit<NaturalRemedy, 'id' | 'reportedAt'> = {
      ...formData,
      ingredients: formData.ingredients.filter(i => i.trim()),
      preparation: formData.preparation.filter(p => p.trim()),
      application: formData.application.filter(a => a.trim()),
      effectiveAgainst: formData.effectiveAgainst.filter(e => e.trim()),
      safetyNotes: formData.safetyNotes.filter(s => s.trim()),
      reportedBy: user!.id,
      status: 'pending'
    };

    addRemedy(remedyData);
    onSuccess();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      ingredients: [''],
      preparation: [''],
      application: [''],
      effectiveAgainst: [''],
      safetyNotes: [''],
      effectiveness: 'medium',
      category: 'organic',
      relatedDiseases: [],
      relatedPests: []
    });
  };

  const addArrayField = (field: 'ingredients' | 'preparation' | 'application' | 'effectiveAgainst' | 'safetyNotes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'ingredients' | 'preparation' | 'application' | 'effectiveAgainst' | 'safetyNotes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (field: 'ingredients' | 'preparation' | 'application' | 'effectiveAgainst' | 'safetyNotes', index: number, value: string) => {
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Remedy Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Neem Oil Spray"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="organic">Organic</option>
            <option value="biological">Biological</option>
            <option value="mechanical">Mechanical</option>
            <option value="cultural">Cultural</option>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Detailed description of the natural remedy..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Effectiveness *</label>
        <select
          required
          value={formData.effectiveness}
          onChange={(e) => setFormData(prev => ({ ...prev, effectiveness: e.target.value as any }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Dynamic Arrays */}
      {(['ingredients', 'preparation', 'application', 'effectiveAgainst', 'safetyNotes'] as const).map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {field === 'effectiveAgainst' ? 'Effective Against' : 
             field === 'safetyNotes' ? 'Safety Notes' : field} *
          </label>
          {formData[field].map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              {field === 'preparation' || field === 'application' || field === 'safetyNotes' ? (
                <textarea
                  required
                  rows={2}
                  value={item}
                  onChange={(e) => updateArrayField(field, index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    field === 'preparation' ? 'Describe preparation step...' :
                    field === 'application' ? 'Describe application method...' :
                    field === 'safetyNotes' ? 'Important safety information...' :
                    `Enter ${field.slice(0, -1)}...`
                  }
                />
              ) : (
                <input
                  type="text"
                  required
                  value={item}
                  onChange={(e) => updateArrayField(field, index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    field === 'ingredients' ? 'e.g., Neem oil' :
                    field === 'effectiveAgainst' ? 'e.g., Aphids' :
                    `Enter ${field.slice(0, -1)}...`
                  }
                />
              )}
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
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add {field === 'effectiveAgainst' ? 'Target' : 
                 field === 'safetyNotes' ? 'Safety Note' : 
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Treats Diseases</label>
            <select
              multiple
              value={formData.relatedDiseases}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                relatedDiseases: Array.from(e.target.selectedOptions, option => option.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            >
              {diseases.map(disease => (
                <option key={disease.id} value={disease.id}>{disease.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Controls Pests</label>
            <select
              multiple
              value={formData.relatedPests}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                relatedPests: Array.from(e.target.selectedOptions, option => option.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            >
              {pests.map(pest => (
                <option key={pest.id} value={pest.id}>{pest.name}</option>
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
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Natural Remedy
        </button>
      </div>
    </form>
  );
}