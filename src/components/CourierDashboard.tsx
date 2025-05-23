import { useState, useEffect } from 'react';
import { getParcelsByCourier, updateParcelStatus } from '../api';
import { demoParcels } from '../demoParcels';
import { Parcel, TrackingUpdate } from '../types';
import {
  Loader2,
  Package,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CourierDashboardProps {
  courierId: string;
  onLogout: () => void;

}


export function CourierDashboard({ courierId, onLogout }: CourierDashboardProps) {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('tracking');

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const data = await getParcelsByCourier(courierId);
      setParcels(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch parcels. Using demo data.', err);
      setParcels(demoParcels);
      setError('Failed to load live parcels. Showing demo data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!courierId) return;
    fetchParcels();
  }, [courierId]);

  const handleStatusUpdate = async (
    parcelId: string,
    status: string,
    location: string
  ) => {
    setUpdatingId(parcelId);
    const update: TrackingUpdate = {
      status,
      location,
      timestamp: new Date().toISOString(),
      description: `Package ${status.replace(/_/g, ' ')} at ${location}`,
    };

    try {
      await updateParcelStatus(parcelId, update);
      await fetchParcels();
    } catch (err) {
      setError('Status update failed. Please retry.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = 'px-2 py-1 text-xs rounded-full font-medium';
    switch (status) {
      case 'delivered':
        return <span className={`${base} bg-green-100 text-green-700`}>Delivered</span>;
      case 'in_transit':
        return <span className={`${base} bg-blue-100 text-blue-700`}>In Transit</span>;
      case 'out_for_delivery':
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>Out for Delivery</span>;
      case 'failed_delivery':
        return <span className={`${base} bg-red-100 text-red-600`}>Failed Delivery</span>;
      case 'processing':
        return <span className={`${base} bg-gray-100 text-gray-600`}>Processing</span>;
      default:
        return <span className={`${base} bg-gray-50 text-gray-600`}>{status}</span>;
    }
  };

  const getNextPossibleStatuses = (currentStatus: string) => {
    switch (currentStatus) {
      case 'processing':
        return ['in_transit'];
      case 'in_transit':
        return ['out_for_delivery'];
      case 'out_for_delivery':
        return ['delivered', 'failed_delivery'];
      case 'failed_delivery':
        return ['out_for_delivery'];
      default:
        return [];
    }
  };

  const sortedParcels = [...parcels].sort((a, b) => {
    if (sortOption === 'status') {
      return (a.status ?? '').localeCompare(b.status ?? '');
    }
    return a.tracking_number.localeCompare(b.tracking_number);
  });

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Courier Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchParcels}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-40 text-blue-500">
          <Loader2 className="animate-spin h-6 w-6" />
          <p className="mt-2 text-sm">Loading parcels...</p>
        </div>
      ) : parcels.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="mx-auto h-10 w-10 text-gray-400" />
          <h3 className="mt-3 text-lg font-semibold">No parcels assigned</h3>
          <p>You're currently not handling any deliveries.</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="sortSelect" className="sr-only">
              Sort parcels
            </label>
            <select
              id="sortSelect"
              title="Sort parcels by"
              className="p-2 border rounded-md"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="tracking">Sort by Tracking #</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>

          <div className="space-y-6">
            {sortedParcels.map((parcel) => {
              const history = parcel.tracking_history || [];
              const latest = history[history.length - 1] || { status: 'processing' };
              const current = latest.status;
              const next = getNextPossibleStatuses(current);

              return (
                <motion.div
                  key={parcel.tracking_number}
                  className="bg-gray-50 border rounded-xl p-4"
                  initial={{ opacity: 0.6, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {parcel.tracking_number}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {parcel.sender.name} → {parcel.recipient.name}
                      </p>
                      <div className="mt-2 flex flex-col gap-1">
                        {getStatusBadge(current)}
                        {parcel.estimated_delivery && (
                          <p className="text-xs text-gray-500">
                            Est. delivery: {new Date(parcel.estimated_delivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {parcel.recipient.address}
                      </p>
                      <p className="text-xs text-gray-500">{parcel.recipient.phone}</p>
                      {latest.timestamp && (
                        <p className="text-xs text-gray-400 mt-1">
                          Updated: {new Date(latest.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {next.length > 0 && (
                    <div className="mt-4 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">Update Status:</p>
                      <div className="flex gap-2 flex-wrap">
                        {next.map((status) => (
                          <button
                            key={status}
                            disabled={updatingId === parcel.tracking_number}
                            onClick={() =>
                              handleStatusUpdate(
                                parcel.tracking_number,
                                status,
                                status === 'delivered'
                                  ? parcel.recipient.address
                                  : 'Current location'
                              )
                            }
                            className="flex items-center px-3 py-2 text-sm bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
                          >
                            {updatingId === parcel.tracking_number ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            {status.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
 }