// client/src/components/Shop.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { useUser } from "../context/UserContext";

export default function Shop() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const { user, refreshUser } = useUser();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const res = await API.get("/shop/rewards");
      setRewards(res.data);
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (rewardId, cost) => {
    if (user.coins < cost) {
      alert("Not enough Honey Coins ! 🐝");
      return;
    }
    setPurchasing(rewardId);
    try {
      await API.post("/shop/purchase", { rewardId });
      alert("Reward purchased successfully ! 🎁✨");
      refreshUser(); // Instantly updates coins in MascotCard
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading Shop...</div>;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        Honey Shop 🛍️
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <div key={reward.id} className="border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-md transition-all bg-gradient-to-b from-white to-amber-50/30">
            <div className="text-5xl mb-3 drop-shadow-sm">{reward.image_emoji}</div>
            <h3 className="font-bold text-gray-800 mb-1">{reward.title}</h3>
            <p className="text-gray-500 text-sm mb-4 flex-grow">{reward.description}</p>
            <button
              onClick={() => handlePurchase(reward.id, reward.cost)}
              disabled={purchasing === reward.id || user.coins < reward.cost}
              className={`w-full py-2 rounded-xl font-semibold transition-all ${
                user.coins >= reward.cost
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {purchasing === reward.id ? "Processing..." : `${reward.cost} 💰`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}