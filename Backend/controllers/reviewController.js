const { analyzeReviews } = require('../sentiment');
const { getReviewsForMovie } = require('../reviewsData');
const Analysis = require('../models/Analysis');

// GET /api/reviews/:imdbId?title=MovieTitle
const getReviews = async (req, res) => {
  const { imdbId } = req.params;
  const { title = '' } = req.query;

  try {
    const rawReviews = getReviewsForMovie(imdbId, title);
    const result = analyzeReviews(rawReviews);
    if (!result) return res.status(500).json({ error: 'Analysis failed' });

    // Persist analysis to MongoDB (upsert-style, non-blocking)
    Analysis.findOneAndUpdate(
      { imdbID: imdbId },
      {
        imdbID: imdbId,
        movieTitle: title || imdbId,
        userId: req.user?._id || null,
        summary: result.summary,
        totalReviews: result.counts.total,
        avgConfidence: result.avgConfidence,
        topKeywords: result.topKeywords.slice(0, 15),
        analyzedAt: new Date(),
      },
      { upsert: true, new: true }
    ).catch(() => {});

    res.json({
      imdbID: imdbId,
      reviews: result.analyzed,
      summary: result.summary,
      counts: result.counts,
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
      .select('imdbID movieTitle summary totalReviews analyzedAt')
      .sort({ analyzedAt: -1 })
      .limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getReviews, getAnalysisHistory };
