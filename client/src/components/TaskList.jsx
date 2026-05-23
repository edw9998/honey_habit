import { useEffect, useState } from "react";
import API from "../services/api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

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
      console.log(err);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      // If the task is being marked as completed → delete it
      if (!completed) {
        const taskElement = document.getElementById(`task-${id}`);
        if (taskElement) taskElement.style.opacity = "0.5";

        await API.delete(`/tasks/${id}`);           // Delete from db
        await API.put("/users/streak");             // Update streak
        await API.put("/users/coins");              // Update coins
      } 
      // If somehow unchecking (rare), we can re-fetch
      else {
        await API.put(`/tasks/${id}`, { completed: false });
      }

      fetchTasks();        // Refresh the list without full page reload
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Daily Tasks</h2>

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

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
              task.completed ? "bg-gray-100" : "bg-white border border-gray-200"
            }`}
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id, task.completed)}
                className="w-5 h-5 accent-amber-500"
              />
              <span
                className={`text-lg ${
                  task.completed ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {task.title}
              </span>
            </div>

            {/* RIGHT SIDE */}
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:scale-110 transition"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}