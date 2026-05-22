import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Sparkles, Brain, BarChart3, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import useTrending from '../hooks/useTrending';
import { posterUrl } from '../services/api';
import { searchMoviesAPI } from '../services/api';

const STATS = [
  { label: 'Movies Analyzed', end: 50000, suffix: '+', c: '#e50914', icon: '🎬' },
  { label: 'Reviews Processed', end: 2000000, suffix: '+', c: '#8b5cf6', icon: '📝' },
  { label: 'ML Accuracy', end: 94, suffix: '%', c: '#f97316', icon: '🎯' },
  { label: 'Daily Users', end: 12000, suffix: '+', c: '#06b6d4', icon: '👥' },
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
        const t = setInterval(() => { cur += step; if (cur >= end) { setN(end); clearInterval(t); } else setN(Math.floor(cur)); }, 40);
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
    }, 380);
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    addSearchHistory(q);
    navigate(`/movies?q=${encodeURIComponent(q)}`);
    setSuggestions([]);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 70 }}>
      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(229,9,20,0.14) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 40% at 80% 60%, rgba(139,92,246,0.08) 0%, transparent 60%)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 1, textAlign: 'center', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)', borderRadius: 40, marginBottom: 30 }}>
              <Sparkles size={13} color="#e50914" />
              <span style={{ color: '#e50914', fontSize: 13, fontWeight: 700 }}>AI-Powered Movie Sentiment Analysis</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontFamily: 'Outfit', fontSize: 'clamp(2.4rem,7vw,4.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 22 }}>
            <span style={{ color: 'white' }}>Understand Movie</span><br />
            <span style={{ background: 'linear-gradient(135deg,#e50914,#f97316,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Audience Emotions</span><br />
            <span style={{ color: 'white' }}>with AI</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(15px,2.5vw,19px)', maxWidth: 620, margin: '0 auto 44px', lineHeight: 1.75 }}>
            Search any movie → see all IMDB releases → get reviews classified as <span style={{ color: '#22c55e' }}>Positive</span> or <span style={{ color: '#ef4444' }}>Negative</span> using NLP.
          </motion.p>

          {/* Search bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ maxWidth: 620, margin: '0 auto 36px', position: 'relative' }}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', zIndex: 1 }} />
                  <input type="text" value={q} onChange={e => setQ(e.target.value)}
                    placeholder="Search any movie... e.g. Dunkirk"
                    className="cs-input" style={{ paddingLeft: 50, height: 56, fontSize: 16 }} autoComplete="off" />
                </div>
                <button type="submit" className="btn-primary" style={{ height: 56, padding: '0 30px', fontSize: 15, borderRadius: 14 }}>Analyze</button>
              </div>
            </form>

            {/* Autocomplete dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', top: '100%', left: 0, right: 90, marginTop: 6, background: 'rgba(15,15,22,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', zIndex: 50, backdropFilter: 'blur(20px)' }}>
                  {suggestions.map(m => (
                    <div key={m.imdbID} onClick={() => { navigate(`/movie/${m.imdbID}`); setSuggestions([]); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(229,9,20,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <img src={posterUrl(m.Poster, m.Title)} alt="" style={{ width: 32, height: 44, objectFit: 'cover', borderRadius: 5 }}
                        onError={e => e.target.style.display='none'} />
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>{m.Title}</p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{m.Year} • {m.imdbID}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 70 }}>
            <button onClick={() => navigate('/movies')} className="btn-secondary" style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} /> Explore Trends
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={16} /> View Dashboard
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, maxWidth: 860, margin: '0 auto' }}>
            {STATS.map((s, i) => (
              <div key={i} className="glass" style={{ padding: '22px 18px', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Outfit', fontSize: '1.9rem', fontWeight: 800, color: s.c }}><AnimCounter end={s.end} suffix={s.suffix} /></div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending carousel */}
      {trending.length > 0 && (
        <section style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.8rem' }}>🔥 Trending Now</h2>
            <button onClick={() => navigate('/movies')} className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>View All</button>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
            {trending.map(m => (
              <motion.div key={m.imdbID} whileHover={{ y: -8 }} onClick={() => navigate(`/movie/${m.imdbID}`)}
                style={{ flexShrink: 0, width: 160, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                  <img src={posterUrl(m.Poster, m.Title)} alt={m.Title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.07)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                    onError={e => { e.target.src = posterUrl(null, m.Title); }} />
                  {m.imdbRating && (
                    <div style={{ position: 'absolute', bottom: 6, left: 8, background: 'rgba(0,0,0,0.75)', borderRadius: 6, padding: '2px 7px', fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                      ⭐ {m.imdbRating}
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ color: 'white', fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 3 }}>{m.Title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{m.Year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.8rem', textAlign: 'center', marginBottom: 40 }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {[
              { n: '1', title: 'Search Movie', desc: 'Type any movie title and see all IMDB releases with IDs', icon: '🔍' },
              { n: '2', title: 'Pick Release', desc: 'Select the specific version (year) you want to analyze', icon: '📋' },
              { n: '3', title: 'NLP Analysis', desc: 'Our ML engine classifies every review as positive or negative', icon: '🧠' },
              { n: '4', title: 'Visual Results', desc: 'See charts, word clouds, and color-coded reviews instantly', icon: '📊' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="glass" style={{ padding: 28, borderRadius: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'Outfit', fontSize: '3rem', fontWeight: 900, color: 'rgba(229,9,20,0.08)', lineHeight: 1 }}>{f.n}</div>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
