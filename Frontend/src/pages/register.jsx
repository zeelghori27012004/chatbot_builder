import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { UserContext } from "../context/User.context";
import Footer from "../components/Footer";

export default function Register() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    isAdmin: false,
  });
  const { setUser, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await register(form);
      if (token) {
        localStorage.setItem("token", token);
        setUser({
          fullname: form.fullname,
          email: form.email,
          phoneNumber: form.phoneNumber,
          isAdmin: form.isAdmin,
        });
        window.dispatchEvent(new Event("tokenChange"));
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message || "Registration failed");
    }
  };

  useEffect(() => {
    // Prevent already logged-in users from accessing register page
    if (user) {
      setMessage("Logout first to Register a new User");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      return;
    }
    const token = localStorage.getItem("token");
    if (token) {
      setMessage("Logout first to Register a new User");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }
  }, [navigate, user]);

  return (
    <>
    <div className="min-h-screen max-w-screen flex items-center justify-center bg-gray-200 overflow-x-hidden">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 text-red-600 text-sm text-center bg-blue-100 p-2 rounded">
            {message}
          </div>
        )}
        <label className="block mb-2 text-sm font-medium">Full Name</label>
        <input
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          required
          autoComplete="name"
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />

        <label className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />

        <label className="block mb-2 text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          autoComplete="mobile-number"
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isAdmin"
            checked={form.isAdmin}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium">Register as Admin</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
    <Footer />
    </>
  );
}
