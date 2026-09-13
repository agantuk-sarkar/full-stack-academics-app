import express from "express";
import cors from "cors";
import { readDatabase } from "../utils/db.js";

const router = express.Router();
router.use(cors());
router.use(express.json());

// Get user by ID
router.post("/academics/:id", (req, res) => {
  const { id } = req.params;
  const data = readDatabase();
  const userObj = data.find((user) => {
    if (user.id === id) {
      return user;
    }
  });
  if (!userObj) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  //   destructuring the password of the user so that it doesn't get send in the response
  const { password, ...userWithoutPassword } = userObj;
  //   success response
  return res.status(200).json(userWithoutPassword);
});

export default router;
