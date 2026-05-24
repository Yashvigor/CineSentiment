const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId:               { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  movieId:              { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  imdbID:               { type: String, required: true, index: true }, // back-compatibility
  movieTitle:           { type: String, required: true },
  analysisType:         { type: String, default: 'sentiment' },
  totalReviewsAnalyzed: { type: Number },
  positiveReviews:      { type: Number },
  negativeReviews:      { type: Number },
  overallSentiment:     { type: String },
  averageConfidence:    { type: Number },
  summary: { // back-compatibility
    positive: { type: Number },
    negative: { type: Number },
    neutral:  { type: Number },
  },
  topKeywords:          [{ word: String, count: Number, sentiment: String }], // back-compatibility
  aiSummary:            { type: String },
  processingTimeMs:     { type: Number },
  createdAt:            { type: Date, default: Date.now, index: true }
});

analysisSchema.index({ imdbID: 1, createdAt: -1 });

module.exports = mongoose.model('Analysis', analysisSchema);
