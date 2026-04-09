import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from './AuthContext';

const Ctx = createContext(null);

export function PlayerProvider({ children }) {
  const authCtx = useAuth();
  const user = authCtx?.user;

  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('none');
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.7;
    }
    const audio = audioRef.current;

    const onEnded = () => {
      if (repeat === 'one') { audio.currentTime = 0; audio.play(); return; }
      playNext();
    };
    const onTime = () => setProgress(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDur);
    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDur);
    };
  }, [repeat, queue]);

  const currentTrack = queue[queueIndex] || null;

  const play = useCallback(async (track, newQueue, index) => {
    if (!track?.previewUrl) return;
    const audio = audioRef.current;
    if (newQueue) {
      setQueue(newQueue);
      setQueueIndex(index ?? newQueue.findIndex(t => t.id === track.id));
    }
    audio.src = track.previewUrl;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (e) {}
    if (user) {
      authAPI.addHistory({ trackId: track.id, name: track.name, artist: track.artist, albumImage: track.albumImage, previewUrl: track.previewUrl }).catch(() => {});
    }
  }, [user]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else if (audio.src) { try { await audio.play(); setIsPlaying(true); } catch(e){} }
  }, [isPlaying]);

  const playNext = useCallback(() => {
    if (!queue.length) return;
    const next = shuffle
      ? Math.floor(Math.random() * queue.length)
      : (queueIndex + 1) % queue.length;
    const track = queue[next];
    setQueueIndex(next);
    if (track?.previewUrl) play(track);
  }, [queue, queueIndex, shuffle, play]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    const prev = Math.max(0, queueIndex - 1);
    setQueueIndex(prev);
    play(queue[prev]);
  }, [queueIndex, queue, play]);

  const seek = useCallback((pct) => {
    const audio = audioRef.current;
    if (audio.duration) audio.currentTime = pct * audio.duration;
  }, []);

  const changeVolume = useCallback((v) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  return (
    <Ctx.Provider value={{ currentTrack, queue, queueIndex, isPlaying, progress, duration, volume, shuffle, repeat, setQueue, setQueueIndex, play, toggle, playNext, playPrev, seek, changeVolume, setShuffle, setRepeat }}>
      {children}
    </Ctx.Provider>
  );
}

export const usePlayer = () => useContext(Ctx);
