import { useEffect, useState } from 'react';
import { Parcel } from '../types';
import { getCustomerParcels } from '../api';

interface CustomerDashboardProps {
  customerId: string;
  onLogout: () => void;
}

const CustomerDashboard = ({ customerId, onLogout }: CustomerDashboardProps) => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const data = await getCustomerParcels(customerId);
        setParcels(data);
      } catch (err) {
        console.error('Error fetching parcels:', err);
        setError('Failed to load parcels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, [customerId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {customerId}</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Parcels</h2>

      {loading ? (
        <p>Loading parcels...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : parcels.length === 0 ? (
        <p>No parcels found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parcels.map((parcel) => (
            <div
              key={parcel.tracking_number}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md"
            >
              <h3 className="text-lg font-semibold mb-2">
                Tracking #: {parcel.tracking_number}
              </h3>
              <p className="mb-1">
                <span className="font-medium">Status:</span> {parcel.status}
              </p>
              <p className="mb-1">
                <span className="font-medium">Recipient:</span> {parcel.recipient?.address || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Courier:</span> {parcel.courier_id || 'Unassigned'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;