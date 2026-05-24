const Movie = require('../models/Movie');
const Review = require('../models/Review');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const ModelMetrics = require('../models/ModelMetrics');
const Notification = require('../models/Notification');

// GET /api/analytics/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalMovies = await Movie.countDocuments({ totalReviews: { $gt: 0 } });
    const totalReviews = await Review.countDocuments({});

    const todayStr = new Date().toISOString().split('T')[0];
    let dailyStats = await Analytics.findOne({ date: todayStr });

    if (!dailyStats) {
      dailyStats = {
        date: todayStr,
        totalMoviesAnalyzed: totalMovies,
        totalReviewsProcessed: totalReviews,
        positiveSentimentPercentage: 75,
        negativeSentimentPercentage: 25,
        mostAnalyzedGenre: 'Sci-Fi',
        mostPositiveMovie: 'Inception'
      };
    }

    res.json({
      totalUsers,
      totalMovies,
      totalReviews,
      globalAccuracy: 94,
      dailyStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/metrics
const getMLMetrics = async (req, res) => {
  try {
    let metrics = await ModelMetrics.find({});

    // Seed default tracking metrics if empty
    if (!metrics.length) {
      metrics = await ModelMetrics.create([
        { modelName: 'Logistic Regression v2.1', accuracy: 0.87, precision: 0.82, recall: 0.89, f1Score: 0.87, datasetSize: 25000 },
        { modelName: 'Naive Bayes v1.5', accuracy: 0.82, precision: 0.80, recall: 0.84, f1Score: 0.82, datasetSize: 18000 },
        { modelName: 'SVM Classifier v3.0', accuracy: 0.91, precision: 0.90, recall: 0.92, f1Score: 0.91, datasetSize: 45000 }
      ]);
    }

    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/notifications
const getNotifications = async (req, res) => {
  try {
    let list = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Seed welcoming alert if none present
    if (!list.length) {
      const welcome = await Notification.create({
        userId: req.user._id,
        title: 'Welcome to CineSentiment!',
        message: 'Explore sentiment trends on movies and save your favorites to get real-time highlights.',
        isRead: false
      });
      list = [welcome];
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/analytics/notifications/:id/read
const markNotificationRead = async (req, res) => {
  const { id } = req.params;
  try {
    const notify = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notify) return res.status(404).json({ error: 'Notification not found' });
    res.json({ success: true, notify });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardStats,
  getMLMetrics,
  getNotifications,
  markNotificationRead
};
