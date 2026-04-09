import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Shuffle, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import TrackRow from '../components/ui/TrackRow';

export default function LikedPage() {
  const { user } = useAuth();
  const { play, toggle, isPlaying, currentTrack, setShuffle } = usePlayer();
  const liked = user?.likedTracks || [];

  const handlePlayAll = () => {
    if (!liked.length) return;
    play(liked[0], liked, 0);
  };

  const isActive = liked.some(t => t.trackId === currentTrack?.id);

  return (
    <div style={{ minHeight: '100%' }}>
      <div className="flex items-end gap-6 p-6"
        style={{ background: 'linear-gradient(180deg, #450af5 0%, #111111 100%)', paddingBottom: 24 }}>
        <div className="w-52 h-52 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #450af5 0%, #c4efd9 100%)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
          <Heart size={64} color="white" fill="white" />
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#b3b3b3', marginBottom: 6 }}>Playlist</p>
          <h1 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 48, color: 'white' }}>Liked Songs</h1>
          <p style={{ fontSize: 14, color: '#b3b3b3', marginTop: 8 }}>
            {user?.username} · {liked.length} songs
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-6 py-4">
        <button onClick={handlePlayAll}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{ background: '#1db954', border: 'none', boxShadow: '0 8px 24px rgba(29,185,84,0.4)', opacity: liked.length ? 1 : 0.5 }}>
          {isActive && isPlaying ? <Pause size={22} fill="black" color="black" /> : <Play size={22} fill="black" color="black" style={{ marginLeft: 3 }} />}
        </button>
      </div>

      <div className="px-6 pb-8">
        {liked.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} color="#535353" className="mx-auto mb-4" />
            <p style={{ color: '#b3b3b3', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Songs you like will appear here</p>
            <p style={{ color: '#535353', fontSize: 14 }}>Press the heart icon on any track to save it here.</p>
          </div>
        ) : (
          <div>
            <div className="grid gap-4 px-3 pb-2 mb-2" style={{ gridTemplateColumns: '40px 1fr auto', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 12, color: '#b3b3b3' }}>#</span>
              <span style={{ fontSize: 12, color: '#b3b3b3' }}>Title</span>
              <span style={{ fontSize: 12, color: '#b3b3b3' }}>Liked At</span>
            </div>
            <div className="space-y-1">
              {liked.map((t, i) => (
                <TrackRow key={t.trackId + i} track={{ ...t, id: t.trackId, duration: 0 }} index={i} queue={liked.map(l => ({ ...l, id: l.trackId }))} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
