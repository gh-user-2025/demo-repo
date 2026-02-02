const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { notifications } = require('../data/store');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all notifications for current user
router.get('/', auth, (req, res) => {
  try {
    const userNotifications = notifications.filter(n => n.userId === req.userId);
    res.json(userNotifications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', auth, (req, res) => {
  try {
    const notification = notifications.find(n => n.id === req.params.id && n.userId === req.userId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error updating notification' });
  }
});

// Mark all notifications as read
router.put('/read-all', auth, (req, res) => {
  try {
    notifications
      .filter(n => n.userId === req.userId)
      .forEach(n => n.read = true);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating notifications' });
  }
});

// Delete notification
router.delete('/:id', auth, (req, res) => {
  try {
    const notificationIndex = notifications.findIndex(
      n => n.id === req.params.id && n.userId === req.userId
    );
    
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notifications.splice(notificationIndex, 1);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting notification' });
  }
});

module.exports = router;
