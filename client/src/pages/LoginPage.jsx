// client/src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useUser } from "../context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Check console.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
        
        {/* 🍯 Honey Habit Logo */}
        <div className="mb-4 flex justify-center text-7xl drop-shadow-md select-none">
          🍯
        </div>

        {/* 📝 Welcome Message */}
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome to Honey Habit !</h2>
        <p className="text-gray-500 mb-6">Build better habits, track your streaks, stay rewarded.</p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          required
        />
        
        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-xl font-bold transition-colors cursor-pointer shadow-md hover:shadow-lg">
          Login
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-600 font-bold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}