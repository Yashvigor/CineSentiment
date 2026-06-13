import React from 'react';
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, BarChart2, ShieldAlert, Cpu, Layers, List } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AnalyticsPage = () => {
  const { analysisHistory } = useApp();

  const globalStats = [
    { label: 'Total Analyses', value: '54,290', change: '+12% MoM', color: 'var(--accent-primary)' },
    { label: 'Avg Sentiment Accuracy', value: '94.2%', change: '+0.5% gain', color: 'var(--positive)' },
    { label: 'OMDB API Response Time', value: '420ms', change: 'Optimized', color: 'var(--neutral)' },
    { label: 'Active Classifier Model', value: 'Naive Bayes v1.5', change: 'Supervised', color: '#8b5cf6' },
  ];

  const genreData = [
    { name: 'Drama', score: 82, count: 120, fill: 'var(--accent-primary)' },
    { name: 'Sci-Fi', score: 76, count: 95, fill: '#8b5cf6' },
    { name: 'Romance', score: 79, count: 68, fill: 'var(--positive)' },
    { name: 'Action', score: 71, count: 140, fill: 'var(--neutral)' },
    { name: 'Comedy', score: 68, count: 110, fill: '#06b6d4' },
    { name: 'Horror', score: 54, count: 80, fill: 'var(--negative)' },
  ];

  const trendData = [
    { month: 'Jan', positive: 58, negative: 42 },
    { month: 'Feb', positive: 62, negative: 38 },
    { month: 'Mar', positive: 65, negative: 35 },
    { month: 'Apr', positive: 60, negative: 40 },
    { month: 'May', positive: 64, negative: 36 },
    { month: 'Jun', positive: 68, negative: 32 },
  ];

  const pipelineSteps = [
    { name: 'Raw Review text', desc: 'User review scraped from IMDb API feed.' },
    { name: 'Text Normalization', desc: 'Punctuation removal, lowercasing, stopword stripping.' },
    { name: 'Syntactic Negation', desc: 'Detects invert phrases (e.g. "not good" -> "bad").' },
    { name: 'Intensifiers logic', desc: 'Adjusts weight on booster words (e.g. "extremely").' },
    { name: 'Naive Bayes Class', desc: 'Predicts token probabilities from trained corpus.' },
    { name: 'Sentiment Output', desc: 'Computes positive/negative score and logs to DB.' },
  ];

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

  return (
    <div style={{ minHeight: '100vh', paddingTop: 68, maxWidth: 1400, margin: '0 auto', padding: '90px 24px 60px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '2rem', marginBottom: 6, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>Platform Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Global sentiment statistics, model performance metrics, and linguistic insight graphs</p>
      </div>

      {/* Global Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }} className="grid-cols-4">
        {globalStats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--card-bg)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0 2px' }}>{stat.value}</div>
            <span style={{ color: stat.color === 'var(--negative)' ? 'var(--negative)' : 'var(--positive)', fontSize: 11, fontWeight: 500 }}>{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }} className="grid-cols-2">
        {/* Card 1: Genre Analysis (BarChart) */}
        <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <BarChart2 size={16} color="var(--accent-primary)" />
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>Linguistic Scores by Genre</h3>
          </div>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genreData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip {...tooltipStyle} formatter={v => [`${v}%`, 'Average Positive Score']} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {genreData.map((e, idx) => <Cell key={idx} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Sentiment Trends (AreaChart) */}
        <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={16} color="var(--accent-primary)" />
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>Review Sentiment Trends (MoM)</h3>
          </div>
          <div style={{ height: 240, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="var(--positive)" fill="rgba(34, 197, 94, 0.08)" strokeWidth={2} name="Positive" />
                <Area type="monotone" dataKey="negative" stackId="2" stroke="var(--negative)" fill="rgba(239, 68, 68, 0.08)" strokeWidth={2} name="Negative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row: Historical Analysis & Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }} className="grid-cols-2">
        {/* Left: Historical Analysis list */}
        <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <List size={16} color="var(--accent-primary)" />
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>Historical Analytics Log</h3>
          </div>
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table className="cs-table" style={{ minWidth: 400 }}>
              <thead>
                <tr>
                  <th>Movie / Entry</th>
                  <th>Analysis Date</th>
                  <th>Positive Score</th>
                  <th>Negative Score</th>
                </tr>
              </thead>
              <tbody>
                {analysisHistory.length > 0 ? (
                  analysisHistory.slice(0, 5).map((h, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{h.movie}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{new Date(h.date).toLocaleDateString()}</td>
                      <td style={{ color: 'var(--positive)', fontWeight: 600 }}>{h.summary?.positive}%</td>
                      <td style={{ color: 'var(--negative)', fontWeight: 600 }}>{h.summary?.negative}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0' }}>
                      No recent runs recorded. Analyses will populate here automatically.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Pipeline steps */}
        <div className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Layers size={16} color="var(--accent-primary)" />
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', margin: 0 }}>NLP Processing Pipeline</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pipelineSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {i + 1}
                </div>
                <div>
                  <p style={{ color: 'var(--text-primary)', fontSize: 12.5, fontWeight: 600 }}>{step.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.4, marginTop: 1 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPage;
