import Navbar from "../components/Navbar";
import MascotCard from "../components/MascotCard";
import TaskList from "../components/TaskList";
import HabitTracker from "../components/HabitTracker";
import FocusTimer from "../components/FocusTimer";

export default function Dashboard() {

  return (
    <div className="p-8 bg-gradient-to-b from-yellow-100 to-pink-100 min-h-screen">
      <Navbar />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <MascotCard />
        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">
          <TaskList />
          <HabitTracker />
          <FocusTimer />
        </div>
      </div>

    </div>
  );
}