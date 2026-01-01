// In-memory data store for demo purposes
// In production, this would be replaced with a proper database

const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$10$XQJ5Y8K9mN.L3Q9X8Y.Z8.5Y8K9mN.L3Q9X8Y.Z8', // 'admin123' hashed
    name: 'Admin User',
    role: 'admin',
    avatar: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'manager@example.com',
    password: '$2a$10$XQJ5Y8K9mN.L3Q9X8Y.Z8.5Y8K9mN.L3Q9X8Y.Z8', // 'manager123' hashed
    name: 'Project Manager',
    role: 'manager',
    avatar: null,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'developer@example.com',
    password: '$2a$10$XQJ5Y8K9mN.L3Q9X8Y.Z8.5Y8K9mN.L3Q9X8Y.Z8', // 'dev123' hashed
    name: 'Developer',
    role: 'developer',
    avatar: null,
    createdAt: new Date().toISOString()
  }
];

const projects = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete redesign of company website',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    progress: 45,
    ownerId: '2',
    teamMembers: ['2', '3'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const tasks = [
  {
    id: '1',
    projectId: '1',
    title: 'Design mockups',
    description: 'Create initial design mockups for homepage',
    status: 'completed',
    priority: 'high',
    assignedTo: '3',
    dueDate: '2024-02-15',
    estimatedHours: 20,
    actualHours: 18,
    createdBy: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    projectId: '1',
    title: 'Implement frontend',
    description: 'Build responsive frontend components',
    status: 'in-progress',
    priority: 'high',
    assignedTo: '3',
    dueDate: '2024-03-30',
    estimatedHours: 80,
    actualHours: 45,
    createdBy: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const teams = [
  {
    id: '1',
    name: 'Development Team',
    description: 'Core development team',
    members: ['2', '3'],
    createdAt: new Date().toISOString()
  }
];

const documents = [];

const notifications = [
  {
    id: '1',
    userId: '3',
    title: 'New task assigned',
    message: 'You have been assigned to "Implement frontend"',
    type: 'task_assignment',
    read: false,
    createdAt: new Date().toISOString()
  }
];

const milestones = [
  {
    id: '1',
    projectId: '1',
    name: 'Design Phase Complete',
    description: 'All design mockups completed and approved',
    dueDate: '2024-02-28',
    status: 'completed',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    projectId: '1',
    name: 'Frontend Development Complete',
    description: 'All frontend components implemented',
    dueDate: '2024-04-30',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const activityLogs = [
  {
    id: '1',
    userId: '2',
    action: 'created_project',
    entityType: 'project',
    entityId: '1',
    description: 'Created project "Website Redesign"',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    userId: '2',
    action: 'created_task',
    entityType: 'task',
    entityId: '1',
    description: 'Created task "Design mockups"',
    timestamp: new Date().toISOString()
  }
];

module.exports = {
  users,
  projects,
  tasks,
  teams,
  documents,
  notifications,
  milestones,
  activityLogs
};
