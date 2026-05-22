import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export default function HabitTracker() {

  const [habits, setHabits] =
    useState([]);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/habits"
        );

      setHabits(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const toggleHabit = async (
    id,
    completed
  ) => {

    try {

      await axios.put(
        `http://localhost:5000/habits/${id}`,
        {
          completed: !completed,
        }
      );

      fetchHabits();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mt-6">

      <h2 className="text-2xl font-bold mb-4">
        Daily Habits
      </h2>

      <div className="space-y-3">

        {habits.map((habit) => (

          <div
            key={habit.id}
            className={`p-4 rounded-2xl flex justify-between items-center ${
              habit.completed
                ? "bg-green-200"
                : "bg-green-50"
            }`}
          >

            <span>
              {habit.title}
            </span>

            <input
              type="checkbox"
              checked={habit.completed}
              onChange={() =>
                toggleHabit(
                  habit.id,
                  habit.completed
                )
              }
              className="w-5 h-5"
            />

          </div>
        ))}

      </div>
    </div>
  );
}