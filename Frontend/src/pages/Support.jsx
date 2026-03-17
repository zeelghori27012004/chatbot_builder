import { Mail, Phone, Clock, HelpCircle, Book, Users } from "lucide-react";

export default function Support() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600">Support</h1>
        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Need help with ChatForge? We're here to assist you every step of the way.
        </p>
      </div>

      {/* Support Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm mb-16">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <Mail className="mx-auto text-blue-600 w-6 h-6 mb-2" />
          <p className="font-semibold text-gray-700">Email</p>
          <p className="text-gray-600 mt-1">support@chatforge.io</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <Phone className="mx-auto text-blue-600 w-6 h-6 mb-2" />
          <p className="font-semibold text-gray-700">Phone</p>
          <p className="text-gray-600 mt-1">+91 98765 43210</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <Clock className="mx-auto text-blue-600 w-6 h-6 mb-2" />
          <p className="font-semibold text-gray-700">Working Hours</p>
          <p className="text-gray-600 mt-1">Mon - Fri, 10am - 6pm IST</p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-blue-50 p-8 rounded-2xl shadow-md mb-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Subject"
            className="col-span-1 md:col-span-2 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="col-span-1 md:col-span-2 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Quick Help Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <a
          href="/faqs"
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
        >
          <HelpCircle className="mx-auto text-blue-600 w-6 h-6 mb-2" />
          <p className="font-semibold text-gray-700">Visit FAQs</p>
          <p className="text-gray-500 text-sm mt-1">Find answers to common questions.</p>
        </a>
        <a
          href="/how-to-use"
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
        >
          <Book className="mx-auto text-blue-600 w-6 h-6 mb-2" />
          <p className="font-semibold text-gray-700">How to Use</p>
          <p className="text-gray-500 text-sm mt-1">Learn step-by-step to build your flow.</p>
        </a>
        <a
          href="/Team"
          className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
        >
          <Users className="mx-auto text-blue-600 w-6 h-6 mb-2" />
          <p className="font-semibold text-gray-700">Our Team</p>
          <p className="text-gray-500 text-sm mt-1">Connect with builders & experts.</p>
        </a>
      </div>
    </div>
  );
}
