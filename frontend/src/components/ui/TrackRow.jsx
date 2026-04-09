import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Plus, ExternalLink, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { authAPI, playlistAPI } from '../../services/api';
import { fmtDuration } from '../../utils/helpers';

export default function TrackRow({ track, index, queue, showIndex = true, playlistId, onRemove }) {
  const { currentTrack, isPlaying, play, toggle } = usePlayer();
  const { user, updateUser } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isActive = currentTrack?.id === track.id;
  const isLiked = user?.likedTracks?.includes(track.id);

  const handlePlay = () => {
    if (isActive) toggle();
    else play(track, queue || [track], queue ? queue.findIndex(t => t.id === track.id) : 0);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const r = await authAPI.likeTrack(track.id, { name: track.name, artist: track.artist, albumImage: track.albumImage, previewUrl: track.previewUrl });
      updateUser({ likedTracks: r.data.likedTracks });
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }}
      className={'track-row group' + (isActive ? ' active' : '')}
      style={{ gridTemplateColumns: showIndex ? '40px 1fr auto' : '1fr auto' }}
      onDoubleClick={handlePlay}>

      {/* Index / play */}
      {showIndex && (
        <div className="relative flex items-center justify-center w-8">
          <span className="group-hover:hidden text-sm" style={{ color: isActive ? '#1db954' : '#b3b3b3' }}>
            {isActive && isPlaying ? (
              <div className="equalizer"><span/><span/><span/></div>
            ) : (index + 1)}
          </span>
          <button onClick={handlePlay}
            className="hidden group-hover:flex items-center justify-center"
            style={{ background: 'none', border: 'none', color: 'white', padding: 0 }}>
            {isActive && isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
          </button>
        </div>
      )}

      {/* Track info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden"
          style={{ background: '#282828' }}>
          {track.albumImage
            ? <img src={track.albumImage} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-sm">🎵</div>}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: isActive ? '#1db954' : 'white' }}>
            {track.name}
          </p>
          <p className="text-xs truncate" style={{ color: '#b3b3b3' }}>
            {track.explicit && <span className="inline-block mr-1 px-1 rounded text-xs" style={{ background: '#535353', color: '#b3b3b3', fontSize: 9 }}>E</span>}
            {track.artist}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {!track.previewUrl && (
          <span className="text-xs" style={{ color: '#535353' }}>No preview</span>
        )}
        <button onClick={handleLike}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'none', border: 'none', color: isLiked ? '#1db954' : '#b3b3b3', padding: 4 }}>
          <Heart size={14} fill={isLiked ? '#1db954' : 'none'} />
        </button>
        <span className="text-xs" style={{ color: '#b3b3b3', minWidth: 36, textAlign: 'right' }}>
          {fmtDuration(track.duration)}
        </span>
        {onRemove && (
          <button onClick={e => { e.stopPropagation(); onRemove(track.id); }}
            className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded transition-all"
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: '#b3b3b3', cursor: 'pointer' }}>
            Remove
          </button>
        )}
      </div>
    </motion.div>
  );
}
