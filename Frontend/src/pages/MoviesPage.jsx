import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film, ExternalLink, ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import useMovieSearch from '../hooks/useMovieSearch';
import useTrending from '../hooks/useTrending';
import { posterUrl } from '../services/api';

const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '60px 0' }}>
    <div style={{ width: 44, height: 44, border: '3px solid rgba(229,9,20,0.25)', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 14px' }} />
    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Searching IMDB...</p>
  </div>
);

const MoviesPage = () => {
  const navigate = useNavigate();
  const { addSearchHistory, searchHistory } = useApp();
  const { results, loading, error, search, query } = useMovieSearch();
  const { movies: trending, loading: trendLoading } = useTrending();
  const [inputVal, setInputVal] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = inputVal.trim();
    if (!q) return;
    addSearchHistory(q);
    setSearched(true);
    search(q);
  };

  const handleRowClick = (imdbID) => navigate(`/movie/${imdbID}`);
  const handleRecentClick = (q) => { setInputVal(q); setSearched(true); search(q); };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 90, maxWidth: 1200, margin: '0 auto', padding: '90px 24px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(2rem,5vw,2.8rem)', marginBottom: 8 }}>IMDB Movie Sentiment</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>Search any movie title to see all releases and analyze reviews</p>
      </div>

      {/* Search form */}
      <div className="glass" style={{ padding: '32px', borderRadius: 20, marginBottom: 32 }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
              <input
                id="movie-search-input"
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Enter Movie title... (e.g. Dunkirk, Inception)"
                className="cs-input"
                style={{ paddingLeft: 48, paddingRight: 16, height: 54, fontSize: 16 }}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ height: 54, padding: '0 32px', fontSize: 15, borderRadius: 14 }}>
              Search
            </button>
          </div>
          {/* Recent searches */}
          {searchHistory.length > 0 && !searched && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}><Clock size={12} style={{ marginRight: 4 }} />Recent:</span>
              {searchHistory.slice(0, 6).map(h => (
                <button key={h} type="button" onClick={() => handleRecentClick(h)}
                  style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(229,9,20,0.5)'; e.currentTarget.style.color='#e50914'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.6)'; }}>
                  {h}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Loading */}
      {loading && <Spinner />}

      {/* Search results — IMDB-style table */}
      {!loading && searched && results.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 40 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 18 }}>
              Results for "<span style={{ color: '#e50914' }}>{query}</span>" — {results.length} release{results.length !== 1 ? 's' : ''} found
            </h2>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Click title or row to analyze</span>
          </div>

          <div style={{ padding: '8px 0' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="cs-table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th>IMDB-ID</th>
                    <th>TITLE</th>
                    <th>YEAR of Release</th>
                    <th style={{ width: 140 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((movie, i) => (
                    <motion.tr key={movie.imdbID}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      onClick={() => handleRowClick(movie.imdbID)}>
                      <td style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{i + 1}</td>
                      <td><span className="imdb-id">{movie.imdbID}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {movie.Poster ? (
                            <img src={movie.Poster} alt="" style={{ width: 32, height: 44, objectFit: 'cover', borderRadius: 5 }}
                              onError={e => e.target.style.display='none'} />
                          ) : (
                            <div style={{ width: 32, height: 44, background: 'rgba(229,9,20,0.1)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Film size={14} color="rgba(229,9,20,0.6)" />
                            </div>
                          )}
                          <span className="movie-title">{movie.Title}</span>
                        </div>
                      </td>
                      <td><span className="year">{movie.Year}</span></td>
                      <td>
                        <button onClick={e => { e.stopPropagation(); handleRowClick(movie.imdbID); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'linear-gradient(135deg,#e50914,#f97316)', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                          Analyze <ChevronRight size={12} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            Source: OMDB / IMDB Database
          </div>
        </motion.div>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🎬</p>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>No movies found</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Try a different title or check your spelling</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#ef4444' }}>{error}</div>
      )}

      {/* Trending section (shown when not searching) */}
      {!searched && !loading && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Film size={18} color="#e50914" />
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 22 }}>Trending Movies</h2>
          </div>
          {trendLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 260, borderRadius: 14 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
              {trending.map((m, i) => (
                <motion.div key={m.imdbID} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -8 }}
                  onClick={() => handleRowClick(m.imdbID)}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ aspectRatio: '2/3', overflow: 'hidden', position: 'relative' }}>
                    <img src={posterUrl(m.Poster, m.Title)} alt={m.Title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.currentTarget.style.transform='scale(1.07)'}
                      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                      onError={e => { e.target.src = posterUrl(null, m.Title); }} />
                    <div style={{ position: 'absolute', bottom: 6, left: 8, background: 'rgba(0,0,0,0.75)', borderRadius: 6, padding: '2px 7px', fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                      ⭐ {m.imdbRating}
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ color: 'white', fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{m.Title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 3 }}>{m.Year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
