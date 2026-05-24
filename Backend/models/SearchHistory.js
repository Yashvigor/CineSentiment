const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  searchQuery: { type: String, required: true, trim: true },
  movieId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', default: null, index: true },
  searchedAt:  { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
