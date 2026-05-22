import { useState, useEffect } from 'react';
import { getMovieAPI } from '../services/api';

/**
 * useMovieDetails — fetches full movie info by IMDB ID
 * Returns: { movie, loading, error }
 */
const useMovieDetails = (imdbId) => {
  const [movie,   setMovie]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!imdbId) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getMovieAPI(imdbId);
        if (!cancelled) setMovie(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || 'Failed to load movie');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [imdbId]);

  return { movie, loading, error };
};

export default useMovieDetails;
