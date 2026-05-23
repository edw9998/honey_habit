import { useUser } from "../context/UserContext";

export default function MascotCard() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        Loading your bear...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
      {/* 🐻 Honey Bear Emoji Avatar */}
      <div className="flex justify-center mb-6 text-8xl select-none drop-shadow-md">
        🐻
      </div>

      <h1 className="text-4xl font-bold text-amber-800 mb-2">Honey Bear</h1>
      <p className="text-gray-600 mb-6">Remember to take care of yourself today!</p>

      {/* Mood */}
      <div className="bg-pink-100 text-pink-700 px-6 py-3 rounded-2xl inline-block mb-8">
        Mood : Aggressive, Mad, Unstable.
      </div>

      {/* Coins and Streak - LIVE UPDATING */}
      <div className="grid grid-cols-2 gap-4">
        {/* Coins Card */}
        <div className="bg-yellow-100 rounded-2xl p-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl">💰</span>
            <p className="text-4xl font-bold text-amber-600">{user.coins || 0}</p>
          </div>
          <p className="text-gray-700 font-semibold">Honey Coins</p>
        </div>

        {/* Streak Card */}
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