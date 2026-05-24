const { analyzeReviews } = require('../sentiment');
const { getReviewsForMovie } = require('../reviewsData');
const Analysis = require('../models/Analysis');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const Analytics = require('../models/Analytics');
const axios = require('axios');

const OMDB_KEY = process.env.OMDB_API_KEY || 'trilogy';
const OMDB_URL = 'https://www.omdbapi.com';

const omdb = async (params) => {
  try {
    const { data } = await axios.get(OMDB_URL, { params: { apikey: OMDB_KEY, ...params }, timeout: 8000 });
    return data?.Response === 'True' ? data : null;
  } catch { return null; }
};

// GET /api/reviews/:imdbId?title=MovieTitle
const getReviews = async (req, res) => {
  const { imdbId } = req.params;
  const { title = '' } = req.query;

  try {
    // 1. Ensure the Movie cache exists
    let movieObj = await Movie.findOne({ imdbId });
    if (!movieObj) {
      let data = await omdb({ i: imdbId, plot: 'full' });
      if (!data) {
        const { MOCK_DETAILS } = require('./movieController');
        if (MOCK_DETAILS && MOCK_DETAILS[imdbId]) {
          data = MOCK_DETAILS[imdbId];
        }
      }
      const cleanGenre = data?.Genre ? data.Genre.split(',').map(g => g.trim()) : [];
      const cleanActors = data?.Actors ? data.Actors.split(',').map(a => a.trim()) : [];
      const cleanRuntime = data?.Runtime ? parseInt(data.Runtime.replace(/[^0-9]/g, '')) || null : null;

      movieObj = await Movie.create({
        imdbId: data?.imdbID || imdbId,
        title: data?.Title || title || imdbId,
        year: data?.Year ? parseInt(data.Year) : null,
        genre: cleanGenre,
        director: data?.Director || 'N/A',
        actors: cleanActors,
        plot: data?.Plot || 'N/A',
        runtime: cleanRuntime,
        language: data?.Language || 'English',
        country: data?.Country || 'N/A',
        poster: data?.Poster !== 'N/A' ? data?.Poster : null,
        imdbRating: data?.imdbRating ? parseFloat(data.imdbRating) : null,
        released: data?.Released || 'N/A'
      });
    }

    // 2. Fetch and evaluate reviews using NLP engine
    const rawReviews = await getReviewsForMovie(imdbId, title || movieObj.title);
    const result = analyzeReviews(rawReviews);
    if (!result) return res.status(500).json({ error: 'Analysis failed' });

    // 3. Clear existing database reviews for this movie and store the fresh analyzed reviews
    await Review.deleteMany({ movieId: movieObj._id });
    
    const reviewPromises = result.analyzed.map(r => {
      const allKws = [...(r.analysis.keywords?.positive || []), ...(r.analysis.keywords?.negative || [])];
      return Review.create({
        movieId: movieObj._id,
        userId: req.user?._id || null,
        source: 'IMDb',
        reviewText: r.text || '',
        sentiment: r.analysis.sentiment,
        sentimentScore: r.analysis.score,
        confidenceScore: r.analysis.confidence,
        keywords: allKws,
        isSpam: false
      });
    });
    await Promise.all(reviewPromises);

    // 4. Update the aggregate sentiment scores on the Movie document
    const reviewsInDb = await Review.find({ movieId: movieObj._id });
    const totalReviews = reviewsInDb.length;
    const avgSentimentScore = totalReviews ? (reviewsInDb.reduce((acc, curr) => acc + curr.sentimentScore, 0) / totalReviews) : 0;
    const posCount = reviewsInDb.filter(r => r.sentiment === 'positive').length;
    const negCount = reviewsInDb.filter(r => r.sentiment === 'negative').length;
    const neuCount = reviewsInDb.filter(r => r.sentiment === 'neutral').length;
    const positivePercentage = totalReviews ? Math.round((posCount / totalReviews) * 100) : 0;
    const negativePercentage = totalReviews ? Math.round((negCount / totalReviews) * 100) : 0;
    const neutralPercentage = 100 - positivePercentage - negativePercentage;

    movieObj.totalReviews = totalReviews;
    movieObj.averageSentimentScore = parseFloat(avgSentimentScore.toFixed(3));
    movieObj.positivePercentage = positivePercentage;
    movieObj.negativePercentage = negativePercentage;
    await movieObj.save();

    // 5. Save detailed session metrics to the Analyses collection
    const processingTimeMs = Math.round(300 + Math.random() * 500); // simulated execution duration
    const overallSentiment = positivePercentage > negativePercentage ? 'positive' : (negativePercentage > positivePercentage ? 'negative' : 'neutral');

    await Analysis.findOneAndUpdate(
      { imdbID: imdbId },
      {
        userId: req.user?._id || null,
        movieId: movieObj._id,
        imdbID: imdbId,
        movieTitle: movieObj.title,
        analysisType: 'sentiment',
        totalReviewsAnalyzed: totalReviews,
        positiveReviews: posCount,
        negativeReviews: negCount,
        overallSentiment: overallSentiment,
        averageConfidence: result.avgConfidence,
        summary: {
          positive: positivePercentage,
          negative: negativePercentage,
          neutral: neutralPercentage
        },
        topKeywords: result.topKeywords.slice(0, 15),
        aiSummary: `Audience feedback for ${movieObj.title} is predominantly ${overallSentiment} with an average confidence level of ${result.avgConfidence}%. Frequent tags: ${result.topKeywords.slice(0, 3).map(k => k.word).join(', ')}.`,
        processingTimeMs: processingTimeMs,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    ).catch(() => {});

    // 6. Refresh the global day-wide Platform Analytics Cache
    const todayStr = new Date().toISOString().split('T')[0];
    const totalMoviesAnalyzed = await Movie.countDocuments({ totalReviews: { $gt: 0 } });
    const totalReviewsProcessed = await Review.countDocuments({});
    
    // Fetch average sentiment across all platform logs
    const allAnalyses = await Analysis.find({});
    const avgPos = allAnalyses.length ? Math.round(allAnalyses.reduce((acc, curr) => acc + (curr.summary?.positive || 0), 0) / allAnalyses.length) : 0;
    const avgNeg = allAnalyses.length ? Math.round(allAnalyses.reduce((acc, curr) => acc + (curr.summary?.negative || 0), 0) / allAnalyses.length) : 0;

    await Analytics.findOneAndUpdate(
      { date: todayStr },
      {
        date: todayStr,
        totalMoviesAnalyzed,
        totalReviewsProcessed,
        positiveSentimentPercentage: avgPos,
        negativeSentimentPercentage: avgNeg,
        mostAnalyzedGenre: movieObj.genre?.[0] || 'Drama',
        mostPositiveMovie: movieObj.title || 'Inception'
      },
      { upsert: true, new: true }
    ).catch(() => {});

    // 7. Output standard JSON payload to the UI
    res.json({
      imdbID: imdbId,
      reviews: result.analyzed,
      summary: {
        positive: positivePercentage,
        negative: negativePercentage,
        neutral: neutralPercentage
      },
      counts: {
        positive: posCount,
        negative: negCount,
        neutral: neuCount,
        total: totalReviews
      },
      avgConfidence: result.avgConfidence,
      topKeywords: result.topKeywords,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reviews/history — recent analyses from DB
const getAnalysisHistory = async (req, res) => {
  try {
    const history = await Analysis.find({})
      .select('imdbID movieTitle summary totalReviewsAnalyzed createdAt')
      .sort({ createdAt: -1 })
      .limit(20);

    const mapped = history.map(h => ({
      imdbID: h.imdbID,
      movie: h.movieTitle,
      date: h.createdAt,
      summary: h.summary,
      totalReviews: h.totalReviewsAnalyzed
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getReviews, getAnalysisHistory };
