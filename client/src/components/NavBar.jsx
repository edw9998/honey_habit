export default function Navbar() {
    return (
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-600">
          Honey Habit 🍯
        </h1>
  
        <div className="flex gap-6 text-gray-600 font-medium">
          <button className="hover:text-amber-500">
            Dashboard
          </button>
  
          <button className="hover:text-amber-500">
            Habits
          </button>
  
          <button className="hover:text-amber-500">
            Focus Timer
          </button>
  
          <button className="hover:text-amber-500">
            Profile
          </button>
        </div>
      </nav>
    );
    
}