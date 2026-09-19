const express = require("express");
const bcrypt = require("bcrypt");
const Student = require("../model/studentModel");

const router = express.Router();

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && emailRegex.test(email.trim());
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, course, age } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Student name is required" });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid student email is required" });
    }

    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Student password is required" });
    }

    if (!course || !course.trim()) {
      return res.status(400).json({ message: "Student course is required" });
    }

    if (age === undefined || age === null || Number.isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
      return res.status(400).json({ message: "Student age must be a valid number between 1 and 120" });
    }

    const existingStudent = await Student.findOne({ email: email.trim().toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      course: course.trim(),
      age: Number(age)
    });

    res.status(201).json({
      message: "Student registered successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        course: student.course,
        age: student.age
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Student registration failed",
      error: error.message
    });
  }
});

module.exports = router;
