const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getMLMetrics,
  getNotifications,
  markNotificationRead
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', getDashboardStats);
router.get('/metrics', getMLMetrics);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
