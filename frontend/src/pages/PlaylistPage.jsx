import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Shuffle, MoreHorizontal, Clock, Pencil, Trash2, Lock, Globe } from 'lucide-react';
import { playlistAPI } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import TrackRow from '../components/ui/TrackRow';

export default function PlaylistPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { play, toggle, isPlaying, currentTrack, setQueue, setQueueIndex, setShuffle } = usePlayer();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    playlistAPI.getOne(id)
      .then(r => { setPlaylist(r.data.playlist); setEditName(r.data.playlist.name); setEditDesc(r.data.playlist.description); })
      .catch(() => navigate('/home'))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = user?._id === (playlist?.owner?._id || playlist?.owner);
  const isActive = playlist?.tracks?.some(t => t.trackId === currentTrack?.id);

  const handlePlayAll = () => {
    if (!playlist?.tracks?.length) return;
    const tracks = playlist.tracks.map(t => ({ ...t, id: t.trackId }));
    play(tracks[0], tracks, 0);
  };

  const handleShuffle = () => {
    if (!playlist?.tracks?.length) return;
    const tracks = playlist.tracks.map(t => ({ ...t, id: t.trackId }));
    setShuffle(true);
    const rand = Math.floor(Math.random() * tracks.length);
    play(tracks[rand], tracks, rand);
  };

  const handleSaveEdit = async () => {
    try {
      const r = await playlistAPI.update(id, { name: editName, description: editDesc });
      setPlaylist(p => ({ ...p, name: r.data.playlist.name, description: r.data.playlist.description }));
      setEditing(false);
    } catch {}
  };

  const handleDelete = async () => {
    if (!confirm('Delete this playlist?')) return;
    await playlistAPI.remove(id);
    navigate('/home');
  };

  const handleRemoveTrack = async (trackId) => {
    try {
      const r = await playlistAPI.removeTrack(id, trackId);
      setPlaylist(p => ({ ...p, tracks: r.data.playlist.tracks }));
    } catch {}
  };

  if (loading) return (
    <div className="flex justify-center items-center" style={{ height: '100%' }}>
      <div className="w-8 h-8 rounded-full border-2 spin" style={{ borderColor: '#1db954', borderTopColor: 'transparent' }} />
    </div>
  );

  const tracks = (playlist?.tracks || []).map(t => ({ ...t, id: t.trackId }));
  const totalMs = tracks.reduce((a, t) => a + (t.duration || 0), 0);
  const totalMin = Math.floor(totalMs / 60000);

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-end gap-6 p-6"
        style={{ background: 'linear-gradient(180deg, #3d3d3d 0%, #111111 100%)', paddingBottom: 24 }}>
        <div className="w-52 h-52 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #1db954 0%, #0d5c2a 100%)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
          <span style={{ fontSize: 64 }}>🎵</span>
        </div>

        <div className="flex-1 min-w-0">
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#b3b3b3', marginBottom: 6 }}>Playlist</p>
          {editing ? (
            <div className="space-y-2 mb-3">
              <input className="input-field" value={editName} onChange={e => setEditName(e.target.value)}
                style={{ fontSize: 22, fontWeight: 700, padding: '6px 12px' }} autoFocus />
              <input className="input-field" value={editDesc} onChange={e => setEditDesc(e.target.value)}
                placeholder="Add description..." style={{ fontSize: 14, padding: '6px 12px' }} />
              <div className="flex gap-2">
                <button className="btn-primary" style={{ padding: '6px 18px', fontSize: 13 }} onClick={handleSaveEdit}>Save</button>
                <button className="btn-outline" style={{ padding: '6px 18px', fontSize: 13 }} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <h1 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 42, color: 'white', lineHeight: 1.1, marginBottom: 8, wordBreak: 'break-word' }}>
              {playlist?.name}
            </h1>
          )}
          {playlist?.description && !editing && (
            <p style={{ fontSize: 14, color: '#b3b3b3', marginBottom: 8 }}>{playlist.description}</p>
          )}
          <p style={{ fontSize: 13, color: '#b3b3b3' }}>
            {playlist?.owner?.displayName || playlist?.owner?.username || 'You'} · {tracks.length} songs
            {totalMin > 0 && `, about ${totalMin} min`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-6 py-4">
        <button onClick={handlePlayAll}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{ background: '#1db954', border: 'none', boxShadow: '0 8px 24px rgba(29,185,84,0.4)' }}>
          {isActive && isPlaying ? <Pause size={22} fill="black" color="black" /> : <Play size={22} fill="black" color="black" style={{ marginLeft: 3 }} />}
        </button>
        <button onClick={handleShuffle}
          style={{ background: 'none', border: 'none', color: '#b3b3b3', padding: 4 }}
          onMouseEnter={e => e.target.style.color = 'white'}
          onMouseLeave={e => e.target.style.color = '#b3b3b3'}>
          <Shuffle size={22} />
        </button>
        {isOwner && (
          <>
            <button onClick={() => setEditing(true)}
              style={{ background: 'none', border: 'none', color: '#b3b3b3', padding: 4 }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = '#b3b3b3'}>
              <Pencil size={18} />
            </button>
            <button onClick={handleDelete}
              style={{ background: 'none', border: 'none', color: '#b3b3b3', padding: 4 }}
              onMouseEnter={e => e.target.style.color = '#ef4444'}
              onMouseLeave={e => e.target.style.color = '#b3b3b3'}>
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>

      {/* Track list */}
      <div className="px-6 pb-8">
        {/* Header row */}
        <div className="grid gap-4 px-3 pb-2 mb-2" style={{ gridTemplateColumns: '40px 1fr auto', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: 12, color: '#b3b3b3' }}>#</span>
          <span style={{ fontSize: 12, color: '#b3b3b3' }}>Title</span>
          <Clock size={14} color="#b3b3b3" />
        </div>

        {tracks.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: '#535353', fontSize: 16 }}>This playlist is empty</p>
            <p style={{ color: '#535353', fontSize: 13, marginTop: 8 }}>Search for songs to add them here.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {tracks.map((t, i) => (
              <TrackRow key={t.trackId + i} track={t} index={i} queue={tracks}
                onRemove={isOwner ? handleRemoveTrack : null} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
