# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "developer"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "developer"
  }
}
```

### Login
**POST** `/auth/login`

Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "developer"
  }
}
```

### Get Current User
**GET** `/auth/me`

Get the currently authenticated user's information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "developer"
}
```

---

## Project Endpoints

### Get All Projects
**GET** `/projects`

Get all projects the user has access to.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "project_id",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "status": "active",
    "startDate": "2024-01-01",
    "endDate": "2024-06-30",
    "progress": 45,
    "ownerId": "user_id",
    "teamMembers": ["user_id_1", "user_id_2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Project by ID
**GET** `/projects/:id`

Get a specific project.

**Headers:** `Authorization: Bearer <token>`

**Response:** Same as project object above

### Create Project
**POST** `/projects`

Create a new project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "teamMembers": ["user_id_1", "user_id_2"]
}
```

**Response:** Created project object

### Update Project
**PUT** `/projects/:id`

Update an existing project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Any project fields to update

**Response:** Updated project object

### Delete Project
**DELETE** `/projects/:id`

Delete a project.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Project deleted successfully"
}
```

### Get Project Tasks
**GET** `/projects/:id/tasks`

Get all tasks for a specific project.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of task objects

### Get Project Milestones
**GET** `/projects/:id/milestones`

Get all milestones for a specific project.

**Headers:** `Authorization: Bearer <token>`

**Response:** Array of milestone objects

---

## Task Endpoints

### Get All Tasks
**GET** `/tasks`

Get all tasks assigned to or created by the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "task_id",
    "projectId": "project_id",
    "title": "Design mockups",
    "description": "Create initial design mockups",
    "status": "in-progress",
    "priority": "high",
    "assignedTo": "user_id",
    "dueDate": "2024-02-15",
    "estimatedHours": 20,
    "actualHours": 10,
    "createdBy": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Task by ID
**GET** `/tasks/:id`

Get a specific task.

**Headers:** `Authorization: Bearer <token>`

**Response:** Task object

### Create Task
**POST** `/tasks`

Create a new task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "projectId": "project_id",
  "title": "Task title",
  "description": "Task description",
  "priority": "high",
  "status": "todo",
  "assignedTo": "user_id",
  "dueDate": "2024-02-15",
  "estimatedHours": 20
}
```

**Response:** Created task object

### Update Task
**PUT** `/tasks/:id`

Update an existing task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Any task fields to update

**Response:** Updated task object

### Delete Task
**DELETE** `/tasks/:id`

Delete a task.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

---

## Team Endpoints

### Get All Teams
**GET** `/teams`

Get all teams.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "team_id",
    "name": "Development Team",
    "description": "Core development team",
    "members": ["user_id_1", "user_id_2"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Team by ID
**GET** `/teams/:id`

Get a specific team.

**Headers:** `Authorization: Bearer <token>`

**Response:** Team object

### Create Team
**POST** `/teams`

Create a new team.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Team Name",
  "description": "Team description",
  "members": ["user_id_1", "user_id_2"]
}
```

**Response:** Created team object

### Update Team
**PUT** `/teams/:id`

Update an existing team.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Any team fields to update

**Response:** Updated team object

### Delete Team
**DELETE** `/teams/:id`

Delete a team.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Team deleted successfully"
}
```

---

## User Endpoints

### Get All Users
**GET** `/users`

Get all users (without passwords).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "developer",
    "avatar": null
  }
]
```

### Get User by ID
**GET** `/users/:id`

Get a specific user.

**Headers:** `Authorization: Bearer <token>`

**Response:** User object (without password)

---

## Document Endpoints

### Get Project Documents
**GET** `/documents/project/:projectId`

Get all documents for a specific project.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "doc_id",
    "projectId": "project_id",
    "name": "document.pdf",
    "filename": "unique_filename.pdf",
    "path": "uploads/unique_filename.pdf",
    "size": 1024000,
    "mimeType": "application/pdf",
    "description": "Project specification",
    "uploadedBy": "user_id",
    "uploadedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Upload Document
**POST** `/documents/upload`

Upload a document.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (form-data):**
- `file`: The file to upload
- `projectId`: Project ID
- `description`: Optional description

**Response:** Created document object

### Delete Document
**DELETE** `/documents/:id`

Delete a document.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Document deleted successfully"
}
```

---

## Notification Endpoints

### Get All Notifications
**GET** `/notifications`

Get all notifications for the current user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "notification_id",
    "userId": "user_id",
    "title": "New task assigned",
    "message": "You have been assigned to task XYZ",
    "type": "task_assignment",
    "read": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Mark Notification as Read
**PUT** `/notifications/:id/read`

Mark a notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response:** Updated notification object

### Mark All Notifications as Read
**PUT** `/notifications/read-all`

Mark all notifications as read.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "All notifications marked as read"
}
```

### Delete Notification
**DELETE** `/notifications/:id`

Delete a notification.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Notification deleted successfully"
}
```

---

## Analytics Endpoints

### Get Dashboard Analytics
**GET** `/analytics/dashboard`

Get dashboard analytics data.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "stats": {
    "totalProjects": 10,
    "activeProjects": 5,
    "totalTasks": 50,
    "completedTasks": 20,
    "inProgressTasks": 15,
    "todoTasks": 15,
    "overdueTasks": 3
  },
  "projectsByStatus": {
    "active": 5,
    "completed": 3,
    "onHold": 2
  },
  "tasksByPriority": {
    "high": 10,
    "medium": 25,
    "low": 15
  },
  "recentActivity": []
}
```

### Get Project Analytics
**GET** `/analytics/project/:projectId`

Get analytics for a specific project.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "totalTasks": 20,
  "completedTasks": 10,
  "inProgressTasks": 5,
  "todoTasks": 5,
  "totalEstimatedHours": 200,
  "totalActualHours": 150,
  "tasksByPriority": {
    "high": 5,
    "medium": 10,
    "low": 5
  },
  "tasksByAssignee": {
    "user_id_1": 10,
    "user_id_2": 10
  }
}
```

### Get Team Workload
**GET** `/analytics/workload`

Get workload distribution across team members.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "userId": "user_id",
    "userName": "John Doe",
    "activeTasks": 5,
    "totalEstimatedHours": 40,
    "tasks": []
  }
]
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
