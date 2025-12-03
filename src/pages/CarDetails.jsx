import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import CarFeatureIcons from "../components/CarFeatureIcons";

import {
  FaStar,
  FaGasPump,
  FaCarSide,
  FaUsers,
  FaCogs,
  FaArrowLeft,
  FaTachometerAlt,
  FaRoad,
  FaRegCalendarAlt,
} from "react-icons/fa";

import apartment1 from "../assets/apartment1.jpg";
import loft from "../assets/loft.jpg";
import beachhouse from "../assets/beachhouse.jpg";
import villa from "../assets/villa.jpg";
import cabin from "../assets/cabin.jpg";
import penthouse from "../assets/penthouse.jpg";

export default function CarDetails() {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const cars = [
    {
      id: "1",
      name: "Tesla Model S",
      type: "Electric Sedan",
      seats: 5,
      fuel: "Electric",
      transmission: "Automatic",
      price: 1200,
      rating: 4.9,
      images: [apartment1, loft, beachhouse],
      specs: { topSpeed: "250 km/h", range: "600 km", acceleration: "3.1s", year: 2023, mileage: "N/A (Electric)" },
      description: "Experience the thrill of electric performance with the Tesla Model S. Perfect for city drives and long trips with zero emissions and unmatched comfort.",
    },
    // ... other cars
  ];

  const car = cars.find((c) => c.id === id);
  if (!car) return <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">Car not found.</div>;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % car.images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + car.images.length) % car.images.length);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays > 0 ? diffDays : 0);
    }
  }, [startDate, endDate]);

  const handleBooking = () => {
    if (!startDate || !endDate || days < 1) {
      alert("Please select valid start and end dates.");
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => setModalOpen(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
      <Link to="/" className="flex items-center gap-2 text-blue-600 mb-6 hover:underline">
        <FaArrowLeft /> Back to Home
      </Link>

      <motion.div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      >
        {/* Carousel */}
        <div className="relative w-full h-[420px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img key={currentIndex} src={car.images[currentIndex]} alt={car.name} className="absolute w-full h-full object-cover"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} />
          </AnimatePresence>
          <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black transition">❮</button>
          <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black transition">❯</button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {car.images.map((_, i) => <div key={i} className={`w-3 h-3 rounded-full ${i === currentIndex ? "bg-white" : "bg-white/50"}`} />)}
          </div>
        </div>

        {/* Car Info */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{car.name}</h1>
            <div className="flex items-center text-yellow-500 mt-2 sm:mt-0"><FaStar className="mr-1" /> {car.rating}</div>
          </div>

          <p className="text-gray-600 mb-6">{car.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700 mb-8">
            <div className="flex items-center gap-2"><FaCarSide /> {car.type}</div>
            <div className="flex items-center gap-2"><FaUsers /> {car.seats} Seats</div>
            <div className="flex items-center gap-2"><FaGasPump /> {car.fuel}</div>
            <div className="flex items-center gap-2"><FaCogs /> {car.transmission}</div>
          </div>

          {/* Feature Icons Component */}
          <h2 className="text-2xl font-bold mb-4">Car Features</h2>
          <CarFeatureIcons />

          {/* Specs Table */}
          <div className="overflow-x-auto mb-8 mt-6">
            <table className="w-full border-collapse text-gray-700 text-sm sm:text-base">
              <thead><tr className="bg-gray-100 text-left"><th className="p-3 font-semibold">Specification</th><th className="p-3 font-semibold">Details</th></tr></thead>
              <tbody>
                <tr><td className="p-3 flex items-center gap-2"><FaTachometerAlt /> Top Speed</td><td className="p-3">{car.specs.topSpeed}</td></tr>
                <tr><td className="p-3 flex items-center gap-2"><FaRoad /> Range</td><td className="p-3">{car.specs.range}</td></tr>
                <tr><td className="p-3 flex items-center gap-2">⚡ Acceleration</td><td className="p-3">{car.specs.acceleration}</td></tr>
                <tr><td className="p-3 flex items-center gap-2"><FaRegCalendarAlt /> Year</td><td className="p-3">{car.specs.year}</td></tr>
                <tr><td className="p-3 flex items-center gap-2">⛽ Mileage</td><td className="p-3">{car.specs.mileage}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Price + Book Now */}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-800">${car.price}/day</p>
            <motion.button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalOpen(true)}
            >
              Book Now
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Booking Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-96 relative shadow-lg"
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
            >
              <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✕</button>
              <h2 className="text-2xl font-bold mb-4">Book {car.name}</h2>
              {bookingSuccess ? (
                <p className="text-green-600 font-semibold text-center">Booking Confirmed!</p>
              ) : (
                <>
                  <label className="block mb-2 text-gray-700">Start Date</label>
                  <input type="date" className="w-full mb-4 p-2 border rounded" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <label className="block mb-2 text-gray-700">End Date</label>
                  <input type="date" className="w-full mb-4 p-2 border rounded" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

                  <p className="text-gray-800 font-semibold mb-4">
                    Total Days: <span className="text-blue-600">{days}</span>
                  </p>
                  <p className="text-gray-800 font-semibold mb-4">
                    Total Price: <span className="text-blue-600">${car.price * days}</span>
                  </p>

                  <button onClick={handleBooking} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                    Confirm Booking
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
