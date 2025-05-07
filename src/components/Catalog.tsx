import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { getParcels } from "../api";
import { Parcel } from "../types";

const Catalog: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(false);

  const parcelsPerPage = 5;

  useEffect(() => {
    setLoading(true);
    getParcels()
      .then((data) => {
        setParcels(data);
      })
      .catch((error) => {
        console.error("Failed to fetch parcels:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  

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

  const filteredParcels = parcels.filter((parcel) => {
    const senderName = parcel.sender?.name?.toLowerCase() || "";
    const recipientName = parcel.recipient?.name?.toLowerCase() || "";
    const trackingNumber = parcel.tracking_number.toLowerCase();
    const query = search.toLowerCase();
    return (
      trackingNumber.includes(query) ||
      senderName.includes(query) ||
      recipientName.includes(query)
    );
  });

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
        />
        <button
          onClick={() => {
            setLoading(true);
            getParcels()
              .then((data) => {
                setParcels(data);
              })
              .catch((error) => {
                console.error("Failed to fetch parcels:", error);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
          
          className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm transition disabled:opacity-50"
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
          >
            <h2 className="text-xl font-semibold mb-2">📦 {parcel.tracking_number}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Sender:</span> {parcel.sender?.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Recipient:</span> {parcel.recipient?.name}
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Weight:</span> {parcel.weight ?? "N/A"} kg
            </p>
            <p
              className={`font-bold mt-2 ${
                parcel.status === "delivered"
                  ? "text-green-600"
                  : parcel.status === "in transit"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {parcel.status}
            </p>
          </motion.div>
        ))}
      </div>

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
          >
            {i + 1}
          </button>
        ))}
      </div>

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
            <p><strong>Sender:</strong> {selectedParcel.sender?.name}</p>
            <p><strong>Recipient:</strong> {selectedParcel.recipient?.name}</p>
            <p><strong>Weight:</strong> {selectedParcel.weight ?? "N/A"} kg</p>
            <p><strong>Status:</strong> {selectedParcel.status}</p>
            <div className="mt-4">
              <h3 className="font-medium text-lg">History:</h3>
              {selectedParcel.tracking_history?.length ? (
                <ul className="space-y-2">
                  {selectedParcel.tracking_history.map((update) => (
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
              ) : (
                <p className="text-sm text-gray-500">No tracking history available.</p>
              )}
            </div>
            <button
              onClick={() => setSelectedParcel(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
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
