# FinTrack 360 - Personal Finance Management Application

A production-style personal finance management application built on the **MERN stack** (MongoDB, Express, React, Node.js) specifically designed for salaried professionals to track income, expenses, budgets, recurring bills, savings goals, and financial analytics.

---

## 🏗️ Project Architecture & Tech Stack

```text
FinTrack 360 Architecture Overview
├── client/                     # Frontend Application (Vite + React)
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Sidebar, Card, Button)
│   │   ├── context/            # React AuthContext state provider
│   │   ├── layout/             # MainLayout application wrapper
│   │   ├── pages/              # Landing & module view components
│   │   ├── routes/             # React Router v7 configuration
│   │   ├── services/           # Axios instance & Auth API service stubs
│   │   └── utils/              # Currency/date formatters & constants
│   ├── package.json
│   └── vite.config.js
│
└── server/                     # Backend API Application (Node.js + Express)
    ├── src/
    │   ├── config/             # Mongoose database connection setup
    │   ├── controllers/        # Request & response controllers
    │   ├── middlewares/        # JWT auth, Zod validation & global error handlers
    │   ├── models/             # Mongoose schemas (User with password sanitization)
    │   ├── routes/             # REST API v1 routes (/api/v1)
    │   ├── services/           # Service layer for business logic
    │   ├── utils/              # ApiError, ApiResponse & Logger utilities
    │   ├── app.js              # Express app configuration & middleware
    │   └── server.js           # Entry point & listener
    └── package.json
```

### Stack Breakdown

* **Frontend**: React 18, Vite, React Router v7, Tailwind CSS v3, Axios, React Hook Form, Zod, Recharts, Lucide React.
* **Backend**: Node.js, Express.js, MongoDB, Mongoose v8, JWT Authentication (`jsonwebtoken`), Password Hashing (`bcryptjs`), Morgan, CORS, Zod validation.

---

## 🔑 Environment Variables Setup

Before running the application, copy the example environment files and update values as needed.

### 1. Server Environment Configuration (`server/.env`)

Copy `server/.env.example` to `server/.env`:

```bash
# Server Port & Environment
PORT=5000
NODE_ENV=development

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/fintrack360

# JWT Authentication Secrets
JWT_SECRET=fintrack360_super_secret_jwt_key_dev_mode
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CLIENT_URL=http://localhost:5173
```

### 2. Client Environment Configuration (`client/.env`)

Copy `client/.env.example` to `client/.env`:

```bash
# Vite API Target Base URL
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## ⚡ Installation & Setup Instructions

### Step 1: Install All Dependencies

From the project root directory:

```bash
npm run install:all
```

Or install separately in each folder:

```bash
# Root dependencies
npm install

# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

---

## 🚀 Running the Application

### Option 1: Run Both Frontend & Backend Concurrently (Recommended)

From the project root:

```bash
npm run dev
```

This starts:
- 🟢 **Express Backend API** on `http://localhost:5000`
- 🟢 **Vite React Client** on `http://localhost:5173`

---

### Option 2: Run Services Individually

#### Run Express Backend Server Only:

```bash
# From root directory:
npm run dev:server

# Or inside /server directory:
cd server
npm run dev
```

#### Run React Frontend Client Only:

```bash
# From root directory:
npm run dev:client

# Or inside /client directory:
cd client
npm run dev
```

---

## 🔍 API Health Check Verification

Once the backend is running, verify server and database status:

- GET `http://localhost:5000/api/v1/health`

**Sample Response:**

```json
{
  "statusCode": 200,
  "data": {
    "status": "healthy",
    "appName": "FinTrack 360 API",
    "version": "1.0.0",
    "timestamp": "2026-10-08T08:23:31.000Z",
    "uptime": 12.45,
    "database": {
      "status": "Connected",
      "connected": true
    },
    "environment": "development"
  },
  "message": "FinTrack 360 backend is operational",
  "success": true
}
```

---

## 🛡️ Security & Architectural Best Practices Enforced

1. **User Scoping & Isolation**: Every future transaction, budget, goal, and financial model is linked to `userId`.
2. **Password Safety**: The `User` Mongoose schema automatically excludes passwords in queries (`select: false`) and strips `password` and `__v` in `toJSON()` transformations.
3. **Operational Error Handling**: Centralized error middleware formats all errors into uniform JSON responses.
4. **Request Validation**: Backend request payloads are strictly validated using Zod schemas via `validateMiddleware.js`.
5. **Clean Separation**: Business logic is separated into `services/`, request handling into `controllers/`, routing in `routes/`, and UI into modular components.

---

## 📋 Next Recommended Task

The project architecture and foundation are complete. The recommended next task is:

**Task 2: Implement Authentication Module**
- Create auth controller (`register`, `login`, `getProfile`, `refresh`)
- Implement Zod registration/login validation schemas
- Wire up JWT token generation & verification
- Connect React `AuthContext` to login/register UI forms with Zod & React Hook Form
