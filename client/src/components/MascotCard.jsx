import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import API from "../services/api";

export default function MascotCard() {
  const { user, loading } = useUser();
  const [equipped, setEquipped] = useState([]);

  useEffect(() => {
    if (user?.id) fetchEquipped();
  }, [user]);

  const fetchEquipped = async () => {
    try {
      const res = await API.get("/cosmetics/my");
      setEquipped(res.data.filter(c => c.is_equipped));
    } catch (err) { console.error(err); }
  };

  const hat = equipped.find(c => c.type === 'hat')?.emoji;
  const accessory = equipped.find(c => c.type === 'accessory')?.emoji;

  if (loading) return <div className="bg-white rounded-3xl shadow-xl p-8 text-center">Loading your bear...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
      {/* 🐻 Layered Avatar Container */}
      <div className="relative w-40 h-40 mx-auto mb-6">
        <div className="absolute inset-0 flex items-center justify-center text-8xl select-none drop-shadow-md">🐻</div>
        {hat && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-5xl drop-shadow-lg animate-bounce-slow">{hat}</div>}
        {accessory && <div className="absolute bottom-2 right-0 text-4xl drop-shadow-lg">{accessory}</div>}
      </div>

      <h1 className="text-4xl font-bold text-amber-800 mb-2">Honey Bear</h1>
      <p className="text-gray-600 mb-6">Remember to take care of yourself today!</p>

      <div className="bg-pink-100 text-pink-700 px-6 py-3 rounded-2xl inline-block mb-8">
        Mood : Focused & Productive ! 🌟
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-yellow-100 rounded-2xl p-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl">💰</span>
            <p className="text-4xl font-bold text-amber-600">{user.coins || 0}</p>
          </div>
          <p className="text-gray-700 font-semibold">Honey Coins</p>
        </div>
        <div className="bg-orange-100 rounded-2xl p-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl">🔥</span>
            <p className="text-4xl font-bold text-orange-600">{user.streak || 0}</p>
          </div>
          <p className="text-gray-700 font-semibold">Current Streak</p>
        </div>
      </div>
    </div>
  );
}