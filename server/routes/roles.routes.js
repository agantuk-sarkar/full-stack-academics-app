import express from "express";
import cors from "cors";
import { readDatabase, writeDatabase } from "../utils/db.js";

const router = express.Router();
router.use(cors());
router.use(express.json());

// get users for Roles Tab
router.get("/roles/:id/users", (req, res) => {
  const { id } = req.params;

  const data = readDatabase();

  const logged_in_user = data.find((user) => {
    if (user.id === id) {
      return user;
    }
  });

  if (!logged_in_user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  //   Teacher
  if (logged_in_user.role === "teacher") {
    const assigned_students = data.filter((user) => {
      if (
        logged_in_user.assignedStudents &&
        logged_in_user.assignedStudents.includes(user.id)
      ) {
        return user;
      }
    });
    return res.status(200).json(assigned_students);
  }

  // Admin
  if (logged_in_user.role === "admin") {
    const users_for_admin = data.filter((user) => {
      if (user.role === "teacher" || user.role === "student") {
        return user;
      }
    });
    return res.status(200).json(users_for_admin);
  }
});

export default router;
