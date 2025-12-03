import React, { useEffect, useState, useContext } from "react"; // ⬅️ useContext जोड़ा गया
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTimesCircle, FaFileDownload } from "react-icons/fa";
import Confetti from "react-confetti";
import jsPDF from "jspdf"; 
import { BookingsContext } from "../context/BookingsContext"; // ⬅️ Context इम्पोर्ट किया गया

export default function BookingCancel() {
  const navigate = useNavigate();
  const { bookings, deleteBooking } = useContext(BookingsContext); // ⬅️ Context से प्राप्त करें

  const [showConfetti, setShowConfetti] = useState(true);
  const [referenceId] = useState(() => "BK" + Math.floor(100000 + Math.random() * 900000));
  const cancelDate = new Date().toLocaleString();
  const [deletedBookingId, setDeletedBookingId] = useState(null); // ⬅️ ट्रैक करने के लिए

  useEffect(() => {
    // 1. Confetti Timer
    const timer = setTimeout(() => setShowConfetti(false), 4000);

    // 2. ऑटो-डिलीट लॉजिक: पहली बुकिंग को डिलीट करें (कोई ID न होने के कारण)
    // 🛑 ध्यान दें: आदर्श रूप से, कैंसल की गई बुकिंग की ID यहाँ URL या State के माध्यम से आनी चाहिए।
    // क्योंकि यहाँ कोई ID नहीं है, हम सरलता के लिए पहली बुकिंग को डिलीट कर रहे हैं।
    if (bookings.length > 0 && !deletedBookingId) {
      const bookingToDelete = bookings[0]; 
      
      // ✅ बुकिंग को डिलीट करें
      deleteBooking(bookingToDelete.id); 
      setDeletedBookingId(bookingToDelete.id); // ताकि यह दुबारा डिलीट न हो

      console.log(`Booking with ID ${bookingToDelete.id} automatically deleted on Cancel page.`);
    }

    return () => clearTimeout(timer);
  }, [bookings, deleteBooking, deletedBookingId]); // dependencies में deleteBooking जोड़ें

  const handleDownloadPDF = () => {
    const doc = new jsPDF(); 

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 0, 0); 
    doc.text("Booking Cancellation Receipt", 20, 25);

    doc.setDrawColor(255, 0, 0);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Reference ID: ${referenceId}`, 20, 50);
    doc.text(`Cancellation Date: ${cancelDate}`, 20, 60);
    doc.text("Status: Booking Cancelled ❌", 20, 70);
    // यदि कोई बुकिंग डिलीट हुई है, तो उसे यहाँ दिखाएँ
    if(deletedBookingId) {
      doc.text(`Note: Booking ID ${deletedBookingId} has been removed from your list.`, 20, 80);
    } else {
      doc.text("Message: We're sorry your booking could not be completed.", 20, 80);
    }
    doc.text("Refund Note: Refund will be processed as per policy.", 20, 90); 
    doc.text("For any help, contact our support team at support@airbnbclone.com", 20, 110);

    doc.save(`Cancellation_${referenceId}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-white to-orange-100 px-4 text-center relative overflow-hidden">
      {showConfetti && <Confetti colors={["#6b7280", "#fef2f2", "#b91c1c"]} />}

      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }} 
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="flex justify-center mb-6"
        >
          <FaTimesCircle className="text-red-500 text-6xl" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Booking Cancelled!
        </h1>
        <p className="text-gray-600 mb-4">
          Oops! Your booking could not be completed or was cancelled.
        </p>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
          <p className="text-gray-700 font-semibold">Reference ID:</p>
          <p className="text-red-600 font-bold text-lg">{referenceId}</p>
          <p className="text-gray-500 text-sm mt-1">Cancellation Date: {cancelDate}</p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 text-white py-2 rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-md"
        >
          <FaFileDownload /> Download Receipt (PDF)
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-gray-800 text-white py-2 rounded-full text-lg font-semibold hover:bg-gray-700 transition-all duration-300"
        >
          Back to Home
        </button>

        <button
          onClick={() => navigate("/my-bookings")} // ⬅️ Try Again के बजाय My Bookings पर भेजें
          className="w-full mt-4 bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 text-white py-2 rounded-full text-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-md"
        >
          View My Bookings
        </button>
      </motion.div>
    </div>
  );
}