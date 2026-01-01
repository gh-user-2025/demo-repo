# Project Management System

A modern, web-based project management system for planning, tracking, and collaborating on projects.

## Features

- **Project Management**: Create, update, and track multiple projects
- **Task Management**: Assign tasks, set priorities, track progress, and manage deadlines
- **Team Collaboration**: Manage teams and assign roles
- **Timeline Tracking**: Monitor project milestones and progress
- **Resource Allocation**: View team workload and resource distribution
- **Document Sharing**: Upload and share project-related documents
- **Notifications**: Real-time activity notifications
- **Analytics Dashboard**: Comprehensive reports and visualizations
- **User Authentication**: Secure login and role-based access control

## Tech Stack

### Backend
- Node.js
- Express.js
- JWT for authentication
- In-memory data storage (demo - replace with database in production)

### Frontend
- React.js
- React Router for navigation
- Recharts for data visualization
- Axios for API calls
- React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-management-system
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `JWT_SECRET`: Your secret key for JWT tokens
- `PORT`: Backend server port (default: 5000)

### Running the Application

#### Development Mode

Start both backend and frontend:

Backend (Terminal 1):
```bash
npm run server
```

Frontend (Terminal 2):
```bash
npm run client
```

#### Production Mode

Build and run:
```bash
npm run build
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Demo Credentials

For testing purposes, use these credentials:

- **Admin**: 
  - Email: admin@example.com
  - Password: admin123

- **Manager**: 
  - Email: manager@example.com
  - Password: manager123

- **Developer**: 
  - Email: developer@example.com
  - Password: dev123

## Project Structure

```
project-management-system/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (auth)
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Data models
│   ├── data/             # In-memory data store
│   └── index.js          # Entry point
├── uploads/              # File uploads directory
├── docs/                 # Documentation
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## API Documentation

See [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for detailed API endpoints and usage.

## User Guide

See [USER_GUIDE.md](docs/USER_GUIDE.md) for detailed user instructions.

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- CORS configuration
- Secure file upload handling

## Production Deployment

For production deployment:

1. Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
2. Set up environment variables securely
3. Enable HTTPS
4. Configure proper CORS settings
5. Set up file storage (AWS S3, etc.)
6. Implement logging and monitoring
7. Set up automated backups

## Support and Maintenance

For support, please contact the development team at the designated support email.

## License

MIT License - See LICENSE file for details