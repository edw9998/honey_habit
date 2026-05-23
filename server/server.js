const express = require("express");
const cors = require("cors");

const taskRoutes = require("./routes/tasks");
const habitRoutes = require("./routes/habits");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/habits", habitRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.listen(5000, () => {
  console.log(
    "Server running on port 5000."
  );
});