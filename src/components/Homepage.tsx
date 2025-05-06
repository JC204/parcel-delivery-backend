import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  ClipboardList,
  UserCheck,
  LogIn,
  CarFront,
} from 'lucide-react';

interface HomepageProps {
  courierId: string | null;
  customerId: string | null;
  customerName?: string | null;
}

const Homepage = ({ courierId, customerId, customerName }: HomepageProps) => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');

  const userWelcome =
    courierId
      ? `Welcome back, Courier!`
      : customerName
      ? `Welcome, ${customerName}!`
      : 'Welcome to ParcelSwift';

  const links = [
    {
      label: 'Create Shipment',
      description: 'Send a new package to any location.',
      icon: <PlusCircle className="h-6 w-6 text-green-400" />,
      route: '/create',
    },
    {
      label: 'View Catalog',
      description: 'Browse through current and demo parcels.',
      icon: <ClipboardList className="h-6 w-6 text-yellow-400" />,
      route: '/catalog',
    },
    {
      label: 'Courier Dashboard',
      description: 'Access the courier dashboard and manage deliveries.',
      icon: <UserCheck className="h-6 w-6 text-pink-400" />,
      route: '/dashboard',
    },
    {
      label: 'Customer Login',
      description: 'Track and manage your deliveries as a customer.',
      icon: <LogIn className="h-6 w-6 text-purple-400" />,
      route: '/customer-login',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-10">
      {/* Driving Car Animation */}
      <motion.div
        className="mb-12"
        initial={{ x: '-100vw' }}
        animate={{ x: '100vw' }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        <CarFront className="h-12 w-12 text-blue-500" />
      </motion.div>

      {/* Welcome Message */}
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {userWelcome}
      </motion.h1>

      <p className="text-gray-400 mb-10 text-center max-w-lg">
        A smart parcel delivery platform for real-time tracking, shipment management, and courier updates.
      </p>

      {/* Track Parcel Section */}
      <div id="track" className="bg-gray-800 p-6 rounded-xl mb-10 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Track a Parcel</h2>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (trackingNumber.trim()) {
              navigate(`/track/${trackingNumber.trim()}`);
            }
          }}
        >
          <input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-grow px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Track
          </button>
        </form>
      </div>

      {/* Home Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {links.map(({ label, description, icon, route }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer bg-gray-800 p-6 rounded-xl border border-gray-700 hover:bg-gray-700 transition"
            onClick={() => navigate(route)}
          >
            <div className="flex items-center gap-4 mb-3">
              {icon}
              <h3 className="text-lg font-semibold">{label}</h3>
            </div>
            <p className="text-gray-400 text-sm">{description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
