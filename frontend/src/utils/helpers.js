export const fmtDuration = (ms) => {
  if (!ms) return '0:00';
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export const fmtTime = (secs) => {
  const s = Math.floor(secs || 0);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export const MOODS = [
  { id: 'happy',       label: 'Happy',       emoji: '😊', color: '#f59e0b' },
  { id: 'energetic',   label: 'Energetic',   emoji: '⚡', color: '#ef4444' },
  { id: 'focused',     label: 'Focused',     emoji: '🎯', color: '#3b82f6' },
  { id: 'calm',        label: 'Calm',        emoji: '😌', color: '#10b981' },
  { id: 'sad',         label: 'Sad',         emoji: '😢', color: '#8b5cf6' },
  { id: 'melancholic', label: 'Melancholic', emoji: '🌧️', color: '#94a3b8' },
];

export const getMood = id => MOODS.find(m => m.id === id) || MOODS[0];
