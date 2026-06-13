import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage        from './pages/HomePage';
import MoviesPage      from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import AnalyticsPage   from './pages/AnalyticsPage';
import AboutPage       from './pages/AboutPage';

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/movies"     element={<MoviesPage />} />
        <Route path="/movie/:id"  element={<MovieDetailPage />} />
        <Route path="/analytics"  element={<AnalyticsPage />} />
        <Route path="/about"      element={<AboutPage />} />
        <Route path="*"           element={<HomePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </AppProvider>
);

export default App;
