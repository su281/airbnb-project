import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaTimes, FaCommentDots, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [newMsg, setNewMsg] = useState(false);
  const messagesEndRef = useRef(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 360, height: 500 });
  const resizerRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!isOpen && messages.length) setNewMsg(true);
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Support: You asked "${input}". Here's a helpful reply!` },
      ]);
      setTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setNewMsg(false);
  };

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizerRef.current?.dragging) {
        const newWidth = Math.max(300, e.clientX - resizerRef.current.getBoundingClientRect().left);
        const newHeight = Math.max(300, e.clientY - resizerRef.current.getBoundingClientRect().top);
        setSize({ width: newWidth, height: newHeight });
      }
    };
    const handleMouseUp = () => {
      if (resizerRef.current) resizerRef.current.dragging = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-blue-600 transition-colors"
        >
          <FaCommentDots />
          {newMsg && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
          )}
        </motion.button>
      )}

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragMomentum={false}
          onDragEnd={(e, info) => setDragPos({ x: info.point.x, y: info.point.y })}
          style={{ x: dragPos.x, y: dragPos.y, width: size.width, height: size.height }}
          className="fixed bottom-4 right-4 bg-white shadow-xl rounded-xl overflow-hidden flex flex-col z-50 max-w-[90vw] sm:max-w-xs"
        >
          {/* Header */}
          <div className="bg-blue-500 text-white px-4 py-3 font-semibold flex justify-between items-center cursor-grab">
            Help Chat
            <div className="flex items-center gap-2">
              <button onClick={toggleMinimize} className="hover:text-gray-200">
                <FaChevronDown />
              </button>
              <button onClick={toggleChat} className="hover:text-gray-200">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                    msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {typing && (
              <div className="flex gap-2 items-center text-sm text-gray-600">
                <span>Support is typing</span>
                <span className="relative w-6 h-2">
                  <span className="absolute inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-0"></span>
                  <span className="absolute left-2 inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                  <span className="absolute left-4 inline-block w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Resizer */}
          <div
            ref={resizerRef}
            onMouseDown={() => (resizerRef.current.dragging = true)}
            className="absolute w-4 h-4 bg-blue-500 bottom-0 right-0 cursor-se-resize"
          ></div>

          {/* Input */}
          <div className="flex p-2 border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-grow px-3 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-full hover:bg-blue-600 transition-colors"
            >
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      )}

      {/* Minimized Chat */}
      {isOpen && isMinimized && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="fixed bottom-4 right-4 bg-blue-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 cursor-pointer"
          onClick={toggleMinimize}
        >
          <FaChevronUp />
          {newMsg && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
