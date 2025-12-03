import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import videoBg from "../assets/airbnb-bg.mp4";
import bgAudio from "../assets/ambient.mp3";

export default function HeroSection({ searchTerm, setSearchTerm }) {
  const audioRef = useRef(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // Start audio with subtle fade on first interaction
  const startAudio = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch((err) => console.log(err));

      let vol = 0;
      const fadeIn = setInterval(() => {
        if (vol < 0.2) {
          vol += 0.01;
          audioRef.current.volume = vol;
        } else clearInterval(fadeIn);
      }, 100);

      setAudioStarted(true);
    }
  };

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      onClick={startAudio} // start audio on first click
    >
      {/* Background Video */}
      <video
        src={videoBg}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
      />

      {/* Background Audio */}
      <audio ref={audioRef} src={bgAudio} loop />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Text & Search */}
      <motion.div
        className="relative z-10 text-center text-white px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Find Your Perfect Stay 🌍
        </h1>
        <p className="text-lg md:text-xl mb-8 font-light drop-shadow-md">
          Discover unique homes, villas, and apartments worldwide.
        </p>

        {/* Animated Search Bar */}
        <motion.div
          className="flex items-center justify-between bg-white/90 rounded-full px-4 py-2 max-w-md mx-auto shadow-lg backdrop-blur-sm"
          animate={{ width: inputFocused ? "100%" : "90%" }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <input
            type="text"
            placeholder="Search by location or title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            className="flex-grow bg-transparent text-gray-700 outline-none px-3 py-2"
          />
          <button className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 transition-transform transform hover:scale-105">
            <FaSearch />
          </button>
          <FaMapMarkerAlt className="text-gray-400 ml-2" />
        </motion.div>
      </motion.div>

      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </section>
  );
}
