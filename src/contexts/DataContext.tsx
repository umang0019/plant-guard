import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Disease, Pest, NaturalRemedy } from '../types';

interface DataContextType {
  diseases: Disease[];
  pests: Pest[];
  remedies: NaturalRemedy[];
  addDisease: (disease: Omit<Disease, 'id' | 'reportedAt'>) => void;
  addPest: (pest: Omit<Pest, 'id' | 'reportedAt'>) => void;
  addRemedy: (remedy: Omit<NaturalRemedy, 'id' | 'reportedAt'>) => void;
  approveItem: (type: 'disease' | 'pest' | 'remedy', id: string, approvedBy: string) => void;
  rejectItem: (type: 'disease' | 'pest' | 'remedy', id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mockDiseases: Disease[] = [
  {
    id: '1',
    name: 'Tomato Late Blight',
    description: 'A devastating disease that affects tomato plants, causing brown lesions on leaves and stems.',
    symptoms: ['Brown lesions on leaves', 'White fuzzy growth on leaf undersides', 'Stem cankers', 'Fruit rot'],
    images: ['https://images.pexels.com/photos/4750258/pexels-photo-4750258.jpeg'],
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Farm Road, Valley View',
      region: 'New York',
      country: 'USA'
    },
    weather: {
      temperature: 22,
      humidity: 85,
      rainfall: 15,
      windSpeed: 12,
      conditions: 'Humid, overcast',
      date: new Date('2024-01-15')
    },
    causedBy: 'fungal',
    severity: 'high',
    treatment: ['Apply copper fungicide', 'Remove affected plant parts', 'Improve air circulation'],
    prevention: ['Plant resistant varieties', 'Avoid overhead watering', 'Space plants properly'],
    reportedBy: '3',
    reportedAt: new Date('2024-01-15'),
    status: 'approved',
    approvedBy: '2',
    approvedAt: new Date('2024-01-16')
  },
  {
    id: '2',
    name: 'Powdery Mildew',
    description: 'A fungal disease that creates white powdery spots on leaves and stems.',
    symptoms: ['White powdery coating on leaves', 'Yellowing leaves', 'Stunted growth', 'Distorted leaves'],
    images: ['https://images.pexels.com/photos/4750258/pexels-photo-4750258.jpeg'],
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: '456 Garden Lane, Sunny Valley',
      region: 'California',
      country: 'USA'
    },
    weather: {
      temperature: 25,
      humidity: 60,
      rainfall: 5,
      windSpeed: 8,
      conditions: 'Warm, dry',
      date: new Date('2024-01-20')
    },
    causedBy: 'fungal',
    severity: 'medium',
    treatment: ['Apply sulfur spray', 'Increase air circulation', 'Remove affected leaves'],
    prevention: ['Avoid overhead watering', 'Plant in sunny locations', 'Proper spacing'],
    reportedBy: '3',
    reportedAt: new Date('2024-01-20'),
    status: 'pending'
  }
];

