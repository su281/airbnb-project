// src/components/AnimatedFooter.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function AnimatedFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white overflow-hidden"
    >
      {/* Wave Animation */}
      <div className="absolute -top-10 left-0 w-[200%] h-40 bg-white opacity-20 rounded-full animate-wave"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        {/* Branding */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold mb-2">YourBookingApp</h2>
          <p className="text-sm text-gray-200">
            &copy; 2025 All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-6 flex-wrap justify-center">
          <a href="/" className="hover:text-gray-200 transition">Home</a>
          <a href="/add-property" className="hover:text-gray-200 transition">Add Property</a>
          <a href="/mybookings" className="hover:text-gray-200 transition">My Bookings</a>
          <a href="/contact" className="hover:text-gray-200 transition">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-200 transition"><FaFacebookF /></a>
          <a href="#" className="hover:text-gray-200 transition"><FaTwitter /></a>
          <a href="#" className="hover:text-gray-200 transition"><FaInstagram /></a>
          <a href="#" className="hover:text-gray-200 transition"><FaLinkedinIn /></a>
        </div>
      </div>

      {/* Tailwind Custom Animation */}
      <style>
        {`
          .animate-wave {
            animation: wave 15s linear infinite;
            transform: translateX(0%);
          }
          @keyframes wave {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </motion.footer>
  );
}
