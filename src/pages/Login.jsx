// src/pages/Login.jsx
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import bgImage from "../assets/login-bg.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [particles, setParticles] = useState([]);
  const cardRef = useRef(null);

  // ❌ 3D Card Tilt लॉजिक हटाया गया (rotateX, rotateY)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
// ❌ rotateX और rotateY को हटा दिया गया है।
  
  // Background Parallax (बरकरार रखा गया है)
  const bgX = useTransform(mouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-20, 20]);
  const bgY = useTransform(mouseY, [-window.innerHeight / 2, window.innerHeight / 2], [-20, 20]);

  // ❌ handleMouseMove और handleMouseLeave फ़ंक्शन्स को अपडेट किया गया
  // ये अब केवल Background Parallax के लिए mouseX/mouseY को अपडेट करेंगे, Card Tilt के लिए नहीं।
  const handleMouseMove = (e) => {
    // केवल Background Parallax के लिए mouse position सेट करें
    mouseX.set(e.clientX - window.innerWidth / 2);
    mouseY.set(e.clientY - window.innerHeight / 2);
  };
  
  const handleMouseLeave = () => {
    // mouseX/mouseY को 0 पर रीसेट करें
    mouseX.set(0);
    mouseY.set(0);
  };

  // Particles Setup (बरकरार रखा गया है)
  useEffect(() => {
    const particleArray = Array.from({ length: window.innerWidth < 768 ? 20 : 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 3,
      color: ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#facc15"][Math.floor(Math.random() * 5)],
      delay: Math.random() * 4,
    }));
    setParticles(particleArray);
  }, []);

  // ✅ UPDATED LOGIN FUNCTION (बरकरार रखा गया है)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    // Simulate login success and store token
    const fakeToken = "demo_token_12345";
    localStorage.setItem("token", fakeToken);

    setMessage("✅ Login successful!");
    setTimeout(() => navigate("/profile"), 1200);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-[#0b0c17] pt-28 sm:pt-32">
      <Navbar />

      {/* Background Image (बरकरार रखा गया है) */}
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})`, x: bgX, y: bgY }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.03, 1], x: [0, 30, -30, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particles (बरकरार रखा गया है) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full blur-lg"
          style={{
            width: p.size,
            height: p.size,
            left: 0,
            top: 0,
            backgroundColor: p.color,
            boxShadow: `0 0 15px ${p.color}, 0 0 30px ${p.color}80`,
          }}
          animate={{ x: p.x, y: p.y, scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "mirror",
            delay: p.delay,
          }}
        />
      ))}

      {/* Login Card (3D Tilt Removed) */}
      <motion.div
        ref={cardRef}
        // ✅ onMouseMove/onMouseLeave को बरकरार रखा गया है, लेकिन अब वे कार्ड को टिल्ट नहीं करते।
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        // ❌ style={{ rotateX, rotateY, perspective: 1000 }} हटा दिया गया है
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-md w-11/12 sm:w-full backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-blue-200/30 mb-32 bg-white/10"
      >
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{ boxShadow: "0 0 30px rgba(59,130,246,0.3)", zIndex: -1, pointerEvents: "none" }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(59,130,246,0.2)",
              "0 0 40px rgba(59,130,246,0.5)",
              "0 0 20px rgba(59,130,246,0.2)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {["email", "password"].map((field) => (
            <div key={field} className="relative">
              <input
                type={field}
                name={field}
                value={field === "email" ? email : password}
                onChange={(e) =>
                  field === "email" ? setEmail(e.target.value) : setPassword(e.target.value)
                }
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="peer w-full p-3 rounded-2xl bg-white/20 text-white placeholder-transparent border border-blue-300/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition shadow-md"
                required
              />
              <label className="absolute left-3 top-3 text-white text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-xs">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            </div>
          ))}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59,130,246,0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="w-full p-3 rounded-2xl bg-blue-600/70 text-white font-semibold transition"
          >
            Login
          </motion.button>
        </form>

        {message && (
          <p
            className={`text-center mt-2 font-semibold ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-4 text-center text-gray-200">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </motion.div>

      {/* Footer (बरकरार रखा गया है) */}
      <footer className="w-full bg-gray-900/90 py-10 sm:py-12 z-0">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-300">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">MyCompany</h3>
            <p className="text-gray-400 text-sm">
              Leading platform for modern solutions. Connect, discover, and explore with us.
            </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Quick Links</h4>
              <ul className="space-y-1 text-gray-400">
                {["Home", "About Us", "Services", "Contact"].map((link, i) => (
                  <li key={i} className="hover:text-blue-400 transition cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Resources</h4>
              <ul className="space-y-1 text-gray-400">
                {["Blog", "Help Center", "Privacy Policy", "Terms of Service"].map((link, i) => (
                  <li key={i} className="hover:text-blue-400 transition cursor-pointer">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Follow Us</h4>
              <div className="flex space-x-4">
                {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social, i) => (
                  <a key={i} href="#!" className="hover:text-blue-400 transition cursor-pointer">
                    {social}
                  </a>
                ))}
              </div>
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} MyCompany. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}