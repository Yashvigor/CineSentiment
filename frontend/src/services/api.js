import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Movie APIs ────────────────────────────────────────────────────────────────
export const searchMoviesAPI   = (q)        => API.get('/movies/search', { params: { q } });
export const getMovieAPI       = (imdbId)   => API.get(`/movies/${imdbId}`);
export const getTrendingAPI    = ()         => API.get('/movies/trending');
export const saveMovieAPI      = (imdbId)   => API.post('/movies/save', { imdbId });
export const unsaveMovieAPI    = (imdbId)   => API.delete(`/movies/unsave/${imdbId}`);
export const getSavedMoviesAPI = ()         => API.get('/movies/saved');
export const getSearchHistoryAPI = ()       => API.get('/movies/history');

// ── Review APIs ───────────────────────────────────────────────────────────────
export const getReviewsAPI     = (imdbId, title) => API.get(`/reviews/${imdbId}`, { params: { title } });
export const getHistoryAPI     = ()         => API.get('/reviews/history');

// ── Auth APIs ─────────────────────────────────────────────────────────────────
export const registerAPI       = (data)     => API.post('/auth/register', data);
export const loginAPI          = (data)     => API.post('/auth/login', data);
export const getMeAPI          = ()         => API.get('/auth/me');

// ── Analytics & Notifications APIs ────────────────────────────────────────────
export const getDashboardStatsAPI = ()      => API.get('/analytics/dashboard');
export const getMLMetricsAPI   = ()         => API.get('/analytics/metrics');
export const getNotificationsAPI = ()       => API.get('/analytics/notifications');
export const markNotificationReadAPI = (id) => API.put(`/analytics/notifications/${id}/read`);

// ── Helpers ───────────────────────────────────────────────────────────────────
export const posterUrl = (url, title = '') =>
  url ? url : `https://placehold.co/200x300/12121a/ffffff?text=${encodeURIComponent((title || '?').slice(0, 10))}`;

export default API;
