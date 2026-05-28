export default function HiveBackground({ coins = 0 }) {
  // Calculate progression tier
  const getTier = (coins) => {
    if (coins >= 300) return 4;
    if (coins >= 150) return 3;
    if (coins >= 50) return 2;
    return 1;
  };

  const tier = getTier(coins);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-1000">
      {/* Dynamic Gradient */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        tier === 1 ? 'bg-gradient-to-b from-yellow-100 to-pink-100' :
        tier === 2 ? 'bg-gradient-to-b from-amber-100 to-green-100' :
        tier === 3 ? 'bg-gradient-to-b from-yellow-200 to-amber-200' :
        'bg-gradient-to-br from-amber-300 to-yellow-400'
      }`} />

      {/* Floating Hive Elements (Non-interactive) */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {tier >= 2 && (
          <>
            <div className="absolute top-12 left-12 text-4xl animate-float-slow">🌸</div>
            <div className="absolute top-24 right-24 text-3xl animate-float-medium delay-500">🌼</div>
            <div className="absolute bottom-40 left-1/4 text-5xl animate-float-slow delay-1000">🐝</div>
          </>
        )}
        {tier >= 3 && (
          <>
            <div className="absolute top-32 right-1/3 text-5xl animate-pulse-slow">🍯</div>
            <div className="absolute bottom-32 right-16 text-4xl animate-float-medium delay-700">🌻</div>
            <div className="absolute top-1/3 left-16 text-4xl animate-float-fast delay-300">🐝</div>
            <div className="absolute bottom-16 right-1/3 text-3xl animate-float-slow delay-1200">🐝</div>
          </>
        )}
        {tier === 4 && (
          <>
            <div className="absolute top-8 left-1/2 text-6xl animate-float-slow delay-200">✨</div>
            <div className="absolute bottom-24 left-16 text-5xl animate-float-fast delay-400">🐝</div>
            <div className="absolute top-1/2 right-20 text-4xl animate-float-medium delay-600">🍯</div>
            <div className="absolute top-1/4 left-1/4 text-3xl animate-float-slow delay-800">🐝</div>
            <div className="absolute bottom-1/3 right-1/4 text-5xl animate-bounce delay-1000">🐝</div>
          </>
        )}
      </div>
    </div>
  );
}