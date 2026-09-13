import express from "express";
import multer from "multer";
import cors from "cors";
import { readDatabase } from "../utils/db.js";

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

// Read the data from database and send it to client in response using GET method. This will provide user data without Admin role
router.get("/academics/users", (req, res) => {
  const users = readDatabase();

  const users_without_admin = users.filter((user) => {
    if (user.role !== "admin") {
      return user;
    }
  });
  return res.status(200).json(users_without_admin);
});

export default router;
