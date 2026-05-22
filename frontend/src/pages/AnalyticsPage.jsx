import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const AnalyticsPage = () => {
  const emotions = [
    { emotion: '😊 Happy', pct: 42, color: '#22c55e' },
    { emotion: '😮 Surprised', pct: 18, color: '#06b6d4' },
    { emotion: '😐 Neutral', pct: 15, color: '#eab308' },
    { emotion: '😞 Sad', pct: 14, color: '#8b5cf6' },
    { emotion: '😠 Angry', pct: 11, color: '#ef4444' },
  ];

  const aiFeatures = [
    { icon: '🧠', title: 'Emotion Detection', desc: 'Identify happy, sad, angry, excited emotions from text using advanced NLP models.', badge: 'NLP' },
    { icon: '📝', title: 'Review Summarization', desc: 'Auto-generate concise summaries from large review datasets with key insights.', badge: 'AI' },
    { icon: '🕵️', title: 'Fake Review Detection', desc: 'Identify spam and inauthentic reviews using ML pattern recognition.', badge: 'ML' },
    { icon: '🎯', title: 'Smart Recommendations', desc: 'Get movie recommendations based on your sentiment preferences and history.', badge: 'AI' },
    { icon: '⚡', title: 'Real-time Analysis', desc: 'Instantly classify sentiment as reviews are submitted with sub-2s response time.', badge: 'Live' },
    { icon: '🌐', title: 'Multi-language Support', desc: 'Analyze reviews in English, Hindi, and Hinglish with language-aware models.', badge: 'Beta' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', maxWidth: '1400px', margin: '0 auto', padding: '90px 24px 60px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '8px' }}>
          Analytics & AI Features
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)' }}>Deep insights powered by NLP and machine learning</p>
      </div>

      {/* Emotion analysis */}
      <div className="glass" style={{ padding: '32px', borderRadius: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.3rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={18} color="#8b5cf6" /> Emotion Distribution (Global Average)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {emotions.map((em, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '20px', minWidth: '120px' }}>{em.emotion}</span>
              <div style={{ flex: 1 }}>
                <div className="progress-track">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${em.pct}%` }} transition={{ delay: i * 0.1, duration: 1 }}
                    style={{ height: '100%', background: em.color, borderRadius: '3px' }} />
                </div>
              </div>
              <span style={{ color: em.color, fontWeight: 700, minWidth: '36px', textAlign: 'right' }}>{em.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Features grid */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.8rem', marginBottom: '24px' }}>AI-Powered Capabilities</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' }}>
          {aiFeatures.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="glass card-hover" style={{ padding: '28px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontSize: '36px' }}>{f.icon}</div>
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: 'rgba(229,9,20,0.15)', color: '#e50914', border: '1px solid rgba(229,9,20,0.3)' }}>{f.badge}</span>
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* NLP Pipeline */}
      <div className="glass" style={{ padding: '32px', borderRadius: '20px' }}>
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.3rem', marginBottom: '24px' }}>NLP Processing Pipeline</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['Raw Review Text', 'Text Cleaning', 'Tokenization', 'Stopword Removal', 'Lemmatization', 'Feature Extraction', 'ML Classification', 'Sentiment Label'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <div style={{ padding: '10px 16px', background: i === arr.length - 1 ? 'linear-gradient(135deg,#e50914,#f97316)' : 'rgba(255,255,255,0.06)', border: `1px solid ${i === arr.length - 1 ? 'rgba(229,9,20,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: i === arr.length - 1 ? 'white' : 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                {step}
              </div>
              {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '18px' }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
