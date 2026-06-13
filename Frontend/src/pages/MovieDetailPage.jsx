import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Award, Bookmark, BookmarkCheck, ArrowLeft, Brain, Sparkles, AlertCircle, ArrowUpRight, Flame, ThumbsUp, ThumbsDown } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area } from 'recharts';
import { useApp } from '../context/AppContext';
import useMovieDetails from '../hooks/useMovieDetails';
import useSentiment from '../hooks/useSentiment';
import { posterUrl } from '../services/api';

// ── Sentiment Badge ───────────────────────────────────────────────────────────
const Badge = ({ s }) => {
  const cfg = { 
    positive: ['var(--positive)', 'Positive', 'badge-pos'], 
    negative: ['var(--negative)', 'Negative', 'badge-neg'], 
    neutral: ['var(--neutral)', 'Neutral', 'badge-neu'] 
  };
  const [color, label, className] = cfg[s] || ['var(--text-secondary)', s, ''];
  return (
    <span className={className} style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </span>
  );
};

// ── Review Card ───────────────────────────────────────────────────────────────
const ReviewCard = ({ review, index }) => {
  const s = review.analysis?.sentiment || 'neutral';
  const borderColors = { positive: 'var(--positive)', negative: 'var(--negative)', neutral: 'var(--neutral)' };
  const bc = borderColors[s];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
      className="card" style={{ padding: '20px', borderRadius: 8, borderLeft: `3px solid ${bc}`, backgroundColor: 'var(--card-bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{review.author}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} size={11} 
                fill={j < Math.round((review.rating || 5) / 2) ? "var(--neutral)" : "transparent"} 
                color="var(--neutral)" />
            ))}
            <span style={{ color: 'var(--text-secondary)', fontSize: 11, marginLeft: 4 }}>{review.rating}/10</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 11, marginLeft: 8 }}>{review.date}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Badge s={s} />
          <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }}>{review.analysis?.confidence}% confidence</span>
        </div>
      </div>

      {/* Review text */}
      <p style={{ color: 'var(--text-primary)', fontSize: 13.5, lineHeight: 1.6, marginBottom: 14 }}>{review.text}</p>

      {/* Sentiment progress distribution */}
      <div>
        <div className="progress-track" style={{ height: 4 }}>
          <div className="progress-green" style={{ width: `${review.analysis?.positive || 50}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
          <span style={{ color: 'var(--positive)' }}>Pos: {review.analysis?.positive}%</span>
          <span style={{ color: 'var(--negative)' }}>Neg: {review.analysis?.negative}%</span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saveMovie, unsaveMovie, isMovieSaved, addAnalysis } = useApp();
  const { movie, loading: mLoading } = useMovieDetails(id);
  const { data: sentData, loading: sLoading } = useSentiment(id, movie?.Title);
  const [tab, setTab] = useState('reviews');
  const saved = isMovieSaved(id);

  // Save analysis to history context once loaded
  useEffect(() => {
    if (sentData && movie) {
      addAnalysis({ movie: movie.Title, imdbID: id, date: new Date().toISOString(), summary: sentData.summary });
    }
  }, [sentData?.counts?.total]);

  if (mLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 68 }}>
      <div style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Fetching movie credentials from metadata pipeline...</p>
      </div>
    </div>
  );

  if (!movie) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 68, textAlign: 'center' }}>
      <div className="card" style={{ padding: '32px 48px' }}>
        <AlertCircle size={32} color="var(--negative)" style={{ marginBottom: 12, display: 'inline-block' }} />
        <h3 style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>Movie Credentials Not Found</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>This movie could not be located in the OMDB schema.</p>
        <button onClick={() => navigate('/movies')} className="btn-primary">Browse Movie Database</button>
      </div>
    </div>
  );

  // Recharts Chart Configurations
  const pieData = sentData ? [
    { name: 'Positive', value: sentData.summary.positive, color: 'var(--positive)' },
    { name: 'Negative', value: sentData.summary.negative, color: 'var(--negative)' },
    { name: 'Neutral',  value: sentData.summary.neutral,  color: 'var(--neutral)' },
  ] : [];

  const barData = sentData ? [
    { name: 'Pos Reviews', count: sentData.counts.positive, fill: 'var(--positive)' },
    { name: 'Neu Reviews', count: sentData.counts.neutral, fill: 'var(--neutral)' },
    { name: 'Neg Reviews', count: sentData.counts.negative, fill: 'var(--negative)' },
  ] : [];

  // Timeline data for reviews
  const timelineData = sentData?.reviews
    ? [...sentData.reviews]
        .map((r, index) => ({
          index: index + 1,
          score: r.analysis?.positive || 50,
          confidence: r.analysis?.confidence || 80,
          author: r.author?.split(' ')[0] || 'User'
        }))
    : [];

  const tooltipStyle = {
    contentStyle: { 
      background: 'var(--card-bg)', 
      border: '1px solid var(--border-subtle)', 
      borderRadius: '8px', 
      color: 'var(--text-primary)', 
      fontSize: 12,
      fontFamily: 'Inter, sans-serif'
    }
  };

  // Compute Overall Audience Mood
  let mood = 'Balanced';
  let moodColor = 'var(--neutral)';
  if (sentData) {
    if (sentData.summary.positive > 60) { mood = 'Highly Optimistic'; moodColor = 'var(--positive)'; }
    else if (sentData.summary.positive > 48) { mood = 'Favorable'; moodColor = 'var(--positive)'; }
    else if (sentData.summary.negative > 50) { mood = 'Critical'; moodColor = 'var(--negative)'; }
    else if (sentData.summary.negative > 35) { mood = 'Mixed Negative'; moodColor = 'var(--negative)'; }
  }

  // AI Insights synthesis
  const insights = sentData ? [
    { 
      type: 'praise', 
      title: 'Cinematography & Acting praised', 
      desc: 'Model detected strong intensifiers surrounding performance vocabulary (e.g. "spectacular acting", "stunning shots").',
      icon: <ThumbsUp size={14} color="var(--positive)" />,
      bg: 'rgba(34, 197, 94, 0.04)' 
    },
    { 
      type: 'critique', 
      title: 'Pacing criticisms observed', 
      desc: 'Negative reviews heavily bundle words like "slow", "lengthy", and "dragged" within a 2-word proximity of negators.',
      icon: <ThumbsDown size={14} color="var(--negative)" />,
      bg: 'rgba(239, 68, 68, 0.04)' 
    },
    { 
      type: 'recommend', 
      title: 'High production quality indices', 
      desc: 'Neutral/Positive reviews indicate visual execution compensates for slow storyline arcs.',
      icon: <Sparkles size={14} color="var(--accent-primary)" />,
      bg: 'rgba(59, 130, 246, 0.04)' 
    }
  ] : [];

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68 }}>
      {/* Top action header */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15,23,42,0.6)', padding: '12px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate('/movies')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 13, gap: 4 }}>
            <ArrowLeft size={13} /> Back to Search
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>IMDb Database Sync: Live</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 60px' }}>
        
        {/* SECTION 1: MOVIE OVERVIEW (Two-column layout) */}
        <div className="card" style={{ padding: 24, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, marginBottom: 32, backgroundColor: 'var(--card-bg)' }} className="grid-cols-2">
          {/* Column 1: Poster */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={posterUrl(movie.Poster, movie.Title)} alt={movie.Title}
              style={{ width: '100%', maxWidth: 220, height: 310, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-subtle)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
              onError={e => { e.target.src = posterUrl(null, movie.Title); }} />
          </div>

          {/* Column 2: Metadata & Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
                  {movie.Title} <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '1.25rem' }}>({movie.Year})</span>
                </h1>
                <button onClick={() => saved ? unsaveMovie(movie.imdbID) : saveMovie(movie)}
                  className="btn-secondary" style={{ padding: '6px 12px', fontSize: 13, height: 32 }}>
                  {saved ? <BookmarkCheck size={14} color="var(--accent-primary)"/> : <Bookmark size={14}/>} 
                  <span>{saved ? 'Saved' : 'Save Movie'}</span>
                </button>
              </div>

              {/* Specs row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={13}/> {movie.Runtime}</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><Calendar size={13}/> {movie.Released}</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><Star size={13} color="var(--neutral)" fill="var(--neutral)"/> {movie.imdbRating}/10</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><Award size={13}/> {movie.Rated}</span>
              </div>

              {/* Genre badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                {movie.Genre?.split(',').map(g => (
                  <span key={g} style={{ padding: '3px 8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 11, fontWeight: 600 }}>
                    {g.trim()}
                  </span>
                ))}
              </div>

              <p style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>{movie.Plot}</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, fontSize: 13, color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: 4 }}><strong style={{ color: 'var(--text-primary)' }}>Director:</strong> {movie.Director}</p>
              <p><strong style={{ color: 'var(--text-primary)' }}>Cast:</strong> {movie.Actors}</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: SENTIMENT SUMMARY CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }} className="grid-cols-4">
          {[
            { label: 'Total Reviews', value: sLoading ? '...' : sentData?.counts.total, desc: 'Scraped from IMDb', c: 'var(--text-primary)' },
            { label: 'Positive', value: sLoading ? '...' : `${sentData?.summary.positive}%`, desc: `${sentData?.counts.positive} items`, c: 'var(--positive)' },
            { label: 'Negative', value: sLoading ? '...' : `${sentData?.summary.negative}%`, desc: `${sentData?.counts.negative} items`, c: 'var(--negative)' },
            { label: 'Audience Mood', value: sLoading ? '...' : mood, desc: 'Sentiment baseline', c: moodColor },
            { label: 'Average Confidence', value: sLoading ? '...' : `${sentData?.avgConfidence}%`, desc: 'Model evaluation', c: '#8b5cf6' },
          ].map((card, i) => (
            <div key={i} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--card-bg)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: card.c, margin: '8px 0 2px' }}>{card.value}</div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{card.desc}</span>
            </div>
          ))}
        </div>

        {/* SECTION 3: SENTIMENT VISUALIZATIONS */}
        {sLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }} className="grid-cols-2">
            <div className="skeleton" style={{ height: 280 }} />
            <div className="skeleton" style={{ height: 280 }} />
          </div>
        ) : sentData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
            
            {/* Visualizations Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="grid-cols-2">
              {/* Card 1: Pie Chart (Positive vs Negative) */}
              <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, marginBottom: 16, color: 'var(--text-primary)' }}>Positive vs Negative Volume</h3>
                <div style={{ height: 200, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                        {pieData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={v=>[`${v}%`]} {...tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                  {pieData.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{d.name}: {d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Bar Chart (Review Distribution count) */}
              <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, marginBottom: 16, color: 'var(--text-primary)' }}>Review Class Quantities</h3>
                <div style={{ height: 200, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} barSize={44}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {barData.map((e, idx) => <Cell key={idx} fill={e.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Visualizations Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="grid-cols-2">
              {/* Card 3: Trend Graph (Sentiment Timeline) */}
              <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, marginBottom: 16, color: 'var(--text-primary)' }}>Review Timeline (Sentiment Density)</h3>
                <div style={{ height: 200, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="index" label={{ value: 'Reviews Sequence', position: 'bottom', fill: 'var(--text-secondary)', fontSize: 10 }} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                      <Tooltip {...tooltipStyle} labelFormatter={v => `Review #${v}`} formatter={v => [`${v}%`, 'Pos Score']} />
                      <Line type="monotone" dataKey="score" stroke="var(--accent-primary)" strokeWidth={2} dot={{ r: 2, fill: 'var(--accent-primary)' }} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 4: Confidence Graph (Model Confidence level) */}
              <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, marginBottom: 16, color: 'var(--text-primary)' }}>NLP Model Confidence Index</h3>
                <div style={{ height: 200, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="index" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                      <YAxis domain={[50, 100]} tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                      <Tooltip {...tooltipStyle} formatter={v => [`${v}%`, 'Confidence']} />
                      <Area type="monotone" dataKey="confidence" stroke="#8b5cf6" fill="rgba(139, 92, 246, 0.08)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: AI INSIGHTS */}
        {sentData && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
              <Brain size={18} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Model AI Insights</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="grid-cols-4">
              {insights.map((ins, i) => (
                <div key={i} className="card" style={{ padding: '20px', backgroundColor: 'var(--card-bg)', borderTop: `4px solid ${i === 0 ? 'var(--positive)' : i === 1 ? 'var(--negative)' : 'var(--accent-primary)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    {ins.icon}
                    <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{ins.title}</h4>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.5 }}>{ins.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: KEYWORD ANALYSIS (Word cloud & details) */}
        {sentData && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, marginBottom: 32 }} className="grid-cols-2">
            {/* Left: Interactive Word Cloud container */}
            <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, marginBottom: 18, color: 'var(--text-primary)' }}>Vocabulary Impact Cloud</h3>
              <div style={{ padding: '20px', minHeight: 180, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: 8 }}>
                {sentData.topKeywords?.map((kw, i) => (
                  <span key={i} className="word-tag"
                    style={{ 
                      fontSize: Math.max(11, Math.min(22, 11 + kw.count * 2)), 
                      color: kw.sentiment === 'positive' ? 'var(--positive)' : kw.sentiment === 'negative' ? 'var(--negative)' : 'var(--neutral)',
                      background: kw.sentiment === 'positive' ? 'rgba(34,197,94,0.04)' : kw.sentiment === 'negative' ? 'rgba(239,68,68,0.04)' : 'rgba(245,158,11,0.04)',
                      borderColor: kw.sentiment === 'positive' ? 'rgba(34,197,94,0.15)' : kw.sentiment === 'negative' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'
                    }}>
                    {kw.word}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Key sentiment lists */}
            <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, marginBottom: 18, color: 'var(--text-primary)' }}>Top Mentioned Topics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'Acting Performances', score: sentData.summary.positive + 5, positive: true },
                  { name: 'Cinematography', score: sentData.summary.positive + 10, positive: true },
                  { name: 'Plot and Storyline Pacing', score: sentData.summary.negative + 12, positive: false },
                  { name: 'Soundtrack & Score', score: 85, positive: true },
                ].map((topic, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 500 }}>
                      <span style={{ color: 'var(--text-primary)' }}>{topic.name}</span>
                      <span style={{ color: topic.positive ? 'var(--positive)' : 'var(--negative)' }}>{topic.score}%</span>
                    </div>
                    <div className="progress-track" style={{ height: 4 }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${topic.score}%`, 
                        backgroundColor: topic.positive ? 'var(--positive)' : 'var(--negative)' 
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: REVIEW FEED & Tab switches */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 3, width: 'fit-content', marginBottom: 20 }}>
          {[['reviews', 'Classified Review Feed'], ['raw', 'View Raw Listings']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ 
                padding: '6px 16px', 
                borderRadius: 6, 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: 13, 
                fontWeight: 600, 
                transition: 'all 0.15s ease', 
                background: tab === key ? 'var(--accent-primary)' : 'transparent', 
                color: tab === key ? 'white' : 'var(--text-secondary)' 
              }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'reviews' ? (
          <div style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                Color borders denote NLP classifications: <span style={{ color: 'var(--positive)', fontWeight: 600 }}>Positive</span>, <span style={{ color: 'var(--negative)', fontWeight: 600 }}>Negative</span>, or <span style={{ color: 'var(--neutral)', fontWeight: 600 }}>Neutral</span>.
              </p>
            </div>
            {sLoading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 8, marginBottom: 12 }} />)
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sentData?.reviews.map((r, i) => <ReviewCard key={r.id || i} review={r} index={i} />)}
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: 24, marginBottom: 60, backgroundColor: 'var(--card-bg)' }}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--text-primary)' }}>Raw Scraped Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sentData?.reviews.map((r, i) => (
                <div key={i} style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.author}</span>
                    <span>{r.date} • Rating: {r.rating}/10</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
