import { useState } from "react";
import axios from "axios";

export default function Register() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/auth/register",
        {
          username,
          email,
          password,
        }
      );

      alert(
        "Registration successful !"
      );

      window.location.href =
        "/login";

    } catch (err) {

      console.log(err);

      alert(
        "Registration failed !"
      );
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
        onSubmit={handleRegister}
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
          Register
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
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
            bg-pink-500
            hover:bg-pink-600
            text-white
            py-3
            rounded-xl
            font-bold
          "
        >
          Register
        </button>

      </form>

    </div>
  );
}