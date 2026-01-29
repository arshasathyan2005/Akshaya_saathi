import { useState } from 'react';
import { Building2, Shield } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CenterProvider, useCenter } from './contexts/CenterContext';
import { HomePage } from './components/HomePage';
import { ServiceDetails } from './components/ServiceDetails';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { CenterSelection } from './components/CenterSelection';
import { CenterSwitcher } from './components/CenterSwitcher';
import { CenterRegistration } from './components/CenterRegistration';
import type { Service } from './lib/database.types';

type View = 'home' | 'service-detail' | 'admin' | 'register';

function AppContent() {
  const { user, loading } = useAuth();
  const { selectedCenter } = useCenter();
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle registration view
  if (currentView === 'register') {
    return (
      <CenterRegistration
        onBack={() => setCurrentView('admin')}
        onSuccess={() => setCurrentView('admin')}
      />
    );
  }

  if (currentView === 'admin') {
    if (user) {
      return <AdminDashboard />;
    } else {
      return <AdminLogin onRegisterClick={() => setCurrentView('register')} />;
    }
  }

  // Show center selection if no center is selected
  if (!selectedCenter) {
    return <CenterSelection />;
  }

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setCurrentView('service-detail');
  };

  const handleBackToHome = () => {
    setSelectedService(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900">Akshaya Services Guide</h1>
                <p className="text-xs text-gray-600">Your guide to government services</p>
              </div>
            </button>
            <div className="flex items-center gap-3">
              <CenterSwitcher />
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Admin Access"
              >
                <Shield className="w-5 h-5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <HomePage onServiceClick={handleServiceClick} />
        )}
        {currentView === 'service-detail' && selectedService && (
          <ServiceDetails service={selectedService} onBack={handleBackToHome} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Akshaya Services Guide - Helping citizens access government services</p>
            <p className="text-sm text-gray-500">
              Information provided is for guidance purposes. Please verify with your local Akshaya center.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CenterProvider>
        <AppContent />
      </CenterProvider>
    </AuthProvider>
  );
}

export default App;
