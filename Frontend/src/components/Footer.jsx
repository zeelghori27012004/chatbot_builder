import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Branding Section */}
        <div>
          <h2 className="text-blue-600 text-xl font-bold mb-2">Chat Forge</h2>
          <p className="text-sm">
            A powerful tool to visually design and manage chatbot conversations
            using flexible, drag-and-drop nodes that adapt to any logic, input,
            or integration in real time.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="text-blue-600 hover:text-blue-800" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="text-blue-600 hover:text-blue-800" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="text-blue-600 hover:text-blue-800" />
            </a>
          </div>
        </div>

        {/* Useful Links - Two Columns */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-3">Useful Links</h3>
          <div className="grid grid-cols-2 gap-x-4 text-sm">
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-600">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/work" className="hover:text-blue-600">
                  Our Work
                </Link>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <Link to="/team" className="hover:text-blue-600">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/how-to-use" className="hover:text-blue-600">
                  How to Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-3">Contact Info</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-blue-600" />
              +91 98765 43210
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              info@antim.tech
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-blue-600 font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/faqs" className="hover:text-blue-600">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-blue-600">
                Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © 2022.{" "}
        <span className="text-blue-600 font-medium">
          AnTim Technologies LLP
        </span>
        . All Rights Reserved.
      </div>
    </footer>
  );
}
