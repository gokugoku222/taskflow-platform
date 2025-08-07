# TaskFlow API Documentation

## Base URL
- Development: http://localhost:5000/api
- Production: https://api.taskflow.com/api

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication
- POST /auth/register - User registration
- POST /auth/login - User login
- POST /auth/refresh - Refresh token

### Users
- GET /users/profile - Get user profile
- PUT /users/profile - Update user profile

### Projects
- GET /projects - Get user projects
- POST /projects - Create new project
- GET /projects/:id - Get project details
- PUT /projects/:id - Update project
- DELETE /projects/:id - Delete project

### Tasks
- GET /tasks - Get tasks with filters
- POST /tasks - Create new task
- GET /tasks/:id - Get task details
- PUT /tasks/:id - Update task
- DELETE /tasks/:id - Delete task

## WebSocket Events

### Connection
- Connect to: http://localhost:5000

### Events
- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `project:updated` - Project updated
