const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date:                         { type: String, required: true, unique: true, index: true }, // Format: YYYY-MM-DD
  totalMoviesAnalyzed:          { type: Number, default: 0 },
  totalReviewsProcessed:        { type: Number, default: 0 },
  positiveSentimentPercentage:  { type: Number, default: 0 },
  negativeSentimentPercentage:  { type: Number, default: 0 },
  mostAnalyzedGenre:            { type: String, default: 'N/A' },
  mostPositiveMovie:            { type: String, default: 'N/A' },
  mostNegativeMovie:            { type: String, default: 'N/A' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);
