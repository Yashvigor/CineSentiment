import { useState, useEffect } from 'react';
import { getTrendingAPI } from '../services/api';

/**
 * useTrending — fetches trending movies list
 * Returns: { movies, loading, error }
 */
const useTrending = () => {
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getTrendingAPI();
        setMovies(data || []);
      } catch (err) {
        setError('Failed to load trending');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { movies, loading, error };
};

export default useTrending;
