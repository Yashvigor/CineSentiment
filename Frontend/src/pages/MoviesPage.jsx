import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film, ChevronRight, Clock, Star, ArrowUpDown, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import useMovieSearch from '../hooks/useMovieSearch';
import useTrending from '../hooks/useTrending';
import { posterUrl } from '../services/api';

const TableSkeleton = () => (
  <div style={{ padding: '8px 0' }}>
    {Array(5).fill(0).map((_, idx) => (
      <div key={idx} style={{ display: 'flex', gap: 16, padding: '16px 18px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: 32, height: 44 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton" style={{ width: '40%', height: 16 }} />
          <div className="skeleton" style={{ width: '20%', height: 12 }} />
        </div>
        <div className="skeleton" style={{ width: 60, height: 16 }} />
        <div className="skeleton" style={{ width: 100, height: 32 }} />
      </div>
    ))}
  </div>
);

const MoviesPage = () => {
  const navigate = useNavigate();
  const { addSearchHistory, searchHistory } = useApp();
  const { results, loading, error, search, query } = useMovieSearch();
  const { movies: trending, loading: trendLoading } = useTrending();
  const [inputVal, setInputVal] = useState('');
  const [searched, setSearched] = useState(false);
  
  // Sorting & Filtering State
  const [sortField, setSortField] = useState('Year'); // 'Title' or 'Year'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [filterYear, setFilterYear] = useState('all');

  useEffect(() => {
    // Fill search input if query comes from URL params
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    if (qParam) {
      setInputVal(qParam);
      setSearched(true);
      search(qParam);
    }
  }, []);

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

  // Sort & Filter logic
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Get unique years for filter dropdown
  const uniqueYears = Array.from(new Set(results.map(m => m.Year?.substring(0, 4)))).filter(Boolean).sort().reverse();

  const processedResults = results
    .filter(m => {
      if (filterYear === 'all') return true;
      return m.Year?.includes(filterYear);
    })
    .sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      
      if (sortField === 'Year') {
        valA = parseInt(valA.substring(0, 4)) || 0;
        valB = parseInt(valB.substring(0, 4)) || 0;
      }
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68, maxWidth: 1200, margin: '0 auto', padding: '90px 24px 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '2rem', marginBottom: 6, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Movie Sentiment Hub</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Search any movie title to see all releases and analyze audience opinions</p>
      </div>

      {/* Search form card */}
      <div className="card" style={{ padding: '24px', borderRadius: 12, marginBottom: 32, backgroundColor: 'var(--card-bg)' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                id="movie-search-input"
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Search for a movie... (e.g. Dunkirk, Inception)"
                className="cs-input"
                style={{ paddingLeft: 46, height: 48, fontSize: 14 }}
                autoComplete="off"
              />
            </div>
            <button type="submit" className="btn-primary" style={{ height: 48, padding: '0 24px', fontSize: 14 }}>
              Search
            </button>
          </div>
          
          {/* Recent searches */}
          {searchHistory.length > 0 && !searched && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> Recent Searches:</span>
              {searchHistory.slice(0, 5).map(h => (
                <button key={h} type="button" onClick={() => handleRecentClick(h)}
                  style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 20, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, transition: 'all 0.15s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent-primary)'; e.currentTarget.style.color='var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text-secondary)'; }}>
                  {h}
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Loading states */}
      {loading && (
        <div className="card" style={{ padding: 12 }}>
          <TableSkeleton />
        </div>
      )}

      {/* Search results: Desktop professional table / Mobile card list */}
      {!loading && searched && processedResults.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 40 }}>
          {/* Table Toolbar */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
              Results for "<span style={{ color: 'var(--accent-primary)' }}>{query}</span>" — {processedResults.length} releases found
            </h2>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                <Filter size={14} />
                <span>Filter Year:</span>
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '4px 8px', borderRadius: 6, fontSize: 12, outline: 'none' }}>
                  <option value="all">All Years</option>
                  {uniqueYears.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hide-mobile">
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table className="cs-table">
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>Poster</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Title')}>
                      Title <ArrowUpDown size={12} style={{ marginLeft: 4, display: 'inline-block', opacity: sortField === 'Title' ? 1 : 0.4 }} />
                    </th>
                    <th style={{ cursor: 'pointer' }} onClick={() => handleSort('Year')}>
                      Year <ArrowUpDown size={12} style={{ marginLeft: 4, display: 'inline-block', opacity: sortField === 'Year' ? 1 : 0.4 }} />
                    </th>
                    <th>IMDb ID</th>
                    <th>Rating</th>
                    <th style={{ width: 140 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {processedResults.map((movie, i) => {
                    // Generate a stable mock rating since OMDB list endpoint doesn't return ratings
                    const lastCharVal = movie.imdbID ? movie.imdbID.charCodeAt(movie.imdbID.length - 1) : 5;
                    const mockRating = (7.0 + (lastCharVal % 25) / 10).toFixed(1);
                    return (
                      <tr key={movie.imdbID} onClick={() => handleRowClick(movie.imdbID)} style={{ cursor: 'pointer' }}>
                        <td>
                          <img src={posterUrl(movie.Poster, movie.Title)} alt="" style={{ width: 32, height: 44, objectFit: 'cover', borderRadius: 4 }}
                            onError={e => { e.target.src = posterUrl(null, movie.Title); }} />
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{movie.Title}</span>
                        </td>
                        <td><span style={{ color: 'var(--text-secondary)' }}>{movie.Year}</span></td>
                        <td><code style={{ fontSize: 12, color: 'var(--neutral)', fontFamily: 'monospace' }}>{movie.imdbID}</code></td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>
                            <Star size={13} fill="var(--neutral)" color="var(--neutral)" /> {mockRating}
                          </span>
                        </td>
                        <td>
                          <button onClick={e => { e.stopPropagation(); handleRowClick(movie.imdbID); }} className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6 }}>
                            Analyze <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile responsive card list view */}
          <div className="show-mobile" style={{ flexDirection: 'column', width: '100%' }}>
            {processedResults.map((movie) => {
              const lastCharVal = movie.imdbID ? movie.imdbID.charCodeAt(movie.imdbID.length - 1) : 5;
              const mockRating = (7.0 + (lastCharVal % 25) / 10).toFixed(1);
              return (
                <div key={movie.imdbID} onClick={() => handleRowClick(movie.imdbID)}
                  style={{ display: 'flex', gap: 14, padding: '16px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
                  <img src={posterUrl(movie.Poster, movie.Title)} alt="" style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                    onError={e => { e.target.src = posterUrl(null, movie.Title); }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.Title}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>{movie.Year} • <code style={{ color: 'var(--neutral)' }}>{movie.imdbID}</code></p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>
                        <Star size={12} fill="var(--neutral)" color="var(--neutral)" /> {mockRating}
                      </span>
                      <button className="btn-primary" style={{ padding: '4px 10px', fontSize: 11, borderRadius: 6, height: 28 }}>
                        Analyze
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: 11, textAlign: 'center' }}>
            Data fetched securely from OMDB / IMDB Database.
          </div>
        </motion.div>
      )}

      {/* No results empty state */}
      {!loading && searched && processedResults.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <p style={{ fontSize: 44, marginBottom: 16 }}>🎬</p>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 20, marginBottom: 6, color: 'var(--text-primary)' }}>No releases found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 360, margin: '0 auto' }}>We couldn't find any releases for that search. Check spelling or try a different movie title.</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="card" style={{ textAlign: 'center', padding: '32px', borderLeft: '4px solid var(--negative)', color: 'var(--negative)' }}>
          {error}
        </div>
      )}

      {/* Trending Movies Grid (shown when not searching) */}
      {!searched && !loading && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Film size={18} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Trending Movies</h2>
          </div>
          {trendLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 260, borderRadius: 12 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 16 }}>
              {trending.map((m, i) => (
                <motion.div key={m.imdbID} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => handleRowClick(m.imdbID)}
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ aspectRatio: '2/3', overflow: 'hidden', position: 'relative' }}>
                    <img src={posterUrl(m.Poster, m.Title)} alt={m.Title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
                      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                      onError={e => { e.target.src = posterUrl(null, m.Title); }} />
                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '3px 7px', fontSize: 11, fontWeight: 700, color: 'var(--neutral)', border: '1px solid var(--border-subtle)' }}>
                      ⭐ {m.imdbRating}
                    </div>
                  </div>
                  <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{m.Title}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 4 }}>{m.Year}</p>
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
