const express = require("express");
const mongoose = require("mongoose");
const teacherRouter = require("./router/teacherRouter");
const studentRouter = require("./router/studentRouter");

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/assignment11";

app.use(express.json());
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);

app.get("/", (req, res) => {
  res.json({ message: "Teacher and Student Registration API is running" });
});

async function startServer() {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
