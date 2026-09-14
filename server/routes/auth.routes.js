import express from "express";
import multer from "multer";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
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

// Register using POST method
router.post("/register", upload.single("register-image"), (req, res) => {
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

  //   finding the user with teacher role
  const default_teacher = db_data.find((user) => {
    if (user.role === "teacher") {
      return user;
    }
  });

  const newStudentId = uuidv4();

  if (userExists) {
    return res.status(409).json({
      message: "Email already registered",
    });
  }

  const studentObj = {
    id: newStudentId,
    name: name,
    email: email,
    role: "student",
    image: req.file.originalname,
    assignedTeacherId: default_teacher ? default_teacher.id : null,
    password: password,
  };

  //   assign the students id into teacher's object
  if (default_teacher) {
    if (default_teacher.assignedStudents === undefined) {
      default_teacher.assignedStudents = [];
    }
    default_teacher.assignedStudents.push(newStudentId);
  }

  // pushing the modified body into db_data array
  db_data.push(studentObj);
  //   making the db_data array into JSON string
  writeDatabase(db_data);
  //   Success message
  return res.status(200).json({
    message: "Registration Successful",
    user: studentObj,
  });
});

// Login user using POST method
router.post("/login", (req, res) => {
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

export default router;
