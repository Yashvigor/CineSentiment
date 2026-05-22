const express = require('express');
const router = express.Router();
const { searchMovies, getMovieById, getTrending } = require('../controllers/movieController');
const { optionalAuth } = require('../middleware/auth');

router.get('/trending', getTrending);
router.get('/search', optionalAuth, searchMovies);
router.get('/:imdbId', getMovieById);

module.exports = router;
