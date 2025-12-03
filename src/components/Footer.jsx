import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-white font-bold mb-4 text-lg">About</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Press</a></li>
            <li><a href="#" className="hover:text-white transition">Blog</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-white font-bold mb-4 text-lg">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Destinations</a></li>
            <li><a href="#" className="hover:text-white transition">Properties</a></li>
            <li><a href="#" className="hover:text-white transition">Top Hosts</a></li>
            <li><a href="#" className="hover:text-white transition">Safety</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-bold mb-4 text-lg">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition">Cancellation Options</a></li>
            <li><a href="#" className="hover:text-white transition">Trust & Safety</a></li>
            <li><a href="#" className="hover:text-white transition">FAQs</a></li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h3 className="text-white font-bold mb-4 text-lg">Stay Updated</h3>
          <p className="text-sm mb-4">Subscribe to our newsletter for the latest deals and updates.</p>
          <div className="flex mb-4">
            <input type="email" placeholder="Enter your email" className="flex-grow px-3 py-2 rounded-l-md focus:outline-none text-gray-900" />
            <button className="bg-blue-500 px-4 py-2 rounded-r-md hover:bg-blue-600 transition">Subscribe</button>
          </div>
          <div className="flex gap-3 mt-2">
            <a href="#" className="hover:text-white transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition"><FaTwitter /></a>
            <a href="#" className="hover:text-white transition"><FaInstagram /></a>
            <a href="#" className="hover:text-white transition"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 py-4 text-center text-sm">
        &copy; {new Date().getFullYear()} YourSiteName. All rights reserved.
      </div>
    </footer>
  );
}
