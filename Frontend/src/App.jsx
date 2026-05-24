import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage        from './pages/HomePage';
import MoviesPage      from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import DashboardPage   from './pages/DashboardPage';
import AnalyticsPage   from './pages/AnalyticsPage';
import ProfilePage     from './pages/ProfilePage';
import AdminPage       from './pages/AdminPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import AboutPage       from './pages/AboutPage';

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/movies"     element={<MoviesPage />} />
        <Route path="/movie/:id"  element={<MovieDetailPage />} />
        <Route path="/dashboard"  element={<DashboardPage />} />
        <Route path="/analytics"  element={<AnalyticsPage />} />
        <Route path="/profile"    element={<ProfilePage />} />
        <Route path="/admin"      element={<AdminPage />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/about"      element={<AboutPage />} />
        <Route path="*"           element={<HomePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </AppProvider>
);

export default App;
