import { useState } from 'react';
import { CourierLogin } from './CourierLogin';
import { CourierDashboard } from './CourierDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { demoParcels } from 'demoParcels';

export function CourierDashboardWrapper() {
  const [courierId, setCourierId] = useState<string | null>(null);

  const handleLogin = (id: string) => {
    console.log("Courier logged in with ID:", id);
    setCourierId(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <AnimatePresence mode="wait">
        {courierId ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          ><h2 className="text-lg font-semibold text-gray-700 mb-4">
          Demo Courier Dashboard (Session will reset on refresh)
        </h2>
            <CourierDashboard
              courierId={courierId}
              onLogout={() => {
                console.log("Courier logged out.");
                setCourierId(null);
              }}
              demoParcels={demoParcels} // optional if you're not using fallback data
            />
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
