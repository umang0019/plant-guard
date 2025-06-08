export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'approver' | 'data_entry' | 'basic_user';
  avatar?: string;
  location?: string;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  images: string[];
  location: Location;
  weather: WeatherData;
  causedBy: 'pest' | 'weather' | 'fungal' | 'bacterial' | 'viral' | 'nutrient';
  severity: 'low' | 'medium' | 'high' | 'critical';
  treatment: string[];
  prevention: string[];
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  relatedPests?: string[];
  relatedRemedies?: string[];
}

export interface Pest {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  images: string[];
  affectedPlants: string[];
  symptoms: string[];
  lifecycle: string;
  prevention: string[];
  treatment: string[];
  naturalRemedies: string[];
  harmfulTo: ('plants' | 'humans' | 'animals')[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  seasonality: string[];
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  relatedDiseases?: string[];
  relatedRemedies?: string[];
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  region: string;
  country: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  conditions: string;
  date: Date;
}

export interface NaturalRemedy {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  preparation: string[];
  application: string[];
  effectiveAgainst: string[];
  safetyNotes: string[];
  effectiveness: 'low' | 'medium' | 'high';
  category: 'organic' | 'biological' | 'mechanical' | 'cultural';
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  relatedDiseases?: string[];
  relatedPests?: string[];
}

export interface InterlinkedItem {
  id: string;
  name: string;
  type: 'disease' | 'pest' | 'remedy';
  severity?: string;
  effectiveness?: string;
  category?: string;
}