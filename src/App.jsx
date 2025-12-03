import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Pages
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import MyBookings from "./pages/MyBookings";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import BookingDetails from "./pages/BookingDetails";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancel from "./pages/BookingCancel"; // 🛑 Missing Import (Added)

// ✅ Components
import Navbar from "./components/Navbar";

// ✅ Context
import { BookingsProvider } from "./context/BookingsContext";

// ⭐ DUMMY DATA FOR SEARCH TEST ⭐
const DUMMY_PROPERTIES = [
  { _id: "p1", title: "Luxury Villa in Bali", location: "Bali", price: 250, beds: 3, baths: 2, guests: 6, image: "https://example.com/bali.jpg", superhost: true, instantBook: true, amenities: [] },
  { _id: "p2", title: "Cozy Apartment in London", location: "London", price: 100, beds: 1, baths: 1, guests: 2, image: "https://example.com/london.jpg", superhost: false, instantBook: false, amenities: [] },
  { _id: "p3", title: "Beach House near Goa", location: "Goa", price: 300, beds: 4, baths: 3, guests: 8, image: "https://example.com/goa.jpg", superhost: true, instantBook: true, amenities: [] },
  { _id: "p4", title: "Mountain Cabin Retreat", location: "Colorado", price: 150, beds: 2, baths: 1, guests: 4, image: "https://example.com/cabin.jpg", superhost: false, instantBook: false, amenities: [] },
  { _id: "p5", title: "Stylish Flat in London", location: "London", price: 120, beds: 1, baths: 1, guests: 2, image: "https://example.com/flat.jpg", superhost: true, instantBook: false, amenities: [] },
];


// --- Utility Components ---

// ScrollToTop Component
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

// Loading Spinner Component (ज़्यादा z-index के कारण डिसेबल है)
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"> 
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}

// AnimatedRoutes Component
// 🛑 यहाँ props को destructure करते समय setProperties को जोड़ा गया है।
function AnimatedRoutes({ searchTerm, user, properties, setProperties }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const isAuthenticated = !!user;

  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {/* 🛑 लोडिंग स्पिनर डिसेबल रखा गया है */}
      {/* {loading && <LoadingSpinner />} */}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home searchTerm={searchTerm} properties={properties} />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
            />

            {/* ✅ AddProperty को setProperties पास किया गया है */}
            <Route 
                path="/add-property" 
                element={<AddProperty properties={properties} setProperties={setProperties} />} 
            />

            {/* ✅ EditProperty को properties और setProperties पास किया गया है */}
            <Route 
                path="/edit-property/:id" 
                element={<EditProperty properties={properties} setProperties={setProperties} />} 
            />

            <Route path="/booking/:id" element={<BookingDetails />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/booking-cancel" element={<BookingCancel />} /> {/* 🛑 Added route for BookingCancel */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// --- Main App Component ---

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  // properties state में DUMMY_PROPERTIES को लोड किया गया है।
  const [properties, setProperties] = useState(DUMMY_PROPERTIES); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        setUser(storedUser);
    }
  }, []);

  return (
    <BookingsProvider>
      <Router>
        <ScrollToTop />
        <Navbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          user={user} 
          setUser={setUser} 
          properties={properties} 
        />
        <AnimatedRoutes 
          searchTerm={searchTerm} 
          user={user} 
          properties={properties}
            setProperties={setProperties} // ✅ setProperties को AnimatedRoutes में पास किया गया है
        />
      </Router>
    </BookingsProvider>
  );
}

export default App;