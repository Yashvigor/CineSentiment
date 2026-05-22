import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookmarkCheck, Clock, Film, Trash2 } from 'lucide-react';
import { posterUrl } from '../services/api';

const ProfilePage = () => {
  const { user, savedMovies, unsaveMovie, analysisHistory } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '70px', textAlign: 'center' }}>
        <div>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</p>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '24px', marginBottom: '8px' }}>Please Sign In</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '24px' }}>You need an account to view your profile</p>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '10px 24px' }}>Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', maxWidth: '1200px', margin: '0 auto', padding: '90px 24px 60px' }}>
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass"
        style={{ padding: '40px', borderRadius: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg,#e50914,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 800, color: 'white', flexShrink: 0 }}>
          {user.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '2rem', marginBottom: '6px' }}>{user.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '16px' }}>{user.email}</p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Saved Movies', value: savedMovies.length, icon: <BookmarkCheck size={14} />, color: '#e50914' },
              { label: 'Analyses Run', value: analysisHistory.length, icon: <Film size={14} />, color: '#8b5cf6' },
              { label: 'Member Since', value: new Date(user.createdAt || Date.now()).toLocaleDateString('en', { month: 'short', year: 'numeric' }), icon: <Clock size={14} />, color: '#22c55e' },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                <span style={{ color: stat.color }}>{stat.icon}</span>
                <strong style={{ color: 'white' }}>{stat.value}</strong> {stat.label}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="grid-2">
        {/* Saved Movies */}
        <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookmarkCheck size={18} color="#e50914" /> Saved Movies
          </h2>
          {savedMovies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: '36px', marginBottom: '12px' }}>🎬</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>No saved movies yet. Browse and save your favorites!</p>
              <button onClick={() => navigate('/movies')} className="btn-primary" style={{ marginTop: '16px', padding: '8px 20px', fontSize: '14px' }}>Browse Movies</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {savedMovies.map(movie => (
                <div key={movie.imdbID} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', alignItems: 'center' }}>
                  <img src={posterUrl(movie.Poster, movie.Title)} alt="" style={{ width: '36px', height: '50px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }}
                    onClick={() => navigate(`/movie/${movie.imdbID}`)}
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/movie/${movie.imdbID}`)}>
                    <p style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{movie.Title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>{movie.Year}</p>
                  </div>
                  <button onClick={() => unsaveMovie(movie.imdbID)}
                    style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', padding: '6px', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.6)'}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis History */}
        <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.3rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#8b5cf6" /> Analysis History
          </h2>
          {analysisHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ fontSize: '36px', marginBottom: '12px' }}>📊</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>No analyses yet. Search a movie to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {analysisHistory.map((entry, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', cursor: 'pointer' }}
                  onClick={() => navigate(`/movie/${entry.imdbID}`)}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  <div>
                    <p style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{entry.movie}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 700 }}>+{entry.summary?.positive || 0}%</span>
                    <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: 700 }}>-{entry.summary?.negative || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
