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

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const data = await getCustomerParcels(customerId);
        setParcels(data);
      } catch (error) {
        console.error('Error fetching parcels:', error);
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
      ) : parcels.length === 0 ? (
        <p>No parcels found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parcels.map((parcel) => (
            <div
              key={parcel.tracking_number}
              className="bg-gray-800 p-4 rounded-lg border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-2">
                {parcel.tracking_number}
              </h3>
              <p>Status: {parcel.status}</p>
              <p>Destination: {parcel.recipient.address}</p> {/* ✅ Fixed from "destination" */}
              <p>Courier: {parcel.courier_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
