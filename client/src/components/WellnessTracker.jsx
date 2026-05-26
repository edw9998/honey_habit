import { useEffect, useState } from "react";
import API from "../services/api";
import { useUser } from "../context/UserContext";

const WELLNESS_CONFIG = {
  hydration: { title: "Hydration 💧", target: 8, unit: "glasses", step: 1 },
  sleep: { title: "Sleep 🌙", target: 7, unit: "hours", step: 0.5 },
};

export default function WellnessTracker() {
  const [logs, setLogs] = useState({ hydration: 0, sleep: 0 });
  const { refreshUser } = useUser();

  useEffect(() => {
    fetchWellnessData();
  }, []);

  const fetchWellnessData = async () => {
    try {
      const [hydRes, sleepRes] = await Promise.all([
        API.get("/wellness/hydration"),
        API.get("/wellness/sleep")
      ]);
      setLogs({ hydration: hydRes.data.value, sleep: sleepRes.data.value });
    } catch (err) {
      console.error("Failed to fetch wellness data:", err);
    }
  };

  const updateLog = async (type, delta) => {
    const config = WELLNESS_CONFIG[type];
    const newValue = Math.max(0, +(logs[type] + delta).toFixed(1));
    
    try {
      const res = await API.post("/wellness/update", { type, value: newValue });
      setLogs(prev => ({ ...prev, [type]: newValue }));
      if (res.data.bonus > 0) {
        await refreshUser(); // Instantly updates coins in MascotCard
      }
    } catch (err) {
      console.error("Failed to update wellness log:", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Wellness Tracker</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(WELLNESS_CONFIG).map(([type, config]) => (
          <WellnessCard 
            key={type}
            type={type}
            config={config}
            value={logs[type]}
            onUpdate={updateLog}
          />
        ))}
      </div>
    </div>
  );
}

function WellnessCard({ config, value, onUpdate }) {
  const progress = Math.min(value / config.target, 1);
  const isTargetMet = value >= config.target;

  return (
    <div className={`p-4 rounded-2xl border-2 transition-colors ${isTargetMet ? 'border-green-300 bg-green-50' : 'border-gray-100 bg-white'}`}>
      <h3 className="text-lg font-bold mb-2">{config.title}</h3>
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl font-bold text-gray-800">
          {value} <span className="text-sm font-normal text-gray-500">{config.unit}</span>
        </div>
        <div className="text-sm text-gray-500">Target: {config.target}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className={`h-2.5 rounded-full transition-all duration-300 ${isTargetMet ? 'bg-green-500' : 'bg-amber-400'}`} 
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => onUpdate(config.title.split(" ")[0].toLowerCase(), -config.step)}
          className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xl transition"
        >-</button>
        <button 
          onClick={() => onUpdate(config.title.split(" ")[0].toLowerCase(), config.step)}
          className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl transition"
        >+</button>
      </div>
    </div>
  );
}