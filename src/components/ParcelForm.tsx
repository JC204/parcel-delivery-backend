import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Customer } from "../types";

type ParcelFormState = {
  sender: Customer;
  recipient: Customer;
  weight: number;
  description: string;
  estimated_delivery: string;
};

const ParcelForm: React.FC = () => {
  const [parcel, setParcel] = useState<ParcelFormState>({
    sender: { name: "", phone: "", address: "", email: "" },
    recipient: { name: "", phone: "", address: "", email: "" },
    weight: 0,
    description: "",
    estimated_delivery: "",
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
        sender: { ...prev.sender, [name.replace("sender_", "")]: value },
      }));
    } else if (name.startsWith("recipient_")) {
      setParcel((prev) => ({
        ...prev,
        recipient: { ...prev.recipient, [name.replace("recipient_", "")]: value },
      }));
    } else if (name === "weight") {
      setParcel((prev) => ({
        ...prev,
        weight: parseFloat(value) || 0,
      }));
    } else {
      setParcel((prev) => ({
        ...prev,
        [name]: value,
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
      estimated_delivery: "",
    });
    setTrackingNumber("");
    setSubmitted(false);
  };

  const inputClass =
    "w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600";

  const renderFields = (role: "sender" | "recipient") =>
    ["name", "phone", "address", "email"].map((field) => (
      <label key={`${role}_${field}`} className="block">
        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
          {role} {field}
        </span>
        <input
          type={field === "email" ? "email" : "text"}
          name={`${role}_${field}`}
          value={parcel[role][field as keyof Customer]}
          onChange={handleChange}
          className={inputClass}
          placeholder={`${role} ${field}`}
          required
        />
      </label>
    ));

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-800">
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
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-white">
              Create a Parcel
            </h2>

            {renderFields("sender")}
            {renderFields("recipient")}

            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Weight (kg)</span>
              <input
                type="number"
                name="weight"
                value={parcel.weight}
                onChange={handleChange}
                min={0.1}
                step={0.1}
                className={inputClass}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Description</span>
              <textarea
                name="description"
                value={parcel.description}
                onChange={handleChange}
                className={inputClass}
                placeholder="Description"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700 dark:text-gray-300">Estimated Delivery</span>
              <input
                type="date"
                name="estimated_delivery"
                value={parcel.estimated_delivery}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </label>

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
            <p className="mb-2 text-gray-700 dark:text-gray-200">Tracking Number:</p>
            <p className="text-lg font-mono bg-gray-100 dark:bg-gray-800 dark:text-white p-2 rounded mb-4">
              {trackingNumber}
            </p>
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