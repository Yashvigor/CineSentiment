import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Globe, MessageCircle, Camera, Mail, Heart } from 'lucide-react';

const Footer = () => (
  <footer style={{ backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-subtle)', padding: '48px 24px 24px', marginTop: 80 }}>
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 34, height: 34, backgroundColor: 'var(--accent-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={17} color="white"/>
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              CineSentiment
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
            AI-powered movie sentiment analysis. Understand what audiences feel through NLP & ML.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[Globe, MessageCircle, Camera, Mail].map((Icon, i) => (
              <a key={i} href="#" style={{ width: 34, height: 34, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(59, 130, 246, 0.1)'; e.currentTarget.style.borderColor='rgba(59, 130, 246, 0.2)'; e.currentTarget.style.color='var(--accent-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor='var(--border-subtle)'; e.currentTarget.style.color='var(--text-secondary)'; }}>
                <Icon size={15}/>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, fontSize: 14 }}>Platform</h4>
          {[
            ['/', 'Home'],
            ['/movies', 'Browse Movies'],
            ['/analytics', 'Analytics'],
            ['/about', 'About / Tech Stack']
          ].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, fontSize: 14 }}>Technology</h4>
          {['NLP Sentiment Engine', 'ML Classification', 'OMDB API Integration', 'MongoDB Database'].map(t => (
            <p key={t} style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 7 }}>• {t}</p>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, fontSize: 14 }}>Tech Stack</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {['React.js', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'NLP', 'Recharts'].map(t => (
              <span key={t} style={{ padding: '3px 10px', background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: 20, fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>© {new Date().getFullYear()} CineSentiment. All rights reserved.</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          Made with <Heart size={11} style={{ color: 'var(--accent-primary)', fill: 'var(--accent-primary)', margin: '0 2px' }}/> for cinema lovers
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
