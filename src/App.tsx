import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import ParcelForm from './components/ParcelForm';
import TrackingPage from './components/ParcelTracker';
import { CourierLogin } from './components/CourierLogin';
import { CourierDashboard } from './components/CourierDashboard';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import { demoParcels } from './demoParcels';
import { CourierDashboardWrapper } from './components/CourierDashboardWrapper';

const AppContent = ({
  courierId,
  handleCourierLogin,
  handleCourierLogout,
}: {
  courierId: string | null;
  handleCourierLogin: (id: string) => void;
  handleCourierLogout: () => void;
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/track" element={<TrackingPage />} />
          <Route path="/track/:trackingNumber" element={<TrackingPage />} />
          <Route path="/create" element={<ParcelForm />} />
          <Route path="/catalog" element={<Catalog />} />

          {/* Courier Routes */}
          <Route path="/dashboard" element={<CourierDashboardWrapper />} />
          <Route path="/courier/dashboard" element={<CourierDashboardWrapper />} />
          <Route
            path="/courier"
            element={
              courierId ? (
                <CourierDashboard
                  courierId={courierId}
                  onLogout={handleCourierLogout}
                  
                />
              ) : (
                <CourierLogin onLogin={handleCourierLogin} />
              )
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [courierId, setCourierId] = useState<string | null>(() => localStorage.getItem('courierId'));

  const handleCourierLogin = (id: string) => {
    setCourierId(id);
    localStorage.setItem('courierId', id);
  };

  const handleCourierLogout = () => {
    setCourierId(null);
    localStorage.removeItem('courierId');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar courierId={courierId} logout={handleCourierLogout} />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <AppContent
            courierId={courierId}
            handleCourierLogin={handleCourierLogin}
            handleCourierLogout={handleCourierLogout}
          />
        </main>
        <footer className="bg-gray-100 border-t py-6">
          <div className="container mx-auto text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} ParcelPro Delivery System
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
