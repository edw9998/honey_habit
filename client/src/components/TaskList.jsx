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
          <div
            key={task.id}
            className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex justify-between"
          >
            <span>{task.title}</span>

            <span>⏰ {task.focus_minutes}m</span>
          </div>
        ))}
      </div>
    </div>
  );
  
}