const mockPests: Pest[] = [
  {
    id: '1',
    name: 'Aphids',
    scientificName: 'Aphidoidea',
    description: 'Small, soft-bodied insects that feed on plant sap and can transmit viruses.',
    images: ['https://images.pexels.com/photos/4944227/pexels-photo-4944227.jpeg'],
    affectedPlants: ['Roses', 'Tomatoes', 'Peppers', 'Lettuce', 'Beans'],
    symptoms: ['Curled leaves', 'Sticky honeydew', 'Stunted growth', 'Yellowing leaves'],
    lifecycle: 'Complete several generations per year, reproduce rapidly in warm weather. Females can produce 40-60 offspring without mating.',
    prevention: ['Encourage beneficial insects', 'Use reflective mulch', 'Regular monitoring', 'Companion planting'],
    treatment: ['Insecticidal soap', 'Neem oil', 'Ladybug release', 'Strong water spray'],
    naturalRemedies: ['Spray with water', 'Companion planting with marigolds', 'Garlic spray'],
    harmfulTo: ['plants'],
    severity: 'medium',
    seasonality: ['Spring', 'Summer', 'Early Fall'],
    reportedBy: '3',
    reportedAt: new Date('2024-01-10'),
    status: 'approved'
  },
  {
    id: '2',
    name: 'Spider Mites',
    scientificName: 'Tetranychidae',
    description: 'Tiny arachnids that feed on plant cells, causing stippling and webbing on leaves.',
    images: ['https://images.pexels.com/photos/4944227/pexels-photo-4944227.jpeg'],
    affectedPlants: ['Tomatoes', 'Cucumbers', 'Beans', 'Strawberries', 'Houseplants'],
    symptoms: ['Fine webbing on leaves', 'Yellow stippling', 'Bronze or yellow leaves', 'Leaf drop'],
    lifecycle: 'Reproduce rapidly in hot, dry conditions. Complete lifecycle in 5-20 days depending on temperature.',
    prevention: ['Maintain humidity', 'Regular watering', 'Avoid over-fertilizing', 'Remove debris'],
    treatment: ['Miticide application', 'Predatory mites', 'Insecticidal soap', 'Systemic insecticides'],
    naturalRemedies: ['Neem oil spray', 'Diatomaceous earth', 'Essential oil sprays'],
    harmfulTo: ['plants'],
    severity: 'high',
    seasonality: ['Summer', 'Fall'],
    reportedBy: '3',
    reportedAt: new Date('2024-01-12'),
    status: 'approved'
  },
  {
    id: '3',
    name: 'Whiteflies',
    scientificName: 'Aleyrodidae',
    description: 'Small white flying insects that feed on plant sap and excrete honeydew.',
    images: ['https://images.pexels.com/photos/4944227/pexels-photo-4944227.jpeg'],
    affectedPlants: ['Tomatoes', 'Peppers', 'Eggplant', 'Cabbage', 'Poinsettias'],
    symptoms: ['Yellowing leaves', 'Sticky honeydew', 'Sooty mold', 'Stunted growth'],
    lifecycle: 'Lay eggs on leaf undersides. Complete development in 25-30 days. Adults live 30-40 days.',
    prevention: ['Yellow sticky traps', 'Remove weeds', 'Quarantine new plants', 'Reflective mulch'],
    treatment: ['Vacuum adults', 'Insecticidal soap', 'Systemic insecticides', 'Beneficial insects'],
    naturalRemedies: ['Neem oil', 'Garlic spray', 'Marigold companion planting'],
    harmfulTo: ['plants'],
    severity: 'medium',
    seasonality: ['Spring', 'Summer', 'Fall'],
    reportedBy: '3',
    reportedAt: new Date('2024-01-14'),
    status: 'pending'
  }
];

