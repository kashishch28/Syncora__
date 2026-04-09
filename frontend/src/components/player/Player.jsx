import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, Heart, ListMusic, Maximize2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { fmtTime, fmtDuration } from '../../utils/helpers';

export default function Player() {
  const { currentTrack, isPlaying, progress, duration, volume, shuffle, repeat, toggle, playNext, playPrev, seek, changeVolume, setShuffle, setRepeat } = usePlayer();
  const { user, updateUser } = useAuth();
  const [muted, setMuted] = useState(false);
  const [prevVol, setPrevVol] = useState(0.7);

  const isLiked = user?.likedTracks?.includes(currentTrack?.id);

  const handleLike = async () => {
    if (!currentTrack || !user) return;
    try {
      const r = await authAPI.likeTrack(currentTrack.id);
      updateUser({ likedTracks: r.data.likedTracks });
    } catch (e) {}
  };

  const handleMute = () => {
    if (muted) { changeVolume(prevVol); setMuted(false); }
    else { setPrevVol(volume); changeVolume(0); setMuted(true); }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek((e.clientX - rect.left) / rect.width);
  };

  const cycleRepeat = () => {
    const modes = ['none','all','one'];
    setRepeat(modes[(modes.indexOf(repeat)+1) % 3]);
  };

  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 select-none"
      style={{ background: 'rgba(12,12,12,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)', height: 90 }}>

      {/* Progress bar - full width at top */}
      <div className="progress-bar absolute top-0 left-0 right-0 rounded-none" style={{ height: 3 }} onClick={handleSeek}>
        <div className="progress-fill" style={{ width: pct + '%' }} />
      </div>

      <div className="flex items-center h-full px-4" style={{ paddingTop: 3 }}>

        {/* Track info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {currentTrack && (
              <motion.div key={currentTrack.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                style={{ background:'#282828', boxShadow:'0 8px 24px rgba(0,0,0,0.5)' }}>
                {currentTrack.albumImage
                  ? <img src={currentTrack.albumImage} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">🎵</div>}
              </motion.div>
            )}
          </AnimatePresence>

          {currentTrack ? (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate" style={{ fontFamily:'Bricolage Grotesque' }}>{currentTrack.name}</p>
              <p className="text-xs truncate" style={{ color:'#b3b3b3' }}>{currentTrack.artist}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm" style={{ color:'#535353' }}>Nothing playing</p>
              <p className="text-xs" style={{ color:'#535353' }}>Pick a track to start</p>
            </div>
          )}

          {currentTrack && (
            <button onClick={handleLike} className="ml-2 flex-shrink-0 transition-transform active:scale-90"
              style={{ background:'none', border:'none', color: isLiked ? '#1db954' : '#535353' }}>
              <Heart size={16} fill={isLiked ? '#1db954' : 'none'} />
            </button>
          )}
        </div>

        {/* Controls - center */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="flex items-center gap-5">
            <button onClick={() => setShuffle(p=>!p)} style={{ background:'none', border:'none', color: shuffle ? '#1db954' : '#b3b3b3', transition:'color 0.15s' }}>
              <Shuffle size={16} />
            </button>
            <button onClick={playPrev} style={{ background:'none', border:'none', color:'white', opacity: currentTrack?1:0.4 }}>
              <SkipBack size={20} fill="white" />
            </button>
            <motion.button onClick={toggle} whileTap={{ scale:0.92 }}
              disabled={!currentTrack}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background:'white', border:'none', opacity: currentTrack?1:0.5 }}>
              {isPlaying ? <Pause size={16} fill="black" color="black" /> : <Play size={16} fill="black" color="black" style={{ marginLeft:2 }} />}
            </motion.button>
            <button onClick={playNext} style={{ background:'none', border:'none', color:'white', opacity: currentTrack?1:0.4 }}>
              <SkipForward size={20} fill="white" />
            </button>
            <button onClick={cycleRepeat} style={{ background:'none', border:'none', color: repeat!=='none' ? '#1db954' : '#b3b3b3', transition:'color 0.15s' }}>
              {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full max-w-xs">
            <span className="text-xs" style={{ color:'#b3b3b3', minWidth:32, textAlign:'right' }}>{fmtTime(progress)}</span>
            <div className="progress-bar flex-1" onClick={handleSeek}>
              <div className="progress-fill" style={{ width: pct + '%' }} />
            </div>
            <span className="text-xs" style={{ color:'#b3b3b3', minWidth:32 }}>{fmtDuration(currentTrack?.duration)}</span>
          </div>
        </div>

        {/* Volume - right */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button onClick={handleMute} style={{ background:'none', border:'none', color:'#b3b3b3' }}>
            {muted || volume === 0 ? <VolumeX size={16}/> : <Volume2 size={16}/>}
          </button>
          <div className="progress-bar" style={{ width:90 }} onClick={e => {
            const r = e.currentTarget.getBoundingClientRect();
            changeVolume(Math.max(0, Math.min(1, (e.clientX-r.left)/r.width)));
          }}>
            <div className="progress-fill" style={{ width: (volume*100)+'%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
