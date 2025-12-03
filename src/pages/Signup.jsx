import { useState, useEffect, useRef } from "react";
// ✅ सभी imports को सीधे यहाँ, file के top पर लिखें।
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import bgImage from "../assets/addproperty-bg.jpg"; // सुनिश्चित करें कि पाथ सही है

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [bgParticles, setBgParticles] = useState([]);
  const [footerParticles, setFooterParticles] = useState([]);
  const [trailParticles, setTrailParticles] = useState([]);
  const cardRef = useRef(null);

  // ❌ 3D Card Tilt लॉजिक हटाया गया (rotateX, rotateY, cardMouseX, cardMouseY)
  // ❌ handleCardMouseMove और handleCardMouseLeave अब उपयोग में नहीं हैं

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
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#facc15"];
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
    const colors = ["#6366f1", "#8b5cf6", "#14b8a6"];
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
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#14b8a6", "#facc15"];
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
      // Background parallax के लिए mouse position सेट करें
      bgMouseX.set(e.clientX - window.innerWidth / 2);
      bgMouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ❌ 3D कार्ड टिल्ट से संबंधित फ़ंक्शन हटा दिए गए हैं।

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirmPassword) {
      setMessage("❌ Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }
    
    console.log("Signup successful for:", form.email); 

    setMessage("✅ Signup successful! Redirecting to login...");
    
    setForm({ email: "", password: "", confirmPassword: "" });

    setTimeout(() => navigate("/login"), 1200); 
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
          backgroundImage: "linear-gradient(270deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15), rgba(236,72,153,0.15), rgba(20,184,166,0.15))",
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

      {/* Signup Card (3D Tilt Removed) */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-md w-11/12 sm:w-full backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 border border-blue-200/30 mb-28 overflow-hidden bg-white/10"
      >
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{ boxShadow: "0 0 30px rgba(236,72,153,0.3)", zIndex: -1, pointerEvents: "none" }}
          animate={{ boxShadow: ["0 0 20px rgba(236,72,153,0.2)", "0 0 40px rgba(236,72,153,0.5)", "0 0 20px rgba(236,72,153,0.2)"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10">

          {/* Heading (बरकरार रखा गया है) */}
          <div className="relative mb-6">
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{ filter: "blur(30px)", background: "linear-gradient(90deg, #ec4899, #facc15, #8b5cf6, #14b8a6)" }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <h1 className="relative text-3xl sm:text-4xl font-bold text-center tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-400">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["email", "password", "confirmPassword"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field === "email" ? "email" : "password"}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full p-3 rounded-2xl bg-white/20 text-white placeholder-transparent border border-blue-300/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-1 transition shadow-md"
                  required
                />
                <label className="absolute left-3 top-3 text-white text-sm transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-pink-400 peer-focus:text-xs">
                  {field === 'email' ? 'Email' : field === 'password' ? 'Password' : 'Confirm Password'}
                </label>
              </div>
            ))}
          
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(236,72,153,0.5), 0 0 45px rgba(236,72,153,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="relative w-full p-3 sm:p-3.5 rounded-2xl bg-pink-600/70 text-white font-semibold overflow-hidden transition"
            >
              Sign Up
            </motion.button>

            {message && (
              <p className={`text-center mt-2 font-semibold ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>{message}</p>
            )}
            <p className="text-center text-sm text-gray-300 mt-4">
                Already have an account? <span onClick={() => navigate('/login')} className="text-pink-400 hover:text-pink-300 cursor-pointer font-bold transition">Log In</span>
            </p>
          </form>
        </div>
      </motion.div>

      {/* Footer (बरकरार रखा गया है) */}
      <footer className="w-full relative flex flex-col items-center py-10 sm:py-12 bg-black/90">
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
                background: `radial-gradient(circle, #6366f1, #8b5cf6, #14b8a6)`,
                boxShadow: `0 0 15px #6366f1, 0 0 30px #8b5cf6, 0 0 45px #14b8a6`,
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
                whileHover={{ scale: 1.3, color: "#14b8a6", textShadow: "0 0 15px #14b8a6, 0 0 25px #8b5cf6" }}
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