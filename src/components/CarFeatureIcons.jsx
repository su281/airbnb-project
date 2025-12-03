// src/components/CarFeatureIcons.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FaUserFriends, // Seats
  FaCarSide,     // Vehicle type
  FaGasPump,     // Fuel
  FaSnowflake,   // AC
  FaMapMarkedAlt, // GPS
  FaSun,         // Sunroof
  FaBoxOpen,     // Trunk
  FaHorse,       // Horsepower
  FaShieldAlt,   // Safety
  FaDoorOpen     // Doors
} from "react-icons/fa";

// Example car features array
const carFeatures = [
  { icon: <FaUserFriends />, label: "5 Seats" },
  { icon: <FaDoorOpen />, label: "4 Doors" },
  { icon: <FaGasPump />, label: "Petrol" },
  { icon: <FaSnowflake />, label: "Air Conditioning" },
  { icon: <FaMapMarkedAlt />, label: "GPS Included" },
  { icon: <FaSun />, label: "Sunroof" },
  { icon: <FaBoxOpen />, label: "Large Trunk" },
  { icon: <FaHorse />, label: "200 HP" },
  { icon: <FaShieldAlt />, label: "Airbags & ABS" },
  { icon: <FaCarSide />, label: "Automatic Transmission" },
];

const CarFeatureIcons = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-4">
      {carFeatures.map((feature, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
          title={feature.label}
        >
          <div className="text-green-500 text-4xl mb-2">{feature.icon}</div>
          <span className="text-gray-700 font-medium text-center">{feature.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default CarFeatureIcons;
