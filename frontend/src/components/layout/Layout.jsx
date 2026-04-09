import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Music2, BarChart3, BookOpen, User, LogOut,
  ChevronUp, Search, X, Shuffle, Repeat, SkipBack,
  SkipForward, Play, Pause, Volume2, Heart, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePlayer } from '../../context/PlayerContext';
import { musicAPI, playlistAPI } from '../../services/api';
import { fmtTime, MOODS, getMood } from '../../utils/helpers';

const NAV = [
  { to: '/home',      icon: Home,      label: 'Home' },
  { to: '/music',     icon: Music2,    label: 'Music' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/profile',   icon: User,      label: 'Profile' },
  { to: '/journal',   icon: BookOpen,  label: 'Journal' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState(user?.currentMood || 'calm');
  const searchRef = useRef(null);

  const { currentTrack, isPlaying, progress, duration, volume, shuffle, repeat,
    toggle, playNext, playPrev, seek, changeVolume, setShuffle, setRepeat, play } = usePlayer();

  const moodCfg = getMood(currentMood);
  const pct = duration > 0 ? (progress / duration * 100) : 0;

  useEffect(() => {
    const handler = e => {
      if (!e.target.closest('.user-menu-wrap')) setUserMenuOpen(false);
      if (!e.target.closest('.profile-drop-wrap')) setProfileDropOpen(false);
      if (!e.target.closest('.search-wrap')) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = async q => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    try {
      const r = await musicAPI.search(q);
      setSearchResults(r.data.tracks?.slice(0, 6) || []);
    } catch {
      // show mock results if API not configured
      setSearchResults([]);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const cycleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    setRepeat(modes[(modes.indexOf(repeat) + 1) % 3]);
  };

  const setMood = async mood => {
    setCurrentMood(mood);
    try { await musicAPI.logMood({ mood }); } catch {}
  };

  const initials = user ? (user.username || user.email || 'U').substring(0, 2).toUpperCase() : 'AK';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'transparent', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: '#f8fafc', position: 'relative' }}>
      
      {/* Animated Animated Orbs */}
      <div className="floating-orb" style={{ top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: '#06b6d4', animationDelay: '0s' }} />
      <div className="floating-orb" style={{ bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: '#8b5cf6', animationDelay: '-5s' }} />
      <div className="floating-orb" style={{ top: '40%', left: '40%', width: '30vw', height: '30vw', background: '#1d4ed8', animationDelay: '-10s' }} />

      {/* TOP NAV */}
      <header style={{ height: 52, flexShrink: 0, background: 'rgba(2,4,12,0.92)', backdropFilter: 'blur(36px)', borderBottom: '1px solid rgba(6,182,212,0.08)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, position: 'relative', zIndex: 30 }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.3),transparent)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginRight: 6, flexShrink: 0 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(6,182,212,0.4)' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="9" width="3" height="6" rx="1.5" fill="white"/><rect x="6.5" y="5" width="3" height="10" rx="1.5" fill="white"/><rect x="11.5" y="2" width="3" height="13" rx="1.5" fill="white"/></svg>
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 16, background: 'linear-gradient(135deg,#e0f2fe,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Syncora</span>
        </div>

        {/* Nav tabs */}
        <nav style={{ display: 'flex', gap: 2 }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 8,
              color: isActive ? '#67e8f9' : 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600,
              textDecoration: 'none', border: `1px solid ${isActive ? 'rgba(6,182,212,0.2)' : 'transparent'}`,
              background: isActive ? 'rgba(6,182,212,0.08)' : 'transparent', transition: 'all .15s'
            })}>
              <Icon size={13} />{label}
            </NavLink>
          ))}
        </nav>

        {/* Search */}
        <div className="search-wrap" style={{ flex: 1, maxWidth: 300, margin: '0 8px', position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(6,182,212,0.4)', pointerEvents: 'none' }} />
          <input value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search songs, artists…"
            style={{ width: '100%', padding: '6px 12px 6px 30px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 8, color: '#e0f2fe', fontSize: 12, outline: 'none', fontFamily: 'inherit', transition: 'border-color .2s' }}
            onFocus_handler={e => e.target.style.borderColor = 'rgba(6,182,212,0.4)'}
          />
          {searchQuery && <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}><X size={12} /></button>}

          <AnimatePresence>
            {searchOpen && (searchResults.length > 0 || searchQuery) && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'rgba(2,6,20,0.97)', backdropFilter: 'blur(24px)', border: '1px solid rgba(6,182,212,0.18)', borderRadius: 12, zIndex: 100, overflow: 'hidden' }}>
                {searchResults.length > 0 ? searchResults.map((t, i) => (
                  <div key={t.id || i} onClick={() => { play(t, searchResults, i); setSearchOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: '#0d1b2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      {t.albumImage ? <img src={t.albumImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 13 }}>🎵</span>}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#e0f2fe', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{t.artist}</div>
                    </div>
                    {!t.previewUrl && <span style={{ fontSize: 9, color: 'rgba(6,182,212,0.5)', background: 'rgba(6,182,212,0.1)', padding: '2px 6px', borderRadius: 4, marginLeft: 'auto', flexShrink: 0 }}>Spotify →</span>}
                  </div>
                )) : (
                  <div style={{ padding: '12px', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                    No results — <span style={{ color: '#67e8f9', cursor: 'pointer' }} onClick={() => navigate('/music')}>try Music page</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {/* Mood pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 7, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', cursor: 'pointer' }}
            onClick={() => navigate('/home')}>
            <span style={{ fontSize: 12 }}>{moodCfg.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#67e8f9' }}>{moodCfg.label}</span>
          </div>

          {/* Profile button */}
          <div className="profile-drop-wrap" style={{ position: 'relative' }}>
            <div onClick={() => setProfileDropOpen(p => !p)}
              style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, cursor: 'pointer', border: '2px solid rgba(6,182,212,0.3)', boxShadow: '0 0 12px rgba(6,182,212,0.3)' }}>
              {initials}
            </div>
            <AnimatePresence>
              {profileDropOpen && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 195, background: 'rgba(2,6,20,0.97)', backdropFilter: 'blur(24px)', border: '1px solid rgba(6,182,212,0.18)', borderRadius: 12, zIndex: 100, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e0f2fe' }}>{user?.username || 'Guest'}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{user?.email || 'Not signed in'}</div>
                  </div>
                  {[
                    { label: 'View Profile', icon: User, action: () => { navigate('/profile'); setProfileDropOpen(false); } },
                    { label: 'Analytics', icon: BarChart3, action: () => { navigate('/analytics'); setProfileDropOpen(false); } },
                  ].map(({ label, icon: Icon, action }) => (
                    <button key={label} onClick={action}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 500, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit', transition: 'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.07)'; e.currentTarget.style.color = '#e0f2fe'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}>
                      <Icon size={13} />{label}
                    </button>
                  ))}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                  <button onClick={() => { handleLogout(); setProfileDropOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', cursor: 'pointer', color: 'rgba(239,68,68,0.7)', fontSize: 12, fontWeight: 500, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit', transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(239,68,68,0.7)'; }}>
                    <LogOut size={13} />Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{ width: 186, flexShrink: 0, background: 'rgba(2,4,12,0.85)', backdropFilter: 'blur(36px)', borderRight: '1px solid rgba(6,182,212,0.07)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.2),transparent)' }} />

          <nav style={{ padding: '10px 8px 0', flex: 1 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(0,255,200,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '8px 10px 5px' }}>Navigation</div>
            {NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 9,
                  color: isActive ? '#e0f2fe' : 'rgba(255,255,255,0.35)', fontWeight: 500, fontSize: 12,
                  textDecoration: 'none', marginBottom: 1, borderLeft: `2px solid ${isActive ? '#06b6d4' : 'transparent'}`,
                  background: isActive ? 'rgba(6,182,212,0.08)' : 'transparent', transition: 'all .2s'
                })}>
                <Icon size={14} />{label}
              </NavLink>
            ))}

            <div style={{ marginTop: 24, padding: '0 10px' }}>
                <div style={{ fontSize: 9, flex: 1, fontWeight: 700, color: 'rgba(0,255,200,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8 }}>My Library</div>
                <NavLink to="/liked" style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 9, color: isActive ? '#e0f2fe' : 'rgba(255,255,255,0.35)', fontWeight: 500, fontSize: 12, textDecoration: 'none', marginBottom: 2 })}>
                    <Heart size={14} />Favorites
                </NavLink>
                <div onClick={async () => {
                    if(!user) return navigate('/login');
                    try {
                        const r = await playlistAPI.create({ name: 'My Playlist ' + Math.floor(Math.random()*100) });
                        navigate('/playlist/' + r.data.playlist._id);
                    } catch(e) {}
                }} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 500, fontSize: 12, cursor: 'pointer', marginBottom: 2 }}>
                    <Plus size={14} />Create Playlist
                </div>
            </div>
          </nav>

          {/* Mood indicator */}
          <div onClick={() => navigate('/home')}
            style={{ margin: '6px 10px 8px', borderRadius: 10, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(6,182,212,0.06)'}>
            <span style={{ fontSize: 16 }}>{moodCfg.emoji}</span>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>Mood</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#67e8f9' }}>{moodCfg.label}</div>
            </div>
          </div>

          {/* User row */}
          <div className="user-menu-wrap" style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', cursor: 'pointer' }}
            onClick={() => setUserMenuOpen(p => !p)}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, boxShadow: '0 0 10px rgba(6,182,212,0.4)', flexShrink: 0 }}>{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#e0f2fe', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'Guest'}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'Not signed in'}</div>
              </div>
              <ChevronUp size={10} style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 'auto', flexShrink: 0, transform: userMenuOpen ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform .2s' }} />
            </div>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ position: 'absolute', bottom: 'calc(100% + 4px)', left: 8, right: 8, background: 'rgba(2,6,20,0.97)', backdropFilter: 'blur(24px)', border: '1px solid rgba(6,182,212,0.18)', borderRadius: 10, overflow: 'hidden', zIndex: 50 }}
                  onClick={e => e.stopPropagation()}>
                  {[
                    { label: 'View Profile', action: () => { navigate('/profile'); setUserMenuOpen(false); } },
                    { label: 'Sign In / Sign Up', action: () => { navigate('/login'); setUserMenuOpen(false); } },
                  ].map(({ label, action }) => (
                    <button key={label} onClick={action}
                      style={{ display: 'flex', alignItems: 'center', padding: '9px 12px', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 500, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit', transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>{label}</button>
                  ))}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '3px 0' }} />
                  <button onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', cursor: 'pointer', color: 'rgba(239,68,68,0.7)', fontSize: 12, fontWeight: 500, background: 'transparent', border: 'none', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={12} />Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'transparent', paddingBottom: 90 }}
          className="main-scroll">
          <Outlet />
        </main>
      </div>

      {/* PLAYER BAR */}
      <div style={{ height: 80, flexShrink: 0, background: 'rgba(2,4,12,0.97)', backdropFilter: 'blur(40px)', borderTop: '1px solid rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, position: 'relative', zIndex: 20 }}>
        {/* Progress */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
          onClick={e => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg,#06b6d4,#8b5cf6)', width: pct + '%', transition: 'width .5s linear' }} />
        </div>

        {/* Track info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, background: currentTrack?.albumImage ? 'transparent' : '#0d1b2a', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            {currentTrack?.albumImage ? <img src={currentTrack.albumImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>🎵</span>}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: currentTrack ? '#e0f2fe' : '#535353', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>
              {currentTrack?.name || 'Nothing playing'}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentTrack?.artist || 'Select a track'}
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', marginLeft: 4, padding: 3 }}>
            <Heart size={13} />
          </button>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1.4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setShuffle(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: shuffle ? '#06b6d4' : 'rgba(255,255,255,0.28)', transition: 'color .15s' }}><Shuffle size={14} /></button>
            <button onClick={playPrev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}><SkipBack size={16} fill="currentColor" /></button>
            <motion.button onClick={toggle} whileTap={{ scale: 0.92 }}
              style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(6,182,212,0.5)', position: 'relative' }}>
              {isPlaying && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(6,182,212,0.4)', animation: 'rpl 1.5s ease-out infinite' }} />}
              {isPlaying ? <Pause size={13} fill="white" color="white" /> : <Play size={13} fill="white" color="white" style={{ marginLeft: 2 }} />}
            </motion.button>
            <button onClick={playNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}><SkipForward size={16} fill="currentColor" /></button>
            <button onClick={cycleRepeat} style={{ background: 'none', border: 'none', cursor: 'pointer', color: repeat !== 'none' ? '#06b6d4' : 'rgba(255,255,255,0.28)', transition: 'color .15s', fontSize: 11, fontWeight: 700 }}>
              {repeat === 'one' ? '1×' : <Repeat size={14} />}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', maxWidth: 240 }}>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', minWidth: 28, textAlign: 'right' }}>{fmtTime(progress)}</span>
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, cursor: 'pointer' }}
              onClick={e => { const r = e.currentTarget.getBoundingClientRect(); seek((e.clientX - r.left) / r.width); }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#06b6d4,#8b5cf6)', borderRadius: 2, width: pct + '%', transition: 'width .5s linear' }} />
            </div>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', minWidth: 28 }}>{fmtTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Volume2 size={13} color="rgba(6,182,212,0.4)" />
          <div style={{ width: 64, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, cursor: 'pointer' }}
            onClick={e => { const r = e.currentTarget.getBoundingClientRect(); changeVolume(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); }}>
            <div style={{ height: '100%', background: 'rgba(6,182,212,0.4)', borderRadius: 2, width: (volume * 100) + '%' }} />
          </div>
        </div>
      </div>
      <style>{`@keyframes rpl{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.4);opacity:0}} .main-scroll::-webkit-scrollbar{width:2px;} .main-scroll::-webkit-scrollbar-thumb{background:rgba(6,182,212,0.2);}`}</style>
    </div>
  );
}
