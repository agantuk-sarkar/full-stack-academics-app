import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

const app = express();

app.use(cors());
app.use(express.json());

// serving the fileUploads folder
// app.use("/uploads", express.static("fileUploads"));

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

// Home directory route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server health is fine" });
});

// Getting the directory path
const db_path = path.join(import.meta.dirname, "db.json");
// console.log('db_path:', db_path);

// Read the database db.json file and parse it
function readDatabase() {
  const data = fs.readFileSync(db_path, "utf-8");
  return JSON.parse(data);
}

// Write the database db.json file and make it into JSON string
function writeDatabase(data) {
  fs.writeFileSync(db_path, JSON.stringify(data));
}

// Register user using POST method
app.post("/register", upload.single("register-image"), (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || !req.file) {
    return res.status(409).json({
      message: "All fields are required",
    });
  }

  const db_data = readDatabase();
  const userExists = db_data.some((user) => {
    if (user.email === email) {
      return true;
    }
  });

  if (userExists) {
    return res.status(409).json({
      message: "Email already registered",
    });
  }

  const modifiedBody = {
    id: uuidv4(),
    name: name,
    email: email,
    role: "student",
    image: req.file.originalname,
  };

  // pushing the modified body into db_data array
  db_data.push(modifiedBody);
  //   making the db_data array into JSON string
  writeDatabase(db_data);
  //   Success message
  return res.status(200).json({
    message: "Registration Successful",
    user: modifiedBody,
  });
});

// Read the data from database and send it to client in response using GET method. This will provide user data without Admin role
app.get("/academics/users", (req, res) => {
  const users = readDatabase();

  const users_without_admin = users.filter((user) => {
    if (user.role !== "admin") {
      return user;
    }
  });
  return res.status(200).json(users_without_admin);
});

// read all the users from database as this will be used by Admin only. This will provide both Admin and other roles
app.get("/admin/users", (req, res) => {
  const data = readDatabase();
  return res.status(200).json(data);
});

// Get user by ID API
app.post("/academics/:id", (req, res) => {
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

// Login user using POST method
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({
      message: "All fields are required",
    });
  }
  const data = readDatabase();

  const userExists = data.find((user) => {
    if (user.email === email) {
      return user;
    }
  });
  // check for email if not exists then redirect to signup
  if (!userExists) {
    return res.status(404).json({
      message: "Account does not exists",
    });
  }
  // check for password, if doesn't match throw error
  if (userExists.password != password) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  //   if success
  return res.status(200).json({
    message: "Login Successful",
    user: {
      id: userExists.id,
      name: userExists.name,
      email: userExists.email,
      role: userExists.role,
      image: userExists.image,
    },
  });
});

// PUT request to update name, role and image using route params, req.body, req.file object coming from formData
app.put("/users/:id", upload.single("imageFile"), (req, res) => {
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

// admin will request for this role Api and below code will give response with the updated array and updated role
app.put("/admin/:id/role", upload.single("imageFile"), (req, res) => {
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

// Delete a user by using the particular user id
app.delete("/users/:id", (req, res) => {
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

// Starting the server
app.listen("5500", () => {
  console.log("Server is running on port 5500");
});
