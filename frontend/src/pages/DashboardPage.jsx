import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';
import { getHistoryAPI } from '../services/api';
import useTrending from '../hooks/useTrending';
import { TrendingUp, Film, Brain, Zap } from 'lucide-react';

const COLORS = ['#22c55e', '#ef4444', '#eab308', '#8b5cf6', '#06b6d4'];

const DashboardPage = () => {
  const { analysisHistory, savedMovies } = useApp();
  const { movies: trending } = useTrending();
  const [dbHistory, setDbHistory] = useState([]);

  useEffect(() => {
    getHistoryAPI().then(res => {
      if (res.data && res.data.length > 0) setDbHistory(res.data);
    }).catch(err => console.log('Could not fetch DB history', err));
  }, []);

  const displayHistory = dbHistory.length > 0 ? dbHistory : analysisHistory;

  const sentimentDist = [
    { name: 'Positive', value: 58, color: '#22c55e' },
    { name: 'Negative', value: 28, color: '#ef4444' },
    { name: 'Neutral', value: 14, color: '#eab308' },
  ];

  const weeklyData = [
    { day: 'Mon', positive: 65, negative: 25, neutral: 10 },
    { day: 'Tue', positive: 72, negative: 18, neutral: 10 },
    { day: 'Wed', positive: 55, negative: 35, neutral: 10 },
    { day: 'Thu', positive: 80, negative: 15, neutral: 5 },
    { day: 'Fri', positive: 68, negative: 22, neutral: 10 },
    { day: 'Sat', positive: 75, negative: 20, neutral: 5 },
    { day: 'Sun', positive: 82, negative: 12, neutral: 6 },
  ];

  const genreData = [
    { genre: 'Action', score: 72 },
    { genre: 'Drama', score: 85 },
    { genre: 'Comedy', score: 68 },
    { genre: 'Sci-Fi', score: 78 },
    { genre: 'Horror', score: 55 },
    { genre: 'Romance', score: 80 },
  ];

  const tooltipStyle = {
    contentStyle: { background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' },
  };

  const statCards = [
    { label: 'Movies Analyzed', value: displayHistory.length || 24, icon: <Film size={20} />, color: '#e50914', suffix: '' },
    { label: 'Avg. Sentiment Score', value: 74, icon: <TrendingUp size={20} />, color: '#22c55e', suffix: '%' },
    { label: 'Reviews Processed', value: 1240, icon: <Brain size={20} />, color: '#8b5cf6', suffix: '' },
    { label: 'Saved Movies', value: savedMovies.length || 0, icon: <Zap size={20} />, color: '#f97316', suffix: '' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', maxWidth: '1400px', margin: '0 auto', padding: '90px 24px 60px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '8px' }}>Analytics Dashboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)' }}>Sentiment trends, insights, and performance metrics</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
        {statCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${card.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: card.color }}>{card.value}{card.suffix}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{card.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }} className="grid-2">
        <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '18px', marginBottom: '24px' }}>Weekly Sentiment Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2.5} dot={false} name="Positive" />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Negative" />
              <Line type="monotone" dataKey="neutral" stroke="#eab308" strokeWidth={2} dot={false} name="Neutral" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '18px', marginBottom: '24px' }}>Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sentimentDist} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value">
                {sentimentDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`]} {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {sentimentDist.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color }} />
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{d.name}: {d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }} className="grid-2">
        <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '18px', marginBottom: '24px' }}>Positive Sentiment by Genre</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={genreData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="genre" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} formatter={v => [`${v}%`]} />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {genreData.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '18px', marginBottom: '20px' }}>Analysis History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto' }}>
            {(displayHistory.length ? displayHistory : [
              { movieTitle: 'The Dark Knight', summary: { positive: 72, negative: 28 }, analyzedAt: new Date().toISOString() },
              { movieTitle: 'Inception', summary: { positive: 85, negative: 15 }, analyzedAt: new Date().toISOString() },
              { movieTitle: 'Interstellar', summary: { positive: 78, negative: 22 }, analyzedAt: new Date().toISOString() },
            ]).slice(0, 8).map((entry, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                <div>
                  <p style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>{entry.movieTitle || entry.movie}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{new Date(entry.analyzedAt || entry.date).toLocaleDateString()}</p>
                </div>
                <span style={{ color: entry.summary?.positive >= 50 ? '#22c55e' : '#ef4444', fontSize: '14px', fontWeight: 700 }}>
                  {entry.summary?.positive || 70}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
