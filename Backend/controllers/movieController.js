const axios = require('axios');
const SearchLog = require('../models/SearchLog');

const OMDB_KEY = process.env.OMDB_API_KEY || 'trilogy';
const OMDB_URL = 'https://www.omdbapi.com';

const omdb = async (params) => {
  try {
    const { data } = await axios.get(OMDB_URL, { params: { apikey: OMDB_KEY, ...params }, timeout: 8000 });
    return data?.Response === 'True' ? data : null;
  } catch { return null; }
};

// GET /api/movies/search?q=title
// Returns table: [{imdbID, Title, Year, Poster}] — all releases for that title
const searchMovies = async (req, res) => {
  const { q } = req.query;
  if (!q?.trim()) return res.status(400).json({ error: 'Search query required' });

  try {
    // Fetch multiple pages to capture all releases of same title
    const pages = await Promise.all([1, 2, 3].map(p => omdb({ s: q, type: 'movie', page: p })));
    let results = [];
    pages.forEach(p => { if (p?.Search) results = [...results, ...p.Search]; });

    // Deduplicate by imdbID
    const unique = Array.from(new Map(results.map(m => [m.imdbID, m])).values());

    // Log to DB (non-blocking)
    SearchLog.create({ userId: req.user?._id || null, query: q, resultCount: unique.length }).catch(() => {});

    if (!unique.length) {
      return res.json({ results: mockSearch(), total: 4 });
    }

    res.json({
      results: unique.map(m => ({
        imdbID: m.imdbID,
        Title: m.Title,
        Year: m.Year,
        Poster: m.Poster !== 'N/A' ? m.Poster : null,
      })),
      total: unique.length,
    });
  } catch (err) {
    res.json({ results: mockSearch(), total: 4 });
  }
};

// GET /api/movies/:imdbId  — full movie details
const getMovieById = async (req, res) => {
  const { imdbId } = req.params;
  try {
    const data = await omdb({ i: imdbId, plot: 'full' });
    if (!data) return res.status(404).json({ error: 'Movie not found' });

    res.json({
      imdbID: data.imdbID,
      Title: data.Title,
      Year: data.Year,
      Rated: data.Rated,
      Released: data.Released,
      Runtime: data.Runtime,
      Genre: data.Genre,
      Director: data.Director,
      Writer: data.Writer,
      Actors: data.Actors,
      Plot: data.Plot,
      Language: data.Language,
      Country: data.Country,
      Awards: data.Awards,
      Poster: data.Poster !== 'N/A' ? data.Poster : null,
      Ratings: data.Ratings || [],
      imdbRating: data.imdbRating,
      imdbVotes: data.imdbVotes,
      BoxOffice: data.BoxOffice,
      Metascore: data.Metascore,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/movies/trending
const getTrending = async (req, res) => {
  const ids = ['tt0468569', 'tt1375666', 'tt0816692', 'tt5013056', 'tt7286456', 'tt15398776'];
  try {
    const movies = await Promise.all(ids.map(id => omdb({ i: id })));
    const valid = movies.filter(Boolean).map(m => ({
      imdbID: m.imdbID, Title: m.Title, Year: m.Year, Genre: m.Genre,
      Poster: m.Poster !== 'N/A' ? m.Poster : null, imdbRating: m.imdbRating,
    }));
    res.json(valid.length ? valid : mockTrending());
  } catch {
    res.json(mockTrending());
  }
};

// Fallbacks
const mockSearch = () => [
  { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Poster: null },
  { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Poster: null },
  { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Poster: null },
  { imdbID: 'tt5013056', Title: 'Dunkirk', Year: '2017', Poster: null },
];
const mockTrending = () => [
  { imdbID: 'tt0468569', Title: 'The Dark Knight', Year: '2008', Genre: 'Action, Crime', imdbRating: '9.0', Poster: null },
  { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Genre: 'Sci-Fi', imdbRating: '8.8', Poster: null },
  { imdbID: 'tt0816692', Title: 'Interstellar', Year: '2014', Genre: 'Sci-Fi, Drama', imdbRating: '8.6', Poster: null },
  { imdbID: 'tt5013056', Title: 'Dunkirk', Year: '2017', Genre: 'Action, Drama', imdbRating: '7.8', Poster: null },
];

module.exports = { searchMovies, getMovieById, getTrending };
