# Full Stack Academics App

A full-stack academics application built using **HTML, CSS, JavaScript, Node.js, and Express.js**.

The application consists of a frontend client and a backend server. The frontend provides the user interface, while the backend handles API requests, authentication, user management, role-based access control, and data storage.

> **Note:** This project is currently configured for local development and learning purposes. The application uses a local `db.json` file as a simple data store instead of a production database.

---

# 📌 Project Overview

The **Full Stack Academics App** is an academic management application that provides different functionality depending on the user's role.

The application is being developed using **Role-Based Access Control (RBAC)**.

The main roles are:

- **Admin**
- **Teacher**
- **Student**

The backend is responsible for determining what a user is allowed to access.

Users should not be allowed to select privileged roles such as `Admin` during normal registration. Role assignment should be handled by an authorized administrator or system process.

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript
- VS Code Live Server

## Backend

- Node.js
- Express.js
- CORS
- Node.js File System (`fs`)
- JSON

## Data Storage

- `db.json`

The project currently uses `db.json` as a simple local data store.

---

# 📁 Project Structure

```text
full-stack-academics-app/
│
├── client/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── academics.html
│   ├── css/
│   ├── js/
│   └── ...
│
├── server/
│   ├── index.js
│   ├── db.json
│   ├── package.json
│   └── ...
│
└── README.md
