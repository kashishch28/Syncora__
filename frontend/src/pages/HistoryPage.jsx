import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { fmtDuration } from '../utils/helpers';
import { format } from 'date-fns';
import TrackRow from '../components/ui/TrackRow';

export default function HistoryPage() {
  const { user } = useAuth();
  const { play } = usePlayer();
  const history = user?.recentTracks || [];

  return (
    <div style={{ padding: '24px 24px 40px' }}>
      <div className="flex items-center gap-3 mb-8">
        <Clock size={28} color="#1db954" />
        <h1 style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 28, color: 'white' }}>Recently Played</h1>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <Clock size={48} color="#535353" className="mx-auto mb-4" />
          <p style={{ color: '#b3b3b3', fontSize: 18, fontWeight: 600 }}>Nothing played yet</p>
          <p style={{ color: '#535353', fontSize: 14, marginTop: 8 }}>Start listening to see your history here.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {history.map((t, i) => (
             <TrackRow key={t.trackId + i + Math.random()} track={{ ...t, id: t.trackId, duration: 0 }} index={i} queue={history.map(h => ({ ...h, id: h.trackId }))} />
          ))}
        </div>
      )}
    </div>
  );
}
