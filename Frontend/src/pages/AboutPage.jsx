import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Zap, Shield, Globe } from 'lucide-react';

const AboutPage = () => (
  <div style={{ minHeight: '100vh', paddingTop: 90, maxWidth: 900, margin: '0 auto', padding: '90px 24px 60px' }}>
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎬</div>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: 14 }}>
          About <span style={{ background: 'linear-gradient(135deg,#e50914,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CineSentiment AI</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, lineHeight: 1.8, maxWidth: 680, margin: '0 auto' }}>
          An AI-powered movie sentiment analysis platform that fetches real IMDB reviews and classifies them using Natural Language Processing and Machine Learning. Built as an academic internship project demonstrating end-to-end NLP pipeline integration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 48 }}>
        {[
          { icon: <Brain size={24} color="#8b5cf6"/>, title: 'NLP Engine', desc: 'Custom lexicon-based sentiment classifier with negation handling, intensifier detection, and confidence scoring.' },
          { icon: <Zap size={24} color="#f97316"/>, title: 'Real-time Analysis', desc: 'Sub-2 second sentiment prediction. Reviews classified instantly on movie selection.' },
          { icon: <Shield size={24} color="#22c55e"/>, title: 'Secure Backend', desc: 'JWT authentication, bcrypt password hashing, MongoDB with proper schema validation and indexes.' },
          { icon: <Globe size={24} color="#06b6d4"/>, title: 'OMDB Integration', desc: 'Live movie data from OMDB/IMDB API including all releases, posters, ratings, and cast information.' },
        ].map((c, i) => (
          <div key={i} className="glass" style={{ padding: 28, borderRadius: 20 }}>
            <div style={{ marginBottom: 14 }}>{c.icon}</div>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{c.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.7 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: 36, borderRadius: 20, marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.4rem', marginBottom: 20 }}>Tech Stack</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
          {[
            ['Frontend', 'React 18 + Vite', '#61dafb'],
            ['Styling', 'Tailwind CSS v4', '#38bdf8'],
            ['Animations', 'Framer Motion', '#8b5cf6'],
            ['Charts', 'Recharts', '#22c55e'],
            ['Backend', 'Node.js + Express', '#68a063'],
            ['Database', 'MongoDB + Mongoose', '#4db33d'],
            ['Auth', 'JWT + bcryptjs', '#f97316'],
            ['API', 'OMDB / IMDB', '#e50914'],
          ].map(([label, val, c]) => (
            <div key={label} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
              <div style={{ color: c, fontWeight: 700, fontSize: 14 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a href="https://github.com" target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14, color: 'white', textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
          <Code size={18} /> View on GitHub
        </a>
      </div>
    </motion.div>
  </div>
);

export default AboutPage;