const mockRemedies: NaturalRemedy[] = [
  {
    id: '1',
    name: 'Neem Oil Spray',
    description: 'Natural oil extracted from neem tree seeds, effective against many pests and diseases.',
    ingredients: ['Neem oil', 'Water', 'Mild soap (emulsifier)'],
    preparation: ['Mix 2 tbsp neem oil with 1 tsp soap', 'Add to 1 gallon of water', 'Stir thoroughly'],
    application: ['Spray in early morning or evening', 'Cover all plant surfaces', 'Reapply every 7-14 days'],
    effectiveAgainst: ['Aphids', 'Spider mites', 'Whiteflies', 'Fungal diseases'],
    safetyNotes: ['Safe for humans and pets', 'May harm beneficial insects if applied directly', 'Avoid during bloom to protect pollinators'],
    effectiveness: 'high',
    category: 'organic',
    reportedBy: '2',
    reportedAt: new Date('2024-01-05'),
    status: 'approved'
  },
  {
    id: '2',
    name: 'Diatomaceous Earth',
    description: 'Fossilized remains of diatoms that damage soft-bodied insects through physical action.',
    ingredients: ['Food-grade diatomaceous earth'],
    preparation: ['Ensure powder is completely dry', 'Use food-grade quality only', 'Apply with duster or by hand'],
    application: ['Dust lightly on affected areas', 'Apply when plants are dry', 'Reapply after rain or watering'],
    effectiveAgainst: ['Slugs', 'Snails', 'Ants', 'Crawling insects'],
    safetyNotes: ['Use food-grade only', 'Avoid inhaling dust', 'Safe around pets and children when settled'],
    effectiveness: 'medium',
    category: 'mechanical',
    reportedBy: '2',
    reportedAt: new Date('2024-01-08'),
    status: 'approved'
  },
  {
    id: '3',
    name: 'Companion Planting with Marigolds',
    description: 'Strategic planting of marigolds to repel pests and attract beneficial insects.',
    ingredients: ['Marigold seeds or seedlings', 'Garden space'],
    preparation: ['Choose appropriate marigold varieties', 'Plan garden layout', 'Prepare soil'],
    application: ['Plant around vegetable crops', 'Space 6-12 inches apart', 'Maintain throughout growing season'],
    effectiveAgainst: ['Nematodes', 'Aphids', 'Whiteflies', 'Tomato hornworms'],
    safetyNotes: ['Completely safe for all', 'Attracts beneficial pollinators', 'Edible flowers for some varieties'],
    effectiveness: 'medium',
    category: 'cultural',
    reportedBy: '2',
    reportedAt: new Date('2024-01-03'),
    status: 'approved'
  },
  {
    id: '4',
    name: 'Garlic and Chili Spray',
    description: 'Homemade spray using garlic and chili peppers to deter various pests.',
    ingredients: ['Fresh garlic cloves', 'Hot chili peppers', 'Water', 'Liquid soap'],
    preparation: ['Blend 6 garlic cloves and 2 hot peppers', 'Steep in 2 cups hot water for 24 hours', 'Strain and add 1 tsp liquid soap'],
    application: ['Spray on affected plants', 'Apply in evening to avoid leaf burn', 'Reapply weekly or after rain'],
    effectiveAgainst: ['Aphids', 'Caterpillars', 'Deer', 'Rabbits'],
    safetyNotes: ['Avoid contact with eyes', 'Wash hands after handling', 'Test on small area first'],
    effectiveness: 'medium',
    category: 'organic',
    reportedBy: '3',
    reportedAt: new Date('2024-01-07'),
    status: 'pending'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [diseases, setDiseases] = useState<Disease[]>(mockDiseases);
  const [pests, setPests] = useState<Pest[]>(mockPests);
  const [remedies, setRemedies] = useState<NaturalRemedy[]>(mockRemedies);

  const addDisease = (diseaseData: Omit<Disease, 'id' | 'reportedAt'>) => {
    const newDisease: Disease = {
      ...diseaseData,
      id: Math.random().toString(36).substr(2, 9),
      reportedAt: new Date()
    };
    setDiseases(prev => [...prev, newDisease]);
  };

  const addPest = (pestData: Omit<Pest, 'id' | 'reportedAt'>) => {
    const newPest: Pest = {
      ...pestData,
      id: Math.random().toString(36).substr(2, 9),
      reportedAt: new Date()
    };
    setPests(prev => [...prev, newPest]);
  };

  const addRemedy = (remedyData: Omit<NaturalRemedy, 'id' | 'reportedAt'>) => {
    const newRemedy: NaturalRemedy = {
      ...remedyData,
      id: Math.random().toString(36).substr(2, 9),
      reportedAt: new Date()
    };
    setRemedies(prev => [...prev, newRemedy]);
  };

  const approveItem = (type: 'disease' | 'pest' | 'remedy', id: string, approvedBy: string) => {
    const updateStatus = (item: any) => {
      if (item.id === id) {
        return { ...item, status: 'approved', approvedBy, approvedAt: new Date() };
      }
      return item;
    };

    if (type === 'disease') {
      setDiseases(prev => prev.map(updateStatus));
    } else if (type === 'pest') {
      setPests(prev => prev.map(updateStatus));
    } else if (type === 'remedy') {
      setRemedies(prev => prev.map(updateStatus));
    }
  };

  const rejectItem = (type: 'disease' | 'pest' | 'remedy', id: string) => {
    const updateStatus = (item: any) => {
      if (item.id === id) {
        return { ...item, status: 'rejected' };
      }
      return item;
    };

    if (type === 'disease') {
      setDiseases(prev => prev.map(updateStatus));
    } else if (type === 'pest') {
      setPests(prev => prev.map(updateStatus));
    } else if (type === 'remedy') {
      setRemedies(prev => prev.map(updateStatus));
    }
  };

  return (
    <DataContext.Provider value={{
      diseases,
      pests,
      remedies,
      addDisease,
      addPest,
      addRemedy,
      approveItem,
      rejectItem
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}