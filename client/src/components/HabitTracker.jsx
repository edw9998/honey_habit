// client/src/components/HabitTracker.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { useUser } from "../context/UserContext";

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const { refreshUser } = useUser();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await API.get("/habits");
      setHabits(res.data);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    try {
      await API.post("/habits", { title: newHabit });
      setNewHabit(""); // Clear input
      fetchHabits(); // Refresh list
    } catch (err) {
      console.error("Failed to add habit:", err);
    }
  };

  const toggleHabit = async (id, currentCompleted) => {
    try {
      // Optimistic UI update (optional) or wait for server
      await API.put(`/habits/${id}`, { completed: !currentCompleted });
      
      // If completed, update streaks and coins
      if (!currentCompleted) {
        await API.put("/users/streak");
        await API.put("/users/coins");
        await refreshUser(); 
      }
      
      fetchHabits();
    } catch (err) {
      console.error("Failed to update habit:", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Daily Habits</h2>
      
      {/* Add Habit Input */}
      <form onSubmit={handleAddHabit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="e.g. Drink water"
          className="flex-1 p-3 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-green-300 transition-colors"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-3 transition-colors font-bold px-5"
        >
          +
        </button>
      </form>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`p-4 rounded-2xl flex justify-between items-center transition-all duration-200 cursor-pointer select-none ${
              habit.completed ? "bg-green-200" : "bg-green-50 hover:bg-green-100"
            }`}
            onClick={() => toggleHabit(habit.id, habit.completed)}
          >
            <span className={`text-lg ${habit.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
              {habit.title}
            </span>
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => toggleHabit(habit.id, habit.completed)}
              className="w-5 h-5 accent-green-500 cursor-pointer"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        ))}
        {habits.length === 0 && (
          <p className="text-gray-400 text-center py-4">No habits yet. Add one above !</p>
        )}
      </div>
    </div>
  );
}