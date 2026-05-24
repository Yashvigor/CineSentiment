const mongoose = require('mongoose');
const { train } = require('../sentiment');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    
    // Auto-train the ML NLP Sentiment Classifier
    await train().catch(err => {
      console.error('⚠️ ML model auto-training failed:', err.message);
    });
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    console.log('⚠️  Running without database (in-memory mode)');
    // Don't exit — app still works with mock data
  }
};

module.exports = connectDB;
