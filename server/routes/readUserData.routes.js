import express from "express";
import cors from "cors";
import { readDatabase } from "../utils/db.js";

const router = express.Router();
router.use(cors());
router.use(express.json());

// Read the data from database and send it to client in response using GET method. This will only provide the logged In user profile in an array, so we are using filter method
router.get("/academics/:id/users", (req, res) => {
  const { id } = req.params;
  const users = readDatabase();

  const logged_in_user_profile = users.filter((user) => {
    if (user.id === id) {
      return user;
    }
  });
  return res.status(200).json(logged_in_user_profile);
});

export default router;
