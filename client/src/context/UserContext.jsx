import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ streak: 0, coins: 0, username: "" });
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get("/users");
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = () => fetchUser();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};