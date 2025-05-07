import { useState } from 'react';
import { CourierLogin } from './CourierLogin';
import { CourierDashboard } from './CourierDashboard';
import { AnimatePresence, motion } from 'framer-motion';


export function CourierDashboardWrapper() {
  const [courierId, setCourierId] = useState<string | null>(null);

  const handleLogin = (id: string) => {
    console.log('Courier logged in with ID:', id);
    setCourierId(id);
  };

  const handleLogout = () => {
    console.log('Courier logged out.');
    setCourierId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <AnimatePresence mode="wait">
        {courierId ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-white mb-4">
              Courier Dashboard
            </h1>
            <p className="text-sm text-gray-400 mb-6 italic">
              Demo session — resets on refresh.
            </p>
            <CourierDashboard courierId={courierId} onLogout={handleLogout} />
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <CourierLogin onLogin={handleLogin} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
 }