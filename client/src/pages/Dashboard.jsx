import Navbar from "../components/Navbar";
import MascotCard from "../components/MascotCard";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-pink-100">
      <Navbar />

      <div className="p-8 grid lg:grid-cols-2 gap-8">
        <MascotCard />
        <TaskList />
      </div>
    </div>
  );
  
}