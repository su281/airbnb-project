// src/pages/BookingDetails.jsx
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BookingsContext } from "../context/BookingsContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrashAlt, FaEdit, FaArrowLeft, FaCheckCircle, FaTimes, FaBed, FaBath, FaUser, FaDoorOpen, FaGasPump, FaSnowflake } from "react-icons/fa";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  // ✅ Context से मेल खाने के लिए removeBooking को deleteBooking से बदला गया
  const { bookings, deleteBooking, editBooking } = useContext(BookingsContext); 

  const [booking, setBooking] = useState(null);
  const [toast, setToast] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [modalTotal, setModalTotal] = useState(0);

  useEffect(() => {
    // useParams से आने वाली ID स्ट्रिंग हो सकती है, इसलिए तुलना के लिए इसे स्ट्रिंग में रखें
    const b = bookings.find((item) => String(item.id) === id); 
    if (!b) {
      navigate("/my-bookings"); // If booking not found, redirect
    } else {
      setBooking(b);
      // यदि आप पहली बार पेज लोड होने पर total दिखाना चाहते हैं, तो calculateTotal को यहाँ कॉल करें
      calculateTotal(b);
    }
  }, [bookings, id, navigate]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2200);
  };

  const handleDelete = (bid) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    deleteBooking(bid); // ✅ deleteBooking का उपयोग करें
    showToast("Booking deleted", "error");
    navigate("/my-bookings");
  };

  const openEditModal = () => {
    setEditModal(booking);
    calculateTotal(booking);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...editModal,
      [name]: name === "guests" || name === "rentalDays" ? Number(value) : value,
    };
    setEditModal(updated);
    calculateTotal(updated);
  };

  const calculateTotal = (b) => {
    let total = 0;
    if (b.itemType === "property") {
      if (b.startDate && b.endDate) {
        // रातों की संख्या की गणना
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        // ✅ रातों की संख्या सही ढंग से गणना करें
        const nights = Math.max(Math.ceil((end - start) / (1000 * 60 * 60 * 24)), 1); 
        
        // ✅ Fix: यदि b.total प्रति रात की कीमत है, तो रातों से गुणा करें।
        // यदि b.total कुल कीमत है, तो इसे प्रति रात की कीमत (per night price) से बदलें।
        // यहाँ हम मानते हैं कि b.total प्रति रात की कीमत है।
        total = nights * b.total; 
      }
    } else {
      // कार बुकिंग (Car Booking)
      total = (b.rentalDays || 1) * b.total;
    }
    setModalTotal(total);
  };

  const saveEdit = () => {
    const updatedBooking = { ...editModal, total: modalTotal };
    // ✅ Context फ़ंक्शन को अपडेटेड ऑब्जेक्ट पास करें
    editBooking(updatedBooking); 
    setBooking(updatedBooking);
    showToast("Booking updated!");
    setEditModal(null);
  };

  const FeatureIcons = ({ item }) => {
    const propertyFeatures = [
      { icon: <FaBed />, label: "Beds", key: "beds" },
      { icon: <FaBath />, label: "Baths", key: "baths" },
      { icon: <FaUser />, label: "Guests", key: "guests" },
    ];
    const carFeatures = [
      { icon: <FaUser />, label: "Seats", key: "seats" },
      { icon: <FaDoorOpen />, label: "Doors", key: "doors" },
      { icon: <FaGasPump />, label: "Fuel", key: "fuel" },
      { icon: <FaSnowflake />, label: "AC", key: "ac" },
    ];
    const features = item.itemType === "property" ? propertyFeatures : carFeatures;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center p-2 bg-gray-100 rounded-lg">
            <div className="text-blue-500 text-2xl mb-1">{f.icon}</div>
            <span className="text-gray-700 text-sm">{item[f.key] || "-"}</span>
            <span className="text-gray-500 text-xs">{f.label}</span>
          </div>
        ))}
      </div>
    );
  };

  if (!booking) return null;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg text-white font-medium shadow-lg flex items-center gap-2 ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <FaCheckCircle />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/my-bookings" className="flex items-center gap-2 text-blue-600 hover:underline">
          <FaArrowLeft /> Back
        </Link>
        <h1 className="text-3xl font-bold">{booking.title}</h1>
        <div className="flex gap-2">
          <button onClick={openEditModal} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition flex items-center gap-1">
            <FaEdit /> Edit
          </button>
          <button onClick={() => handleDelete(booking.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-1">
            <FaTrashAlt /> Delete
          </button>
        </div>
      </div>

      {/* Image */}
      <img src={booking.images?.[0] || booking.image} alt={booking.title} className="w-full h-64 object-cover rounded-lg shadow mb-4" />

      {/* Details */}
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500">{booking.location}</p>
        {booking.itemType === "property" ? (
          <p className="text-gray-700">{booking.startDate} → {booking.endDate} ({booking.guests} guests)</p>
        ) : (
          <p className="text-gray-700">{booking.rentalDays} day(s)</p>
        )}
        <p className="text-blue-600 font-semibold mt-2 text-lg">${booking.total}</p>

        <FeatureIcons item={booking} />
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-md relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button onClick={() => setEditModal(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
              <h2 className="text-2xl font-bold mb-4">Edit Booking</h2>

              {editModal.itemType === "property" ? (
                <>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" name="startDate" value={editModal.startDate} onChange={handleEditChange} className="border rounded px-3 py-2 w-full mb-3" />
                  <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" name="endDate" value={editModal.endDate} onChange={handleEditChange} className="border rounded px-3 py-2 w-full mb-3" />
                  <label className="block mb-1 text-sm font-medium text-gray-700">Guests</label>
                  <input type="number" min="1" name="guests" value={editModal.guests} onChange={handleEditChange} className="border rounded px-3 py-2 w-full mb-4" />
                </>
              ) : (
                <>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Rental Days</label>
                  <input type="number" min="1" name="rentalDays" value={editModal.rentalDays} onChange={handleEditChange} className="border rounded px-3 py-2 w-full mb-4" />
                </>
              )}

              <p className="font-semibold mb-4 text-xl">Total: ${modalTotal.toFixed(2)}</p>

              <button onClick={saveEdit} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}