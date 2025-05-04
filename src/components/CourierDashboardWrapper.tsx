import { useState } from 'react';
import { CourierLogin } from './CourierLogin';
import { CourierDashboard } from './CourierDashboard';
import { AnimatePresence, motion } from 'framer-motion';

export function CourierWrapper() {
  const [courierId, setCourierId] = useState<string | null>(null);

  const handleLogin = (id: string) => {
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
          >
            <CourierDashboard
  courierId={courierId}
  onLogout={() => setCourierId(null)}
  demoParcels={[]} // if you’re still passing demoParcels
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