import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Home, BarChart2, Compass, Info, LogIn, UserPlus, Menu, X, User, LogOut, ChevronDown, BookmarkIcon, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [pathname]);

  const links = [
    { to: '/', label: 'Home', icon: <Home size={15}/> },
    { to: '/movies', label: 'Movies', icon: <Compass size={15}/> },
    { to: '/dashboard', label: 'Dashboard', icon: <BarChart2 size={15}/> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart2 size={15}/> },
    { to: '/about', label: 'About', icon: <Info size={15}/> },
  ];

  const isActive = (p) => pathname === p;

  return (
    <>
      <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s',
          background: scrolled ? 'rgba(10,10,15,0.92)' : 'rgba(10,10,15,0.3)',
          backdropFilter: 'blur(20px)', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#e50914,#f97316)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(229,9,20,0.4)' }}>
              <Film size={20} color="white"/>
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: 'white' }}>
              CineSentiment<span style={{ background: 'linear-gradient(135deg,#e50914,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hide-mobile" style={{ gap: 4, alignItems: 'center' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`} style={{ padding: '8px 14px' }}>{l.label}</Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hide-mobile" style={{ gap: 10, alignItems: 'center' }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(!profileOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 40, padding: '6px 14px 6px 6px', cursor: 'pointer', color: 'white' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#e50914,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={13} style={{ opacity: 0.5 }}/>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}
                      style={{ position: 'absolute', top: '110%', right: 0, width: 200, background: 'rgba(15,15,22,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 8, backdropFilter: 'blur(20px)', zIndex: 100 }}>
                      {[
                        { to: '/profile', icon: <User size={14}/>, label: 'My Profile' },
                        { to: '/profile', icon: <BookmarkIcon size={14}/>, label: 'Saved Movies' },
                        { to: '/admin', icon: <Settings size={14}/>, label: 'Admin Panel' },
                      ].map(item => (
                        <Link key={item.label} to={item.to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', borderRadius: 10, fontSize: 14, transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '6px 0' }}/>
                      <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#ef4444', background: 'none', border: 'none', width: '100%', cursor: 'pointer', borderRadius: 10, fontSize: 14, transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <LogOut size={14}/> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                  <LogIn size={14}/> Login
                </Link>
                <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                  <UserPlus size={14}/> Sign Up
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="show-mobile" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 8 }}>
            {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3 }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 280, background: 'rgba(10,10,15,0.98)', backdropFilter: 'blur(20px)', zIndex: 48, padding: '96px 20px 20px', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', color: isActive(l.to) ? 'white' : 'rgba(255,255,255,0.65)', textDecoration: 'none', borderRadius: 12, fontSize: 15, fontWeight: 500, background: isActive(l.to) ? 'rgba(229,9,20,0.12)' : 'transparent', border: `1px solid ${isActive(l.to) ? 'rgba(229,9,20,0.3)' : 'transparent'}` }}>
                {l.icon} {l.label}
              </Link>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', margin: '8px 0' }}/>
            {user
              ? <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', color: '#ef4444', background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, cursor: 'pointer', fontSize: 15 }}><LogOut size={16}/> Sign Out</button>
              : <>
                  <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', color: 'white', textDecoration: 'none', borderRadius: 12, border: '1px solid rgba(255,255,255,0.18)', fontSize: 15 }}><LogIn size={16}/> Login</Link>
                  <Link to="/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '13px 16px', textDecoration: 'none', borderRadius: 12, fontSize: 15 }}><UserPlus size={16}/> Sign Up</Link>
                </>
            }
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
