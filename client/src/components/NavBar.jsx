// client/src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { logout, user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears token & user state
    navigate("/login", { replace: true }); // Smooth router redirect
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🍯</span>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Honey Habit</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 hidden sm:block">
          {user?.email || "User"}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-medium transition-all text-sm border border-red-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}