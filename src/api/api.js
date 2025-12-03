import axios from "axios";

/* ================= MOCK DATA (fallback) ================= */
let properties = [
  {
    id: 1,
    title: "Luxury Apartment",
    location: "New York, USA",
    images: ["/images/apartment1.jpg", "/images/apartment2.jpg", "/images/apartment3.jpg"],
    beds: 3,
    baths: 2,
    guests: 6,
    price: 150,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Cozy Loft",
    location: "San Francisco, USA",
    images: ["/images/loft1.jpg", "/images/loft2.jpg"],
    beds: 2,
    baths: 1,
    guests: 4,
    price: 120,
    rating: 4.5,
  },
];

let cars = [
  {
    id: 1,
    name: "Toyota Corolla",
    type: "Sedan",
    seats: 5,
    fuel: "Petrol",
    price: 50,
    images: ["/images/car1.jpg", "/images/car2.jpg"],
    rating: 4.7,
  },
  {
    id: 2,
    name: "Ford Mustang",
    type: "Coupe",
    seats: 4,
    fuel: "Petrol",
    price: 120,
    images: ["/images/car3.jpg", "/images/car4.jpg"],
    rating: 4.9,
  },
];

let bookings = []; // Local bookings fallback

/* ================= AXIOS INSTANCE ================= */
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Backend URL
  withCredentials: true, // include cookies if needed
});

// ===== REQUEST INTERCEPTOR =====
// Automatically attach JWT token to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR =====
// Global error handling
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

/* ================= AUTH ================= */
export const signup = async (user) => {
  return await API.post("/auth/signup", user);
};

export const login = async (user) => {
  return await API.post("/auth/login", user);
};

/* ================= PROPERTIES API ================= */
export const getAllProperties = async () => {
  try {
    const res = await API.get("/properties");
    return res.data;
  } catch (err) {
    console.warn("Backend failed, using mock data");
    return properties;
  }
};

export const getPropertyById = async (id) => {
  try {
    const res = await API.get(`/properties/${id}`);
    return res.data;
  } catch (err) {
    console.warn("Backend failed, using mock data");
    return properties.find((p) => p.id === parseInt(id));
  }
};

/* ================= CARS API ================= */
export const getAllCars = async () => {
  try {
    const res = await API.get("/cars");
    return res.data;
  } catch (err) {
    console.warn("Backend failed, using mock data");
    return cars;
  }
};

export const getCarById = async (id) => {
  try {
    const res = await API.get(`/cars/${id}`);
    return res.data;
  } catch (err) {
    console.warn("Backend failed, using mock data");
    return cars.find((c) => c.id === parseInt(id));
  }
};

/* ================= BOOKINGS API ================= */
export const getBookings = async () => {
  try {
    const res = await API.get("/bookings");
    return res.data;
  } catch (err) {
    console.warn("Backend failed, using local bookings");
    return bookings;
  }
};

export const addBooking = async (booking) => {
  try {
    const res = await API.post("/bookings", booking);
    return res.data;
  } catch (err) {
    console.warn("Backend failed, adding to local bookings");
    booking.id = Date.now();
    bookings.push(booking);
    return booking;
  }
};

export const deleteBooking = async (id) => {
  try {
    await API.delete(`/bookings/${id}`);
  } catch (err) {
    console.warn("Backend failed, deleting from local bookings");
    bookings = bookings.filter((b) => b.id !== id);
  }
};

export const deleteBookingsByItem = async (itemId) => {
  try {
    await API.delete("/bookings", { params: { itemId } });
  } catch (err) {
    console.warn("Backend failed, deleting from local bookings");
    bookings = bookings.filter((b) => b.itemId !== itemId);
  }
};

/* ================= PROTECTED DATA (example) ================= */
export const getProtectedData = async () => {
  return await API.get("/protected"); // token will be automatically sent
};

/* ================= EXPORT ================= */
export default API;
