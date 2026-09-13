import express from "express";
import cors from "cors";
import { readDatabase } from "../utils/db.js";

const router = express.Router();
router.use(cors());
router.use(express.json());

// read all the users from database as this will be used by Admin only. This will provide both Admin and other roles
router.get("/admin/users", (req, res) => {
  const data = readDatabase();
  return res.status(200).json(data);
});

export default router;
