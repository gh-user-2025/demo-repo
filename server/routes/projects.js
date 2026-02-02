const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { projects, tasks, milestones } = require('../data/store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', auth, (req, res) => {
  try {
    const userProjects = projects.filter(p => 
      p.ownerId === req.userId || p.teamMembers.includes(req.userId)
    );
    res.json(userProjects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// Get project by ID
router.get('/:id', auth, (req, res) => {
  try {
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check access
    if (project.ownerId !== req.userId && !project.teamMembers.includes(req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project' });
  }
});

// Create project
router.post('/', auth, (req, res) => {
  try {
    const { name, description, startDate, endDate, teamMembers } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const newProject = {
      id: uuidv4(),
      name,
      description: description || '',
      status: 'active',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || null,
      progress: 0,
      ownerId: req.userId,
      teamMembers: teamMembers || [req.userId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
});

// Update project
router.put('/:id', auth, (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projects[projectIndex];
    
    // Check permission
    if (project.ownerId !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedProject = {
      ...project,
      ...req.body,
      id: project.id,
      ownerId: project.ownerId,
      createdAt: project.createdAt,
      updatedAt: new Date().toISOString()
    };

    projects[projectIndex] = updatedProject;
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Error updating project' });
  }
});

// Delete project
router.delete('/:id', auth, (req, res) => {
  try {
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projects[projectIndex];
    
    // Check permission
    if (project.ownerId !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    projects.splice(projectIndex, 1);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting project' });
  }
});

// Get project tasks
router.get('/:id/tasks', auth, (req, res) => {
  try {
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const projectTasks = tasks.filter(t => t.projectId === req.params.id);
    res.json(projectTasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Get project milestones
router.get('/:id/milestones', auth, (req, res) => {
  try {
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const projectMilestones = milestones.filter(m => m.projectId === req.params.id);
    res.json(projectMilestones);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching milestones' });
  }
});

module.exports = router;
