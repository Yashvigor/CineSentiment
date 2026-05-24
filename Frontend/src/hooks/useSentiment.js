import { useState, useEffect } from 'react';
import { getReviewsAPI } from '../services/api';

/**
 * useSentiment — fetches and returns NLP-classified reviews for a movie
 * Returns: { data, loading, error }
 * data = { reviews, summary, counts, avgConfidence, topKeywords }
 */
const useSentiment = (imdbId, movieTitle) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!imdbId) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await getReviewsAPI(imdbId, movieTitle || '');
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'Sentiment analysis failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [imdbId, movieTitle]);

  return { data, loading, error };
};

export default useSentiment;
