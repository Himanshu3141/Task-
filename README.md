# Task Dashboard - Full Stack Application

A full-stack task management application built with **Next.js** (frontend) and **Node.js/Express** (backend), featuring JWT authentication, MongoDB database, and a responsive dashboard with CRUD operations.

## Features

✅ **Frontend (Next.js)**
- Responsive design using TailwindCSS
- Forms with client-side validation
- Protected routes (login required for dashboard)
- Modern UI with dark mode support

✅ **Backend (Node.js/Express)**
- JWT-based authentication (HTTP-only cookies)
- Password hashing with bcrypt
- RESTful APIs for auth, profile, and tasks
- MongoDB database integration
- Server-side validation with express-validator

✅ **Dashboard Features**
- User profile management (view/update)
- Task CRUD operations (Create, Read, Update, Delete)
- Search and filter functionality
- Logout flow

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas connection string)
- **npm** or **yarn**

## Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

   Create a `server/.env` file (or set environment variables):
   ```env
   MONGODB_URI=mongodb://localhost:27017/my-dashboard
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ALLOWED_ORIGIN=http://localhost:3000
   PORT=5000
   NODE_ENV=development
   ```

   **Note:** For MongoDB Atlas, use your connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/my-dashboard
   ```

## Running the Application

You need to run **both** the backend server and the frontend development server.

### Terminal 1: Start the Backend Server

```bash
npm run server:dev
```

This starts the Express server on `http://localhost:5000` (or the port specified in `PORT`).

**Verify it's running:** Open `http://localhost:5000/health` in your browser - you should see `{"status":"ok"}`.

### Terminal 2: Start the Frontend Development Server

```bash
npm run dev
```

This starts the Next.js app on `http://localhost:3000`.

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Create an account:**
   - Click "Create account" or go to `/register`
   - Fill in name, email, and password (min 8 characters)
   - You'll be automatically logged in and redirected to the dashboard

3. **Sign in:**
   - Go to `/login`
   - Enter your email and password
   - You'll be redirected to the dashboard

4. **Dashboard:**
   - View and update your profile (name and bio)
   - Create new tasks with title and description
   - Search tasks by title/description
   - Filter tasks by status (todo, in-progress, done)
   - Update task status or delete tasks
   - Logout using the button in the sidebar/header

## Troubleshooting

### "Failed to fetch" Error

If you see this error, it means the frontend cannot connect to the backend. Check:

1. **Is the backend server running?**
   - Make sure you ran `npm run server:dev` in a separate terminal
   - Check `http://localhost:5000/health` - it should return `{"status":"ok"}`

2. **Is MongoDB running?**
   - If using local MongoDB, make sure the MongoDB service is running
   - Check your `MONGODB_URI` in `server/.env` is correct
   - For MongoDB Atlas, verify your connection string and network access settings

3. **Check environment variables:**
   - Ensure `NEXT_PUBLIC_API_BASE_URL` in `.env` matches your backend URL
   - Ensure `ALLOWED_ORIGIN` in `server/.env` matches your frontend URL (`http://localhost:3000`)

4. **Check console logs:**
   - Backend terminal should show "Connected to MongoDB" and "Server running on port 5000"
   - Frontend browser console may show CORS errors if origins don't match

### Other Issues

- **Port already in use:** Change `PORT` in `server/.env` or kill the process using port 5000
- **MongoDB connection failed:** Verify your `MONGODB_URI` is correct and MongoDB is accessible
- **Dependencies missing:** Run `npm install` again

## Project Structure

```
my-app/
├── app/                    # Next.js frontend (App Router)
│   ├── (auth)/            # Auth pages (login, register)
│   ├── dashboard/         # Protected dashboard pages
│   ├── api-client.ts      # API client for backend communication
│   └── page.tsx           # Landing page
├── server/                # Express backend
│   ├── config/            # Database configuration
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models (User, Task)
│   ├── routes/            # API routes (auth, profile, tasks)
│   └── index.js           # Express app entry point
└── package.json           # Dependencies and scripts
```

## Scripts

- `npm run dev` - Start Next.js development server (frontend)
- `npm run server` - Start Express server (backend)
- `npm run server:dev` - Start Express server with nodemon (auto-reload)
- `npm run build` - Build Next.js for production
- `npm run start` - Start Next.js production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, TailwindCSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **Validation:** express-validator (server), React forms (client)

## License

MIT
