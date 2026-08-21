# 🚀 TaskFlow — Multi-Tenant Task Management System

**TaskFlow** is a full-stack, multi-tenant task management platform designed to help companies and teams organize projects, assign tasks, manage team members, and track productivity from a centralized workspace.

Each organization gets its own isolated workspace where administrators can invite team members, create and assign tasks, monitor progress, and manage their team.

The application includes secure authentication, role-based authorization, email notifications, task checklists, file uploads, dashboards, analytics, and responsive UI.

---

## 🌐 Live Demo

https://taskflow-iota-liart.vercel.app/


---

## ✨ Features

### 🔐 Authentication & Authorization

* User registration with **Admin** and **Member** roles
* Secure JWT-based authentication
* Authentication using **HTTP-only cookies**
* Login and logout functionality
* OTP-based password reset via email
* Secure password hashing using **bcrypt**
* Role-Based Access Control (RBAC)
* Protected routes and API endpoints
* Automatic authentication handling for unauthorized requests

---

### 🏢 Multi-Tenancy

TaskFlow is designed as a multi-tenant application, allowing multiple organizations to use the platform independently.

* Each Admin has their own workspace
* Tenant-specific data isolation
* Admins can invite members to their workspace
* Members can only access data belonging to their organization
* Invitation system with **7-day expiration**
* Track invitation status:

  * Pending
  * Accepted
  * Expired
* Admin-specific team and task management

This architecture allows TaskFlow to be used by multiple companies without mixing their data.

---

### 📋 Task Management

Admins can manage tasks throughout their entire lifecycle.

* Create tasks
* Edit task information
* Delete tasks
* Assign tasks to team members
* Set task descriptions
* Set due dates
* Set task priorities
* Update task status
* Add checklist items
* Track checklist completion
* Filter tasks by status
* View assigned tasks
* Track task progress

#### Task Statuses

* Pending
* In Progress
* Completed

#### Priority Levels

* 🔴 High
* 🟡 Medium
* 🟢 Low

---

### 📊 Dashboard & Analytics

TaskFlow provides different dashboards based on the user's role.

#### Admin Dashboard

* Total task overview
* Pending task count
* In-progress task count
* Completed task count
* Task distribution
* Priority statistics
* Recent tasks
* Team activity overview
* Quick access to task management

#### Member Dashboard

* Personal task overview
* Assigned tasks
* Task status tracking
* Recent assigned tasks
* Personal task progress

---

### 👥 User & Team Management

Admins can manage their organization members from a centralized interface.

* View all team members
* View member profiles
* View profile pictures
* View user email information
* Track task counts per member
* Assign tasks to specific members
* Manage user profiles
* Update personal information

---

### 📩 Team Invitation System

Admins can invite new members through email.

**Invitation workflow:**

```text
Admin
  ↓
Enter Member Email
  ↓
Invitation Sent
  ↓
Member Receives Email
  ↓
Accept Invitation
  ↓
Member Joins Organization
```

Invitations automatically expire after **7 days**.

Admins can also view invitation status and manage pending invitations.

---

### ☑️ Task Checklists

Each task can contain multiple checklist items.

* Add checklist items
* Mark items as completed
* Track checklist progress
* Manage checklist items within individual tasks

This makes TaskFlow useful for breaking larger tasks into smaller actionable steps.

---

### 👤 User Profiles

Users can manage their personal profiles.

* Update name
* Update email information
* Upload profile picture
* Change profile information
* View profile details

---

### 🖼️ File Uploads

TaskFlow supports profile image uploads.

* Profile picture upload
* Image storage
* Static image serving


---

### 📧 Email Notifications

TaskFlow integrates email communication for important account and workspace events.

Emails are sent for:

* Welcome emails after registration
* Team invitations
* Password reset OTPs

---

### 📱 Responsive Design

The application is designed to work across different screen sizes.

* Desktop
* Laptop
* Tablet
* Mobile

Authentication pages and core application interfaces are responsive and optimized for different devices.

---

## 🔒 Security

Security is an important part of the TaskFlow architecture.

### Authentication

