# Task Management Backend

Minimal Express + MongoDB backend for a simple task management app.

Environment
- Copy `.env.example` to `.env` and set MONGO_URI and JWT_SECRET.

Install

```bash
npm install
```

Run

```bash
npm run dev
# or
npm start
```

API
- POST /api/auth/register
- POST /api/auth/login
- GET /api/tasks?page=1&limit=10&assignedOnly=true
- GET /api/tasks/:id
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id?confirm=true
- PATCH /api/tasks/:id/status
- PATCH /api/tasks/:id/priority

Note: Protected routes require Authorization: Bearer <token>
