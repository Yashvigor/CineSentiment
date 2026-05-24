import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Film, Database, Shield, BarChart2, Trash2, RefreshCw, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const mockUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'user', analyses: 12, joined: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user', analyses: 7, joined: '2024-02-03' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'admin', analyses: 45, joined: '2023-12-01' },
];

const AdminPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState(mockUsers);

  if (!user || user.role !== 'admin') {
    // Basic protection (can be expanded)
  }

  const stats = [
    { label: 'Total Users', value: 1248, icon: <Users size={20} />, color: '#8b5cf6' },
    { label: 'Movies in DB', value: 50400, icon: <Film size={20} />, color: '#e50914' },
    { label: 'Reviews Analyzed', value: '2.1M', icon: <Database size={20} />, color: '#22c55e' },
    { label: 'Model Accuracy', value: '94%', icon: <BarChart2 size={20} />, color: '#f97316' },
  ];

  const tabs = ['overview', 'users', 'models', 'logs'];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', maxWidth: '1400px', margin: '0 auto', padding: '90px 24px 60px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Shield size={20} color="#e50914" />
            <span style={{ color: '#e50914', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(1.8rem,4vw,2.5rem)' }}>System Administration</h1>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '4px', marginBottom: '32px', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s', background: activeTab === tab ? 'linear-gradient(135deg,#e50914,#f97316)' : 'transparent', color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.5)' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '32px' }}>
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass" style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass" style={{ padding: '32px', borderRadius: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', marginBottom: '20px' }}>ML Model Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '16px' }}>
              {[
                { metric: 'Accuracy', value: 94, color: '#22c55e' },
                { metric: 'Precision', value: 91, color: '#8b5cf6' },
                { metric: 'Recall', value: 89, color: '#f97316' },
                { metric: 'F1-Score', value: 90, color: '#06b6d4' },
              ].map(m => (
                <div key={m.metric} style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px' }}>
                  <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, color: m.color }}>{m.value}%</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>{m.metric}</div>
                  <div className="progress-track" style={{ marginTop: '10px' }}>
                    <div style={{ height: '100%', borderRadius: '3px', width: `${m.value}%`, background: m.color, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px' }}>
                <RefreshCw size={14} /> Retrain Model
              </button>
              <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px' }}>
                <Upload size={14} /> Upload Dataset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', marginBottom: '20px' }}>User Management</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="cs-table">
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Analyses', 'Joined', 'Actions'].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ color: 'white', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'rgba(255,255,255,0.55)' }}>{u.email}</td>
                    <td>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: u.role === 'admin' ? 'rgba(229,9,20,0.15)' : 'rgba(139,92,246,0.15)', color: u.role === 'admin' ? '#e50914' : '#a78bfa' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.analyses}</td>
                    <td>{u.joined}</td>
                    <td>
                      <button onClick={() => setUsers(prev => prev.filter(x => x.id !== u.id))}
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Models Tab */}
      {activeTab === 'models' && (
        <div className="glass" style={{ padding: '32px', borderRadius: '20px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', marginBottom: '20px' }}>Model Management</h3>
          {[
            { name: 'Logistic Regression', version: 'v2.1', accuracy: '87%', status: 'active' },
            { name: 'Naive Bayes', version: 'v1.5', accuracy: '82%', status: 'inactive' },
            { name: 'SVM Classifier', version: 'v3.0', accuracy: '91%', status: 'active' },
          ].map((model, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>{model.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{model.version} • Accuracy: {model.accuracy}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: model.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: model.status === 'active' ? '#22c55e' : 'rgba(255,255,255,0.4)', border: `1px solid ${model.status === 'active' ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  {model.status}
                </span>
                <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px' }}>
                  <RefreshCw size={12} /> Retrain
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="glass" style={{ padding: '28px', borderRadius: '20px', fontFamily: 'monospace' }}>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem', marginBottom: '16px' }}>System Logs</h3>
          {[
            { time: '10:42:15', type: 'INFO', msg: 'User alice@example.com logged in' },
            { time: '10:41:03', type: 'PREDICT', msg: 'Sentiment analysis complete for tt0468569 — 94% positive' },
            { time: '10:38:50', type: 'API', msg: 'OMDB API call — GET /movie?i=tt1375666' },
            { time: '10:35:22', type: 'ERROR', msg: 'OMDB API rate limit warning' },
          ].map((log, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', minWidth: '70px' }}>{log.time}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '60px', color: log.type === 'ERROR' ? '#ef4444' : log.type === 'PREDICT' ? '#8b5cf6' : log.type === 'API' ? '#06b6d4' : '#22c55e' }}>[{log.type}]</span>
              <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '12px' }}>{log.msg}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
