// src/pages/BookingSuccess.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { jsPDF } from "jspdf";
import Confetti from "react-confetti";

// FIXED FOR VITE (process.env ❌)
const BACKEND_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Small Beep Sound (base64)
const CHIME_BASE64 =
  "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA...";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const loc = useLocation();
  const query = new URLSearchParams(loc.search);
  const refId = query.get("ref");

  const [showConfetti, setShowConfetti] = useState(true);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(12);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef(null);

  // Stop confetti
  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(t);
  }, []);

  // Fetch booking details
  useEffect(() => {
    let cancelled = false;

    const fetchBooking = async () => {
      if (refId) {
        try {
          const res = await fetch(`${BACKEND_BASE}/api/bookings/${refId}`);
          if (!res.ok) throw new Error("Not found");

          const json = await res.json();
          if (!cancelled) setBooking(json.booking);
        } catch (err) {
          const local = JSON.parse(localStorage.getItem("latestBooking"));
          if (!cancelled && local?.referenceId === refId) {
            setBooking(local);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        const local = JSON.parse(localStorage.getItem("latestBooking"));
        if (local) setBooking(local);
        setLoading(false);
      }
    };

    fetchBooking();
    return () => (cancelled = true);
  }, [refId]);

  // Auto redirect
  useEffect(() => {
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(iv);
          navigate("/my-bookings");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [navigate]);

  // Play sound
  useEffect(() => {
    const audio = new Audio(CHIME_BASE64);
    audio.volume = 0.85;
    audio.muted = muted;
    audioRef.current = audio;

    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [muted]);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) {
        audioRef.current.muted = next;
        if (!next) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  };

  // Create PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const id = booking?.referenceId || "N/A";
    const name = booking?.name || "Guest";
    const property = booking?.propertyName || "Property";
    const checkIn = booking?.startDate
      ? new Date(booking.startDate).toLocaleDateString()
      : "N/A";
    const checkOut = booking?.endDate
      ? new Date(booking.endDate).toLocaleDateString()
      : "N/A";
    const total = booking?.total ?? booking?.totalPrice ?? 0;

    doc.setFontSize(22);
    doc.text("Booking Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${id}`, 20, 40);
    doc.text(`Name: ${name}`, 20, 50);
    doc.text(`Property: ${property}`, 20, 60);
    doc.text(`Check-In: ${checkIn}`, 20, 70);
    doc.text(`Check-Out: ${checkOut}`, 20, 80);
    doc.text(`Guests: ${booking?.guests ?? 1}`, 20, 90);
    doc.text(`Total Amount: ₹${total}`, 20, 100);

    doc.save(`Booking_${id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 pt-32">
        Loading booking...
      </div>
    );
  }

  const referenceId = booking?.referenceId || refId || "BK-XXXXXX";
  const bookingDate = booking?.createdAt
    ? new Date(booking.createdAt).toLocaleString()
    : new Date().toLocaleString();

  const propertyName = booking?.propertyName || "Your property";
  const totalPrice = booking?.total ?? booking?.totalPrice ?? 0;
  const checkIn = booking?.startDate
    ? new Date(booking.startDate).toLocaleDateString()
    : "N/A";
  const checkOut = booking?.endDate
    ? new Date(booking.endDate).toLocaleDateString()
    : "N/A";

  return (
    <div className="min-h-screen mt-32 flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-white to-yellow-100 px-4 text-center overflow-hidden relative">

      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full relative"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.2 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <FaCheckCircle className="text-green-600 text-6xl" />
            </motion.div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h1>
              <p className="text-sm text-gray-600">
                Ref: <span className="text-blue-600 font-mono">{referenceId}</span>
              </p>
            </div>
          </div>

          <button onClick={toggleMute} className="p-2 rounded-full bg-gray-100 hover:shadow">
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>

        <p className="mt-3 text-gray-700">
          Your stay at <b>{propertyName}</b> has been successfully booked.
        </p>

        {/* Booking Details */}
        <div className="bg-gray-50 p-4 rounded-xl border mt-5 text-left">
          <p><b>Booking Date:</b> {bookingDate}</p>
          <p><b>Check-In:</b> {checkIn}</p>
          <p><b>Check-Out:</b> {checkOut}</p>
          <p><b>Guests:</b> {booking?.guests ?? 1}</p>
          <p className="mt-2 font-semibold text-gray-800">Total: ₹{totalPrice}</p>
        </div>

        {/* Buttons */}
        <div className="mt-6 grid gap-3">
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white py-2 rounded-full font-semibold"
          >
            Download Receipt (PDF)
          </button>

          <button
            onClick={() => navigate("/my-bookings")}
            className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold"
          >
            View My Bookings
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-800 text-white py-2 rounded-full font-semibold"
          >
            Back to Home
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-5">
          Redirecting to My Bookings in <b>{countdown}</b>s…
        </p>
      </motion.div>
    </div>
  );
}
