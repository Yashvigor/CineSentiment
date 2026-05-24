const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  imdbId:      { type: String, required: true, unique: true, index: true },
  title:       { type: String, required: true, index: true },
  year:        { type: Number },
  genre:       [{ type: String }],
  director:    { type: String },
  actors:      [{ type: String }],
  plot:        { type: String },
  runtime:     { type: Number }, // runtime in minutes
  language:    { type: String },
  country:     { type: String },
  poster:      { type: String },
  imdbRating:  { type: Number },
  awards:      { type: String },
  boxOffice:   { type: String },
  released:    { type: String },
  totalReviews:          { type: Number, default: 0 },
  averageSentimentScore: { type: Number, default: 0 },
  positivePercentage:    { type: Number, default: 0 },
  negativePercentage:    { type: Number, default: 0 },
}, {
  timestamps: true
});

// Enable text search index on title, ignoring the language field for override
movieSchema.index({ title: 'text' }, { language_override: 'none' });

module.exports = mongoose.model('Movie', movieSchema);
