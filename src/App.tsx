import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import ParcelForm from './components/ParcelForm';
import TrackingPage from './components/ParcelTracker';
import { CourierLogin } from './components/CourierLogin';
import { CourierDashboard } from './components/CourierDashboard';
import  CustomerLogin  from './components/CustomerLogin';
import  CustomerDashboard  from './components/CustomerDashboard';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Catalog from './components/Catalog';
import  {demoCustomers}  from './demoCustomer'; // Adjust path if needed

import { CourierDashboardWrapper } from './components/CourierDashboardWrapper';
import  {Customer}  from './types';


const [customerId, setCustomerId] = useState<string | null>(null);
const [customerName, setCustomerName] = useState<string | null>(null);

const AppContent = ({
  courierId,
  customerId,
  handleCourierLogin,
  handleCustomerLogin,
  handleCourierLogout,
  handleCustomerLogout,
}: {
  courierId: string | null;
  customerId: string | null;
  handleCourierLogin: (id: string) => void;
  handleCustomerLogin: (id: string) => void;
  handleCourierLogout: () => void;
  handleCustomerLogout: () => void;
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
          
          <Route path="/track" element={<TrackingPage />} />
          <Route path="/track/:tracking_number" element={<TrackingPage />} />
          <Route path="/create" element={<ParcelForm />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route
  path="/"
  element={
    <Homepage
      courierId={courierId}
      customerId={customerId}
      customerName={customerName}
    />
  }
/>

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

          {/* Customer Routes */}
          <Route
            path="/customer"
            element={
              customerId ? (
                <CustomerDashboard
                  customerId={customerId!}
                  onLogout={handleCustomerLogout}
                />
              ) : (
                <CustomerLogin onLogin={handleCustomerLogin} />
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
  const [customerId, setCustomerId] = useState<string | null>(() => localStorage.getItem('customerId'));

  const handleCourierLogin = (id: string) => {
    setCourierId(id);
    localStorage.setItem('courierId', id);
  };

  const handleCourierLogout = () => {
    setCourierId(null);
    localStorage.removeItem('courierId');
  };

  const handleCustomerLogin = (id: string) => {
    setCustomerId(id);
    // Optionally: look up name by id from demoCustomers
    const match = demoCustomers.find((c) => c.customerId === id);
    setCustomerName(match?.name ?? null);
  };
  
  

  const handleCustomerLogout = () => {
    setCustomerId(null);
    localStorage.removeItem('customerId');
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar courierId={courierId} customerId={customerId} logout={handleCourierLogout} />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <AppContent
            courierId={courierId}
            customerId={customerId}
            handleCourierLogin={handleCourierLogin}
            handleCustomerLogin={handleCustomerLogin}
            handleCourierLogout={handleCourierLogout}
            handleCustomerLogout={handleCustomerLogout}
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
