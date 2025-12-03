// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBed,
  FaBath,
  FaUser,
  FaStar,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import Particles from "react-tsparticles";

import Navbar from "../components/Navbar";
import ChatWidget from "../components/HelpChat";

import videoBg from "../assets/airbnb-bg.mp4";
import bgAudio from "../assets/ambient.mp3";

// --- Property images ---
import apartment1 from "../assets/apartment1.jpg";
import loft from "../assets/loft.jpg";
import beachhouse from "../assets/beachhouse.jpg";
import villa from "../assets/villa.jpg";
import cabin from "../assets/cabin.jpg";
import penthouse from "../assets/penthouse.jpg";
import goaVilla from "../assets/goaVilla.jpg";
import manaliCottage from "../assets/manaliCottage.jpg";
import nainital from "../assets/nainital.jpg";

// --- Host images ---
import host1 from "../assets/hosts/host1.jpg";
import host2 from "../assets/hosts/host2.jpg";
import host3 from "../assets/hosts/host3.jpg";
import host4 from "../assets/hosts/host4.jpg";
import host5 from "../assets/hosts/host5.jpg"; // new host
import host6 from "../assets/hosts/host6.jpg"; // new host

// --- Guest images ---
import guest1 from "../assets/guests/guest1.jpg";
import guest2 from "../assets/guests/guest2.jpg";
import guest3 from "../assets/guests/guest3.jpg";
import guest4 from "../assets/guests/guest4.jpg"; // new guest
import guest5 from "../assets/guests/guest5.jpg"; // new guest

import "leaflet/dist/leaflet.css";

