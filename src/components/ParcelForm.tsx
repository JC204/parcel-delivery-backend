import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Customer } from "../types";

type ParcelFormState = {
  sender: Customer;
  recipient: Customer;
  weight: number;
  description: string;
  length: number;
  width: number;
  height: number;
  service_type: string;
};

const ParcelForm: React.FC = () => {
  const [parcel, setParcel] = useState<ParcelFormState>({
    sender: { name: "", phone: "", address: "", email: "" },
    recipient: { name: "", phone: "", address: "", email: "" },
    weight: 0,
    description: "",
    length: 0,
    width: 0,
    height: 0,
    service_type: "Standard",
  });

  const [submitted, setSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    } else if (["weight", "length", "width", "height"].includes(name)) {
      setParcel((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
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
      length: 0,
      width: 0,
      height: 0,
      service_type: "Standard",
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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-800">
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

            <div className="grid grid-cols-2 gap-4">
              {renderFields("sender")}
              {renderFields("recipient")}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <span className="text-sm text-gray-700 dark:text-gray-300">Length (cm)</span>
                <input
                  type="number"
                  name="length"
                  value={parcel.length}
                  onChange={handleChange}
                  min={1}
                  className={inputClass}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700 dark:text-gray-300">Width (cm)</span>
                <input
                  type="number"
                  name="width"
                  value={parcel.width}
                  onChange={handleChange}
                  min={1}
                  className={inputClass}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700 dark:text-gray-300">Height (cm)</span>
                <input
                  type="number"
                  name="height"
                  value={parcel.height}
                  onChange={handleChange}
                  min={1}
                  className={inputClass}
                  required
                />
              </label>

              <label className="col-span-2 block">
                <span className="text-sm text-gray-700 dark:text-gray-300">Service Type</span>
                <select
                  name="service_type"
                  value={parcel.service_type}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Same Day">Same Day</option>
                </select>
              </label>

              <label className="col-span-2 block">
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
            </div>

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