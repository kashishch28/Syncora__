import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Library, Plus, ChevronRight, Music2, LogOut, Heart, Clock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { playlistAPI } from '../../services/api';

export default function Sidebar({ playlists, onPlaylistCreated }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const r = await playlistAPI.create({ name: newName.trim() });
      setNewName(''); setCreating(false);
      onPlaylistCreated?.(r.data.playlist);
      navigate('/playlist/' + r.data.playlist._id);
    } catch (e) {}
  };

  return (
    <aside style={{ width:240, background:'#000000', display:'flex', flexDirection:'column', height:'100%', flexShrink:0 }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 pt-6 pb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'#1db954' }}>
          <Music2 size={16} color="black" />
        </div>
        <span style={{ fontFamily:'Bricolage Grotesque', fontWeight:800, fontSize:20, color:'white' }}>Syncora</span>
      </div>

      {/* Main nav */}
      <nav className="px-3 mb-4">
        {[
          { to:'/home', icon:Home, label:'Home' },
          { to:'/search', icon:Search, label:'Search' },
        ].map(({ to, icon:Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Library */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ background:'#121212', borderRadius:8, margin:'0 8px' }}>
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <button className="sidebar-link" style={{ width:'auto', padding:'4px 0', fontWeight:600 }}>
            <Library size={20} />
            Your Library
          </button>
          <button onClick={() => setCreating(p=>!p)}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ background:'none', border:'none', color:'#b3b3b3' }}
            onMouseEnter={e=>e.target.style.color='white'}
            onMouseLeave={e=>e.target.style.color='#b3b3b3'}>
            <Plus size={18}/>
          </button>
        </div>

        {creating && (
          <form onSubmit={handleCreate} className="px-3 pb-3">
            <input className="input-field" placeholder="Playlist name..." value={newName}
              onChange={e=>setNewName(e.target.value)} autoFocus
              style={{ fontSize:13, padding:'8px 12px' }} />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="btn-primary" style={{ padding:'6px 16px', fontSize:12 }}>Create</button>
              <button type="button" className="btn-outline" style={{ padding:'6px 16px', fontSize:12 }} onClick={()=>setCreating(false)}>Cancel</button>
            </div>
          </form>
        )}

        <div className="overflow-y-auto flex-1 px-2 pb-4 space-y-0.5">
          <NavLink to="/liked" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')} style={{ borderRadius:6 }}>
            <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background:'linear-gradient(135deg,#450af5,#c4efd9)' }}>
              <Heart size={14} color="white" fill="white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Liked Songs</p>
              <p className="text-xs truncate" style={{ color:'#b3b3b3' }}>{user?.likedTracks?.length || 0} songs</p>
            </div>
          </NavLink>

          <NavLink to="/history" className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')} style={{ borderRadius:6 }}>
            <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background:'#282828' }}>
              <Clock size={14} color="#b3b3b3" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Recently Played</p>
              <p className="text-xs" style={{ color:'#b3b3b3' }}>History</p>
            </div>
          </NavLink>

          {playlists.map(pl => (
            <NavLink key={pl._id} to={'/playlist/'+pl._id}
              className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')} style={{ borderRadius:6 }}>
              <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background:'#282828' }}>
                <Music2 size={13} color="#b3b3b3" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#e0e0e0' }}>{pl.name}</p>
                <p className="text-xs truncate" style={{ color:'#b3b3b3' }}>Playlist · {pl.tracks?.length||0} songs</p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* User footer */}
      <div className="flex items-center gap-3 px-4 py-4 mt-2">
        <NavLink to="/profile" className="flex items-center gap-3 flex-1 min-w-0 group" style={{ textDecoration:'none' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background:'#535353' }}>
            <User size={14} color="white" />
          </div>
          <span className="text-sm font-semibold text-white truncate group-hover:underline">{user?.displayName || user?.username}</span>
        </NavLink>
        <button onClick={handleLogout} style={{ background:'none', border:'none', color:'#b3b3b3', padding:4 }}
          onMouseEnter={e=>e.target.style.color='white'}
          onMouseLeave={e=>e.target.style.color='#b3b3b3'}>
          <LogOut size={16}/>
        </button>
      </div>
    </aside>
  );
}
