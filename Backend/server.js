require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const authRoutes      = require('./routes/authRoutes');
const movieRoutes     = require('./routes/movieRoutes');
const reviewRoutes    = require('./routes/reviewRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth',      authRoutes);
app.use('/api/movies',    movieRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/', (req, res) => res.json({
  message: 'CineSentiment AI Backend',
  version: '1.0.0',
  status: 'running',
  endpoints: ['/api/auth', '/api/movies', '/api/reviews', '/api/analytics'],
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ CineSentiment Backend → http://localhost:${PORT}`);
});
