const mongoose = require('mongoose');

const savedMovieSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  savedAt: { type: Date, default: Date.now }
});

// Compound index for uniqueness
savedMovieSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('SavedMovie', savedMovieSchema);
