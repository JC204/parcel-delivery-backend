import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { createParcel } from '../api';

export function ParcelForm() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientAddress: '',
    weight: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTrackingNumber(null);

    try {
      const parcelData = {
        sender: {
          name: formData.senderName,
          email: formData.senderEmail,
          phone: formData.senderPhone,
          address: formData.senderAddress,
        },
        recipient: {
          name: formData.recipientName,
          email: formData.recipientEmail,
          phone: formData.recipientPhone,
          address: formData.recipientAddress,
        },
        weight: parseFloat(formData.weight),
        description: formData.description,
      };

      const response = await createParcel(parcelData);
      setTrackingNumber(response.tracking_number);

      // Reset form
      setFormData({
        senderName: '',
        senderEmail: '',
        senderPhone: '',
        senderAddress: '',
        recipientName: '',
        recipientEmail: '',
        recipientPhone: '',
        recipientAddress: '',
        weight: '',
        description: '',
      });
    } catch (err) {
      setError('Failed to create parcel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex items-center justify-center mb-6">
        <Package className="w-8 h-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Create New Shipment</h2>
      </div>

      {error && <p className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</p>}
      {trackingNumber && (
        <p className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Shipment created successfully! Tracking #: <strong>{trackingNumber}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sender Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sender</h3>
            {["Name", "Email", "Phone", "Address"].map((field) => (
              <input
                key={field}
                type={field === "Email" ? "email" : field === "Phone" ? "tel" : "text"}
                name={`sender${field}`}
                value={(formData as any)[`sender${field}`]}
                onChange={handleChange}
                placeholder={`Sender's ${field}`}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                disabled={loading}
                required
              />
            ))}
          </div>

          {/* Recipient Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recipient</h3>
            {["Name", "Email", "Phone", "Address"].map((field) => (
              <input
                key={field}
                type={field === "Email" ? "email" : field === "Phone" ? "tel" : "text"}
                name={`recipient${field}`}
                value={(formData as any)[`recipient${field}`]}
                onChange={handleChange}
                placeholder={`Recipient's ${field}`}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                disabled={loading}
                required
              />
            ))}
          </div>
        </div>

        {/* Parcel Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Parcel Details</h3>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
            min="0.1"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Parcel Description"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Shipment'}
        </button>
      </form>
    </div>
  );
}