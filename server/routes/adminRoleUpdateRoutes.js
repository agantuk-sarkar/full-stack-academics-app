import express from "express";
import multer from "multer";
import cors from "cors";
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

// admin will request for this role Api and below code will give response with the updated array and updated role
router.put("/admin/:id/role", upload.single("imageFile"), (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const data = readDatabase();

  const user = data.find((user) => {
    if (user.id === id) {
      return user;
    }
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (role !== "student" && role !== "teacher") {
    return res.status(400).json({
      message: "Invalid Role",
    });
  }

  // update the role. This will update the user object
  user.role = role;
  // making thr data array into JSON string
  writeDatabase(data);
  // success message
  return res.status(200).json({
    message: "Role updated successfully",
    user: user,
  });
});

export default router;
