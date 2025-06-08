import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Diseases } from './pages/Diseases';
import { Pests } from './pages/Pests';
import { NaturalRemedies } from './pages/NaturalRemedies';
import { DataEntry } from './pages/DataEntry';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/pests" element={<Pests />} />
        <Route path="/remedies" element={<NaturalRemedies />} />
        <Route path="/data-entry" element={<DataEntry />} />
        <Route path="/approvals" element={<div className="p-6">Approvals page coming soon...</div>} />
        <Route path="/analytics" element={<div className="p-6">Analytics page coming soon...</div>} />
        <Route path="/settings" element={<div className="p-6">Settings page coming soon...</div>} />
        <Route path="/help" element={<div className="p-6">Help & Support page coming soon...</div>} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;