const express = require('express');
const router = express.Router();
const {
  searchMovies,
  getMovieById,
  getTrending,
  saveMovie,
  unsaveMovie,
  getSavedMovies,
  getSearchHistory
} = require('../controllers/movieController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/trending', getTrending);
router.get('/search', optionalAuth, searchMovies);
router.get('/saved', protect, getSavedMovies);
router.get('/history', protect, getSearchHistory);
router.post('/save', protect, saveMovie);
router.delete('/unsave/:imdbId', protect, unsaveMovie);
router.get('/:imdbId', getMovieById);

module.exports = router;
