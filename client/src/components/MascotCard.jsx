import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

export default function MascotCard() {

  const [streak, setStreak] =
    useState(0);

  useEffect(() => {

    fetchUser();

  }, []);

  const fetchUser = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/users"
        );

      setStreak(
        res.data.streak
      );

    } catch (err) {

      console.log(err);
    }
  };

  return (

    <div className="bg-white rounded-3xl shadow-xl p-6 text-center">

      <div className="text-8xl animate-bounce">
        🐻
      </div>

      <h2 className="text-3xl font-bold text-amber-700 mt-4">
        Honey Bear
      </h2>

      <p className="text-gray-500 mt-3">
        Remember to take care of yourself today !
      </p>

      <div className="mt-6 bg-pink-100 text-pink-700 py-2 rounded-full font-semibold">

        Mood : Aggressive, Mad, Unstable.

      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">

        <div className="bg-yellow-100 rounded-2xl p-4">

          <h3 className="font-bold text-lg">
            Coins
          </h3>

          <p className="text-2xl mt-2">
            👛 120
          </p>

        </div>

        <div className="bg-orange-100 rounded-2xl p-4">

          <h3 className="font-bold text-lg">
            Streak
          </h3>

          <p className="text-2xl mt-2">
            🔥 {streak}
          </p>

        </div>

      </div>

    </div>
  );
}