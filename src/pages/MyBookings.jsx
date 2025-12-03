import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookingsContext } from "../context/BookingsContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaDownload,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";

// --- Sub-Component for Individual Card (UPDATED for Inline Editing) ---
const Card = ({ b, handleDelete, downloadPDF, imgIdx, nextImg, prevImg, handleUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        startDate: b.startDate,
        endDate: b.endDate,
        guests: b.guests,
    });
    
    const totalImages = b.images.length;
    const idx = imgIdx[b.id] || 0;
    const src = b.images[idx];

    // ₹ INR Formatting Function
    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Validation (आप यहाँ और लॉजिक जोड़ सकते हैं)
        if (!editData.startDate || !editData.endDate || new Date(editData.startDate) >= new Date(editData.endDate)) {
            toast.error("Invalid dates selected.");
            return;
        }
        if (editData.guests < 1) {
            toast.error("Guests must be at least 1.");
            return;
        }

        handleUpdate(b.id, editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Original data पर वापस सेट करें
        setEditData({
            startDate: b.startDate,
            endDate: b.endDate,
            guests: b.guests,
        });
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            whileHover={{
                scale: 1.03,
                boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
            }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transform transition"
        >
            <div className="relative h-48 overflow-hidden">
                <motion.img
                    key={src}
                    src={src}
                    alt={b.title}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                />
                {totalImages > 1 && (
                    <>
                        <button
                            onClick={() => prevImg(b.id, totalImages)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white z-10"
                        >
                            <FaChevronLeft size={12} />
                        </button>
                        <button
                            onClick={() => nextImg(b.id, totalImages)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white z-10"
                        >
                            <FaChevronRight size={12} />
                        </button>
                    </>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{b.title}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-pink-400" /> {b.location}
                </p>

                {/* ⚡️ EDITING FORM / VIEW DETAILS Toggler */}
                {isEditing ? (
                    <div className="space-y-2 bg-gray-50 p-3 rounded-lg mt-2 border border-gray-100">
                        <label className="text-xs font-bold block flex items-center gap-1"><FaCalendarAlt size={10}/> Check-in:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={editData.startDate}
                            onChange={handleEditChange}
                            className="w-full p-2 border border-pink-300 rounded-md bg-white/70 text-sm focus:bg-white outline-none"
                        />
                        
                        <label className="text-xs font-bold block flex items-center gap-1"><FaCalendarAlt size={10}/> Check-out:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={editData.endDate}
                            onChange={handleEditChange}
                            className="w-full p-2 border border-pink-300 rounded-md bg-white/70 text-sm focus:bg-white outline-none"
                        />
                        
                        <label className="text-xs font-bold block flex items-center gap-1"><FaUsers size={10}/> Guests:</label>
                        <input
                            type="number"
                            name="guests"
                            value={editData.guests}
                            onChange={handleEditChange}
                            min="1"
                            className="w-full p-2 border border-pink-300 rounded-md bg-white/70 text-sm focus:bg-white outline-none"
                        />
                    </div>
                ) : (
                    <div className="text-sm text-gray-600 mt-2 flex flex-col gap-1">
                        {/* Original View Details */}
                        <span>
                            <FaCalendarAlt className="inline mr-2 text-gray-400" />
                            **Check-in:** {b.startDate} → **Check-out:** {b.endDate}
                        </span>
                        <span>
                            <FaUsers className="inline mr-2 text-gray-400" />
                            **Guests:** {b.guests}
                        </span>
                    </div>
                )}
                
                <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-pink-600 text-xl">
                        {formatINR(b.total)}
                    </span>
                    <button
                        onClick={() => downloadPDF(b)}
                        className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                    >
                        <FaDownload size={12} /> Receipt
                    </button>
                </div>


                {/* ⚡️ ACTION BUTTONS (Edit/Save/Cancel) */}
                <div className="mt-3 flex gap-2 flex-wrap justify-end">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 text-white bg-pink-500 rounded-lg text-sm flex items-center gap-1 border border-pink-100 hover:bg-pink-600 transition"
                            >
                                <FaEdit /> Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-3 py-1 text-gray-700 bg-gray-200 rounded-lg text-sm flex items-center gap-1 border border-gray-300 hover:bg-gray-300 transition"
                            >
                                <FaEdit /> Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-3 py-1 text-yellow-700 bg-yellow-50 rounded-lg text-sm flex items-center gap-1 border border-yellow-100 hover:bg-yellow-100 transition"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(b.id)}
                                className="px-3 py-1 text-red-600 bg-red-50 rounded-lg text-sm flex items-center gap-1 border border-red-100 hover:bg-red-100 transition"
                            >
                                <FaTrash /> Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
// --- Main Component ---
export default function MyBookings() {
    const navigate = useNavigate();
    const {
        bookings = [],
        deleteBooking,
        clearAllBookings,
        updateBooking, // ⚡️ Context से updateBooking प्राप्त करें
        getTotalNights,
        getTotalAmount,
        isLoading,
    } = useContext(BookingsContext);

    const [query, setQuery] = useState("");
    const [tab, setTab] = useState("upcoming");
    const [sortBy, setSortBy] = useState("date_desc");
    const [page, setPage] = useState(1);
    const [imgIdx, setImgIdx] = useState({});

    const pageSize = 8;
    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    // Normalization लॉजिक
    const normalized = useMemo(
        () =>
            (bookings || []).map((b) => ({
                id: String(b.id),
                title: b.title || b.name || "Untitled Property",
                location: b.location || "Unknown Location",
                startDate: b.startDate || "",
                endDate: b.endDate || "",
                guests: Number(b.guests) || 1,
                pricePerNight: Number(b.pricePerNight || b.price || 0),
                total: Number(b.total || 0),
                images: Array.isArray(b.images)
                    ? b.images
                    : b.images
                    ? [b.images]
                    : ["/assets/default.jpg"],
            })),
        [bookings]
    );

    // Filtering और Sorting लॉजिक
    const filtered = useMemo(() => {
        const q = (query || "").trim().toLowerCase();
        let list = normalized.slice();

        if (tab === "upcoming") {
            list = list.filter((b) => !b.startDate || new Date(b.startDate) >= today);
        } else if (tab === "past") {
            list = list.filter((b) => b.endDate && new Date(b.endDate) < today);
        }

        if (q) {
            list = list.filter(
                (b) =>
                    b.title.toLowerCase().includes(q) ||
                    b.location.toLowerCase().includes(q)
            );
        }

        list.sort((a, b) => {
            if (sortBy === "date_desc")
                return new Date(b.startDate) - new Date(a.startDate);
            if (sortBy === "date_asc")
                return new Date(a.startDate) - new Date(b.startDate);
            if (sortBy === "price_desc")
                return b.pricePerNight - a.pricePerNight;
            if (sortBy === "price_asc") return a.pricePerNight - b.pricePerNight;
            return 0;
        });

        return list;
    }, [normalized, query, tab, sortBy, today]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    // Paged Items लॉजिक
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    // Image Slider Handlers
    const nextImg = (id, total) =>
        setImgIdx((s) => ({ ...s, [id]: ((s[id] || 0) + 1) % total }));
    const prevImg = (id, total) =>
        setImgIdx((s) => ({
            ...s,
            [id]: (s[id] || 0) === 0 ? total - 1 : (s[id] || 0) - 1,
        }));
    
    // Handlers
    const handleDelete = (id) => {
        if (!window.confirm("Delete this booking?")) return;
        deleteBooking(id);
        toast.success("Booking deleted");
    };

    const handleUpdate = (id, newEditData) => {
        const originalBooking = bookings.find(b => String(b.id) === String(id));
        if (!originalBooking) return;
        
        // Note: यहाँ हम केवल basic fields को update कर रहे हैं।
        // यदि डेट्स बदलने से total price बदलता है, तो आपको यहाँ price calculation logic जोड़ना होगा।
        
        const updatedBooking = { 
            ...originalBooking, 
            ...newEditData,
        };

        updateBooking(id, updatedBooking);
        toast.success("Booking updated successfully! ✨");
    };

    const handleClearAll = () => {
        if (!window.confirm("Clear all bookings?")) return;
        clearAllBookings();
        toast.success("All bookings cleared");
    };
    
    const downloadPDF = (b) => {
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        doc.setFontSize(18);
        doc.text("Booking Receipt", 40, 60);
        doc.setFontSize(12);
        doc.text(`Booking ID: ${b.id}`, 40, 90);
        doc.text(`Title: ${b.title}`, 40, 110);
        doc.text(`Location: ${b.location}`, 40, 130);
        doc.text(`Dates: ${b.startDate} -> ${b.endDate}`, 40, 150);
        doc.text(`Guests: ${b.guests}`, 40, 170);
        doc.text(`Total: ₹${b.total}`, 40, 190);
        doc.save(`Booking_${b.id}.pdf`);
    };

    // Loading State UI
    if (isLoading) {
        return (
            <div className="pt-32 min-h-screen flex items-center justify-center bg-gray-50">
                <motion.h2 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 200 }} 
                    className="text-3xl font-extrabold text-pink-600"
                >
                    Loading your trips... ⏳
                </motion.h2>
            </div>
        );
    }

    // Empty Booking List (Initial State)
    if (bookings.length === 0 && !isLoading) {
        return (
            <div className="min-h-screen pt-32 p-4 flex items-start justify-center bg-gray-50">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-16 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg mt-20"
                >
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-4">No Trips Yet 😢</h2>
                    <p className="text-lg text-gray-500 mb-6">It looks like you haven't booked anything. Start planning your next adventure!</p>
                    <motion.button
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-pink-600 text-white font-bold rounded-lg shadow-lg hover:bg-pink-700 transition"
                    >
                        Start Exploring Homes
                    </motion.button>
                </motion.div>
            </div>
        );
    }


    // --- Main Render ---
    return (
        <div className="relative min-h-screen bg-gray-50 pt-32 px-4 overflow-hidden">
            
            {/* 🌄 Background Video/Image Placeholder */}
            <motion.div
                className="absolute inset-0 -z-10 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
                {/* Note: /assets/airbnb-loop.mp4 और /assets/bg-travel.jpg को आपके प्रोजेक्ट में मौजूद होना चाहिए */}
                <video
                    src="/assets/airbnb-loop.mp4"
                    poster="/assets/bg-travel.jpg"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/95 backdrop-blur-[2px]"
                    animate={{ opacity: [0.6, 0.8, 0.6] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
            </motion.div>

            {/* ✨ Main Content */}
            <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <header className="mb-10 text-center">
                    <h1 className="text-5xl font-bold text-gray-800 drop-shadow-md">
                        My Bookings ✈️
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage all your stays — edit, cancel, or download receipts.
                    </p>
                </header>

                {/* 🔍 Search + Filters */}
                <div className="bg-white p-4 rounded-2xl mb-8 flex flex-col md:flex-row md:items-center gap-4 border border-gray-100 shadow-lg">
                    <div className="relative flex items-center w-full md:flex-1">
                        <FaSearch className="absolute left-3 text-gray-400" />
                        <input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search by title or location..."
                            className="pl-10 pr-3 py-3 border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                        />
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        <select
                            value={tab}
                            onChange={(e) => { setTab(e.target.value); setPage(1); }}
                            className="border rounded-xl px-4 py-3 bg-gray-50 focus:ring-1 focus:ring-pink-400"
                        >
                            <option value="upcoming">Upcoming Trips</option>
                            <option value="past">Past Trips</option>
                            <option value="all">All Trips</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border rounded-xl px-4 py-3 bg-gray-50 focus:ring-1 focus:ring-pink-400"
                        >
                            <option value="date_desc">Date (Newest)</option>
                            <option value="date_asc">Date (Oldest)</option>
                            <option value="price_desc">Price (High)</option>
                            <option value="price_asc">Price (Low)</option>
                        </select>

                        <button
                            onClick={handleClearAll}
                            className="px-4 py-3 bg-white text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition shadow-sm"
                            disabled={bookings.length === 0}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
                
                {/* No Search Results State */}
                {filtered.length === 0 && query && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-10 bg-yellow-50 rounded-2xl border border-yellow-200 mt-10"
                    >
                        <p className="text-xl font-semibold text-gray-700">
                            No bookings found matching "{query}" in {tab} trips.
                        </p>
                        <button onClick={() => setQuery("")} className="mt-3 text-pink-600 hover:underline">
                            Clear Search
                        </button>
                    </motion.div>
                )}


                {/* 📋 Grid of Bookings */}
                {filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        <AnimatePresence>
                            {pageItems.map((b) => (
                                <Card 
                                    key={b.id} 
                                    b={b} 
                                    handleDelete={handleDelete}
                                    downloadPDF={downloadPDF}
                                    handleUpdate={handleUpdate}
                                    imgIdx={imgIdx}
                                    nextImg={nextImg}
                                    prevImg={prevImg}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-3 border rounded-full text-gray-700 bg-white shadow-md disabled:opacity-50 hover:bg-gray-100"
                        >
                            <FaChevronLeft size={14} />
                        </button>
                        <div className="text-lg font-medium text-gray-700">
                            Page **{page}** of **{totalPages}**
                        </div>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-3 border rounded-full text-gray-700 bg-white shadow-md disabled:opacity-50 hover:bg-gray-100"
                        >
                            <FaChevronRight size={14} />
                        </button>
                    </div>
                )}

                {/* 📊 Summary Section */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <div className="text-sm text-gray-500">Total Nights Booked</div>
                        <div className="text-3xl font-bold text-pink-600">
                            {getTotalNights()}
                        </div>
                    </div>
                    <div className="border-l border-gray-200 h-12 hidden md:block"></div>
                    <div>
                        <div className="text-sm text-gray-500">Total Spent</div>
                        <div className="text-3xl font-bold text-green-600">
                            ₹{getTotalAmount()}
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <button className="w-full px-6 py-3 bg-pink-600 text-white rounded-xl shadow-lg hover:bg-pink-700 transition font-semibold flex items-center justify-center gap-2">
                            <FaDownload size={14} /> Export All Data
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}