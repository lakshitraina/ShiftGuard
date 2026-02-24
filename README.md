# Employee Leave Management System

A full-stack, real-world simulated Human Resources web application built with the MERN stack (MongoDB, Express, React, Node.js) featuring Role-Based Access Control, JWT authentication, and Tailwind CSS dashboards.

## Project Overview

This application simulates a company workflow where employees can request time off, managers can approve or reject those requests, and administrators can manage user roles and system access.

### Key Features
*   **Role-Based Dashboards**: Distinct interfaces and capabilities for `employee`, `manager`, and `admin` roles.
*   **Secure Authentication**: JWT-based authentication with bcrypt password hashing.
*   **Interactive UI**: Modern, responsive design using React and Tailwind CSS.
*   **State Management**: React Context API for global state.
*   **API Security**: Express middleware for route protection and role authorization.

## Tech Stack
*   **Frontend**: React (Vite), React Router DOM, Tailwind CSS, Lucide React (Icons), Axios, Context API.
*   **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT (JSON Web Tokens), bcryptjs.

## Folder Structure

```
LeaveSystem/
├── backend/
│   ├── config/          # DB connection setup
│   ├── controllers/     # Route logic (Auth, Leave, User)
│   ├── middleware/      # Auth & Role verification handlers
│   ├── models/          # Mongoose DB Schemas
│   ├── routes/          # API endpoint definitions
│   ├── server.js        # Entry point
│   ├── seed.js          # DB seeding script
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance setup
    │   ├── components/  # Reusable UI (Navbar, Sidebar, Cards)
    │   ├── context/     # Global auth state provider
    │   ├── pages/       # Dashboard & Auth views
    │   ├── App.jsx      # Router & Layout configuration
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

## Setup Instructions

### Prerequisites
*   Node.js installed
*   MongoDB installed locally or a MongoDB Atlas URI

### 1. Backend Setup
1.  Navigate to the backend directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Configure environment variables (see `.env Example` below).
4.  (Optional) Seed database with mock users: `node seed.js`
5.  Start the development server: `npm run dev`

### 2. Frontend Setup
1.  Navigate to the frontend directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

## .env Example (Backend)
Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/leave-management
JWT_SECRET=your_super_secret_jwt_key
```

## API Endpoints List

### Authentication
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Authenticate user & get token

### Leave Management
*   `POST /api/leave` - Apply for leave (Employee)
*   `GET /api/leave/my` - Get logged-in user's leaves (Employee)
*   `GET /api/leave` - Get all leaves (Manager/Admin)
*   `PUT /api/leave/:id/status` - Approve/Reject leave (Manager/Admin)

### User Management (Admin Only)
*   `GET /api/users` - Get all registered users
*   `PUT /api/users/:id/role` - Update a user's role
*   `DELETE /api/users/:id` - Remove a user

## Testing Users
If you ran `node seed.js`, you can log in with:
*   **Admin:** `admin@company.com` / `password123`
*   **Manager:** `manager@company.com` / `password123`
*   **Employee:** `employee1@company.com` / `password123`
