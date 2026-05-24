const mongoose = require('mongoose');

const modelMetricsSchema = new mongoose.Schema({
  modelName:   { type: String, required: true, unique: true, index: true },
  accuracy:    { type: Number, required: true },
  precision:   { type: Number, required: true },
  recall:      { type: Number, required: true },
  f1Score:     { type: Number, required: true },
  datasetSize: { type: Number },
  trainedAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('ModelMetrics', modelMetricsSchema);
