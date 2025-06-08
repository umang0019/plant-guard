import React from 'react';
import { useData } from '../../contexts/DataContext';
import { InterlinkedItem } from '../../types';
import { Leaf, Bug, Heart, ArrowRight } from 'lucide-react';

interface RelatedItemsProps {
  itemId: string;
  itemType: 'disease' | 'pest' | 'remedy';
  relatedIds?: string[];
  title: string;
  emptyMessage: string;
}

export function RelatedItems({ itemId, itemType, relatedIds = [], title, emptyMessage }: RelatedItemsProps) {
  const { diseases, pests, remedies } = useData();

  const getRelatedItems = (): InterlinkedItem[] => {
    const items: InterlinkedItem[] = [];

    // Get items based on explicit relationships
    relatedIds.forEach(id => {
      const disease = diseases.find(d => d.id === id);
      if (disease) {
        items.push({
          id: disease.id,
          name: disease.name,
          type: 'disease',
          severity: disease.severity
        });
      }

      const pest = pests.find(p => p.id === id);
      if (pest) {
        items.push({
          id: pest.id,
          name: pest.name,
          type: 'pest',
          severity: pest.severity
        });
      }

      const remedy = remedies.find(r => r.id === id);
      if (remedy) {
        items.push({
          id: remedy.id,
          name: remedy.name,
          type: 'remedy',
          effectiveness: remedy.effectiveness,
          category: remedy.category
        });
      }
    });

    // Auto-discover relationships based on content
    if (itemType === 'disease') {
      const currentDisease = diseases.find(d => d.id === itemId);
      if (currentDisease) {
        // Find pests that might cause this disease
        pests.forEach(pest => {
          if (!items.some(item => item.id === pest.id) && 
              (pest.relatedDiseases?.includes(itemId) || 
               currentDisease.causedBy === 'pest')) {
            items.push({
              id: pest.id,
              name: pest.name,
              type: 'pest',
              severity: pest.severity
            });
          }
        });

        // Find remedies that treat this disease
        remedies.forEach(remedy => {
          if (!items.some(item => item.id === remedy.id) && 
              (remedy.relatedDiseases?.includes(itemId) ||
               remedy.effectiveAgainst.some(target => 
                 target.toLowerCase().includes(currentDisease.name.toLowerCase())))) {
            items.push({
              id: remedy.id,
              name: remedy.name,
              type: 'remedy',
              effectiveness: remedy.effectiveness,
              category: remedy.category
            });
          }
        });
      }
    }

    return items;
  };

  const relatedItems = getRelatedItems();

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'disease':
        return <Leaf className="h-4 w-4 text-green-600" />;
      case 'pest':
        return <Bug className="h-4 w-4 text-orange-600" />;
      case 'remedy':
        return <Heart className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'disease':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'pest':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'remedy':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityColor = (severity?: string) => {
    if (!severity) return '';
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || '';
  };

  const getEffectivenessColor = (effectiveness?: string) => {
    if (!effectiveness) return '';
    const colors = {
      low: 'bg-yellow-100 text-yellow-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-green-100 text-green-800'
    };
    return colors[effectiveness as keyof typeof colors] || '';
  };

  if (relatedItems.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
        {title}
        <ArrowRight className="h-4 w-4 ml-2 text-gray-400" />
      </h4>
      <div className="space-y-2">
        {relatedItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${getItemColor(item.type)} hover:shadow-sm transition-shadow cursor-pointer`}
          >
            <div className="flex items-center space-x-2">
              {getItemIcon(item.type)}
              <span className="font-medium text-sm">{item.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              {item.severity && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                  {item.severity}
                </span>
              )}
              {item.effectiveness && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffectivenessColor(item.effectiveness)}`}>
                  {item.effectiveness}
                </span>
              )}
              {item.category && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {item.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}