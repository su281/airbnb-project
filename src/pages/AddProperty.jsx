// src/pages/AddProperty.jsx
import { useState, useEffect, useRef, useContext } from "react";
// ✅ सभी imports को सीधे यहाँ, file के top पर लिखें।
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBed, FaBath, FaUser, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BookingsContext } from "../context/BookingsContext"; // BookingsContext का उपयोग किया जा रहा है
import bgImage from "../assets/addproperty-bg.jpg";

export default function AddProperty() {
  const navigate = useNavigate();
  // ✅ addBooking फ़ंक्शन को BookingsContext से प्राप्त करें
  const { addBooking } = useContext(BookingsContext);

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    beds: "",
    baths: "",
    guests: "",
    image: "",
    superhost: false,
    instantBook: false,
  });

  const [message, setMessage] = useState("");
  const [bgParticles, setBgParticles] = useState([]);
  const [footerParticles, setFooterParticles] = useState([]);
  const [trailParticles, setTrailParticles] = useState([]);
  const cardRef = useRef(null);

  // ❌ 3D Card Tilt लॉजिक हटाया गया
  const cardMouseX = useMotionValue(0);
  const cardMouseY = useMotionValue(0);
  // ❌ rotateX और rotateY अब उपयोग में नहीं हैं
  // const rotateX = useTransform(cardMouseY, [-100, 100], [15, -15]);
  // const rotateY = useTransform(cardMouseX, [-100, 100], [-15, 15]);

  // Background Parallax (बरकरार रखा गया है)
  const bgMouseX = useMotionValue(0);
  const bgMouseY = useMotionValue(0);
  const bgX = useTransform(bgMouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-20, 20]);
  const bgY = useTransform(bgMouseY, [-window.innerHeight / 2, window.innerHeight / 2], [-20, 20]);

  const particleCount = window.innerWidth < 768 ? 15 : 30;
  const footerParticleCount = window.innerWidth < 768 ? 10 : 20;

  // Background particles (बरकरार रखा गया है)
  useEffect(() => {
    const tempParticles = [];
    const colors = ["#6b7280", "#9ca3af", "#3b82f6"];
    for (let i = 0; i < particleCount; i++) {
      tempParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 6 + 4,
        delay: Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setBgParticles(tempParticles);
  }, [particleCount]);

  // Footer particles (बरकरार रखा गया है)
  useEffect(() => {
    const tempParticles = [];
    const colors = ["#6b7280", "#9ca3af", "#3b82f6"];
    for (let i = 0; i < footerParticleCount; i++) {
      tempParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * 120,
        size: Math.random() * 5 + 3,
        delay: Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setFooterParticles(tempParticles);
  }, [footerParticleCount]);

  // Mouse trail (बरकरार रखा गया है)
  useEffect(() => {
    const colors = ["#6b7280", "#9ca3af", "#3b82f6"];
    const handleMouseMove = (e) => {
      setTrailParticles((prev) => [
        ...prev.slice(-30),
        {
          id: Date.now(),
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ]);
      bgMouseX.set(e.clientX - window.innerWidth / 2);
      bgMouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ❌ handleCardMouseMove और handleCardMouseLeave को केवल mouseX/mouseY सेट करने के लिए संशोधित किया गया है, 
  // लेकिन चूंकि rotateX/rotateY का उपयोग नहीं हो रहा है, यह कार्ड को टिल्ट नहीं करेगा।
  const handleCardMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cardMouseX.set(x);
    cardMouseY.set(y);
  };

  const handleCardMouseLeave = () => {
    cardMouseX.set(0);
    cardMouseY.set(0);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.price || !form.image) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }
    const newProperty = {
      id: Date.now(),
      title: form.title,
      location: form.location,
      total: parseFloat(form.price),
      itemType: "property",
      images: [form.image],
      beds: parseInt(form.beds) || 0,
      baths: parseInt(form.baths) || 0,
      guests: parseInt(form.guests) || 0,
      superhost: form.superhost,
      instantBook: form.instantBook,
      // 💡 बुकिंग लिस्ट में दिखाने के लिए चेक-इन और चेक-आउट तारीखें जोड़ें
      checkIn: new Date().toISOString().split('T')[0], 
      checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // आज से 7 दिन बाद
    };
    
    // ✅ BookingContext में नई लिस्टिंग जोड़ें ताकि वह 'My Booking' में दिखे
    addBooking(newProperty); 
    
    setMessage("✅ Property added successfully and added to My Bookings!");
    
    setForm({
      title: "",
      location: "",
      price: "",
      beds: "",
      baths: "",
      guests: "",
      image: "",
      superhost: false,
      instantBook: false,
    });
    
    // नेविगेशन / (होम पेज) पर बदला गया
    setTimeout(() => navigate("/"), 1200); 
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0b0c17] pt-28 sm:pt-32">

      {/* Animated Background (बरकरार रखा गया है) */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", x: bgX, y: bgY }}
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{ scale: [1, 1.03, 1], x: [0, 30, -30, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: "linear-gradient(270deg, rgba(107,114,128,0.15), rgba(156,163,175,0.15), rgba(59,130,246,0.15))",
          backgroundSize: "400% 400%",
          mixBlendMode: "overlay",
        }}
      />

      {/* Background Particles (बरकरार रखा गया है) */}
      {bgParticles.map((p) => (
        <motion.div
          key={p.id}
          animate={{ x: p.x, y: p.y, scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8 + Math.random() * 5, repeat: Infinity, repeatType: "mirror", delay: p.delay }}
          className="absolute rounded-full blur-lg"
          style={{ width: p.size, height: p.size, left: 0, top: 0, backgroundColor: p.color, boxShadow: `0 0 20px ${p.color}, 0 0 40px ${p.color}80` }}
        />
      ))}

      {/* Mouse Trail (बरकरार रखा गया है) */}
      {trailParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute rounded-full blur-lg pointer-events-none"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, boxShadow: `0 0 15px ${p.color}, 0 0 30px ${p.color}80` }}
        />
      ))}

      {/* Property Card (3D Tilt Removed) */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        // ❌ style={{ rotateX, rotateY, perspective: 1000 }} हटा दिया गया है
        onMouseMove={handleCardMouseMove} // mouseX/mouseY को अपडेट करता है (लेकिन टिल्ट नहीं)
        onMouseLeave={handleCardMouseLeave}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-md w-11/12 sm:w-full 
                           backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10
                           border border-gray-300/20 mb-28 overflow-hidden
                           bg-gradient-to-br from-gray-50/60 via-gray-100/50 to-blue-100/40"
      >

        <div className="relative z-10">

          {/* Heading (बरकरार रखा गया है) */}
          <div className="relative mb-6">
            <h1 className="relative text-3xl sm:text-4xl font-bold text-center tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-gray-500 to-blue-600">
              Add New Property
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["title", "location", "price", "image"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field === "price" ? "number" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full p-3 rounded-2xl bg-white/30 text-gray-900 placeholder-transparent border border-gray-300/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition shadow-lg hover:shadow-xl"
                  required
                />
                <label className="absolute left-3 top-3 text-gray-700 text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:text-xs">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-2">
              {[{ name: "beds", icon: <FaBed /> }, { name: "baths", icon: <FaBath /> }, { name: "guests", icon: <FaUser /> }].map((item) => (
                <div key={item.name} className="flex flex-col">
                  <label className="flex items-center gap-1 text-gray-800 font-semibold">{item.icon} {item.name.charAt(0).toUpperCase() + item.name.slice(1)}</label>
                  <input
                    type="number"
                    name={item.name}
                    value={form[item.name]}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-2xl bg-white/30 text-gray-900 placeholder-transparent border border-gray-300/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-md hover:shadow-lg"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 text-gray-800 font-semibold mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="superhost" checked={form.superhost} onChange={handleChange} className="accent-blue-500" /> Superhost
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="instantBook" checked={form.instantBook} onChange={handleChange} className="accent-blue-500" /> Instant Book
              </label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59,130,246,0.6), 0 0 50px rgba(59,130,246,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="relative w-full p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold overflow-hidden transition shadow-md hover:shadow-xl"
            >
              Add Property
            </motion.button>

            {message && (
              <p className={`text-center mt-2 font-semibold ${message.includes("✅") ? "text-green-500" : "text-red-500"}`}>{message}</p>
            )}
          </form>
        </div>
      </motion.div>

      {/* Footer (बरकरार रखा गया है) */}
      <footer className="w-full relative flex flex-col items-center py-10 sm:py-12 bg-gray-900/90">
        <div className="absolute inset-0 overflow-hidden z-0">
          {footerParticles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full blur-lg"
              style={{
                width: p.size,
                height: p.size,
                left: p.x,
                top: p.y,
                background: `radial-gradient(circle, #6b7280, #9ca3af, #3b82f6)`,
                boxShadow: `0 0 15px #6b7280, 0 0 30px #9ca3af, 0 0 45px #3b82f6`,
              }}
              animate={{ y: [p.y, p.y + 20, p.y], opacity: [0.4, 0.9, 0.4], scale: [1, 1.3, 1] }}
              transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, repeatType: "mirror", delay: p.delay }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center text-gray-100">
          <p className="mb-3 text-xs sm:text-sm">© 2025 YourCompany. All rights reserved.</p>
          <div className="flex gap-5 sm:gap-6 mb-2">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.3, color: "#3b82f6", textShadow: "0 0 15px #3b82f6, 0 0 25px #9ca3af" }}
                className="cursor-pointer text-lg sm:text-xl"
              >
                <Icon />
              </motion.div>
            ))}
          </div>
          <p className="text-xs sm:text-sm">
            Made with <span className="text-red-500">❤️</span> using React & Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
}