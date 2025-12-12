# Task Management Application

A full-stack task management application with React frontend and Node.js/Express backend.

## Test Credentials

For testing purposes, you can use these credentials:

- Email: `testing@gmail.com`
- Password: `testing@123`


**Note:** Register these users first, or create your own test accounts.

## Features

- **User Authentication**: Register and login with JWT token-based authentication
- **Task Management**: Create, read, update, and delete tasks
- **Task Assignment**: Assign tasks to specific users
- **Task Filtering**: View tasks assigned to you or all your tasks
- **Priority & Status Tracking**: Set priority (low/medium/high) and status (pending/in-progress/completed)
- **Pagination**: Browse tasks with pagination support
- **Responsive Design**: Clean, modern UI built with React and Tailwind CSS

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS 4.1
- Modern component architecture

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_super_secret_jwt_key_change_this
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   # or for production
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks (Protected Routes)
- `GET /api/tasks` - List all tasks with pagination
  - Query params: `page`, `limit`, `assignedOnly`
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id?confirm=true` - Delete a task
- `PATCH /api/tasks/:id/status` - Update task status
- `PATCH /api/tasks/:id/priority` - Update task priority

### Users (Protected Routes)
- `GET /api/users` - List all users

## Project Structure

```
task-manager/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ConfirmModal.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── TaskList.jsx
    │   │   ├── TaskForm.jsx
    │   │   ├── TaskDetails.jsx
    │   │   └── Users.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Usage

1. **Register**: Create a new account using the registration form
2. **Login**: Sign in with your credentials
3. **Create Tasks**: Click "Create" to add new tasks
4. **View Tasks**: Browse all tasks in the Tasks page
5. **Assign Tasks**: Assign tasks to specific users (including yourself)
6. **Update Status**: Mark tasks as completed or in-progress
7. **Edit Tasks**: Click "Edit" on any task to modify its details
8. **Delete Tasks**: Delete tasks you created (with confirmation)

## Features in Detail

### Task Priority
- **Low**: Green color coding
- **Medium**: Yellow color coding
- **High**: Red color coding

### Task Status
- **Pending**: Default status for new tasks
- **In Progress**: Tasks currently being worked on
- **Completed**: Finished tasks

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- CORS configuration
- Token expiration (7 days)

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Production Build
```bash
cd frontend
npm run build
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```
