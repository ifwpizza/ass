const express = require("express");
const bcrypt = require("bcrypt");
const Teacher = require("../model/teacherModel");

const router = express.Router();

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && emailRegex.test(email.trim());
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, subject } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Teacher name is required" });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid teacher email is required" });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Teacher password is required" });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({ message: "Teacher subject is required" });
    }

    const existingTeacher = await Teacher.findOne({ email: email.trim().toLowerCase() });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      subject: subject.trim()
    });

    res.status(201).json({
      message: "Teacher registered successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Teacher registration failed",
      error: error.message
    });
  }
});

module.exports = router;
