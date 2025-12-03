import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBed, FaBath, FaUser, FaSpinner } from "react-icons/fa"; 

export default function EditProperty({ properties, setProperties }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // 1. Property को ID के आधार पर खोजें
  const propertyToEdit = properties.find((p) => String(p._id) === id);

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
    amenities: [],
  });

  const [message, setMessage] = useState("");
  
  // 2. Loading State: properties array खाली होने पर Loading दिखाएँ
  const isLoading = properties.length === 0 && !propertyToEdit;


  // 3. Component लोड होने पर या propertyToEdit बदलने पर फॉर्म को डेटा से भरें
  useEffect(() => {
    if (propertyToEdit) {
      // संख्यात्मक मानों को इनपुट में दिखाने के लिए स्ट्रिंग के रूप में सेट करें
      setForm({ 
        ...propertyToEdit,
        price: String(propertyToEdit.price || 0),
        beds: String(propertyToEdit.beds || 0),
        baths: String(propertyToEdit.baths || 0),
        guests: String(propertyToEdit.guests || 0),
      });
    } else if (properties.length > 0 && !propertyToEdit) {
        // अगर properties array में डेटा है लेकिन ID मैच नहीं हुआ
        setMessage("❌ Property not found with this ID.");
    }
  }, [propertyToEdit, properties]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.title || !form.location || !form.price || !form.image) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }

    // Updated Property Object: सबमिट के समय स्ट्रिंग को नंबर में बदलें
    const updatedProperty = { 
      ...form, 
      price: parseFloat(form.price) || 0, 
      beds: parseInt(form.beds) || 0, 
      baths: parseInt(form.baths) || 0, 
      guests: parseInt(form.guests) || 0,
      _id: id, 
    };

    // setProperties को State Updater Function के साथ कॉल करें
    setProperties((prevProperties) => 
      prevProperties.map((p) =>
        String(p._id) === id ? updatedProperty : p
      )
    );

    setMessage("✅ Property updated successfully! Redirecting...");
    setTimeout(() => navigate("/"), 1200);
  };

  // --- RENDER LOGIC ---

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="text-center mt-20 p-8 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-lg text-gray-600">Loading property data...</p>
      </div>
    );
  }
    
  // 2. Property Not Found State
  if (!propertyToEdit) {
    return <p className="text-center mt-12 text-red-600 font-semibold text-xl">❌ Property not found for ID: {id}</p>;
  }


  // 3. Form Render
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Property: {propertyToEdit.title}</h1>

      {message && (
        <p
          className={`text-center mb-4 p-3 rounded-lg font-semibold ${
            message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </p>
      )}

      <form className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg border border-gray-100" onSubmit={handleSubmit}>
        <label className="font-semibold text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Property Title"
          className="border rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
          value={form.title}
          onChange={handleChange}
          required
        />
        
        <label className="font-semibold text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="border rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
          value={form.location}
          onChange={handleChange}
          required
        />
        
        <label className="font-semibold text-gray-700">Price (per night)</label>
        <input
          type="number"
          name="price"
          placeholder="Price (e.g., 150)"
          className="border rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
          value={form.price}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="flex flex-col">
            <label className="text-sm font-bold flex items-center gap-1 text-gray-700 mb-1">
              <FaBed className="text-blue-500"/> Beds
            </label>
            <input
              type="number"
              name="beds"
              placeholder="2"
              className="border rounded px-3 py-2"
              value={form.beds}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold flex items-center gap-1 text-gray-700 mb-1">
              <FaBath className="text-blue-500"/> Baths
            </label>
            <input
              type="number"
              name="baths"
              placeholder="1"
              className="border rounded px-3 py-2"
              value={form.baths}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold flex items-center gap-1 text-gray-700 mb-1">
              <FaUser className="text-blue-500"/> Guests
            </label>
            <input
              type="number"
              name="guests"
              placeholder="4"
              className="border rounded px-3 py-2"
              value={form.guests}
              onChange={handleChange}
            />
          </div>
        </div>

        <label className="font-semibold text-gray-700">Image URL</label>
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          className="border rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500"
          value={form.image}
          onChange={handleChange}
          required
        />

        {/* Optional Features */}
        <div className="flex gap-4 mt-4 text-gray-700">
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              name="superhost"
              checked={form.superhost}
              onChange={handleChange}
              className="form-checkbox text-blue-500 h-5 w-5 rounded"
            />
            Superhost
          </label>
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              name="instantBook"
              checked={form.instantBook}
              onChange={handleChange}
              className="form-checkbox text-blue-500 h-5 w-5 rounded"
            />
            Instant Book
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold text-lg mt-6 shadow-md"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}