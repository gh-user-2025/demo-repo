const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { teams } = require('../data/store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all teams
router.get('/', auth, (req, res) => {
  try {
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teams' });
  }
});

// Get team by ID
router.get('/:id', auth, (req, res) => {
  try {
    const team = teams.find(t => t.id === req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching team' });
  }
});

// Create team
router.post('/', auth, (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const newTeam = {
      id: uuidv4(),
      name,
      description: description || '',
      members: members || [],
      createdAt: new Date().toISOString()
    };

    teams.push(newTeam);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: 'Error creating team' });
  }
});

// Update team
router.put('/:id', auth, (req, res) => {
  try {
    const teamIndex = teams.findIndex(t => t.id === req.params.id);
    if (teamIndex === -1) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const team = teams[teamIndex];
    
    // Only allow specific fields to be updated
    const allowedUpdates = ['name', 'description', 'members'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedTeam = {
      ...team,
      ...updates,
      id: team.id,
      createdAt: team.createdAt
    };

    teams[teamIndex] = updatedTeam;
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Error updating team' });
  }
});

// Delete team
router.delete('/:id', auth, (req, res) => {
  try {
    const teamIndex = teams.findIndex(t => t.id === req.params.id);
    if (teamIndex === -1) {
      return res.status(404).json({ error: 'Team not found' });
    }

    teams.splice(teamIndex, 1);
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting team' });
  }
});

module.exports = router;
