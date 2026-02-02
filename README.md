# Project Management System

A modern, web-based project management system for planning, tracking, and collaborating on projects.

## Quick Start

```bash
# 1. Clone and navigate to the repository
git clone <repository-url>
cd demo-repo

# 2. Install all dependencies
npm run install-all

# 3. Set up environment variables
cp .env.example .env

# 4. Run the application (in separate terminals)
npm run server    # Terminal 1 - Backend
npm run client    # Terminal 2 - Frontend

# 5. Run tests
npm test
```

Access the application at http://localhost:3000

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

- **Node.js**: v16.0.0 or higher (v18.x or v20.x recommended)
- **npm**: v8.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

To check your current versions:
```bash
node --version
npm --version
```

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd demo-repo
```

2. **Install all dependencies (backend + frontend):**
```bash
npm run install-all
```

This single command installs dependencies for both the server and client.

Alternatively, install separately:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `JWT_SECRET`: Your secret key for JWT tokens (required - change in production!)
- `PORT`: Backend server port (default: 5000)
- `NODE_ENV`: Set to `development` for local development

### Running the Application

#### Development Mode (Recommended for Local Development)

**Option 1: Run both servers separately (recommended)**

Backend (Terminal 1):
```bash
npm run server
```

Frontend (Terminal 2):
```bash
npm run client
```

**Option 2: Run backend only**
```bash
npm run dev
```

Then navigate to `client/` and run `npm start` separately.

#### Production Mode

Build the React app and serve it from the Express server:
```bash
npm run build
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000 (development) or http://localhost:5000 (production)
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### Running Tests

The project uses Jest for backend testing and React Testing Library for frontend testing.

**Run all tests (backend + frontend):**
```bash
npm test
```

**Run backend tests only:**
```bash
npm run test:server
```

**Run frontend tests only:**
```bash
npm run test:client
```

**Run tests in watch mode (for development):**
```bash
npm run test:watch
```

**Frontend tests in watch mode:**
```bash
cd client
npm test
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run production server (requires build) |
| `npm run dev` | Run backend in development mode with nodemon |
| `npm run server` | Run backend in development mode |
| `npm run client` | Run React frontend in development mode |
| `npm run install-all` | Install all dependencies (root + client) |
| `npm run build` | Build React app for production |
| `npm test` | Run all tests (backend + frontend) |
| `npm run test:server` | Run backend tests only |
| `npm run test:client` | Run frontend tests only |
| `npm run test:watch` | Run backend tests in watch mode |

### Troubleshooting

**Port already in use:**
```bash
# Find process using port 5000 or 3000
lsof -i :5000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules
npm run install-all
```

**JWT_SECRET error:**
Make sure you've copied `.env.example` to `.env` and the JWT_SECRET is set.

**Tests failing:**
```bash
# Clear Jest cache
npx jest --clearCache

# Run tests with verbose output
npm test -- --verbose
```

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
├── jest.config.js        # Jest configuration for backend tests
├── .gitignore
├── package.json
└── README.md
```

### Test Structure

```
Tests/
├── server/
│   ├── routes/__tests__/
│   │   └── auth.test.js           # Auth API endpoint tests
│   └── middleware/__tests__/
│       └── auth.test.js           # Auth middleware tests
└── client/src/
    ├── components/__tests__/
    │   └── Layout.test.js         # Layout component tests
    ├── pages/__tests__/
    │   └── Login.test.js          # Login page tests
    ├── services/__tests__/
    │   └── api.test.js            # API service tests
    └── setupTests.js              # Test configuration
```

**Testing Technologies:**
- **Backend**: Jest + Supertest for API integration tests
- **Frontend**: Jest + React Testing Library for component tests
- **Coverage**: Run `npm test -- --coverage` to see test coverage reports

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

### Known Security Notes

1. **Multer Version**: The current version of multer (1.4.5-lts.1) has known vulnerabilities. For production use, upgrade to multer 2.x
2. **JWT Secret**: Always set a strong, unique JWT_SECRET in production environments. The application will fail to start in production mode without it.
3. **Rate Limiting**: Production deployments should implement rate limiting on all API endpoints to prevent abuse. Use `express-rate-limit` package.
4. **File Upload**: Consider adding magic number validation for uploaded files in production
5. **Database**: Replace in-memory storage with a proper database with parameterized queries to prevent SQL injection

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