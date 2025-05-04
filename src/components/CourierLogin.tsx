import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Truck } from 'lucide-react';
import { getCouriers } from '../api';
import { Courier } from '../types';

interface CourierLoginProps {
  onLogin: (courierId: string) => void;
}

export function CourierLogin({ onLogin }: CourierLoginProps) {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCouriers() {
      try {
        const data = await getCouriers();
        setCouriers(data);
        if (data.length > 0) {
          setSelectedCourierId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch couriers:', err);
        setError('Could not load courier list. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchCouriers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/couriers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier_id: selectedCourierId, password }),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Invalid credentials');
      }

      const data = await res.json();
      onLogin(data.courier_id); // notify parent component
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Loading courier information...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="text-center mb-6">
        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Courier Login</h1>
        <p className="text-gray-600 mt-1">Select your name and enter password</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {couriers.length === 0 && !error ? (
        <div className="text-center py-6">
          <p className="text-gray-600">No couriers found in the system.</p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/api/seed';
            }}
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Click here to create test couriers
          </a>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="courier-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Courier
            </label>
            <select
              id="courier-select"
              value={selectedCourierId}
              onChange={(e) => setSelectedCourierId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {couriers.map((courier) => (
                <option key={courier.id} value={courier.id}>
                  {courier.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!selectedCourierId || !password}
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Login to Dashboard
          </button>
        </form>
      )}
    </motion.div>
  );
}
