import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../api/index";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface Parcel {
  tracking_number: string;
  sender: string;
  recipient: string;
  weight: number;
  description: string;
  status: string;
  history: Array<{
    status: string;
    location: string;
    description: string;
    timestamp: string;
  }>;
}

const randomNames = ["Alice", "Bob", "Charlie", "Diana", "Edward"];
const randomDescriptions = ["Books", "Electronics", "Clothing", "Accessories", "Sports Gear"];

const generateRandomParcels = (count: number): Parcel[] => {
  return Array.from({ length: count }, (_, i) => ({
    tracking_number: `RND-${i + 1}`,
    sender: randomNames[Math.floor(Math.random() * randomNames.length)],
    recipient: randomNames[Math.floor(Math.random() * randomNames.length)],
    weight: +(Math.random() * 10).toFixed(2),
    description: randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)],
    status: ["Pending", "In Transit", "Delivered"][Math.floor(Math.random() * 3)],
    history: [
      {
        status: "Dispatched",
        location: "New York",
        description: "Package left warehouse",
        timestamp: new Date().toISOString(),
      },
      {
        status: "In Transit",
        location: "Los Angeles",
        description: "Package en route",
        timestamp: new Date().toISOString(),
      },
    ],
  }));
};

const Catalog: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(false);

  const parcelsPerPage = 5;

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/parcels`);
      setParcels(response.data);
    } catch (error) {
      console.error("Error fetching parcels:", error);
      setParcels(generateRandomParcels(10));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedParcel) return;

    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById("modal");
      if (modal && !modal.contains(e.target as Node)) {
        setSelectedParcel(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedParcel]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredParcels = parcels.filter(
    (parcel) =>
      parcel.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
      parcel.sender.toLowerCase().includes(search.toLowerCase()) ||
      parcel.recipient.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastParcel = currentPage * parcelsPerPage;
  const indexOfFirstParcel = indexOfLastParcel - parcelsPerPage;
  const currentParcels = filteredParcels.slice(indexOfFirstParcel, indexOfLastParcel);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6 dark:bg-gray-900 dark:text-white bg-white text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Parcel Catalog 📦</h1>

      <div className="flex justify-center items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search parcels..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          aria-label="Search parcels"
        />
        <button
          onClick={fetchParcels}
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm transition disabled:opacity-50"
          aria-label="Refresh parcel list"
          disabled={loading}
        >
          <ArrowPathIcon className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
        {loading && (
          <span className="text-gray-600 dark:text-gray-300 text-sm animate-pulse">
            Loading parcels...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentParcels.map((parcel) => (
          <motion.div
            key={parcel.tracking_number}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedParcel(parcel)}
            aria-label={`View details of parcel ${parcel.tracking_number}`}
          >
            <h2 className="text-xl font-semibold mb-2">📦 {parcel.tracking_number}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Sender:</span> {parcel.sender}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Recipient:</span> {parcel.recipient}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Weight:</span> {parcel.weight} kg
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Description:</span> {parcel.description}
            </p>
            <p
              className={`font-bold mt-2 ${
                parcel.status === "Delivered"
                  ? "text-green-600"
                  : parcel.status === "In Transit"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {parcel.status}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: Math.ceil(filteredParcels.length / parcelsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            } hover:bg-blue-400`}
            aria-label={`Go to page ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedParcel && (
        <motion.div
          id="modal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Parcel Details</h2>
            <p><strong>Tracking Number:</strong> {selectedParcel.tracking_number}</p>
            <p><strong>Sender:</strong> {selectedParcel.sender}</p>
            <p><strong>Recipient:</strong> {selectedParcel.recipient}</p>
            <p><strong>Weight:</strong> {selectedParcel.weight} kg</p>
            <p><strong>Description:</strong> {selectedParcel.description}</p>
            <p><strong>Status:</strong> {selectedParcel.status}</p>
            <div className="mt-4">
              <h3 className="font-medium text-lg">History:</h3>
              <ul>
                {selectedParcel.history.map((update) => (
                  <li
                    key={`${update.status}-${update.timestamp}`}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    <span className="font-semibold">{update.status}:</span>{" "}
                    {update.description} at {update.location} (
                    {new Date(update.timestamp).toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setSelectedParcel(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              aria-label="Close parcel details"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Catalog;
