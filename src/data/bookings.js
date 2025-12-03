// src/data/bookings.js
let bookings = [];

// Add new booking
export const addBooking = (booking) => {
  booking.id = Date.now();
  bookings.push(booking);
  return booking;
};

// Get all bookings
export const getBookings = () => bookings;

// Delete booking by ID
export const deleteBooking = (id) => {
  bookings = bookings.filter((b) => b.id !== id);
};

// Delete all bookings for a property/car
export const deleteAllBookingsForItem = (itemId) => {
  bookings = bookings.filter((b) => b.itemId !== itemId);
};
