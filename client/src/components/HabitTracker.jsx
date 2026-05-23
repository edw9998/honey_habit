// client/src/components/HabitTracker.jsx
import { useEffect, useState } from "react";
import API from "../services/api";
import { useUser } from "../context/UserContext";

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
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

  const toggleHabit = async (id, currentCompleted) => {
    try {
      // Toggle the habit completion status
      await API.put(`/habits/${id}`, { completed: !currentCompleted });
      
      // If we just completed a habit, update user stats (streaks/coins)
      if (!currentCompleted) {
        await API.put("/users/streak");
        await API.put("/users/coins");
        await refreshUser(); // Updates the UI on the left sidebar
      }
      
      fetchHabits(); // Refresh the list to show the new status
    } catch (err) {
      console.error("Failed to update habit:", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Daily Habits</h2>
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`p-4 rounded-2xl flex justify-between items-center transition-all duration-200 cursor-pointer ${
              habit.completed ? "bg-green-200" : "bg-green-50 hover:bg-green-100"
            }`}
            onClick={() => toggleHabit(habit.id, habit.completed)}
          >
            <span className={habit.completed ? "line-through text-gray-500" : "text-gray-800"}>
              {habit.title}
            </span>
            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() => toggleHabit(habit.id, habit.completed)}
              className="w-5 h-5 accent-green-500 cursor-pointer"
              onClick={(e) => e.stopPropagation()} // Prevent double toggle
            />
          </div>
        ))}
        {habits.length === 0 && (
          <p className="text-gray-400 text-center py-4">No habits yet.</p>
        )}
      </div>
    </div>
  );
}