export default function Home({ searchTerm }) {
  const audioRef = useRef(null);
  const [audioStarted, setAudioStarted] = useState(false);
  const [properties, setProperties] = useState([]);

  // --- USA properties ---
  const usaProperties = [
    { _id: "usa1", title: "Cozy Apartment", location: "New York, USA", price: 1200, beds: 2, baths: 1, guests: 4, rating: 4.8, reviews: 34, superhost: true, instantBook: true, image: apartment1, number: 1 },
    { _id: "usa2", title: "Modern Loft", location: "San Francisco, USA", price: 1500, beds: 3, baths: 2, guests: 6, rating: 4.7, reviews: 21, superhost: false, instantBook: false, image: loft, number: 2 },
    { _id: "usa3", title: "Beach House Retreat", location: "Malibu, USA", price: 2000, beds: 4, baths: 3, guests: 8, rating: 4.9, reviews: 46, superhost: true, instantBook: true, image: beachhouse, number: 3 },
    { _id: "usa4", title: "Luxury Villa", location: "Miami, USA", price: 1100, beds: 5, baths: 4, guests: 10, rating: 4.8, reviews: 52, superhost: true, instantBook: false, image: villa, number: 4 },
    { _id: "usa5", title: "Mountain Cabin", location: "Aspen, USA", price: 1800, beds: 3, baths: 2, guests: 6, rating: 4.6, reviews: 28, superhost: false, instantBook: false, image: cabin, number: 5 },
    { _id: "usa6", title: "Penthouse Suite", location: "Chicago, USA", price: 1000, beds: 4, baths: 3, guests: 8, rating: 5.0, reviews: 64, superhost: true, instantBook: true, image: penthouse, number: 6 },
  ];

  // --- India properties ---
  const indiaProperties = [
    { _id: "india1", title: "Luxury Villa in Goa", location: "Calangute, Goa", image: goaVilla, beds: 3, baths: 2, guests: 6, rating: 4.8, reviews: 210, price: 4500, superhost: true, instantBook: true, number: 7 },
    { _id: "india2", title: "Mountain View Cottage", location: "Manali, Himachal Pradesh", image: manaliCottage, beds: 2, baths: 1, guests: 4, rating: 4.7, reviews: 154, price: 3200, superhost: false, instantBook: true, number: 8 },
    { _id: "india3", title: "Lakefront Stay", location: "Nainital, Uttarakhand", image: nainital, beds: 1, baths: 1, guests: 3, rating: 4.9, reviews: 198, price: 3800, superhost: true, instantBook: false, number: 9 },
  ];

  useEffect(() => {
    setProperties([...usaProperties, ...indiaProperties]);
  }, []);

  const startAudio = () => {
    if (audioRef.current && !audioStarted) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => {});
      let vol = 0;
      const fadeIn = setInterval(() => {
        if (vol < 0.18) {
          vol += 0.01;
          audioRef.current.volume = vol;
        } else {
          clearInterval(fadeIn);
        }
      }, 50);
      setAudioStarted(true);
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (!searchTerm || searchTerm.trim() === "") return true;
    const q = searchTerm.toLowerCase();
    return p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q);
  });

  // --- Featured Destinations ---
  const featuredDestinations = [...new Map(properties.map(p => [p.location, p])).values()];

  // --- Top Hosts (6 total now) ---
  const topHosts = [
    { name: "Alice", img: host1, rating: 4.8, listings: 5 },
    { name: "Bob", img: host2, rating: 4.7, listings: 3 },
    { name: "Charlie", img: host3, rating: 4.9, listings: 6 },
    { name: "Diana", img: host4, rating: 5.0, listings: 8 },
    { name: "Ethan", img: host5, rating: 4.6, listings: 4 },
    { name: "Fiona", img: host6, rating: 4.8, listings: 5 },
  ];

  // --- Testimonials / Guests (5 total now) ---
  const testimonials = [
    { guest: "Guest 1", img: guest1, rating: 4.8, text: "Amazing stay — host was super friendly and the place was spotless!" },
    { guest: "Guest 2", img: guest2, rating: 4.7, text: "Beautiful location and very clean property." },
    { guest: "Guest 3", img: guest3, rating: 4.9, text: "Exceeded expectations! Will book again." },
    { guest: "Guest 4", img: guest4, rating: 4.6, text: "Loved the ambiance and the neighborhood!" },
    { guest: "Guest 5", img: guest5, rating: 4.8, text: "Comfortable stay and amazing host communication!" },
  ];

  return (
    <>
      <Navbar searchTerm={searchTerm} properties={properties} />

      {/* Hero Section */}
      <section className="relative w-full h-[88vh] sm:h-[95vh] flex flex-col items-center justify-center overflow-hidden mt-[70px]" onClick={startAudio}>
        <video src={videoBg} autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover brightness-75" />
        <audio ref={audioRef} src={bgAudio} loop />
        <div className="absolute inset-0 bg-black/40" />
        <Particles className="absolute inset-0" options={{
          fpsLimit: 60,
          particles: {
            number: { value: 40, density: { enable: true, area: 700 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.25, random: true },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 1.3, random: true, outMode: "bounce" },
          },
          interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
          detectRetina: true
        }} />
        <motion.div className="relative z-10 text-center text-white px-4 flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
        >
          <motion.h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-red-500 to-yellow-400" whileHover={{ scale: 1.03 }}>
            Find Your Perfect Stay 🌍
          </motion.h1>
          <motion.p className="text-base sm:text-lg md:text-xl mb-6 font-light drop-shadow-md max-w-2xl">
            Discover curated homes, villas, and apartments across the USA & India.
          </motion.p>
        </motion.div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-6xl mx-auto mt-10 px-4 overflow-hidden relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Destinations</h2>
        <motion.div 
            className="flex gap-4 py-2 w-max" 
            animate={{ x: ["0%", "-45%"] }} 
            transition={{ repeat: Infinity, duration: 14, ease: "linear" }} 
            // ^^^^ यहाँ duration को 6 से बढ़ाकर 12 कर दिया गया है
        >
          {featuredDestinations.map((item, idx) => (
            <motion.div key={idx} className="relative min-w-[220px] sm:min-w-[250px] rounded-lg overflow-hidden shadow-lg cursor-pointer flex-shrink-0 group" whileHover={{ scale: 1.03 }}>
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3 text-white font-semibold text-lg">
                {item.location.split(",")[0]}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Properties Grid */}
      <div className="max-w-6xl mx-auto mt-12 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProperties.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No properties found.</p>
        ) : (
          filteredProperties.map((property, index) => (
            <motion.div key={property._id} className="bg-white rounded-xl shadow-lg overflow-hidden relative cursor-pointer group" whileHover={{ scale: 1.04 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.45 }}>
              <div className="absolute top-3 left-3 bg-black/75 text-white px-3 py-1 rounded-full text-xs font-bold z-20">#{property.number ?? index + 1}</div>
              <img src={property.image} alt={property.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
              {property.superhost && <div className="absolute top-3 right-3 bg-white/90 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">SUPERHOST</div>}
              {property.instantBook && <div className="absolute top-12 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Instant Book</div>}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white font-semibold text-lg">Quick View</div>
              <div className="p-4">
                <h2 className="font-bold text-lg">{property.title}</h2>
                <p className="text-gray-600">{property.location}</p>
                <div className="flex items-center mt-2 gap-2 text-yellow-500"><FaStar /><span className="text-gray-800 font-semibold">{property.rating}</span><span className="text-gray-500 text-sm">({property.reviews ?? "—"} reviews)</span></div>
                <div className="flex gap-4 mt-3 text-gray-600 text-sm">
                  <div className="flex items-center gap-1"><FaBed /> {property.beds ?? "-"} Beds</div>
                  <div className="flex items-center gap-1"><FaBath /> {property.baths ?? "-"}</div>
                  <div className="flex items-center gap-1"><FaUser /> {property.guests ?? "-"} Guests</div>
                </div>
                <p className="font-semibold mt-3 text-lg">₹{property.price}/night</p>
                <Link to={`/property/${property._id}`} className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white rounded hover:scale-105 transition transform">View Details</Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Top Hosts */}
<section className="max-w-6xl mx-auto mt-16 px-4 overflow-hidden relative">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Hosts</h2>
  <motion.div
    className="flex gap-4 py-2 w-max"
    animate={{ x: [0, -1800] }}
    transition={{ repeat: Infinity, duration: 12, ease: "linear" }} // <- slower
  >
    {topHosts.map((host, idx) => (
      <motion.div
        key={idx}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-4 cursor-pointer flex-shrink-0 w-60 group"
        whileHover={{ scale: 1.03 }}
      >
        <img src={host.img} alt={host.name} className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-blue-500" />
        <h3 className="font-semibold text-lg">{host.name}</h3>
        <div className="flex items-center gap-1 text-yellow-500 mt-1"><FaStar /> <span className="text-gray-800 font-semibold">{host.rating}</span></div>
        <p className="text-gray-500 text-sm mt-1">{host.listings} Listings</p>
      </motion.div>
    ))}
  </motion.div>
</section>


      {/* Testimonials */}
      <section className="max-w-6xl mx-auto mt-16 px-4 relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">What Our Guests Say</h2>
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"/>
          <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"/>
          <motion.div className="flex gap-4 sm:gap-6 whitespace-nowrap" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} whileHover={{ animationPlayState: "paused" }}>
            {testimonials.map((t, idx) => (
              <motion.div key={idx} className="bg-white rounded-xl shadow-lg p-4 sm:p-6 min-w-[220px] sm:min-w-[250px] md:min-w-[300px] flex-shrink-0 hover:scale-105 transition-transform duration-300">
                <p className="text-gray-600 mb-4 text-sm sm:text-base">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.guest} className="w-10 h-10 rounded-full"/>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{t.guest}</p>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm sm:text-base"><FaStar /> {t.rating}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <ChatWidget />

       {/* Footer */}
      <section className="bg-gray-900 text-white mt-24">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-400 text-sm">Find your perfect stay with our curated listings of homes, villas, and apartments worldwide.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-white transition">Destinations</a></li>
              <li><a href="#" className="hover:text-white transition">Properties</a></li>
              <li><a href="#" className="hover:text-white transition">Top Hosts</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: sj414435@gmail.com</li>
              <li>Phone: +91 9918528638</li>
              <li>Address: Delhi Noida, India</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
              <a href="#" className="hover:text-white transition"><FaTwitter /></a>
              <a href="#" className="hover:text-white transition"><FaInstagram /></a>
              <a href="#" className="hover:text-white transition"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Sunita Jaiswal. All rights reserved.
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
}
