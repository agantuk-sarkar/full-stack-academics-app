import express from "express";
import cors from "cors";
import multer from "multer";
import { readDatabase, writeDatabase } from "../utils/db.js";

const router = express.Router();
router.use(cors());
router.use(express.json());

// Using Multer for files/images uploading and passing other string values
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "fileUploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

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
    // if success
    return res.status(200).json(users_for_admin);
  }
});

// update name, email, image and role (Student -> Teacher) when clicked on Save button from client
router.put("/roles/:id", upload.single("imageFile"), (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.params;

  const data = readDatabase();

  const user = data.find((user) => {
    if (user.id === id) {
      return user;
    }
  });
  //   if user doesn't exists
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  //   update name
  if (name) {
    user.name = name;
  }
  // update email
  if (email) {
    user.email = email;
  }
  // update image
  if (req.file) {
    user.image = req.file.originalname;
  }

  //   update role and if it is a student, then remove assignedTeacherId and add assignedStudents array because role will update to teacher
  if (role === "teacher") {
    if (user.role === "student") {
      user.assignedStudents = [];
      delete user.assignedTeacherId;
    }
    user.role = role;
  }

  // make the updated array into JSON string
  writeDatabase(data);

  //   success message
  return res.status(200).json({
    message: "Role updated successfully",
    user: user,
  });
});

export default router;
