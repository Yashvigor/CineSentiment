const mongoose = require('mongoose');

// Stores each sentiment analysis run — keyed by imdbID + userId
const analysisSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  imdbID:     { type: String, required: true, index: true },
  movieTitle: { type: String, required: true },
  movieYear:  { type: String },
  summary: {
    positive: { type: Number },   // percentage 0–100
    negative: { type: Number },
    neutral:  { type: Number },
  },
  totalReviews:  { type: Number },
  avgConfidence: { type: Number },
  topKeywords:   [{ word: String, count: Number, sentiment: String }],
  analyzedAt:    { type: Date, default: Date.now },
});

// Index for quick lookup by movie
analysisSchema.index({ imdbID: 1, analyzedAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
