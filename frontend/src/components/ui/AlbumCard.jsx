import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function AlbumCard({ track, queue, index = 0 }) {
  const { play, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack?.id === track?.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="card group relative"
      style={{ width: 180, flexShrink: 0 }}
      onClick={() => track.previewUrl && play(track, queue || [track], 0)}>

      <div className="relative mb-3" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ background: '#282828' }}>
          {track.albumImage
            ? <img src={track.albumImage} alt={track.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-4xl">🎵</div>}
        </div>
        <motion.button
          initial={{ opacity: 0, y: 8 }} whileHover={{ scale: 1.06 }}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ background: '#1db954', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', transform: 'translateY(4px)' }}
          whileInView={{ opacity: isActive ? 1 : undefined }}
          onClick={e => { e.stopPropagation(); track.previewUrl && play(track, queue || [track], 0); }}>
          <Play size={16} fill="black" color="black" style={{ marginLeft: 2 }} />
        </motion.button>
      </div>

      <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: 'Bricolage Grotesque' }}>{track.name}</p>
      <p className="text-xs mt-0.5 truncate" style={{ color: '#b3b3b3' }}>{track.artist}</p>
    </motion.div>
  );
}
