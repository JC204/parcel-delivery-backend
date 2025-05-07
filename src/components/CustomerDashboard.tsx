import { useEffect, useState } from 'react';
import { Parcel } from '../types';
import { CheckCircle, Truck, PackageCheck, Hourglass } from 'lucide-react';
import {demoParcels} from '../demoParcels'; // <-- demo only, no backend

interface CustomerDashboardProps {
  customerId: string;
  onLogout: () => void;
}

const getProgress = (status: string = '') => {
  switch (status) {
    case 'Created':
      return { percent: 25, color: 'bg-blue-500', icon: <Hourglass size={16} /> };
    case 'In Transit':
      return { percent: 50, color: 'bg-yellow-400', icon: <Truck size={16} /> };
    case 'Out for Delivery':
      return { percent: 75, color: 'bg-orange-500', icon: <PackageCheck size={16} /> };
    case 'Delivered':
      return { percent: 100, color: 'bg-green-500', icon: <CheckCircle size={16} /> };
    default:
      return { percent: 0, color: 'bg-gray-400', icon: <Hourglass size={16} /> };
  }
};

const CustomerDashboard = ({ customerId, onLogout }: CustomerDashboardProps) => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [sortOption, setSortOption] = useState<string>('status');

  useEffect(() => {
    const data = demoParcels.filter(
      (p) => p.recipient?.email?.toLowerCase() === customerId.toLowerCase()
    );
    setParcels(data);
  }, [customerId]);

  const sortParcels = (data: Parcel[]) => {
    return [...data].sort((a, b) => {
      const aStatus = a.status || '';
      const bStatus = b.status || '';
      return aStatus.localeCompare(bStatus);
    });
  };

  const sortedParcels = sortParcels(parcels);

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

      <div className="mb-4">
        <label htmlFor="sort" className="block text-sm font-medium mb-1">
          Sort by:
        </label>
        <select
          id="sort"
          name="sort"
          className="bg-gray-800 text-white px-3 py-2 rounded-md"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="status">Status</option>
          <option value="estimated_delivery">Estimated Delivery</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Parcels</h2>

      {sortedParcels.length === 0 ? (
        <p>No parcels found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedParcels.map((parcel) => {
            const { percent, color, icon } = getProgress(parcel.status);

            return (
              <div
                key={parcel.tracking_number}
                className="bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
              >
                <h3 className="text-lg font-semibold mb-2">
                  📦 {parcel.tracking_number}
                </h3>
                <p><span className="font-medium">Sender:</span> {parcel.sender?.email || 'N/A'}</p>
                <p><span className="font-medium">Recipient:</span> {parcel.recipient?.email || 'N/A'}</p>
                <p><span className="font-medium">Courier:</span> {parcel.courier_name || 'Unassigned'}</p>
                <p><span className="font-medium">Weight:</span> {parcel.weight} kg</p>
                <p>
                  <span className="font-medium">Est. Delivery:</span>{' '}
                  {parcel.estimated_delivery
                    ? new Date(parcel.estimated_delivery).toLocaleDateString()
                    : 'N/A'}
                </p>

                {parcel.tracking_history && parcel.tracking_history.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold">Tracking History:</h4>
                    <ul className="text-sm list-disc ml-4">
                      {parcel.tracking_history.map((update, idx) => (
                        <li key={idx}>
                          <span className="text-gray-400">
                            {new Date(update.timestamp).toLocaleString()}
                          </span>{' '}
                          - {update.status} ({update.location})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-1 text-sm">
                    {icon}
                    <span>{parcel.status || 'Unknown'}</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${color} h-full transition-all duration-300`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
