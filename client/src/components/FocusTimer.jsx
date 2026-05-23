import { useEffect, useState } from "react";
import axios from "axios";

export default function FocusTimer() {

  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const [isActive, setIsActive] =
    useState(false);

  useEffect(() => {

    let interval = null;

    if (isActive) {

      interval = setInterval(() => {

        if (seconds > 0) {

          setSeconds(seconds - 1);

        } else {

          if (minutes === 0) {

            clearInterval(interval);

            rewardCoins();

            alert(
              "Focus session completed! +50 coins 🪙"
            );

            setIsActive(false);

          } else {

            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }

      }, 1000);

    }

    return () => clearInterval(interval);

  }, [isActive, seconds, minutes]);

  const rewardCoins = async () => {

    try {

      await axios.put(
        "http://localhost:5000/users/coins"
      );

    } catch (err) {

      console.log(err);
    }
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {

    setIsActive(false);

    setMinutes(25);
    setSeconds(0);
  };

  return (

    <div className="bg-white rounded-3xl shadow-xl p-6">

      <h2 className="text-3xl font-bold mb-6">
        Focus Timer
      </h2>

      <div className="text-center">

        <div className="text-7xl font-bold text-amber-600">

          {String(minutes).padStart(2, "0")}
          :
          {String(seconds).padStart(2, "0")}

        </div>

        <div className="flex justify-center gap-4 mt-8">

          <button
            onClick={startTimer}
            className="
              bg-green-500
              hover:bg-green-600
              text-white
              px-6
              py-3
              rounded-2xl
              font-bold
            "
          >
            Start
          </button>

          <button
            onClick={pauseTimer}
            className="
              bg-yellow-500
              hover:bg-yellow-600
              text-white
              px-6
              py-3
              rounded-2xl
              font-bold
            "
          >
            Pause
          </button>

          <button
            onClick={resetTimer}
            className="
              bg-red-500
              hover:bg-red-600
              text-white
              px-6
              py-3
              rounded-2xl
              font-bold
            "
          >
            Reset
          </button>

        </div>

      </div>

    </div>
  );
}