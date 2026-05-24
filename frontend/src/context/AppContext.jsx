import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  saveMovieAPI,
  unsaveMovieAPI,
  getSavedMoviesAPI,
  getSearchHistoryAPI,
  getHistoryAPI
} from '../services/api';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_user')); } catch { return null; } });
  const [searchHistory, setSearchHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_history')) || []; } catch { return []; } });
  const [savedMovies, setSavedMovies] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_saved')) || []; } catch { return []; } });
  const [analysisHistory, setAnalysisHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_analysis')) || []; } catch { return []; } });

  // Local storage synchronization (used as backup/fallback)
  useEffect(() => { user ? localStorage.setItem('cs_user', JSON.stringify(user)) : localStorage.removeItem('cs_user'); }, [user]);
  useEffect(() => { localStorage.setItem('cs_history', JSON.stringify(searchHistory)); }, [searchHistory]);
  useEffect(() => { localStorage.setItem('cs_saved', JSON.stringify(savedMovies)); }, [savedMovies]);
  useEffect(() => { localStorage.setItem('cs_analysis', JSON.stringify(analysisHistory)); }, [analysisHistory]);

  const syncWithBackend = async () => {
    if (!user) return;
    try {
      const [savedRes, historyRes, analysisRes] = await Promise.all([
        getSavedMoviesAPI().catch(() => ({ data: [] })),
        getSearchHistoryAPI().catch(() => ({ data: [] })),
        getHistoryAPI().catch(() => ({ data: [] }))
      ]);
      
      if (savedRes?.data) setSavedMovies(savedRes.data);
      if (historyRes?.data) setSearchHistory(historyRes.data);
      if (analysisRes?.data) setAnalysisHistory(analysisRes.data);
    } catch (err) {
      console.warn('Real-time database sync suspended: running in off-grid mode', err);
    }
  };

  // Sync databases whenever the authenticated identity changes
  useEffect(() => {
    if (user) {
      syncWithBackend();
    } else {
      // Clear in-memory lists on logout to prevent state leaks
      setSavedMovies([]);
      setSearchHistory([]);
      setAnalysisHistory([]);
    }
  }, [user]);

  const login = (u) => setUser(u);
  
  const logout = () => {
    localStorage.removeItem('cs_token');
    setUser(null);
  };

  const addSearchHistory = (q) => {
    setSearchHistory(prev => [q, ...prev.filter(h => h !== q)].slice(0, 10));
    // When logged in, backend movieController logs search query during /movies/search API call
  };

  const saveMovie = async (m) => {
    if (user) {
      try {
        await saveMovieAPI(m.imdbID);
      } catch (err) {
        console.error('Failed to register bookmark to database:', err);
      }
    }
    setSavedMovies(prev => prev.find(x => x.imdbID === m.imdbID) ? prev : [m, ...prev].slice(0, 50));
  };

  const unsaveMovie = async (id) => {
    if (user) {
      try {
        await unsaveMovieAPI(id);
      } catch (err) {
        console.error('Failed to remove bookmark from database:', err);
      }
    }
    setSavedMovies(prev => prev.filter(m => m.imdbID !== id));
  };

  const isMovieSaved = (id) => savedMovies.some(m => m.imdbID === id);

  const addAnalysis = (entry) => {
    setAnalysisHistory(prev => [entry, ...prev].slice(0, 30));
    // When running reviews analysis, backend automatically saves to database and populates logs
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      searchHistory,
      addSearchHistory,
      savedMovies,
      saveMovie,
      unsaveMovie,
      isMovieSaved,
      analysisHistory,
      addAnalysis,
      syncWithBackend
    }}>
      {children}
    </AppContext.Provider>
  );
};
