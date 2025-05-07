import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackParcel } from '../api';
import { Parcel, TrackingUpdate } from '../types';
import {
  Package,
  Loader2,
  SearchIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const ParcelTracker = () => {
  const { trackingNumber: urlTrackingNumber } = useParams<{ trackingNumber?: string }>();
  const navigate = useNavigate();

  const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || '');
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlTrackingNumber) {
      handleTrackParcel(urlTrackingNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTrackingNumber]);

  const handleTrackParcel = async (number: string) => {
    if (!number.trim()) {
      setError('Please enter a tracking number.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const parcelData = await trackParcel(number);
      setParcel(parcelData);
      if (!urlTrackingNumber) {
        navigate(`/track/${number}`);
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to find parcel. Please check the tracking number and try again.');
      setParcel(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrackParcel(trackingNumber);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered: 'bg-green-100 text-green-800',
      in_transit: 'bg-blue-100 text-blue-800',
      out_for_delivery: 'bg-yellow-100 text-yellow-800',
      failed_delivery: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const latestStatus = parcel?.tracking_history?.[parcel.tracking_history.length - 1];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Track Your Parcel</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your tracking number to get real-time updates on your delivery.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
            Track
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3 dark:bg-red-100/10 dark:border-red-400">
          <AlertCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Searching for your parcel...</p>
        </div>
      )}

      {/* Parcel Info */}
      {parcel && !loading && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-1">{parcel.tracking_number}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Expected delivery:{' '}
                  {parcel.estimated_delivery
                    ? new Date(parcel.estimated_delivery).toLocaleDateString()
                    : 'Not available'}
                </p>
              </div>
              {latestStatus && (
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    latestStatus.status
                  )}`}
                >
                  {latestStatus.status.replace(/_/g, ' ')}
                </div>
              )}
            </div>
          </div>

{/* Courier Info */}
{parcel.courier_name && (
  <div className="mb-6 flex items-center gap-4">
    <img
      src={`https://api.dicebear.com/7.x/initials/svg?seed=${parcel.courier_name}`}
      alt="Courier Avatar"
      className="w-12 h-12 rounded-full border"
    />
    <div>
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Courier</h3>
      <p className="font-medium">{parcel.courier_name}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">Courier ID: {parcel.courier_id}</p>
    </div>
  </div>
         )} 
          <div className="p-6">
            {/* Sender & Recipient */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {['sender', 'recipient'].map((key) => {
                const person = parcel[key as 'sender' | 'recipient'];
                return (
                  <div key={key}>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 dark:text-gray-400">
                      {key === 'sender' ? 'Sender' : 'Recipient'}
                    </h3>
                    <p className="font-medium">{person?.name}</p>
                    <p className="text-gray-600 text-sm dark:text-gray-400">{person?.address}</p>
                    <p className="text-gray-600 text-sm dark:text-gray-400">{person?.phone}</p>
                  </div>
                );
              })}
            </div>

            {/* Tracking History */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3 dark:text-gray-400">Tracking History</h3>
              {(parcel.tracking_history?.length ?? 0) > 0 ? (
                <div className="space-y-4">
                  {parcel.tracking_history!.map((update: TrackingUpdate, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-600/10 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{update.status.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{update.location}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No tracking updates available yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Default Empty State */}
      {!loading && !parcel && !error && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-700 dark:text-white">No parcel information</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Enter a tracking number to see delivery status</p>
        </div>
      )}
    </div>
  );
};

export default ParcelTracker;
