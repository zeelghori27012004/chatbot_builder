export const login = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/users/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }
  );

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || "Login failed");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Login failed");
  }

  if (!data.token) {
    throw new Error("No token received from server");
  }

  localStorage.setItem("token", data.token);
  return data.token;
};

export const googleLogin = async (idToken) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/users/google-login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || "Google login failed");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Google login failed");
  }

  if (!data.token) {
    throw new Error("No token received from server");
  }

  localStorage.setItem("token", data.token);
  return data.token;
};

export const register = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/users/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }
  );

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || "Registration failed");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Registration failed");
  }

  if (!data.token) {
    throw new Error("No token received from server");
  }

  localStorage.setItem("token", data.token);
  return data.token;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/users/profile`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return await response.json();
};

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/users/profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update profile");
  }
  return await response.json();
};

export const sendResetCode = async (email) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/users/reset-password/send-code`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || "Failed to send reset code");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to send reset code");
  }

  return data.message;
};

export const verifyResetCode = async (email, code) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/users/reset-password/verify-code`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    }
  );

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || "Failed to verify code");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Invalid or expired code");
  }

  return data.message;
};

export const resetPassword = async (email, newPassword) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_DOMAIN}/users/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    }
  );

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(text || "Failed to reset password");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Password reset failed");
  }

  return data.message;
};
