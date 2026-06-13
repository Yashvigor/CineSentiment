import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Home, BarChart2, Compass, Info, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const links = [
    { to: '/', label: 'Home', icon: <Home size={15}/> },
    { to: '/movies', label: 'Movies', icon: <Compass size={15}/> },
    { to: '/analytics', label: 'Analytics', icon: <BarChart2 size={15}/> },
    { to: '/about', label: 'About', icon: <Info size={15}/> },
  ];

  const isActive = (p) => pathname === p;

  return (
    <>
      <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s',
          background: scrolled ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(20px)', borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.06)' : 'none' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, backgroundColor: 'var(--accent-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Film size={18} color="white"/>
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              CineSentiment
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hide-mobile" style={{ gap: 4, alignItems: 'center' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? 'active' : ''}`} style={{ padding: '8px 14px' }}>{l.label}</Link>
            ))}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="show-mobile" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 8 }}>
            {mobileOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3 }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 280, background: 'var(--bg-primary)', borderLeft: '1px solid var(--border-subtle)', zIndex: 48, padding: '96px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', color: isActive(l.to) ? 'var(--text-primary)' : 'var(--text-secondary)', textDecoration: 'none', borderRadius: 8, fontSize: 15, fontWeight: 500, background: isActive(l.to) ? 'rgba(59, 130, 246, 0.08)' : 'transparent', border: `1px solid ${isActive(l.to) ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}` }}>
                {l.icon} {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
