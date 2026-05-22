import { useEffect, useState } from "react";
import axios from "axios";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/tasks"
      );

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async () => {
    if (!taskInput) return;

    try {
      await axios.post(
        "http://localhost:5000/tasks",
        {
          title: taskInput,
          focus_minutes: 25,
        }
      );

      setTaskInput("");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleTask = async (
  id,
  completed
  ) => {
    try {

      await axios.put(
        `http://localhost:5000/tasks/${id}`,
        {
          completed: !completed,
        }
      );

      await axios.put(
        "http://localhost:5000/users/streak"
      );

      window.location.reload();

  } catch (err) {
    console.log(err);
  }
  };

  const deleteTask = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/tasks/${id}`
    );

    fetchTasks();
  } catch (err) {
    console.log(err);
  }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">
        Daily Tasks
      </h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={taskInput}
          onChange={(e) =>
            setTaskInput(e.target.value)
          }
          placeholder="Add new task..."
          className="border p-3 rounded-xl w-full"
        />

        <button
          onClick={addTask}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 rounded-xl"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className={`p-4 rounded-2xl flex justify-between items-center transition-all ${
          task.completed ? "bg-gray-200 line-through opacity-70" : "bg-yellow-50"
          }`}
>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={task.completed}
              onChange={() =>
                toggleTask(task.id, task.completed)
              }
              className="w-5 h-5"
            />

          <span className="font-medium">
            {task.title}
          </span>

          </div>

          <div className="flex items-center gap-4">
            <span>
              ⏰ {task.focus_minutes}m
            </span>

            <button
              onClick={() =>
                deleteTask(task.id)
            }
            className="text-red-500 hover:scale-110 transition"
            >
            ❌
            </button>
          </div>
        </div>
        ))}

      </div>

    </div>
  );
}