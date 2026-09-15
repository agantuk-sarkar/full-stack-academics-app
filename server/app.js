import express from "express";
import cors from "cors";

import userAuthRoutes from "./routes/auth.routes.js";

import readUserData from "./routes/readUserData.routes.js";

import getUserByIdRoutes from "./routes/getUserByIdRoutes.js";

import deleteUserByIdRoutes from "./routes/deleteUserByIdRoutes.js";

import rolesRoutes from "./routes/roles.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Home directory route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server health is fine" });
});

// Register and Login user using POST method
app.use("/", userAuthRoutes);

// Read the data from database and send it to client in response using GET method. This will only provide the logged In user profile
app.use("/", readUserData);

// Get user by ID API
app.use("/", getUserByIdRoutes);

// This middleware has two CRUD operations. For GET method it will get users for Roles tab. For PUT or update operation it will update name, email, image and role
app.use("/", rolesRoutes);

// // Delete a user by using the particular user id
app.use("/", deleteUserByIdRoutes);

// Starting the server
app.listen("5500", () => {
  console.log("Server is running on port 5500");
});
