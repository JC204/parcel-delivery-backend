// src/components/ParcelForm.tsx
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Customer } from "../types";

type ParcelFormState = {
  sender: Customer;
  recipient: Customer;
  weight: number;
  description: string;
};

const ParcelForm: React.FC = () => {
  const [parcel, setParcel] = useState<ParcelFormState>({
    sender: {
      name: "",
      phone: "",
      address: "",
      email: "",
    },
    recipient: {
      name: "",
      phone: "",
      address: "",
      email: "",
    },
    weight: 0,
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("sender_")) {
      setParcel((prev) => ({
        ...prev,
        sender: {
          ...prev.sender,
          [name.replace("sender_", "")]: value,
        },
      }));
    } else if (name.startsWith("recipient_")) {
      setParcel((prev) => ({
        ...prev,
        recipient: {
          ...prev.recipient,
          [name.replace("recipient_", "")]: value,
        },
      }));
    } else if (name === "weight") {
      setParcel((prev) => ({
        ...prev,
        weight: parseFloat(value) || 0,
      }));
    } else if (name === "description") {
      setParcel((prev) => ({
        ...prev,
        description: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/parcels`,
        parcel
      );

      setTrackingNumber(response.data.tracking_number);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting parcel:", error);
      alert("Failed to submit parcel. Please try again.");
    }
  };

  const resetForm = () => {
    setParcel({
      sender: { name: "", phone: "", address: "", email: "" },
      recipient: { name: "", phone: "", address: "", email: "" },
      weight: 0,
      description: "",
    });
    setTrackingNumber("");
    setSubmitted(false);
  };


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-center mb-4">Create a Parcel</h2>

            {/* Sender Inputs */}
            <input
              type="text"
              name="sender_name"
              value={parcel.sender.name}
              onChange={handleChange}
              placeholder="Sender Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="sender_phone"
              value={parcel.sender.phone}
              onChange={handleChange}
              placeholder="Sender Phone"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="sender_address"
              value={parcel.sender.address}
              onChange={handleChange}
              placeholder="Sender Address"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="email"
              name="sender_email"
              value={parcel.sender.email}
              onChange={handleChange}
              placeholder="Sender Email"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />

            {/* Recipient Inputs */}
            <input
              type="text"
              name="recipient_name"
              value={parcel.recipient.name}
              onChange={handleChange}
              placeholder="Recipient Name"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="recipient_phone"
              value={parcel.recipient.phone}
              onChange={handleChange}
              placeholder="Recipient Phone"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="recipient_address"
              value={parcel.recipient.address}
              onChange={handleChange}
              placeholder="Recipient Address"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
           
            <input
              type="email"
              name="recipient_email"
              value={parcel.recipient.email}
              onChange={handleChange}
              placeholder="Recipient Email"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />

            {/* Other Inputs */}
            <input
              type="number"
              name="weight"
              value={parcel.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
              className="w-full p-2 border border-gray-300 rounded"
              min={0.1}
              step={0.1}
              required
            />
            <textarea
              name="description"
              value={parcel.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Parcel
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Parcel Submitted!</h2>
            <p className="mb-2 text-gray-700">Tracking Number:</p>
            <p className="text-lg font-mono bg-gray-100 p-2 rounded mb-4">{trackingNumber}</p>
            <button
              onClick={resetForm}
              className="mt-2 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition"
            >
              Create Another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParcelForm;
