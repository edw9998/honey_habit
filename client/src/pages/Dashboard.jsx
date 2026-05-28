import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import MascotCard from "../components/MascotCard";
import TaskList from "../components/TaskList";
import HabitTracker from "../components/HabitTracker";
import FocusTimer from "../components/FocusTimer";
import Shop from "../components/Shop";
import WellnessTracker from "../components/WellnessTracker";
import CosmeticShop from "../components/CosmeticShop";
import HiveBackground from "../components/HiveBackground";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <>
      {/* ✅ Dynamic Background (sits behind everything) */}
      <HiveBackground coins={user?.coins || 0} />
      
      {/* ✅ Content wrapper (static bg removed to let HiveBackground shine) */}
      <div className="min-h-screen">
        <Navbar />
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE */}
          <MascotCard />
          
          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-6">
            <TaskList />
            <HabitTracker />
            <WellnessTracker />
            <CosmeticShop />
            <FocusTimer />
            <Shop />
          </div>
        </div>
      </div>
    </>
  );
}