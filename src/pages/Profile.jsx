// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaEdit, FaLock } from "react-icons/fa";

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = () => {
    // Temporary update
    setUser({ ...user, name, email });
    alert("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    alert(`Password changed to: ${password}`);
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 mb-2">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600">
              <FaCamera className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Edit Info */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-2 border rounded-md outline-none"
            />
            <FaEdit className="text-gray-500" />
          </div>

          <label className="block text-gray-700 font-semibold mb-1 mt-4">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md outline-none"
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          className="w-full py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all mb-6"
        >
          Update Profile
        </button>

        {/* Change Password */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">Change Password</label>
          <div className="flex items-center gap-2">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 p-2 border rounded-md outline-none"
            />
            <FaLock className="text-gray-500" />
          </div>
          <button
            onClick={handleChangePassword}
            className="mt-3 w-full py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
