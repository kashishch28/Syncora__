import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { musicAPI } from '../services/api';
import { MOODS } from '../utils/helpers';
import TrackRow from '../components/ui/TrackRow';
import MoodChip from '../components/ui/MoodChip';
import AlbumCard from '../components/ui/AlbumCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [browseMood, setBrowseMood] = useState(null);
  const [moodTracks, setMoodTracks] = useState([]);
  const [moodLoading, setMoodLoading] = useState(false);
  const timerRef = useRef(null);

  const handleInput = (val) => {
    setQuery(val);
    clearTimeout(timerRef.current);
    if (!val.trim()) { setResults(null); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await musicAPI.search(val);
        setResults(r.data);
      } catch {}
      finally { setLoading(false); }
    }, 400);
  };

  const handleMoodBrowse = async (mood) => {
    if (browseMood === mood) { setBrowseMood(null); setMoodTracks([]); return; }
    setBrowseMood(mood); setMoodLoading(true);
    try {
      const r = await musicAPI.recommendations(mood);
      setMoodTracks(r.data.tracks);
    } catch {}
    finally { setMoodLoading(false); }
  };

  return (
    <div style={{ padding: '24px 24px 40px' }}>
      <h1 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 28, color: 'white', marginBottom: 20 }}>Search</h1>

      {/* Search input */}
      <div className="relative mb-8" style={{ maxWidth: 560 }}>
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#535353' }} />
        <input
          className="input-field"
          style={{ paddingLeft: 44, paddingRight: query ? 44 : 16, height: 48, borderRadius: 500, fontSize: 15 }}
          placeholder="What do you want to listen to?"
          value={query} onChange={e => handleInput(e.target.value)} />
        {query && (
          <button onClick={() => { setQuery(''); setResults(null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ background: 'none', border: 'none', color: '#b3b3b3' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search results */}
      <AnimatePresence mode="wait">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 spin" style={{ borderColor: '#1db954', borderTopColor: 'transparent' }} />
          </div>
        )}

        {results && !loading && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {results.tracks?.length > 0 ? (
              <section>
                <h2 className="section-title">Songs</h2>
                <div className="space-y-1">
                  {results.tracks.map((t, i) => (
                    <TrackRow key={t.id} track={t} index={i} queue={results.tracks} />
                  ))}
                </div>
              </section>
            ) : (
              <div className="text-center py-16">
                <p style={{ color: '#535353', fontSize: 16 }}>No results for "{query}"</p>
                <p style={{ color: '#535353', fontSize: 13, marginTop: 8 }}>Check spelling or try different keywords.</p>
              </div>
            )}
          </motion.div>
        )}

        {!query && !loading && (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="section-title">Browse by mood</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8" style={{ maxWidth: 600 }}>
              {MOODS.map((m, i) => (
                <motion.button key={m.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  onClick={() => handleMoodBrowse(m.id)}
                  className="rounded-xl p-4 text-left transition-all"
                  style={{
                    background: browseMood === m.id ? 'rgba(255,255,255,0.12)' : '#181818',
                    border: `1px solid ${browseMood === m.id ? 'rgba(255,255,255,0.2)' : 'transparent'}`,
                    cursor: 'pointer', height: 80
                  }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: 28 }}>{m.emoji}</span>
                    <div>
                      <p className="font-bold text-white" style={{ fontFamily: 'Bricolage Grotesque', fontSize: 16 }}>{m.label}</p>
                      <p style={{ fontSize: 12, color: '#b3b3b3' }}>Music for this mood</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {moodLoading && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 rounded-full border-2 spin" style={{ borderColor: '#1db954', borderTopColor: 'transparent' }} />
              </div>
            )}

            {moodTracks.length > 0 && !moodLoading && (
              <section>
                <h2 className="section-title">
                  {MOODS.find(m => m.id === browseMood)?.emoji} {MOODS.find(m => m.id === browseMood)?.label} Picks
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {moodTracks.map((t, i) => <AlbumCard key={t.id} track={t} queue={moodTracks} index={i} />)}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
