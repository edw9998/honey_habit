import { useState } from "react";
import axios from "axios";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      alert("Login successful!");

      window.location.href = "/";

    } catch (err) {

      console.log(err);

      alert("Login failed");
    }
  };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-b
      from-yellow-100
      to-pink-100
    ">

      <form
        onSubmit={handleLogin}
        className="
          bg-white
          p-8
          rounded-3xl
          shadow-xl
          w-96
        "
      >

        <h2 className="
          text-3xl
          font-bold
          mb-6
          text-center
        ">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full
            p-3
            border
            rounded-xl
            mb-4
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full
            p-3
            border
            rounded-xl
            mb-6
          "
        />

        <button
          type="submit"
          className="
            w-full
            bg-amber-500
            hover:bg-amber-600
            text-white
            py-3
            rounded-xl
            font-bold
          "
        >
          Login
        </button>

      </form>

    </div>
  );
}