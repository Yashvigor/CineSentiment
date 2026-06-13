import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Zap, Shield, Globe } from 'lucide-react';

const AboutPage = () => (
  <div style={{ minHeight: '100vh', paddingTop: 68, maxWidth: 900, margin: '0 auto', padding: '90px 24px 60px' }}>
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 50, marginBottom: 16 }}>🎬</div>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '2rem', marginBottom: 12, color: 'var(--text-primary)' }}>
          About <span style={{ color: 'var(--accent-primary)' }}>CineSentiment</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>
          An AI-powered movie sentiment analysis platform that fetches real IMDb reviews and classifies them using Natural Language Processing and Machine Learning. Built as an academic demonstration of end-to-end NLP pipelines.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { icon: <Brain size={22} color="#8b5cf6"/>, title: 'NLP Engine', desc: 'Custom lexicon-based sentiment classifier with negation handling, intensifier detection, and confidence scoring.' },
          { icon: <Zap size={22} color="var(--accent-primary)"/>, title: 'Real-time Analysis', desc: 'Sub-2 second sentiment prediction. Reviews classified instantly on movie selection.' },
          { icon: <Shield size={22} color="var(--positive)"/>, title: 'Secure Backend', desc: 'JWT authentication, bcrypt password hashing, MongoDB with proper schema validation and indexes.' },
          { icon: <Globe size={22} color="#06b6d4"/>, title: 'OMDB Integration', desc: 'Live movie data from OMDB/IMDB API including all releases, posters, ratings, and cast information.' },
        ].map((c, i) => (
          <div key={i} className="card" style={{ padding: 24, backgroundColor: 'var(--card-bg)' }}>
            <div style={{ marginBottom: 12 }}>{c.icon}</div>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text-primary)' }}>{c.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 28, borderRadius: 12, marginBottom: 32, backgroundColor: 'var(--card-bg)' }}>
        <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '1.25rem', marginBottom: 16, color: 'var(--text-primary)' }}>Platform Tech Stack</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
          {[
            ['Frontend', 'React 19 + Vite', '#61dafb'],
            ['Styling', 'Vanilla CSS + Tailwind', '#38bdf8'],
            ['Animations', 'Framer Motion', '#8b5cf6'],
            ['Charts', 'Recharts', '#22c55e'],
            ['Backend', 'Node.js + Express', '#68a063'],
            ['Database', 'MongoDB + Mongoose', '#4db33d'],
            ['Auth', 'JWT + bcryptjs', '#f97316'],
            ['API Integration', 'OMDB / IMDB API', 'var(--accent-primary)'],
          ].map(([label, val, c]) => (
            <div key={label} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
              <div style={{ color: c, fontWeight: 600, fontSize: 13.5 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '10px 24px', fontSize: 13.5 }}>
          <Code size={16} /> View on GitHub
        </a>
      </div>
    </motion.div>
  </div>
);

export default AboutPage;
