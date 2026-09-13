import express from "express";
import cors from "cors";

import userAuthRoutes from "./routes/auth.routes.js";
import updateUserRoutes from "./routes/updateUser.routes.js";
import readUserDataWithoutAdminRoutes from "./routes/readUserDataWithoutAdmin.routes.js";
import readAllUsersRoutes from "./routes/readAllUsers.routes.js";
import getUserByIdRoutes from "./routes/getUserByIdRoutes.js";
import adminRoleUpdateRoutes from "./routes/adminRoleUpdateRoutes.js";
import deleteUserByIdRoutes from "./routes/deleteUserByIdRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// serving the fileUploads folder
// app.use("/uploads", express.static("fileUploads"));

// Home directory route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server health is fine" });
});

// Register and Login user using POST method
app.use("/", userAuthRoutes);
// // PUT request to update name, role and image using route params, req.body, req.file object coming from formData
app.use("/", updateUserRoutes);

// Read the data from database and send it to client in response using GET method. This will provide user data without Admin role
app.use("/", readUserDataWithoutAdminRoutes);

// read all the users from database as this will be used by Admin only. This will provide both Admin and other roles
app.use("/", readAllUsersRoutes);

// Get user by ID API
app.use("/", getUserByIdRoutes);

// admin will request for this role Api and below code will give response with the updated array and updated role
app.use("/", adminRoleUpdateRoutes);

// // Delete a user by using the particular user id
app.use("/", deleteUserByIdRoutes);

// Starting the server
app.listen("5500", () => {
  console.log("Server is running on port 5500");
});
