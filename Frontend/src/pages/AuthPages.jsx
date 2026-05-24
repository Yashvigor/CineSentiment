import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Film, ArrowRight, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { loginAPI, registerAPI } from '../services/api';

const AuthField = ({ label, type, value, onChange, placeholder, children }) => (
  <div>
    <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="cs-input" style={{ height: 50, fontSize: 15, paddingLeft: children ? 44 : 16, paddingRight: 16 }} required />
      {children}
    </div>
  </div>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await loginAPI(form);
      localStorage.setItem('cs_token', data.token);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 24px 40px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(229,9,20,0.1), transparent 70%)' }} />
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="glass-strong"
        style={{ width: '100%', maxWidth: 420, borderRadius: 24, padding: '44px 38px', zIndex: 1, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 54, height: 54, background: 'linear-gradient(135deg,#e50914,#f97316)', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 0 28px rgba(229,9,20,0.4)' }}>
            <Film size={26} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 26, marginBottom: 5 }}>Welcome Back</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Sign in to CineSentiment AI</p>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 11, padding: '11px 15px', color: '#ef4444', fontSize: 14, marginBottom: 18 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <AuthField label="Email Address" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com">
            <Mail size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          </AuthField>
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••" className="cs-input" style={{ height: 50, fontSize: 15, paddingLeft: 44, paddingRight: 44 }} required />
              <button type="button" onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                {show ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}
            style={{ height: 50, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, marginTop: 6 }}>
            {loading ? 'Signing in...' : <><ArrowRight size={15}/> Sign In</>}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.38)', fontSize: 14, marginTop: 22 }}>
          No account? <Link to="/register" style={{ color: '#e50914', fontWeight: 700, textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await registerAPI({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem('cs_token', data.token);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const F = (key, label, type, ph) => (
    <div>
      <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
        placeholder={ph} className="cs-input" style={{ height: 50, fontSize: 15 }} required />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '90px 24px 40px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139,92,246,0.09), transparent 70%)' }} />
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="glass-strong"
        style={{ width: '100%', maxWidth: 420, borderRadius: 24, padding: '44px 38px', zIndex: 1, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 54, height: 54, background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 0 28px rgba(139,92,246,0.4)' }}>
            <UserIcon size={26} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 26, marginBottom: 5 }}>Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Join CineSentiment AI today</p>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 11, padding: '11px 15px', color: '#ef4444', fontSize: 14, marginBottom: 18 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {F('name', 'Full Name', 'text', 'John Doe')}
          {F('email', 'Email', 'email', 'you@example.com')}
          <div>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 600, marginBottom: 7 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                placeholder="Min 6 characters" className="cs-input" style={{ height: 50, fontSize: 15, paddingRight: 44 }} required />
              <button type="button" onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                {show ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>
          {F('confirm', 'Confirm Password', 'password', 'Repeat password')}
          <button type="submit" disabled={loading}
            style={{ height: 50, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, marginTop: 6, background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Creating...' : <><ArrowRight size={15}/> Create Account</>}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.38)', fontSize: 14, marginTop: 22 }}>
          Have an account? <Link to="/login" style={{ color: '#8b5cf6', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};
