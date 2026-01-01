const express = require('express');
const { users } = require('../data/store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/', auth, (req, res) => {
  try {
    const userList = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      avatar: u.avatar
    }));
    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get user by ID
router.get('/:id', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

module.exports = router;
