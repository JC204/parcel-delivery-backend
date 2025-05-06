import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PackageSearch,
  PlusCircle,
  ClipboardList,
  UserCheck,
  CarFront,
} from 'lucide-react';

const Homepage = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierId, setCourierId] = useState<string | null>(null);

  // Check login status on mount
  useEffect(() => {
    const storedId = localStorage.getItem('courierId');
    setCourierId(storedId);
  }, []);

  // Define homepage links based on login state
  const links = courierId
    ? [
        {
          label: 'Go to Dashboard',
          description: 'Manage deliveries and update parcel status.',
          icon: <UserCheck className="h-6 w-6 text-pink-400" />,
          route: '/dashboard',
        },
      ]
    : [
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
          label: 'Courier Demo',
          description: 'Try out the dashboard as a guest courier.',
          icon: <UserCheck className="h-6 w-6 text-pink-400" />,
          route: '/dashboard',
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

      {/* Welcome Title */}
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to ParcelSwift
      </motion.h1>

      <p className="text-gray-400 mb-6 text-center max-w-lg">
        A smart parcel delivery platform for real-time tracking, shipment management, and courier updates.
      </p>

      {/* Optional Logged-in Greeting */}
      {courierId && (
        <div className="text-sm text-gray-400 mb-6 text-center">
          Logged in as Courier <strong>{courierId}</strong>
          <button
            className="ml-4 underline text-blue-400 hover:text-blue-300"
            onClick={() => {
              localStorage.removeItem('courierId');
              setCourierId(null);
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Track Parcel Section */}
      <div id="track" className="bg-gray-800 p-6 rounded-xl mb-8 w-full max-w-md">
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
            className="flex-grow px-3 py-2 rounded-md text-black"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Track
          </button>
        </form>
      </div>

      {/* Feature Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
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
