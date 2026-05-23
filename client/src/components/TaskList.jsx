import { useEffect, useState } from "react";
import API from "../services/api";
import { useUser } from "../context/UserContext";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const { user, refreshUser } = useUser();   // ← Use context

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!taskInput) return;
    try {
      await API.post("/tasks", { title: taskInput, focus_minutes: 25 });
      setTaskInput("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      await API.put("/users/streak");
      await API.put("/users/coins");

      await refreshUser();     // ← This updates left side too!
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Daily Tasks</h2>

      {/* Add Task */}
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
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                onChange={() => toggleTask(task.id)}
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