import express from "express";
import cors from "cors";
import { readDatabase, writeDatabase } from "../utils/db.js";

const router = express.Router();
router.use(cors());
router.use(express.json());

// Delete a user by using the particular user id
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const users = readDatabase();
  const user = users.find((user) => {
    if (user.id === id) {
      return user;
    }
  });

  // check if user exists
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  // create a new array without the selected user so that the database shows only the users which are not deleted
  const excluding_deleted_users = users.filter((user) => {
    if (user.id != id) {
      return user;
    }
  });
  // making the excluding_deleted_users array into JSON string
  writeDatabase(excluding_deleted_users);
  // success message
  return res.status(200).json({
    message: "User deleted successfully",
    user: user,
  });
});

export default router;
