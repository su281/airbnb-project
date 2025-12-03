// src/pages/PropertyDetails.jsx
import React, { useEffect, useState, useContext, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBed,
  FaBath,
  FaUser,
  FaStar,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimes,
  FaWifi,
  FaUtensils,
  FaCar,
  FaTv,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaRegBookmark,
} from "react-icons/fa";
import { BookingsContext } from "../context/BookingsContext";

// react-leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet icon paths (ESM-friendly import)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Local images (replace with your assets)
import apartment1 from "../assets/apartment1.jpg";
import loft from "../assets/loft.jpg";
import beachhouse from "../assets/beachhouse.jpg";
import villa from "../assets/villa.jpg";
import cabin from "../assets/cabin.jpg";
import penthouse from "../assets/penthouse.jpg";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Ensure BookingsContext is safely accessed
  const { addBooking } = useContext(BookingsContext || React.createContext({ addBooking: () => {} }));

  // dataset with coordinates
  const allProperties = useMemo(
    () => [
      {
        _id: "1",
        title: "Cozy Apartment",
        location: "New York, USA",
        coords: [40.7128, -74.0060],
        price: 120,
        beds: 2,
        baths: 1,
        guests: 4,
        rating: 4.8,
        reviews: 34,
        images: [apartment1, loft, beachhouse],
        amenities: ["Free WiFi", "Kitchen", "Smart TV", "Washer"],
        description: "Enjoy a relaxing stay in this cozy apartment in the heart of New York — walkable to restaurants and transit.",
        map: "https://www.google.com/maps?q=New+York&output=embed",
        host: { name: "Sam", superhost: true, avatar: penthouse },
      },
      {
        _id: "2",
        title: "Modern Loft",
        location: "San Francisco, USA",
        coords: [37.7749, -122.4194],
        price: 150,
        beds: 3,
        baths: 2,
        guests: 6,
        rating: 4.7,
        reviews: 21,
        images: [loft, apartment1, beachhouse],
        amenities: ["High-speed WiFi", "Kitchen", "City View", "Heating"],
        description: "Spacious modern loft with great city views — ideal for remote work.",
        map: "https://www.google.com/maps?q=San+Francisco&output=embed",
        host: { name: "Aisha", superhost: false, avatar: loft },
      },
      {
        _id: "3",
        title: "Beach House Retreat",
        location: "Malibu, USA",
        coords: [34.0259, -118.7798],
        price: 200,
        beds: 4,
        baths: 3,
        guests: 8,
        rating: 4.9,
        reviews: 46,
        images: [beachhouse, villa, cabin],
        amenities: ["Ocean View", "Private Beach Access", "Pool", "Kitchen"],
        description: "Wake up to ocean waves in this luxury beach house with private beach access.",
        map: "https://www.google.com/maps?q=Malibu&output=embed",
        host: { name: "Liam", superhost: true, avatar: beachhouse },
      },
      {
        _id: "4",
        title: "Luxury Villa",
        location: "Miami, USA",
        coords: [25.7617, -80.1918],
        price: 350,
        beds: 5,
        baths: 4,
        guests: 10,
        rating: 4.8,
        reviews: 52,
        images: [villa, loft, beachhouse],
        amenities: ["Pool", "Garden", "Parking", "Kitchen"],
        description: "Experience world-class luxury in this Miami villa featuring a pool and garden.",
        map: "https://www.google.com/maps?q=Miami&output=embed",
        host: { name: "Olivia", superhost: true, avatar: villa },
      },
      {
        _id: "5",
        title: "Mountain Cabin",
        location: "Aspen, USA",
        coords: [39.1911, -106.8175],
        price: 180,
        beds: 3,
        baths: 2,
        guests: 6,
        rating: 4.6,
        reviews: 28,
        images: [cabin, apartment1, loft],
        amenities: ["Fireplace", "Mountain View", "Kitchen", "Washer"],
        description: "Enjoy tranquility in this mountain cabin surrounded by nature.",
        map: "https://www.google.com/maps?q=Aspen&output=embed",
        host: { name: "Noah", superhost: false, avatar: cabin },
      },
      {
        _id: "6",
        title: "Penthouse Suite",
        location: "Chicago, USA",
        coords: [41.8781, -87.6298],
        price: 400,
        beds: 4,
        baths: 3,
        guests: 8,
        rating: 5.0,
        reviews: 64,
        images: [penthouse, loft, villa],
        amenities: ["Rooftop Access", "City View", "Parking", "Smart TV"],
        description: "Top-floor penthouse with breathtaking city views and luxury amenities.",
        map: "https://www.google.com/maps?q=Chicago&output=embed",
        host: { name: "Maya", superhost: true, avatar: penthouse },
      },
    ],
    []
  );

  const property = allProperties.find((p) => p._id === id) || allProperties[0];

  // UI state
  const [heroIdx, setHeroIdx] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [mapOpen, setMapOpen] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [bookForm, setBookForm] = useState({ name: "", email: "", startDate: "", endDate: "", guests: 1 });
  const nearbyRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeroIdx(0);
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen || mapOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isModalOpen, mapOpen]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevModalImage();
      if (e.key === "ArrowRight") nextModalImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen, modalIndex, property.images.length]);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((h) => (h + 1) % property.images.length), 7000);
    return () => clearInterval(t);
  }, [property.images.length]);

  const openModal = (i = 0) => {
    setModalIndex(i);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const prevModalImage = () => setModalIndex((m) => (m - 1 + property.images.length) % property.images.length);
  const nextModalImage = () => setModalIndex((m) => (m + 1) % property.images.length);

  const openMap = () => setMapOpen(true);
  const closeMap = () => setMapOpen(false);

  const calcNights = (s, e) => {
    if (!s || !e) return 1;
    const a = new Date(s);
    const b = new Date(e);
    const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };
  const calcTotal = () => calcNights(bookForm.startDate, bookForm.endDate) * property.price;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBookForm((s) => ({ ...s, [name]: value }));
  };

  const confirmBooking = (e) => {
    e.preventDefault();
    if (!bookForm.name || !bookForm.email) {
      showToast("Please enter your name and email", "error");
      return;
    }
    if (!bookForm.startDate || !bookForm.endDate) {
      showToast("Please select check-in & check-out", "error");
      return;
    }
    if (new Date(bookForm.endDate) <= new Date(bookForm.startDate)) {
      showToast("Check-out must be after check-in", "error");
      return;
    }

    const booking = { id: Date.now().toString(), itemId: property._id, title: property.title, image: property.images[0], ...bookForm, total: calcTotal() };
    addBooking && addBooking(booking);
    showToast("Booking confirmed — redirecting...", "success");
    setTimeout(() => navigate("/booking-success"), 700);
  };

  // helper
  const fmt = (v) => `₹${v.toLocaleString()}`;

  // simple reviews (demo)
  const reviews = [
    { id: 1, name: "Priya", avatar: penthouse, rating: 5, text: "Amazing stay, very clean and host was responsive." },
    { id: 2, name: "Rahul", avatar: loft, rating: 4, text: "Great location and comfy beds." },
    { id: 3, name: "Anita", avatar: cabin, rating: 5, text: "Perfect for a weekend getaway!" },
  ];

  // Recenter helper for react-leaflet
  function Recenter({ center }) {
    const map = useMap();
    useEffect(() => {
      if (!center) return;
      map.setView(center, 12, { animate: true });
    }, [center, map]);
    return null;
  }

  // Motion variants
  const fadeIn = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.38 } } };

  return (
    <>
      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 px-4 py-3 rounded-lg text-white shadow-xl flex items-center gap-3 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
            {toast.type === "success" ? <FaCheckCircle /> : <FaTimes />} <div className="text-sm font-medium">{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAGE */}
      <div className="pt-24 pb-28 px-4 bg-gradient-to-b from-white to-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-6">
            {/* header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{property.title}</h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><FaMapMarkerAlt className="text-red-500" />{property.location}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-yellow-400"><FaStar /> <span className="font-semibold">{property.rating}</span></div>
                <button aria-label="favorite" onClick={() => setIsFavorited((s) => !s)} className="p-2 rounded-full bg-white shadow hover:scale-105 transition-transform">
                  <FaHeart className={`${isFavorited ? "text-rose-500" : "text-gray-400"}`} />
                </button>
              </div>
            </div>

            {/* HERO - Responsive height adjustment */}
            <div className="rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100">
              <div className="relative">
                <AnimatePresence mode="wait">
                  {/* Changed h-[520px] to a responsive h-96 sm:h-[420px] lg:h-[520px] */}
                  <motion.img key={heroIdx} src={property.images[heroIdx]} alt={`hero-${heroIdx}`} initial={{ opacity: 0.6, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="w-full h-96 sm:h-[420px] lg:h-[520px] object-cover cursor-zoom-in" onClick={() => openModal(heroIdx)} />
                </AnimatePresence>

                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/70 backdrop-blur rounded-full px-4 py-2 shadow flex items-center gap-3">
                  <div className="text-sm text-gray-700">{property.location}</div>
                  <div className="flex items-center text-yellow-400 gap-1"><FaStar /> <span className="font-semibold text-sm text-gray-800">{property.rating}</span></div>
                </div>

                {/* thumbnails - Hidden on very small screens for better space */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex gap-3 px-4">
                  {property.images.map((img, i) => (
                    <button key={i} onClick={() => setHeroIdx(i)} aria-label={`thumb-${i}`} className={`w-14 h-10 md:w-20 md:h-14 rounded-lg overflow-hidden border transition-shadow ${heroIdx === i ? "ring-2 ring-sky-200 border-sky-400" : "border-gray-200 hover:shadow-md"}`}>
                      <img src={img} alt={`t-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* arrows */}
                <button onClick={() => setHeroIdx((h) => (h - 1 + property.images.length) % property.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full text-white">
                  <FaChevronLeft />
                </button>
                <button onClick={() => setHeroIdx((h) => (h + 1) % property.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 p-3 rounded-full text-white">
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* Info grid - Changed md:grid-cols-3 to sm:grid-cols-2 lg:grid-cols-3 for tablet layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
                  {/* About Place */}
                  <motion.div variants={fadeIn} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold">About this place</h3>
                    <p className="text-gray-700 mt-3">{property.description}</p>

                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="flex items-start gap-3"><FaBed className="mt-1" /><div><div className="text-sm font-medium">{property.beds} beds</div><div className="text-xs text-gray-500">Comfortable & clean</div></div></div>
                      <div className="flex items-start gap-3"><FaBath className="mt-1" /><div><div className="text-sm font-medium">{property.baths} baths</div><div className="text-xs text-gray-500">Essentials provided</div></div></div>
                      <div className="flex items-start gap-3"><FaUser className="mt-1" /><div><div className="text-sm font-medium">{property.guests} guests</div><div className="text-xs text-gray-500">Great for groups</div></div></div>
                      <div className="flex items-start gap-3"><FaStar className="mt-1 text-yellow-400" /><div><div className="text-sm font-medium">{property.rating} rating</div><div className="text-xs text-gray-500">{property.reviews} reviews</div></div></div>
                    </div>
                  </motion.div>

                  {/* Map small */}
                  <motion.div variants={fadeIn} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Location</h3><button onClick={openMap} className="text-sm text-sky-600">Open full map</button></div>
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 h-64">
                      <MapContainer center={property.coords} zoom={12} scrollWheelZoom={false} className="w-full h-full">
                        <Recenter center={property.coords} />
                        <TileLayer attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={property.coords}>
                          <Popup>{property.title}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </motion.div>

                  {/* Amenities */}
                  <motion.div variants={fadeIn} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold">Amenities</h3>
                    {/* Changed sm:grid-cols-3 to sm:grid-cols-2 md:grid-cols-3 for better tablet/desktop spacing */}
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((a) => (
                        <div key={a} className="flex items-center gap-3 text-gray-700">
                          <div className="text-lg">
                            {a.toLowerCase().includes("wifi") ? <FaWifi /> : a.toLowerCase().includes("kitchen") ? <FaUtensils /> : a.toLowerCase().includes("tv") ? <FaTv /> : <FaCar />}
                          </div>
                          <div className="text-sm">{a}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Guest Reviews */}
                  <motion.div variants={fadeIn} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold">Guest reviews</h3>
                    <div className="mt-3 space-y-3">
                      {reviews.map((r) => (
                        <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="border p-3 rounded-lg flex gap-3">
                          <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between"><div className="font-medium">{r.name}</div><div className="flex items-center gap-1 text-yellow-400"><FaStar />{r.rating}</div></div>
                            <div className="text-sm text-gray-700 mt-2">{r.text}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* RIGHT HIGHLIGHTS */}
              <div className="space-y-4">
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.03 } } }}>
                  {/* Price/Rating block - visible on all screens, but fine-tuned for small screens */}
                  <motion.div variants={fadeIn} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 **lg:hidden**">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">{property.reviews} reviews</div>
                        <div className="text-2xl font-semibold mt-1">{fmt(property.price)} / night</div> {/* Added / night for clarity */}
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400"><FaStar />{property.rating}</div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">{property.beds} beds • {property.baths} baths • {property.guests} guests</div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => openModal(0)} className="flex-1 py-2 rounded-lg border border-gray-200">View photos</button>
                      <button onClick={() => setIsFavorited((s) => !s)} className={`py-2 px-3 rounded-lg ${isFavorited ? "bg-rose-500 text-white" : "bg-white border"}`}>
                        {isFavorited ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </motion.div>

                  {/* Booking Sidebar / Highlights - Only visible on LG screens and up */}
                  <motion.div variants={fadeIn} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 **hidden lg:block**">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">{property.reviews} reviews</div>
                        <div className="text-2xl font-semibold mt-1">{fmt(property.price)}</div>
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400"><FaStar />{property.rating}</div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">{property.beds} beds • {property.baths} baths • {property.guests} guests</div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => openModal(0)} className="flex-1 py-2 rounded-lg border border-gray-200">View photos</button>
                      <button onClick={() => setIsFavorited((s) => !s)} className={`py-2 px-3 rounded-lg ${isFavorited ? "bg-rose-500 text-white" : "bg-white border"}`}>
                        {isFavorited ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </motion.div>


                  <motion.div variants={fadeIn} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h4 className="text-sm font-semibold">Where you'll sleep</h4>
                    <div className="mt-3 text-sm text-gray-600">Bedroom: {property.beds} beds • Living room: 1 sofa bed</div>
                  </motion.div>

                  <motion.div variants={fadeIn} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h4 className="text-sm font-semibold">House rules</h4>
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside"><li>No smoking</li><li>No parties</li><li>Check-in after 3PM</li></ul>
                  </motion.div>

                  <motion.div variants={fadeIn} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <h4 className="text-sm font-semibold">Host</h4>
                    <div className="flex items-center gap-3 mt-3">
                      <img src={property.host.avatar} alt="host" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-medium">{property.host.name} {property.host.superhost && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded ml-2">Superhost</span>}</div>
                        <div className="text-xs text-gray-500">Joined 2019 • 98% response</div>
                        <div className="mt-2"><button onClick={() => showToast("Message host — demo only")} className="text-sm text-sky-600">Contact host</button></div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* SIMILAR NEARBY (carousel) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">Similar stays nearby</h3><div className="text-sm text-gray-500">Showing {Math.min(3, allProperties.length - 1)}</div></div>
              <div className="mt-4 relative">
                {/* Ensure overflow-x-auto is present for mobile scrolling */}
                <div ref={nearbyRef} className="flex gap-4 overflow-x-auto py-2">
                  {allProperties
                    .filter((p) => p._id !== property._id)
                    .slice(0, 6)
                    .map((p) => (
                      <div key={p._id} className="min-w-[240px] bg-white rounded-lg overflow-hidden border hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/property/${p._id}`)}>
                        <img src={p.images[0]} alt={p.title} className="w-full h-36 object-cover" />
                        <div className="p-3"><div className="flex items-center justify-between"><div className="font-medium">{p.title}</div><div className="text-sm text-gray-600">{fmt(p.price)}</div></div><div className="text-xs text-gray-500 mt-1">{p.location}</div></div>
                      </div>
                    ))}
                </div>
                {/* Scroll button hidden on small screens */}
                <div className="absolute right-2 top-8 hidden md:block">
                  <button onClick={() => { if (nearbyRef.current) nearbyRef.current.scrollBy({ left: 260, behavior: "smooth" }); }} className="p-2 rounded-full bg-white shadow"><FaChevronRight /></button>
                </div>
              </div>
            </div>
          </div>

          {/* BOOKING SIDEBAR - Only visible on large screens and up */}
          <aside className="lg:sticky top-24 self-start">
            <div className="**hidden** lg:block">
              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 w-80">
                <div className="flex items-center justify-between"><div><div className="text-sm text-gray-500">{property.reviews} reviews</div><div className="text-2xl font-semibold mt-1">{fmt(property.price)}</div></div><div className="flex items-center gap-2 text-yellow-400"><FaStar />{property.rating}</div></div>
                <form onSubmit={confirmBooking} className="mt-4 space-y-3">
                  <label className="text-xs text-gray-600">Check-in</label>
                  <input type="date" name="startDate" value={bookForm.startDate} onChange={handleFormChange} className="w-full mt-1 border px-3 py-2 rounded-md" />
                  <label className="text-xs text-gray-600">Check-out</label>
                  <input type="date" name="endDate" value={bookForm.endDate} onChange={handleFormChange} className="w-full mt-1 border px-3 py-2 rounded-md" />
                  <label className="text-xs text-gray-600">Guests</label>
                  <select name="guests" value={bookForm.guests} onChange={handleFormChange} className="w-full mt-1 border px-3 py-2 rounded-md">{Array.from({ length: property.guests }, (_, i) => i + 1).map((g) => (<option key={g} value={g}>{g} {g === 1 ? "guest" : "guests"}</option>))}</select>

                  <div className="bg-gray-50 rounded-md p-3 text-sm mt-2">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{fmt(calcNights(bookForm.startDate, bookForm.endDate) * property.price)}</span></div>
                    <div className="flex justify-between text-gray-600 mt-1"><span>Service fee</span><span>{fmt(Math.round(property.price * 0.08))}</span></div>
                    <div className="flex justify-between font-semibold mt-2"><span>Total</span><span>{fmt(calcTotal() + Math.round(property.price * 0.08))}</span></div>
                  </div>

                  <input type="text" name="name" placeholder="Full name" value={bookForm.name} onChange={handleFormChange} className="w-full border px-3 py-2 rounded-md" />
                  <input type="email" name="email" placeholder="Email address" value={bookForm.email} onChange={handleFormChange} className="w-full border px-3 py-2 rounded-md" />
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white py-3 rounded-lg font-semibold">Reserve</motion.button>
                </form>

                {/* Mini map + expand */}
                <div className="mt-5">
                  <h3 className="text-sm text-gray-700 font-semibold mb-2">Location preview</h3>
                  {showMiniMap ? (
                    <div className="relative h-36 rounded-xl overflow-hidden border border-gray-100">
                      <MapContainer center={property.coords} zoom={12} scrollWheelZoom={false} className="w-full h-full">
                        <Recenter center={property.coords} />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={property.coords}>
                          <Popup>{property.title}</Popup>
                        </Marker>
                      </MapContainer>
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button onClick={() => setShowMiniMap(false)} className="bg-white/80 px-3 py-1 rounded-full text-xs">Hide</button>
                        <button onClick={openMap} className="bg-black/70 text-white px-3 py-1 rounded-full text-xs">Expand</button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100">
                      <button onClick={() => setShowMiniMap(true)} className="text-sm text-sky-600">Show location preview</button>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-xs text-gray-500">You won't be charged — demo booking only.</div>
              </div>
            </div>

            {/* mobile booking bar - Visible on all screens except large screens and up */}
            <div className="**block** lg:hidden fixed left-4 right-4 bottom-4 z-40">
              <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{fmt(property.price)} / night</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{property.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{property.reviews} reviews</span>
                  </div>
                </div>
                {/* Scroll to top of the sidebar/form section (where booking starts on mobile) */}
                <button onClick={() => {
                  const sidebarTop = document.querySelector('.lg\\:sticky.top-24.self-start').offsetTop;
                  window.scrollTo({ top: sidebarTop, behavior: "smooth" });
                }} className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white px-4 py-2 rounded-lg font-medium">
                  Check Availability
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* IMAGE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
            <motion.div className="relative max-w-6xl w-full mx-auto" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}>
              <div className="rounded-xl overflow-hidden bg-black">
                {/* Reduced modal image height for mobile/tablet */}
                <img src={property.images[modalIndex]} alt={`modal-${modalIndex}`} className="w-full h-[65vh] sm:h-[75vh] object-contain bg-black" />
                <button aria-label="close" onClick={closeModal} className="absolute top-4 right-4 text-white bg-black/40 p-2 rounded-full"><FaTimes /></button>
                <button aria-label="prev" onClick={(e) => { e.stopPropagation(); prevModalImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-3 rounded-full"><FaChevronLeft /></button>
                <button aria-label="next" onClick={(e) => { e.stopPropagation(); nextModalImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-3 rounded-full"><FaChevronRight /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL MAP MODAL */}
      <AnimatePresence>
        {mapOpen && (
          <motion.div className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/75" onClick={closeMap} />
            <motion.div className="relative w-full max-w-6xl h-[90vh] sm:h-[85vh] bg-white rounded-xl overflow-hidden shadow-2xl" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}>
              <div className="flex items-center justify-between p-3 border-b">
                <div className="font-medium">Map — {property.location}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { navigator.clipboard && navigator.clipboard.writeText(property.map); showToast("Map embed link copied"); }} className="text-sm text-gray-600">Copy link</button>
                  <button onClick={closeMap} className="text-sm text-red-600 font-medium">Close</button>
                </div>
              </div>

              <MapContainer center={property.coords} zoom={12} scrollWheelZoom={true} className="w-full h-full">
                <Recenter center={property.coords} />
                <TileLayer attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {allProperties.map((p) => (
                  <Marker key={p._id} position={p.coords}>
                    <Popup>
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs">{p.location}</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}