import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Sparkles, Brain, BarChart3, Film, MessageSquare, Target, Users, Play, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import useTrending from '../hooks/useTrending';
import { posterUrl } from '../services/api';
import { searchMoviesAPI } from '../services/api';

const STATS = [
  { label: 'Movies Analyzed', end: 50840, suffix: '+', c: '#3b82f6', icon: <Film size={20} /> },
  { label: 'Reviews Processed', end: 2450000, suffix: '+', c: '#8b5cf6', icon: <MessageSquare size={20} /> },
  { label: 'ML Model Accuracy', end: 94, suffix: '%', c: '#22c55e', icon: <Target size={20} /> },
  { label: 'Active Users', end: 14200, suffix: '+', c: '#f59e0b', icon: <Users size={20} /> },
];

const AnimCounter = ({ end, suffix = '' }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const steps = 60, step = end / steps;
        let cur = 0;
        const t = setInterval(() => { cur += step; if (cur >= end) { setN(end); clearInterval(t); } else setN(Math.floor(cur)); }, 30);
      }
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
};

const HomePage = () => {
  const navigate = useNavigate();
  const { addSearchHistory } = useApp();
  const { movies: trending } = useTrending();
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debRef = useRef(null);

  useEffect(() => {
    if (!q.trim()) { setSuggestions([]); return; }
    clearTimeout(debRef.current);
    debRef.current = setTimeout(async () => {
      try { const { data } = await searchMoviesAPI(q); setSuggestions((data.results || []).slice(0, 6)); }
      catch { setSuggestions([]); }
    }, 350);
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    addSearchHistory(q);
    navigate(`/movies?q=${encodeURIComponent(q)}`);
    setSuggestions([]);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      {/* HERO SECTION */}
      <section style={{ display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '80px 0 60px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)' }} />
        
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: 20, marginBottom: 24 }}>
              <Sparkles size={13} color="var(--accent-primary)" />
              <span style={{ color: 'var(--accent-primary)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Sentiment Classifier</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, marginBottom: 18, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Understand Audience Sentiment<br />
            <span style={{ color: 'var(--accent-primary)' }}>Before You Watch</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 640, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Analyze real movie reviews using AI-powered Natural Language Processing and discover audience opinions instantly.
          </motion.p>

          {/* Large centered search component */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ maxWidth: 580, margin: '0 auto 28px', position: 'relative' }}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', zIndex: 1 }} />
                  <input type="text" value={q} onChange={e => setQ(e.target.value)}
                    placeholder="Search for a movie..."
                    className="cs-input" style={{ paddingLeft: 46, height: 50, fontSize: 15 }} autoComplete="off" />
                </div>
                <button type="submit" className="btn-primary" style={{ height: 50, padding: '0 24px', fontSize: 14 }}>Analyze</button>
              </div>
            </form>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, background: 'var(--card-bg)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden', zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                  {suggestions.map(m => (
                    <div key={m.imdbID} onClick={() => { navigate(`/movie/${m.imdbID}`); setSuggestions([]); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.15s ease' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor='rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
                      <img src={posterUrl(m.Poster, m.Title)} alt="" style={{ width: 28, height: 40, objectFit: 'cover', borderRadius: 4 }}
                        onError={e => e.target.style.display='none'} />
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{m.Title}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{m.Year} • {m.imdbID}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <button onClick={() => navigate('/movies')} className="btn-primary" style={{ height: 44, padding: '0 24px', fontSize: 14 }}>
              Analyze Movies <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate('/analytics')} className="btn-secondary" style={{ height: 44, padding: '0 24px', fontSize: 14 }}>
              View Analytics
            </button>
          </motion.div>

          {/* Metric Cards Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
            {STATS.map((s, i) => (
              <div key={i} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: `${s.c}12`, display: 'flex', alignItems: 'center', justifycontent: 'center', color: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  {s.icon}
                </div>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  <AnimCounter end={s.end} suffix={s.suffix} />
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TRENDING MOVIES SECTION */}
      {trending.length > 0 && (
        <section style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)' }}>Trending Movies</h2>
            </div>
            <button onClick={() => navigate('/movies')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>View All</button>
          </div>

          {/* 4 columns desktop layout */}
          <div className="grid-cols-4" style={{ gap: 16 }}>
            {trending.slice(0, 4).map(m => (
              <motion.div key={m.imdbID} whileHover={{ y: -4 }}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: 260, overflow: 'hidden', position: 'relative', cursor: 'pointer' }} onClick={() => navigate(`/movie/${m.imdbID}`)}>
                  <img src={posterUrl(m.Poster, m.Title)} alt={m.Title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                    onError={e => { e.target.src = posterUrl(null, m.Title); }} />
                  {m.imdbRating && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700, color: 'var(--neutral)', border: '1px solid var(--border-subtle)' }}>
                      ⭐ {m.imdbRating}
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 700, lineHeight: 1.3, cursor: 'pointer' }} onClick={() => navigate(`/movie/${m.imdbID}`)}>{m.Title}</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>{m.Year}</p>
                  </div>
                  <button onClick={() => navigate(`/movie/${m.imdbID}`)} className="btn-secondary" style={{ width: '100%', fontSize: 12, padding: '6px 12px', display: 'flex', gap: 6 }}>
                    <Play size={12} fill="white" /> Analyze
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* HOW IT WORKS SECTION */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.005)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.5rem', textAlign: 'center', marginBottom: 44, color: 'var(--text-primary)' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 20 }}>
            {[
              { n: '1', title: 'Search Movie', desc: 'Search any title to fetch live listings and metadata from IMDB.', icon: <Search size={22} color="var(--accent-primary)" /> },
              { n: '2', title: 'Analyze Reviews', desc: 'Our custom lexicon model classifies reviews based on sentiment syntax.', icon: <Brain size={22} color="#8b5cf6" /> },
              { n: '3', title: 'View AI Insights', desc: 'Interact with visual sentiment trends, distributions, and keyword clouds.', icon: <BarChart3 size={22} color="#22c55e" /> },
            ].map((f, i) => (
              <div key={i} className="card" style={{ padding: 24, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255, 255, 255, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                <div style={{ position: 'absolute', bottom: 12, right: 16, fontFamily: 'Plus Jakarta Sans', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.02)', lineHeight: 1 }}>{f.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
