import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ user, setUser, searchTerm, setSearchTerm, properties }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const inputRef = useRef();

  // Styles
  const glassGradient = "from-white/20 via-white/10 to-white/10";
  const buttonStyle = `px-4 py-2 bg-gradient-to-r ${glassGradient} text-gray-900 rounded-full shadow-md transition-all hover:text-blue-500`;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "My Bookings", to: "/my-bookings" },
    { label: "Add Listing", to: "/add-property" },
  ];

  const authLinks = [
    { label: "Signup", to: "/signup" },
    { label: "Login", to: "/login" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Search Logic ---
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setActiveIndex(-1);

    if (value.length > 0 && properties && properties.length > 0) {
      const filtered = properties.filter((p) =>
        p.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") setActiveIndex((prev) => (prev + 1) % suggestions.length);
    else if (e.key === "ArrowUp") setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    else if (e.key === "Enter") {
      if (activeIndex >= 0) handleSuggestionClick(suggestions[activeIndex]._id);
    }
  };

  const handleLogoClick = () => { navigate("/"); setSearchTerm(""); setSuggestions([]); };
  
  const handleLogout = () => { 
    setUser(null); 
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate("/login"); 
  };
  
  const handleSuggestionClick = (id) => { 
    navigate(`/property/${id}`); 
    setSearchTerm(""); 
    setSuggestions([]); 
    if (menuOpen) setMenuOpen(false);
  };

  const LinkWrapper = ({ link, children }) => (
    <motion.div 
        whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(59,130,246,0.5)" }} 
        whileTap={{ scale: 0.95 }}
        className={link.label ? '' : 'w-full flex justify-center'}
    >
        <Link
            to={link.to}
            onClick={() => setMenuOpen(false)}
            className={`${buttonStyle} ${link.label ? '' : 'w-3/4 text-center'}`}
        >
            {children}
        </Link>
    </motion.div>
  );

  return (
    <motion.nav
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl transition-all duration-500 ${scrolled ? "bg-white/40 shadow-xl border-b border-white/20" : "bg-white/10"}`}
    >
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto relative">

        {/* Logo */}
        <motion.div
          onClick={handleLogoClick}
          className="flex items-center cursor-pointer transition"
          whileHover={{ scale: 1.1, textShadow: "0 0 8px rgba(59,130,246,0.6)", rotate: [0, 5, -5, 0] }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg"
            alt="Airbnb Logo"
            className="w-16 h-16"
            style={{ filter: "invert(0)" }}
          />
        </motion.div>

        {/* 🚀 FIXED Search Bar 🚀 */}
        <div className="hidden sm:flex flex-col relative w-full sm:w-1/3 z-[51]"> 
          <div
            className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 shadow-sm border border-white/20 transition-all duration-300"
          >
            <FiSearch className="text-gray-400 mr-2" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              // ✅ सुनिश्चित किया कि इनपुट फ़ील्ड relative या absolute न हो
              className="bg-transparent outline-none w-full placeholder-gray-400 text-gray-900" 
            />
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                // सजेशन लिस्ट का z-index 53 किया
                className="absolute top-full mt-2 w-full rounded-lg shadow-lg overflow-hidden z-[53] border border-white/20 bg-white/30 backdrop-blur-md"
              >
                {suggestions.map((s, index) => (
                  <motion.li
                    key={s._id}
                    onClick={() => handleSuggestionClick(s._id)}
                    onMouseEnter={() => setActiveIndex(index)}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(59,130,246,0.1)" }}
                    className={`px-4 py-2 cursor-pointer transition ${index === activeIndex ? "bg-blue-100 font-semibold" : "bg-transparent text-gray-900"}`}
                  >
                    {s.title}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-4 items-center relative">
          {navLinks.map((link) => (
            <LinkWrapper key={link.label} link={link}>
              {link.label}
            </LinkWrapper>
          ))}

          {!user ? (
            authLinks.map((link) => (
              <LinkWrapper key={link.label} link={link}>
                {link.label}
              </LinkWrapper>
            ))
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(59,130,246,0.5)" }} whileTap={{ scale: 0.95 }}>
                <Link to="/profile" className={`flex items-center gap-2 ${buttonStyle}`}>
                  <FaUserCircle /> {user.name || 'Profile'}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 12px rgba(59,130,246,0.5)" }} whileTap={{ scale: 0.95 }}>
                <button onClick={handleLogout} className={buttonStyle}>
                  Logout
                </button>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className={`md:hidden text-2xl ${scrolled ? "text-gray-900" : "text-gray-900"}`} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="md:hidden bg-white/30 backdrop-blur-xl shadow-lg flex flex-col items-center space-y-3 py-4"
          >
            {/* Mobile Logo */}
             <motion.div
              onClick={handleLogoClick}
              className="cursor-pointer mb-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg"
                alt="Airbnb Logo"
                className="w-16 h-16"
                style={{ filter: "invert(0)" }}
              />
            </motion.div>

            {/* Mobile Links */}
            {[...navLinks, ...(!user ? authLinks : [])].map((link) => (
              <LinkWrapper key={link.label} link={link}>
                {link.label}
              </LinkWrapper>
            ))}

            {user && (
              <>
                <LinkWrapper link={{ to: "/profile", label: "Profile" }}>
                    <span className="flex items-center justify-center gap-2 w-full">
                       <FaUserCircle /> {user.name || 'Profile'}
                    </span>
                </LinkWrapper>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full flex justify-center">
                  <button 
                    onClick={() => { handleLogout(); setMenuOpen(false); }} 
                    className={`${buttonStyle} w-3/4 text-center`}
                  >
                    Logout
                  </button>
                </motion.div>
              </>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}