import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_user')); } catch { return null; } });
  const [searchHistory, setSearchHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_history')) || []; } catch { return []; } });
  const [savedMovies, setSavedMovies] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_saved')) || []; } catch { return []; } });
  const [analysisHistory, setAnalysisHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('cs_analysis')) || []; } catch { return []; } });

  useEffect(() => { user ? localStorage.setItem('cs_user', JSON.stringify(user)) : localStorage.removeItem('cs_user'); }, [user]);
  useEffect(() => { localStorage.setItem('cs_history', JSON.stringify(searchHistory)); }, [searchHistory]);
  useEffect(() => { localStorage.setItem('cs_saved', JSON.stringify(savedMovies)); }, [savedMovies]);
  useEffect(() => { localStorage.setItem('cs_analysis', JSON.stringify(analysisHistory)); }, [analysisHistory]);

  const login = (u) => setUser(u);
  const logout = () => setUser(null);

  const addSearchHistory = (q) => setSearchHistory(prev => [q, ...prev.filter(h => h !== q)].slice(0, 10));

  const saveMovie = (m) => setSavedMovies(prev => prev.find(x => x.imdbID === m.imdbID) ? prev : [m, ...prev].slice(0, 50));
  const unsaveMovie = (id) => setSavedMovies(prev => prev.filter(m => m.imdbID !== id));
  const isMovieSaved = (id) => savedMovies.some(m => m.imdbID === id);

  const addAnalysis = (entry) => setAnalysisHistory(prev => [entry, ...prev].slice(0, 30));

  return (
    <AppContext.Provider value={{ user, login, logout, searchHistory, addSearchHistory, savedMovies, saveMovie, unsaveMovie, isMovieSaved, analysisHistory, addAnalysis }}>
      {children}
    </AppContext.Provider>
  );
};
