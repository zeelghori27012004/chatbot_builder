// src/components/ResetPasswordForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendResetCode,
  verifyResetCode,
  resetPassword,
} from "../../services/authService"; // Adjust the import path as needed

// A self-contained SVG spinner component using Tailwind's `animate-spin`
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function ResetPasswordForm() {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const message = await sendResetCode(email);
      setSuccessMessage(message);
      setStep(2); // Move to the next step
    } catch (err) {
      setError(err.message || "Failed to send code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    try {
      const message = await verifyResetCode(email, code);
      setSuccessMessage(message);
      setStep(3); // Move to the final step
    } catch (err) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const message = await resetPassword(email, newPassword);
      setSuccessMessage(`${message} You will be redirected to login.`);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonStyles =
    "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendCode}>
              <p className="text-center text-sm text-gray-600">
                Enter your email and we'll send you a reset code.
              </p>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputStyles}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={buttonStyles}
                >
                  {isLoading ? <Spinner /> : "Send Code"}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Verify Code */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyCode}>
              <p className="text-center text-sm text-gray-600">
                A code has been sent to{" "}
                <strong className="font-semibold text-gray-800">{email}</strong>
                .
              </p>
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className={inputStyles}
                    placeholder="123456"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={buttonStyles}
                >
                  {isLoading ? <Spinner /> : "Verify Code"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <p className="text-center text-sm text-gray-600">
                Enter and confirm your new password.
              </p>
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={inputStyles}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={inputStyles}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={buttonStyles}
                >
                  {isLoading ? <Spinner /> : "Reset Password"}
                </button>
              </div>
            </form>
          )}

          {/* Display Messages */}
          {error && (
            <p className="mt-4 text-center text-sm text-red-600 bg-red-100 p-3 rounded-md">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="mt-4 text-center text-sm text-green-600 bg-green-100 p-3 rounded-md">
              {successMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
