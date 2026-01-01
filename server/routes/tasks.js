const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { tasks, projects } = require('../data/store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all tasks for current user
router.get('/', auth, (req, res) => {
  try {
    const userTasks = tasks.filter(t => 
      t.assignedTo === req.userId || t.createdBy === req.userId
    );
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Get task by ID
router.get('/:id', auth, (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
});

// Create task
router.post('/', auth, (req, res) => {
  try {
    const { projectId, title, description, status, priority, assignedTo, dueDate, estimatedHours } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ error: 'Project ID and title are required' });
    }

    // Verify project exists
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const newTask = {
      id: uuidv4(),
      projectId,
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      estimatedHours: estimatedHours || 0,
      actualHours: 0,
      createdBy: req.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Update task
router.put('/:id', auth, (req, res) => {
  try {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = tasks[taskIndex];
    const updatedTask = {
      ...task,
      ...req.body,
      id: task.id,
      projectId: task.projectId,
      createdBy: task.createdBy,
      createdAt: task.createdAt,
      updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', auth, (req, res) => {
  try {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks.splice(taskIndex, 1);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

module.exports = router;
