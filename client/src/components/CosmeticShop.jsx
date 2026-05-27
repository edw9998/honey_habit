import { useEffect, useState } from "react";
import API from "../services/api";
import { useUser } from "../context/UserContext";

export default function CosmeticShop() {
  const [cosmetics, setCosmetics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, refreshUser } = useUser();

  useEffect(() => { fetchCosmetics(); }, []);

  const fetchCosmetics = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        API.get("/cosmetics"),
        API.get("/cosmetics/my")
      ]);
      const myMap = new Map(myRes.data.map(c => [c.id, c]));
      const merged = allRes.data.map(c => ({
        ...c,
        owned: myMap.has(c.id),
        is_equipped: myMap.has(c.id) ? myMap.get(c.id).is_equipped : false
      }));
      setCosmetics(merged);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleBuy = async (id, cost) => {
    if (user.coins < cost) return alert("Not enough coins! 🐝");
    try {
      await API.post("/cosmetics/buy", { cosmeticId: id });
      await refreshUser();
      fetchCosmetics();
    } catch (err) { alert(err.response?.data?.message || "Failed"); }
  };

  const handleEquip = async (id) => {
    try {
      await API.put("/cosmetics/equip", { cosmeticId: id });
      fetchCosmetics();
    } catch (err) { console.error(err); }
  };

  if (loading) return <p className="text-center text-gray-500 py-4">Loading closet...</p>;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">Bear Closet 👕</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {cosmetics.map(item => (
          <div key={item.id} className={`p-3 rounded-2xl text-center border-2 transition-all ${item.is_equipped ? 'border-green-400 bg-green-50' : 'border-gray-100 hover:border-amber-300'}`}>
            <div className="text-4xl mb-2 drop-shadow-sm">{item.emoji}</div>
            <div className="font-semibold text-sm mb-2">{item.name}</div>
            {item.owned ? (
              <button onClick={() => handleEquip(item.id)} className={`w-full py-1.5 rounded-xl text-sm font-bold transition ${item.is_equipped ? 'bg-gray-200 text-gray-600' : 'bg-amber-500 text-white hover:bg-amber-600'}`}>
                {item.is_equipped ? "Equipped ✅" : "Equip"}
              </button>
            ) : (
              <button onClick={() => handleBuy(item.id, item.cost)} className="w-full py-1.5 rounded-xl text-sm font-bold bg-amber-100 text-amber-700 hover:bg-amber-200 transition">
                {item.cost} 💰
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}