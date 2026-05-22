const express = require('express');
const router = express.Router();
const { getReviews, getAnalysisHistory } = require('../controllers/reviewController');
const { optionalAuth } = require('../middleware/auth');

router.get('/history', getAnalysisHistory);
router.get('/:imdbId', optionalAuth, getReviews);

module.exports = router;