* JWT-based authentication
* HTTP-only authentication cookies
* Secure cookie configuration
* 7-day token expiration

### Password Security

* Password hashing with bcrypt
* Passwords are never stored in plain text
* OTP-based password recovery

### Authorization

* Role-Based Access Control
* Protected API routes
* Admin/member permission separation
* Tenant-level data isolation

### API Security

* CORS configuration
* Credential-based cross-origin requests
* Protected endpoints
* Authentication middleware

---

# 🛠️ Tech Stack

## Frontend

* **React.js**
* **Vite**
* **JavaScript**
* **Tailwind CSS**
* **Axios**
* **React Router**
* **Recharts**

## Backend

* **Node.js**
* **Express.js**
* **JavaScript / ES Modules**
* **JWT**
* **Cookie Parser**
* **Multer**
* **Nodemailer**

## Database

* **MongoDB**
* **Mongoose**
* **MongoDB Atlas**

## Authentication & Security

* **JSON Web Tokens (JWT)**
* **bcrypt**
* **HTTP-only Cookies**
* **CORS**

## Development & Deployment

* **Git**
* **GitHub**
* **VS Code**
* **Postman**
* **Vercel**

---

# 🏗️ Project Architecture

TaskFlow follows a client-server architecture:

```text
┌─────────────────────────────────────────────┐
│                 TaskFlow                    │
├─────────────────────────────────────────────┤
│                                             │
│  React + Vite Frontend                      │
│            │                                │
│            │ Axios / REST API               │
│            ▼                                │
│  Express + Node.js Backend                  │
│            │                                │
│            ├── Authentication               │
│            ├── Authorization                │
│            ├── Task Management              │
│            ├── User Management              │
│            ├── Invitations                  │
│            ├── Reports                      │
│            └── File Uploads                 │
│            │                                │
│            ▼                                │
│       MongoDB Atlas                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 📂 Project Structure

```text
TaskFlow/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   │
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```


---

# 🔄 Application Workflow

### Admin Workflow

```text
Register
   ↓
Create Organization Workspace
   ↓
Login
   ↓
Admin Dashboard
   ↓
Invite Team Members
   ↓
Create Tasks
   ↓
Assign Tasks
   ↓
Monitor Progress
   ↓
View Analytics
```

### Member Workflow

```text
Receive Invitation
   ↓
Accept Invitation
   ↓
Create / Access Account
   ↓
Login
   ↓
Member Dashboard
   ↓
View Assigned Tasks
   ↓
Update Task Progress
   ↓
Complete Tasks
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/hassan7226/TaskFlow-MERN-Task-Management-System.git

cd TaskFlow-MERN-Task-Management-System
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

---

# 🔑 Environment Variables

## Frontend

Create a `.env` file inside the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000/api
```

Use the appropriate backend URL and port for your local environment.

---

## Backend

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

---

# ▶️ Running the Application

## Start Backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---



# 🔮 Future Improvements

Potential future improvements include:

* Project/workspace management
* Drag-and-drop task boards
* Real-time task updates with Socket.IO
* Advanced reporting and analytics
* Dark mode
* Calendar integration
* Search and advanced filtering
* Subscription-based SaaS plans
* Organization-level settings

---

# 🎯 Purpose of the Project

TaskFlow was built to demonstrate the development of a **production-oriented MERN stack application** with real-world concepts such as:

* Multi-tenancy
* Authentication
* Authorization
* REST APIs
* Role-based permissions
* Database relationships
* Secure cookies
* Email communication
* File uploads
* Dashboard analytics
* Responsive frontend development
* Production deployment
* CORS and cross-origin authentication

The goal is to provide a scalable foundation that can be used by different companies and teams to manage their tasks and collaborate within isolated workspaces.

---

# 👨‍💻 Author

**Hassan Arshad**

Full-Stack / MERN Stack Developer

* GitHub: https://github.com/hassan7226
* LinkedIn: https://www.linkedin.com/in/hassan7226/

---

# ⭐ Support

If you find TaskFlow useful or interesting, consider giving the repository a ⭐ on GitHub.

---


