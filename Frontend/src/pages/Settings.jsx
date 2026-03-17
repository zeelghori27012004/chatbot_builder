import React from "react";
import { useTheme } from "../context/Theme.context";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900 flex flex-col items-center pt-8" : "min-h-screen bg-gray-100 flex flex-col items-center pt-8"}>
      <div className={darkMode ? "bg-gray-800 rounded-lg shadow-lg shadow-blue-100 border border-blue-600 p-8 w-full max-w-xl" : "bg-white rounded-lg shadow-lg shadow-blue-100 border border-blue-600 p-8 w-full max-w-xl"}>
        <div className={darkMode ? "text-xl font-semibold mb-6 text-gray-100" : "text-xl font-semibold mb-6 text-gray-700"}>Settings</div>
        <div className="divide-y">
          <div className="flex justify-between py-3 items-center">
            <span className={darkMode ? "font-semibold text-gray-200" : "font-semibold text-gray-800"}>Dark Mode</span>
            <button
              className={darkMode ? "bg-blue-600 text-white px-4 py-2 rounded focus:outline-none" : "bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"}
              onClick={toggleDarkMode}
            >
              {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>
          <div className="flex justify-between py-3 items-center">
            <span className={darkMode ? "font-semibold text-gray-200" : "font-semibold text-gray-800"}>Google Translate</span>
            {/* Placeholder for Google Translate widget */}
            <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
} 