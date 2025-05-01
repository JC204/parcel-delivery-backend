import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackParcel } from '../api';
import { Parcel } from '../types';
import { Package, Loader2, SearchIcon, CheckCircle, AlertCircle } from 'lucide-react';

const ParcelTracker = () => {
  const { trackingNumber: urlTrackingNumber } = useParams();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || '');
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlTrackingNumber) {
      handleTrackParcel(urlTrackingNumber);
    }
  }, [urlTrackingNumber]);

  const handleTrackParcel = async (number: string) => {
    if (!number.trim()) {
      setError('Please enter a tracking number');
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
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed_delivery':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Track Your Parcel</h1>
        <p className="text-gray-600">Enter your tracking number to get real-time updates on your delivery</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3">
          <AlertCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Searching for your parcel...</p>
        </div>
      )}

      {parcel && !loading && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-1">{parcel.tracking_number}</h2>
                <p className="text-gray-600">Expected delivery: {parcel.estimated_delivery ? 
                  new Date(parcel.estimated_delivery).toLocaleDateString() : 'Not available'}</p>
              </div>
              
              {parcel.tracking_history && parcel.tracking_history.length > 0 && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getStatusColor(parcel.tracking_history[parcel.tracking_history.length - 1].status)
                }`}>
                  {parcel.tracking_history[parcel.tracking_history.length - 1].status.replace(/_/g, ' ')}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Sender</h3>
                <p className="font-medium">{parcel.sender.name}</p>
                <p className="text-gray-600 text-sm">{parcel.sender.address}</p>
                <p className="text-gray-600 text-sm">{parcel.sender.phone}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Recipient</h3>
                <p className="font-medium">{parcel.recipient.name}</p>
                <p className="text-gray-600 text-sm">{parcel.recipient.address}</p>
                <p className="text-gray-600 text-sm">{parcel.recipient.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Tracking History</h3>
              
              {parcel.tracking_history && parcel.tracking_history.length > 0 ? (
                <div className="space-y-4">
                  {parcel.tracking_history.map((update, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {update.status.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-gray-600">{update.location}</p>
                        <p className="text-sm text-gray-500">{update.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tracking updates available yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!loading && !parcel && !error && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-700">No parcel information</h3>
          <p className="mt-2 text-gray-500">Enter a tracking number to see delivery status</p>
        </div>
      )}
    </div>
  );
};

export default ParcelTracker;