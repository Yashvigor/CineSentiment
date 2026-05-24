const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  movieId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  source:          { type: String, default: 'IMDb' },
  reviewText:      { type: String, required: true },
  cleanedReview:   { type: String },
  sentiment:       { type: String, enum: ['positive', 'negative', 'neutral'], required: true, index: true },
  sentimentScore:  { type: Number },
  confidenceScore: { type: Number },
  emotion:         { type: String, default: 'neutral' },
  keywords:        [{ type: String }],
  language:        { type: String, default: 'English' },
  isSpam:          { type: Boolean, default: false },
  likes:           { type: Number, default: 0 },
  createdAt:       { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Review', reviewSchema);
