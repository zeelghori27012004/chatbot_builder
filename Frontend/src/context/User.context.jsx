import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../services/authService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Try to restore user from localStorage
  const [user, setUserState] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Wrap setUser to also update localStorage
  const setUser = (userObj) => {
    if (userObj) {
      localStorage.setItem("user", JSON.stringify(userObj));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(userObj);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      // Fetch user profile from backend if not in localStorage
      getProfile()
        .then((profile) => setUser(profile))
        .catch(() => setUser({ token }));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
