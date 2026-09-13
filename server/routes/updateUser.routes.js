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

// PUT request to update name, role and image using route params, req.body, req.file object coming from formData
router.put("/users/:id", upload.single("imageFile"), (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  const users = readDatabase();

  const user = users.find((user) => {
    if (user.id === id) {
      return user;
    }
  });

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  // update name in the existing object
  if (name) {
    user.name = name;
  }
  // update role in the existing object
  if (role) {
    user.role = role;
  }

  //   update image file using the req.file object
  if (req.file) {
    user.image = req.file.originalname;
  }
  console.log("updatedUsers:", users);
  // write the updated user element into existing array in JSON string
  writeDatabase(users);
  // success messsage
  return res.status(200).json({
    message: "Succesfully Updated",
    user: user,
  });
});
export default router;
