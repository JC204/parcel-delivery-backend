import { useState, useEffect } from 'react';
import { CourierDashboard } from './CourierDashboard';
import { AlertCircle } from 'lucide-react';

type Courier = {
  id: string;
  name: string;
};

const couriers: Courier[] = [
  { id: 'john_doe', name: 'John Doe' },
  { id: 'jane_smith', name: 'Jane Smith' },
];

export default function CourierDashboardWrapper() {
  const [courierId, setCourierId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('courierId');
    if (saved) setCourierId(saved);
  }, []);

  const handleLogin = (id: string) => {
    localStorage.setItem('courierId', id);
    setCourierId(id);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('courierId');
    setCourierId(null);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!courierId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Select a Courier to Log In</h1>
        <div className="flex gap-4">
          {couriers.map((courier) => (
            <button
              key={courier.id}
              onClick={() => handleLogin(courier.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {courier.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <CourierDashboard courierId={courierId} onLogout={handleLogout} />
  );
}