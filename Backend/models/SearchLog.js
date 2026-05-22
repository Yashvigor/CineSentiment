const mongoose = require('mongoose');

// Logs each search query for history & analytics
const searchLogSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  query:     { type: String, required: true, trim: true },
  resultCount: { type: Number, default: 0 },
  searchedAt:  { type: Date, default: Date.now, expires: '90d' }, // auto-delete after 90 days
});

searchLogSchema.index({ userId: 1, searchedAt: -1 });

module.exports = mongoose.model('SearchLog', searchLogSchema);
