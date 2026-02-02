const express = require('express');
const { projects, tasks, users, activityLogs } = require('../data/store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', auth, (req, res) => {
  try {
    // Get user's projects
    const userProjects = projects.filter(p => 
      p.ownerId === req.userId || p.teamMembers.includes(req.userId)
    );

    // Get user's tasks
    const userTasks = tasks.filter(t => 
      t.assignedTo === req.userId || t.createdBy === req.userId
    );

    // Calculate statistics
    const stats = {
      totalProjects: userProjects.length,
      activeProjects: userProjects.filter(p => p.status === 'active').length,
      totalTasks: userTasks.length,
      completedTasks: userTasks.filter(t => t.status === 'completed').length,
      inProgressTasks: userTasks.filter(t => t.status === 'in-progress').length,
      todoTasks: userTasks.filter(t => t.status === 'todo').length,
      overdueTasks: userTasks.filter(t => {
        return t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date();
      }).length
    };

    // Project status distribution
    const projectsByStatus = {
      active: userProjects.filter(p => p.status === 'active').length,
      completed: userProjects.filter(p => p.status === 'completed').length,
      onHold: userProjects.filter(p => p.status === 'on-hold').length
    };

    // Task priority distribution
    const tasksByPriority = {
      high: userTasks.filter(t => t.priority === 'high').length,
      medium: userTasks.filter(t => t.priority === 'medium').length,
      low: userTasks.filter(t => t.priority === 'low').length
    };

    // Recent activity
    const recentActivity = activityLogs
      .filter(log => {
        const project = projects.find(p => p.id === log.entityId);
        return project && (project.ownerId === req.userId || project.teamMembers.includes(req.userId));
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    res.json({
      stats,
      projectsByStatus,
      tasksByPriority,
      recentActivity
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Error fetching analytics' });
  }
});

// Get project analytics
router.get('/project/:projectId', auth, (req, res) => {
  try {
    const project = projects.find(p => p.id === req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const projectTasks = tasks.filter(t => t.projectId === req.params.projectId);

    const analytics = {
      totalTasks: projectTasks.length,
      completedTasks: projectTasks.filter(t => t.status === 'completed').length,
      inProgressTasks: projectTasks.filter(t => t.status === 'in-progress').length,
      todoTasks: projectTasks.filter(t => t.status === 'todo').length,
      totalEstimatedHours: projectTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0),
      totalActualHours: projectTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0),
      tasksByPriority: {
        high: projectTasks.filter(t => t.priority === 'high').length,
        medium: projectTasks.filter(t => t.priority === 'medium').length,
        low: projectTasks.filter(t => t.priority === 'low').length
      },
      tasksByAssignee: projectTasks.reduce((acc, task) => {
        if (task.assignedTo) {
          acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
        }
        return acc;
      }, {})
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project analytics' });
  }
});

// Get team workload
router.get('/workload', auth, (req, res) => {
  try {
    const workload = users.map(user => {
      const userTasks = tasks.filter(t => t.assignedTo === user.id);
      const activeTasks = userTasks.filter(t => t.status !== 'completed');
      const totalHours = activeTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

      return {
        userId: user.id,
        userName: user.name,
        activeTasks: activeTasks.length,
        totalEstimatedHours: totalHours,
        tasks: activeTasks
      };
    });

    res.json(workload);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching workload analytics' });
  }
});

module.exports = router;
