import { useState, useEffect, useCallback, useRef } from 'react';
import { searchMoviesAPI } from '../services/api';

/**
 * useMovieSearch — debounced movie search returning all releases in a table
 * Returns: { results, loading, error, search, clear }
 */
const useMovieSearch = () => {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [query, setQuery]       = useState('');
  const debounceRef = useRef(null);

  const search = useCallback(async (q) => {
    const trimmed = q?.trim();
    setQuery(trimmed);
    if (!trimmed) { setResults([]); return; }

    setLoading(true);
    setError(null);
    try {
      const { data } = await searchMoviesAPI(trimmed);
      setResults(data.results || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((q) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 400);
  }, [search]);

  const clear = () => { setResults([]); setQuery(''); setError(null); };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return { results, loading, error, query, search, debouncedSearch, clear };
};

export default useMovieSearch;
