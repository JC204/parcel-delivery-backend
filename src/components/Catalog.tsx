import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../api/index"; // Adjust path if needed

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
const randomDescriptions = [
  "Books",
  "Electronics",
  "Clothing",
  "Accessories",
  "Sports Gear",
];

const generateRandomParcels = (count: number): Parcel[] => {
  return Array.from({ length: count }, (_, i) => ({
    tracking_number: `RND-${i + 1}`,
    sender: randomNames[Math.floor(Math.random() * randomNames.length)],
    recipient: randomNames[Math.floor(Math.random() * randomNames.length)],
    weight: +(Math.random() * 10).toFixed(2),
    description:
      randomDescriptions[Math.floor(Math.random() * randomDescriptions.length)],
    status: ["Pending", "In Transit", "Delivered"][
      Math.floor(Math.random() * 3)
    ],
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
  const parcelsPerPage = 5;

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const response = await axios.get(`${API_URL}/parcels`);
      setParcels(response.data);
    } catch (error) {
      console.error("Error fetching parcels:", error);
      setParcels(generateRandomParcels(10));
    }
  };

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
  const currentParcels = filteredParcels.slice(
    indexOfFirstParcel,
    indexOfLastParcel
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleParcelClick = (parcel: Parcel) => setSelectedParcel(parcel);
  const closeModal = () => setSelectedParcel(null);

  const handleOutsideClick = (e: React.MouseEvent) => {
    const modal = document.getElementById("modal");
    if (modal && !modal.contains(e.target as Node)) {
      closeModal();
    }
  };

  return (
    <div className="container mx-auto p-6" onClick={handleOutsideClick}>
      <h1 className="text-3xl font-bold mb-6 text-center">Parcel Catalog 📦</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search parcels..."
          value={search}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-lg p-2 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Search parcels"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentParcels.map((parcel, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
            whileHover={{ scale: 1.05 }}
            onClick={() => handleParcelClick(parcel)}
            aria-label={`View details of parcel ${parcel.tracking_number}`}
          >
            <h2 className="text-xl font-semibold mb-2">📦 {parcel.tracking_number}</h2>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Sender:</span> {parcel.sender}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Recipient:</span> {parcel.recipient}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Weight:</span> {parcel.weight} kg
            </p>
            <p className="text-gray-700 mb-1">
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
        {Array.from(
          { length: Math.ceil(filteredParcels.length / parcelsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-400 transition duration-300`}
              aria-label={`Go to page ${i + 1}`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>

      {/* Modal */}
      {selectedParcel && (
        <div
          id="modal"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg w-1/2">
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
                {selectedParcel.history.map((update, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    <span className="font-semibold">{update.status}:</span>{" "}
                    {update.description} at {update.location} (
                    {new Date(update.timestamp).toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              aria-label="Close parcel details"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;