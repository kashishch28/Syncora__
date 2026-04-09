import React from 'react';
import { MOODS } from '../../utils/helpers';

export default function MoodChip({ mood, active, onClick }) {
  const cfg = MOODS.find(m => m.id === mood) || MOODS[0];
  return (
    <button onClick={onClick}
      className="pill"
      style={{
        background: active ? 'white' : 'transparent',
        color: active ? 'black' : '#b3b3b3',
        borderColor: active ? 'white' : 'rgba(255,255,255,0.15)',
        display: 'flex', alignItems: 'center', gap: 6
      }}>
      <span>{cfg.emoji}</span> {cfg.label}
    </button>
  );
}
