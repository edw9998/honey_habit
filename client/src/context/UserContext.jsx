// client/src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Internal function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await API.get("/users/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      // If token is invalid, clear it
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load user on startup
  useEffect(() => {
    fetchUserData();
  }, []);

  // ✅ NEW: refreshUser function available to all components
  const refreshUser = async () => {
    await fetchUserData();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};