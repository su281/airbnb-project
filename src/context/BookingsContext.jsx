import React, { createContext, useEffect, useState } from "react";

/**
 * 🌍 BookingsContext (Airbnb-style)
 * Provides global state for user bookings with:
 * - Persistent localStorage (Now only for saving, not loading)
 * - Add / Edit / Delete / Clear All features
 * - Starter demo data
 */

export const BookingsContext = createContext();

const STORAGE_KEY = "sunitastays_bookings_v2";

// 🏡 Starter demo bookings (public/assets/... for images)
// नोट: यह डेटा अब हर बार पेज लोड होने पर उपयोग होगा, क्योंकि हमने Local Storage Loading हटा दिया है।
const starterBookings = [
  {
    id: "bk_1",
    title: "Luxury Beachfront Villa",
    location: "Goa, India",
    guests: 4,
    beds: 2,
    baths: 2,
    startDate: "2025-11-15",
    endDate: "2025-11-20",
    pricePerNight: 6400,
    total: 32000,
    images: [
      "/assets/villa1.jpg",
      "/assets/villa2.jpg",
      "/assets/villa3.jpg",
    ],
    itemType: "property", // सुनिश्चित करें कि type सही है
  },
  {
    id: "bk_2",
    title: "Mountain View Cottage",
    location: "Manali, Himachal Pradesh",
    guests: 2,
    beds: 1,
    baths: 1,
    startDate: "2025-12-01",
    endDate: "2025-12-04",
    pricePerNight: 6000,
    total: 18000,
    images: [
      "/assets/hotel1.jpg",
      "/assets/hotel2.jpg",
    ],
    itemType: "property",
  },
  {
    id: "bk_3",
    title: "Modern Apartment Downtown",
    location: "Bangalore, India",
    guests: 3,
    beds: 2,
    baths: 1,
    startDate: "2025-12-10",
    endDate: "2025-12-14",
    pricePerNight: 4500,
    total: 18000,
    images: [
      "/assets/apartment1.jpg",
      "/assets/apartment2.jpg",
    ],
    itemType: "property",
  },
];

export const BookingsProvider = ({ children }) => {
  // 🛑 FIX: लोकल स्टोरेज से डेटा लोड करने का लॉजिक हटा दिया गया है।
  // अब यह हमेशा starterBookings के साथ शुरू होगा।
  const [bookings, setBookings] = useState(starterBookings);

  // 💾 Auto-save bookings to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (err) {
      console.warn("Failed to save bookings:", err);
    }
  }, [bookings]);

  /**
   * ➕ Add Booking
   */
  const addBooking = (newBooking) => {
    const booking = {
      ...newBooking,
      id: newBooking.id || `bk_${Date.now()}`,
    };
    setBookings((prev) => [booking, ...prev]);
  };

  /**
   * ✏️ Edit Booking
   */
  const editBooking = (idOrUpdatedBooking, updates) => {
    let id, updateFields;

    if (updates && typeof idOrUpdatedBooking === 'string') {
      id = idOrUpdatedBooking;
      updateFields = updates;
    } else if (typeof idOrUpdatedBooking === 'object' && idOrUpdatedBooking.id) {
      id = idOrUpdatedBooking.id;
      updateFields = idOrUpdatedBooking;
    } else {
      console.error("Invalid arguments passed to editBooking.");
      return;
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updateFields } : b))
    );
  };

  /**
   * 🗑️ Remove Booking by ID
   */
  const removeBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  /**
   * ❌ Clear All Bookings
   */
  const clearAllBookings = () => {
    setBookings([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  /**
   * 📆 Calculate total booked nights
   */
  const getTotalNights = () => {
    return bookings.reduce((sum, b) => {
      if (b.startDate && b.endDate) {
        const nights = Math.max(
          Math.ceil(
            (new Date(b.endDate) - new Date(b.startDate)) /
              (1000 * 60 * 60 * 24)
          ),
          0
        );
        return sum + nights;
      }
      return sum;
    }, 0);
  };

  /**
   * 💰 Calculate total booking amount
   */
  const getTotalAmount = () => {
    return bookings.reduce((sum, b) => sum + (Number(b.total) || 0), 0);
  };

  /**
   * 📊 Get summary 
   */
  const getSummary = () => ({
    totalBookings: bookings.length,
    totalNights: getTotalNights(),
    totalAmount: getTotalAmount(),
  });

  /**
   * 🔍 Find booking by ID
   */
  const findBookingById = (id) => bookings.find((b) => b.id === id);

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        addBooking,
        editBooking,
        // deleteBooking को removeBooking के रूप में expose करें
        deleteBooking: removeBooking, 
        removeBooking,
        clearAllBookings,
        getTotalNights,
        getTotalAmount,
        getSummary,
        findBookingById,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
};