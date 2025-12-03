// src/components/FeatureIcons.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FaBed,
  FaBath,
  FaSwimmingPool,
  FaFire,
  FaTree,
  FaDoorOpen,
  FaWifi,
  FaDog,
  FaUtensils,
  FaMountain
} from "react-icons/fa";

// Example features array (can be dynamic)
const features = [
  { icon: <FaBed />, label: "3 Beds" },
  { icon: <FaBath />, label: "2 Baths" },
  { icon: <FaSwimmingPool />, label: "Private Pool" },
  { icon: <FaFire />, label: "Fireplace" },
  { icon: <FaTree />, label: "Garden" },
  { icon: <FaDoorOpen />, label: "Garage" },
  { icon: <FaWifi />, label: "High-speed Wi-Fi" },
  { icon: <FaDog />, label: "Pet-friendly" },
  { icon: <FaUtensils />, label: "Full Kitchen" },
  { icon: <FaMountain />, label: "Scenic View" },
];

const FeatureIcons = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
          title={feature.label}
        >
          <div className="text-blue-500 text-4xl mb-2">{feature.icon}</div>
          <span className="text-gray-700 font-medium text-center">{feature.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default FeatureIcons;
