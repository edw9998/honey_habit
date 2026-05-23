// client/src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setLoading(false); // Stop loading immediately if not logged in
      return;
    }

    // Fetch user profile only if token exists
    // ⚠️ Adjust "/users/me" to match your actual backend route (e.g., "/auth/me" or "/users")
    API.get("/users/me")
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        localStorage.removeItem("token"); // Clear invalid/expired token
        setUser(null);
      })
      .finally(() => setLoading(false)); // Always stop loading, even on error
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};