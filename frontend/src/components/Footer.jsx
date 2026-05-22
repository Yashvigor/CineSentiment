import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Globe, MessageCircle, Camera, Mail, Heart } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: 'rgba(10,10,15,1)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px 24px', marginTop: 80 }}>
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#e50914,#f97316)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={17} color="white"/>
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 17, color: 'white' }}>
              CineSentiment <span style={{ background: 'linear-gradient(135deg,#e50914,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
            AI-powered movie sentiment analysis. Understand what audiences feel through NLP & ML.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[Globe, MessageCircle, Camera, Mail].map((Icon, i) => (
              <a key={i} href="#" style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(229,9,20,0.18)'; e.currentTarget.style.color='white'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='rgba(255,255,255,0.45)'; }}>
                <Icon size={15}/>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'white', marginBottom: 14, fontSize: 14 }}>Platform</h4>
          {[['/', 'Home'], ['/movies', 'Browse Movies'], ['/dashboard', 'Dashboard'], ['/analytics', 'Analytics']].map(([to, label]) => (
            <Link key={to} to={to} style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color='white'}
              onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.4)'}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'white', marginBottom: 14, fontSize: 14 }}>Technology</h4>
          {['NLP Sentiment Engine', 'ML Classification', 'OMDB API Integration', 'JWT Authentication', 'MongoDB Database'].map(t => (
            <p key={t} style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, marginBottom: 7 }}>• {t}</p>
          ))}
        </div>
        <div>
          <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'white', marginBottom: 14, fontSize: 14 }}>Tech Stack</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {['React.js', 'Tailwind', 'Node.js', 'Express', 'MongoDB', 'NLP', 'Recharts'].map(t => (
              <span key={t} style={{ padding: '3px 10px', background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.2)', borderRadius: 20, fontSize: 11, color: '#e50914', fontWeight: 700 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12 }}>© {new Date().getFullYear()} CineSentiment AI. All rights reserved.</p>
        <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          Made with <Heart size={11} style={{ color: '#e50914', fill: '#e50914', margin: '0 2px' }}/> for cinema lovers
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
