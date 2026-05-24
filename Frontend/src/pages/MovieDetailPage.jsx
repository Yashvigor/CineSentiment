import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Award, Bookmark, BookmarkCheck, ArrowLeft, Brain } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import useMovieDetails from '../hooks/useMovieDetails';
import useSentiment from '../hooks/useSentiment';
import { posterUrl } from '../services/api';

// ── Sentiment badge ────────────────────────────────────────────────────────────
const Badge = ({ s }) => {
  const cfg = { positive: ['#22c55e', 'Positive'], negative: ['#ef4444', 'Negative'], neutral: ['#eab308', 'Neutral'] };
  const [c, label] = cfg[s] || ['#94a3b8', s];
  return (
    <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 800, background: `${c}20`, border: `1px solid ${c}50`, color: c, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
      {label}
    </span>
  );
};

// ── Review card ────────────────────────────────────────────────────────────────
const ReviewCard = ({ review, index }) => {
  const s = review.analysis?.sentiment || 'neutral';
  const borderColors = { positive: '#22c55e', negative: '#ef4444', neutral: '#eab308' };
  const textColors   = { positive: 'rgba(134,239,172,0.9)', negative: 'rgba(252,165,165,0.95)', neutral: 'rgba(255,255,200,0.9)' };
  const bc = borderColors[s];
  const tc = textColors[s];

  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}
      className="glass" style={{ padding: '20px 24px', borderRadius: 16, borderLeft: `4px solid ${bc}` }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{review.author}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
            {Array.from({ length: Math.min(review.rating, 10) }).map((_, j) => (
              <Star key={j} size={11} color="#f59e0b" fill="#f59e0b" />
            ))}
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginLeft: 4 }}>{review.rating}/10</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginLeft: 8 }}>{review.date}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge s={s} />
          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>{review.analysis?.confidence}% confidence</span>
        </div>
      </div>

      {/* Review text — color coded */}
      <p style={{ color: tc, fontSize: 14, lineHeight: 1.85 }}>{review.text}</p>

      {/* Sentiment bar */}
      <div style={{ marginTop: 12 }}>
        <div className="progress-track">
          <div className="progress-green" style={{ width: `${review.analysis?.positive || 50}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ color: '#22c55e' }}>Positive {review.analysis?.positive}%</span>
          <span style={{ color: '#ef4444' }}>Negative {review.analysis?.negative}%</span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main page ──────────────────────────────────────────────────────────────────
const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saveMovie, unsaveMovie, isMovieSaved, addAnalysis } = useApp();
  const { movie, loading: mLoading } = useMovieDetails(id);
  const { data: sentData, loading: sLoading } = useSentiment(id, movie?.Title);
  const [tab, setTab] = useState('reviews');
  const saved = isMovieSaved(id);

  // Save analysis to context once loaded
  React.useEffect(() => {
    if (sentData && movie) {
      addAnalysis({ movie: movie.Title, imdbID: id, date: new Date().toISOString(), summary: sentData.summary });
    }
  }, [sentData?.counts?.total]);

  if (mLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 70 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(229,9,20,0.25)', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 14px' }} />
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading movie from IMDB...</p>
      </div>
    </div>
  );

  if (!movie) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 70, textAlign: 'center' }}>
      <div><p style={{ fontSize: 48 }}>🎬</p><h3 style={{ marginTop: 12 }}>Movie not found</h3>
        <button onClick={() => navigate(-1)} className="btn-primary" style={{ marginTop: 20, padding: '10px 24px' }}>Go Back</button></div>
    </div>
  );

  const pieData = sentData ? [
    { name: 'Positive', value: sentData.summary.positive, color: '#22c55e' },
    { name: 'Negative', value: sentData.summary.negative, color: '#ef4444' },
    { name: 'Neutral',  value: sentData.summary.neutral,  color: '#eab308' },
  ] : [];

  const tt = { contentStyle: { background: 'rgba(15,15,22,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white' } };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 70 }}>
      {/* Cinematic banner */}
      <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <img src={posterUrl(movie.Poster, movie.Title)} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) brightness(0.25)', transform: 'scale(1.1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.3), rgba(10,10,15,1))' }} />
        <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
          <button onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: 'white', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 14, backdropFilter: 'blur(8px)' }}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Movie header */}
        <div style={{ display: 'flex', gap: 32, marginTop: -80, marginBottom: 40, flexWrap: 'wrap' }}>
          <img src={posterUrl(movie.Poster, movie.Title)} alt={movie.Title}
            style={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.7)', flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)', zIndex: 1 }}
            onError={e => { e.target.src = posterUrl(null, movie.Title); }} />

          <div style={{ flex: 1, minWidth: 260, paddingTop: 90, zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
              <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(1.6rem,4vw,2.5rem)', color: 'white' }}>
                {movie.Title} <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6em', fontWeight: 400 }}>({movie.Year})</span>
              </h1>
              <button onClick={() => saved ? unsaveMovie(movie.imdbID) : saveMovie(movie)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: saved ? 'rgba(229,9,20,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${saved ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.14)'}`, color: saved ? '#e50914' : 'white', borderRadius: 12, cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s', flexShrink: 0 }}>
                {saved ? <BookmarkCheck size={15}/> : <Bookmark size={15}/>} {saved ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Metadata row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 14, color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={13}/> {movie.Runtime}</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><Calendar size={13}/> {movie.Released}</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><Star size={13} color="#f59e0b" fill="#f59e0b"/> {movie.imdbRating}/10</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><Award size={13}/> {movie.Rated}</span>
            </div>

            {/* Genre tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 14 }}>
              {movie.Genre?.split(',').map(g => (
                <span key={g} style={{ padding: '4px 12px', background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, color: '#a78bfa', fontSize: 12, fontWeight: 600 }}>{g.trim()}</span>
              ))}
            </div>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.8, maxWidth: 650, marginBottom: 12 }}>{movie.Plot}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Director:</strong> {movie.Director}&emsp;
              <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Cast:</strong> {movie.Actors}
            </p>
            {movie.Awards && movie.Awards !== 'N/A' && (
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 6 }}>
                <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Awards:</strong> {movie.Awards}
              </p>
            )}
          </div>
        </div>

        {/* Sentiment overview cards */}
        {sLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
            {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 16 }} />)}
          </div>
        ) : sentData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Positive Reviews', pct: sentData.summary.positive, count: sentData.counts.positive, icon: '😊', c: '#22c55e' },
              { label: 'Negative Reviews', pct: sentData.summary.negative, count: sentData.counts.negative, icon: '😞', c: '#ef4444' },
              { label: 'Neutral Reviews',  pct: sentData.summary.neutral,  count: sentData.counts.neutral,  icon: '😐', c: '#eab308' },
              { label: 'AI Confidence',    pct: sentData.avgConfidence,     count: sentData.counts.total,    icon: '🧠', c: '#8b5cf6' },
            ].map((card, i) => (
              <div key={i} className="glass" style={{ padding: '20px 24px', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 6 }}>{card.icon}</div>
                <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, color: card.c }}>{card.pct}%</div>
                <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{card.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 }}>from {card.count} reviews</div>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        {sentData && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }} className="grid-2">
            <div className="glass" style={{ padding: 28, borderRadius: 20 }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Sentiment Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={v=>[`${v}%`]} {...tt} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: d.color }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{d.name}: {d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass" style={{ padding: 28, borderRadius: 20 }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 17, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Brain size={17} color="#8b5cf6" /> AI Keyword Analysis
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
                {sentData.topKeywords?.slice(0, 14).map(kw => (
                  <span key={kw.word} className="word-cloud-item"
                    style={{ fontSize: Math.max(11, Math.min(20, 11 + kw.count * 2)), background: kw.sentiment === 'positive' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: kw.sentiment === 'positive' ? '#22c55e' : '#ef4444', border: `1px solid ${kw.sentiment === 'positive' ? 'rgba(34,197,94,0.28)' : 'rgba(239,68,68,0.28)'}` }}>
                    {kw.word}
                  </span>
                ))}
              </div>
              <div className="progress-track">
                <div className="progress-green" style={{ width: `${sentData.summary.positive}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ color: '#22c55e' }}>👍 {sentData.summary.positive}% positive</span>
                <span style={{ color: '#ef4444' }}>👎 {sentData.summary.negative}% negative</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, width: 'fit-content', marginBottom: 24 }}>
          {[['reviews', 'IMDB Reviews'], ['wordcloud', 'Word Cloud']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: '8px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, transition: 'all 0.2s', background: tab === key ? 'linear-gradient(135deg,#e50914,#f97316)' : 'transparent', color: tab === key ? 'white' : 'rgba(255,255,255,0.45)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Reviews list */}
        {tab === 'reviews' && (
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.4rem', marginBottom: 6 }}>
              REVIEWS — Sentiment Classified
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 20 }}>
              🟢 Green text = Positive sentiment &nbsp;|&nbsp; 🔴 Red text = Negative sentiment
            </p>
            {sLoading ? (
              Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16, marginBottom: 14 }} />)
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {sentData?.reviews.map((r, i) => <ReviewCard key={r.id || i} review={r} index={i} />)}
              </div>
            )}
          </div>
        )}

        {/* Word cloud tab */}
        {tab === 'wordcloud' && sentData && (
          <div className="glass" style={{ padding: 40, borderRadius: 20, marginBottom: 60, textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.4rem', marginBottom: 28 }}>Review Word Cloud</h3>
            {sentData.topKeywords?.map((kw, i) => (
              <span key={i} className="word-cloud-item"
                style={{ fontSize: Math.max(12, Math.min(34, 12 + kw.count * 4)), background: kw.sentiment === 'positive' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: kw.sentiment === 'positive' ? '#22c55e' : '#ef4444', border: `1px solid ${kw.sentiment === 'positive' ? 'rgba(34,197,94,0.28)' : 'rgba(239,68,68,0.28)'}` }}>
                {kw.word}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
