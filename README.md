# Smart Leads Dashboard

Smart Leads Dashboard is a full-stack Lead Management application built using the MERN stack with TypeScript. It includes JWT authentication, role-based access control, lead CRUD operations, advanced filtering, backend pagination, CSV export, and Docker support.

## Features

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Role-based access control
  - Admin
  - Sales User
- Create, view, update, and delete leads
- Search leads by name or email
- Filter leads by status and source
- Sort leads by latest or oldest
- Backend pagination with 10 records per page
- Debounced search
- CSV export functionality
- Responsive dashboard UI
- Loading, empty, and error states
- Form validation using Zod
- Centralized backend error handling
- Docker setup for frontend and backend

## Tech Stack

### Frontend

- React.js
- TypeScript
- TailwindCSS
- React Router
- React Hook Form
- Zod
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod

### DevOps

- Docker
- Docker Compose
- Nginx

## Folder Structure

```txt
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── API_DOCUMENTATION.md
├── docker-compose.yml
└── README.md