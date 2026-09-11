# Full Stack Academics App

A full-stack academics application built using **HTML, CSS, JavaScript, Node.js, and Express.js**.

The application has a separate frontend and backend. The backend handles API requests, authentication, user management, role-based access control (RBAC), and data storage.

> **Note:** This project uses a local `db.json` file instead of a live database. Therefore, the backend server must be running locally for the application to work.

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* VS Code Live Server

### Backend

* Node.js
* Express.js
* CORS
* File System (`fs`)
* JSON

### Data Storage

* `db.json`

---

## 📁 Project Structure

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
```

---

# 🚀 How to Run the Project

The frontend and backend need to be started separately.

## 1. Start the Backend Server

Open a terminal and navigate to the `server` folder:

```bash
cd server
```

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The backend will start on the configured localhost port, for example:

```text
http://localhost:5500
```

Keep this terminal running while using the application.

### Why is the backend required?

Since the application uses `db.json` as its data store, the backend server is responsible for reading and updating this file.

The frontend communicates with the backend through API requests such as:

```text
POST /login
POST /signup
GET /users
```

Therefore, the frontend will not work correctly if the backend server is not running.

---

## 2. Run the Frontend

After starting the backend, open the project in **VS Code**.

Navigate to:

```text
client/index.html
```

Right-click `index.html` and select:

**Open with Live Server**

The frontend will open in your browser, usually at an address similar to:

```text
http://127.0.0.1:5500/client/index.html
```

> **Important:** Do not open the HTML files directly using `file://`. Use **Live Server** so that the frontend runs correctly during development.

---

# 🔄 Running Both Parts

You need **two separate processes** running:

### Terminal 1 — Backend

```bash
cd server
npm run dev
```

### VS Code — Frontend

```text
client/index.html
→ Right Click
→ Open with Live Server
```

The basic flow is:

```text
Browser
   │
   │ Frontend
   ▼
Live Server
   │
   │ API Requests
   ▼
Express.js Backend
   │
   │ Read / Write
   ▼
db.json
```

---

# 🔐 Role-Based Access Control

The application supports different user roles:

* **Admin**
* **Teacher**
* **Student**

Access to different functionality is determined by the user's assigned role.

Users should **not normally select privileged roles such as Admin during signup**.

Instead, an authorized administrator or system process should assign roles.

For example:

```text
New User
   │
   ▼
Signup
   │
   ▼
Student / Default Role
   │
   ▼
Admin assigns appropriate role
   │
   ├── Teacher
   └── Student
```

The backend should always enforce authorization rather than relying only on frontend checks.

---

# 🗄️ Database / Data Storage

This project does **not currently use a live database**.

Instead, user and application data is stored locally in:

```text
server/db.json
```

The backend uses Node.js file-system operations to read and update the JSON file.

### Important

Because `db.json` is only a local file:

* Data is stored only on the local machine.
* It is not suitable for production use.
* Multiple users cannot safely use it as a real production database.
* Deleting or modifying `db.json` can result in data loss.
* The backend must be running for the application to access the data.

A production version of the application should replace `db.json` with a proper database such as **PostgreSQL, MySQL, MongoDB, or another suitable database system**.

---

# 📦 Installing Dependencies

If you are setting up the project for the first time, run:

```bash
cd server
npm install
```

This installs the dependencies defined in `package.json`.

After installation, start the backend with:

```bash
npm run dev
```

---

# ⚠️ Common Issues

### Backend is not running

If the frontend cannot communicate with the API, make sure:

```bash
npm run dev
```

is running inside the `server` directory.

### Frontend API requests are failing

Check that:

1. The backend server is running.
2. The frontend is opened using **Live Server**.
3. The API URLs in the frontend JavaScript point to the correct backend port.
4. CORS is configured correctly on the Express server.

### Changes to `db.json` are not visible

Refresh the application after making changes to `db.json` and ensure the backend is reading the correct file path.

---

# 👨‍💻 Development

For local development, always run:

```bash
# Backend
cd server
npm run dev
```

Then open:

```text
client/index.html
```

using **VS Code Live Server**.

---

## 📌 Project Status

This project is currently intended for **learning and local development**.

The current implementation uses:

* Local JSON-based data storage
* Express.js backend
* Frontend JavaScript
* Authentication
* Role-Based Access Control

A future production version can replace `db.json` with a proper database and introduce additional security, validation, and deployment configuration.
