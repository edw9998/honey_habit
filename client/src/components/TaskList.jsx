import { useEffect, useState } from "react";
import API from "../services/api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [user, setUser] = useState({ streak: 0, coins: 0 });

  // Fetch tasks for the logged-in user
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
    }
  };

  // Fetch current user stats (streak + coins)
  const fetchUser = async () => {
    try {
      const res = await API.get("/users");
      setUser(res.data);
      console.log("✅ User stats loaded:", res.data);
    } catch (err) {
      console.error("❌ Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUser();
  }, []);

  const addTask = async () => {
    if (!taskInput) return;

    try {
      await API.post("/tasks", {
        title: taskInput,
        focus_minutes: 25,
      });

      setTaskInput("");
      fetchTasks();
    } catch (err) {
      console.error("❌ Error adding task:", err);
    }
  };

  const toggleTask = async (id, completed) => {
    if (!completed) {
      try {
        console.log("✅ Completing task:", id);

        await API.delete(`/tasks/${id}`);
        console.log("✅ Task deleted");

        await API.put("/users/streak");
        console.log("✅ Streak updated");

        await API.put("/users/coins");
        console.log("✅ Coins updated");

        await fetchUser();      // Update streak & coins in UI
        fetchTasks();           // Refresh task list

      } catch (err) {
        console.error("❌ Error completing task:", err.response?.data || err.message);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("❌ Error deleting task:", err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Daily Tasks</h2>

      {/* Stats Bar */}
      <div className="flex gap-6 mb-6 bg-amber-50 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="text-2xl font-bold text-orange-600">{user.streak}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-3xl">💰</span>
          <div>
            <p className="text-sm text-gray-500">Honey Coins</p>
            <p className="text-2xl font-bold text-amber-600">{user.coins}</p>
          </div>
        </div>
      </div>

      {/* Add New Task */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={addTask}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-medium transition"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200 hover:border-amber-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={false} // Since completed tasks are deleted
                onChange={() => toggleTask(task.id, false)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
              <span className="text-lg text-gray-800">{task.title}</span>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:scale-110 transition"
            >
              ❌
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            No tasks yet. Add one above!
          </p>
        )}
      </div>
    </div>
  );
}