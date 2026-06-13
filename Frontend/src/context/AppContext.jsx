import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_history')) || []; } catch { return []; } });
  const [savedMovies, setSavedMovies] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_saved')) || []; } catch { return []; } });
  const [analysisHistory, setAnalysisHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_analysis')) || []; } catch { return []; } });
  const [toasts, setToasts] = useState([]);

  // Toast actions
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Local storage synchronization
  useEffect(() => { localStorage.setItem('cs_history', JSON.stringify(searchHistory)); }, [searchHistory]);
  useEffect(() => { localStorage.setItem('cs_saved', JSON.stringify(savedMovies)); }, [savedMovies]);
  useEffect(() => { localStorage.setItem('cs_analysis', JSON.stringify(analysisHistory)); }, [analysisHistory]);

  const addSearchHistory = (q) => {
    setSearchHistory(prev => [q, ...prev.filter(h => h !== q)].slice(0, 10));
  };

  const saveMovie = (m) => {
    const exists = savedMovies.find(x => x.imdbID === m.imdbID);
    if (!exists) {
      setSavedMovies(prev => [m, ...prev].slice(0, 50));
      addToast(`Saved "${m.Title}" to your bookmarks`, 'success');
    }
  };

  const unsaveMovie = (id) => {
    const movie = savedMovies.find(x => x.imdbID === id);
    const title = movie ? movie.Title : 'Movie';
    setSavedMovies(prev => prev.filter(m => m.imdbID !== id));
    addToast(`Removed "${title}" from bookmarks`, 'info');
  };

  const isMovieSaved = (id) => savedMovies.some(m => m.imdbID === id);

  const addAnalysis = (entry) => {
    // Prevent duplicate logs in history
    setAnalysisHistory(prev => {
      const filtered = prev.filter(x => x.imdbID !== entry.imdbID);
      return [entry, ...filtered].slice(0, 30);
    });
  };

  return (
    <AppContext.Provider value={{
      searchHistory,
      addSearchHistory,
      savedMovies,
      saveMovie,
      unsaveMovie,
      isMovieSaved,
      analysisHistory,
      addAnalysis,
      toasts,
      addToast,
      removeToast
    }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>
                {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span>{t.message}</span>
            </div>
            <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', opacity: 0.6, fontSize: '18px', padding: '0 4px' }}>×</button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};
