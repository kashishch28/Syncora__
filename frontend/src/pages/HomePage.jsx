import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { musicAPI } from '../services/api';
import { MOODS, getMood } from '../utils/helpers';

const INSIGHTS = {
  happy:"You're radiating good vibes — your upbeat playlist perfectly amplifies your energy.",
  calm:"Calm moods follow productive mornings. Your ambient selections reflect inner balance.",
  energetic:"High energy today! Your playlist is fueling your momentum and driving you forward.",
  focused:"Deep work mode activated. Instrumental selections sharpen your flow state.",
  sad:"Music can be a companion through difficult moments. Your selections show beautiful depth.",
  melancholic:"Introspective music for introspective moments. Your musical intelligence runs deeply.",
};

export default function HomePage() {
  const { user } = useAuth();
  const { play, setQueue } = usePlayer();
  const navigate = useNavigate();
  const [activeMood, setActiveMood] = useState('calm');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const moodCfg = getMood(activeMood);

  useEffect(() => {
    setLoading(true);
    musicAPI.recommendations(activeMood)
      .then(r => { setTracks(r.data.tracks); setQueue(r.data.tracks); setIsMock(r.data.isMock); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeMood]);

  const handleMood = async mood => {
    setActiveMood(mood);
    try { await musicAPI.logMood({ mood }); } catch {}
  };

  const recent = user?.recentTracks?.slice(0, 6) || [];

  return (
    <div style={{ padding:'22px 24px 40px', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", color:'#f8fafc' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:'rgba(6,182,212,0.6)', fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:3 }}>{greeting}</div>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:900, background:'linear-gradient(135deg,#e0f2fe 40%,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1.1 }}>
          {user?.displayName || user?.username || 'Aryan'}
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', marginTop:3 }}>
          {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })}
        </div>
      </motion.div>

      {/* Recent quick grid */}
      {recent.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, maxWidth:640, marginBottom:24 }}>
          {recent.slice(0, 4).map((t, i) => (
            <motion.div key={t.trackId+i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.05 }}
              style={{ display:'flex', alignItems:'center', background:'rgba(6,182,212,0.05)', border:'1px solid rgba(6,182,212,0.1)', borderRadius:9, overflow:'hidden', height:52, cursor:'pointer', transition:'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(6,182,212,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(6,182,212,0.05)'}>
              <div style={{ width:52, height:52, flexShrink:0, background:'#0d1b2a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, overflow:'hidden' }}>
                {t.albumImage ? <img src={t.albumImage} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🎵'}
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:'#e0f2fe', padding:'0 12px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mood strip */}
      <div style={{ fontSize:11, fontWeight:700, color:'rgba(6,182,212,0.7)', marginBottom:8, letterSpacing:'.3px' }}>How are you feeling today?</div>
      <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
        {MOODS.map(m => (
          <button key={m.id} onClick={() => handleMood(m.id)}
            style={{ padding:'5px 12px', borderRadius:500, fontSize:11, fontWeight:600, cursor:'pointer', border:'1px solid', borderColor: activeMood===m.id ? m.color+'55' : 'rgba(255,255,255,0.08)', background: activeMood===m.id ? m.color+'20' : 'rgba(255,255,255,0.03)', color: activeMood===m.id ? '#fff' : 'rgba(255,255,255,0.4)', transition:'all .22s', transform: activeMood===m.id ? 'scale(1.04)' : 'none', fontFamily:'inherit' }}>
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {/* Insight */}
      <div style={{ borderRadius:14, padding:'12px 14px', marginBottom:16, display:'flex', alignItems:'flex-start', gap:10, background:'rgba(2,6,18,0.7)', border:'1px solid rgba(6,182,212,0.2)', position:'relative', overflow:'hidden', backdropFilter:'blur(12px)' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(6,182,212,0.4),transparent)' }} />
        <div style={{ position:'absolute', top:-40, right:-20, width:120, height:120, borderRadius:'50%', filter:'blur(40px)', opacity:0.12, background:moodCfg.color }} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><line x1="9" y1="21" x2="15" y2="21"/><line x1="9" y1="18" x2="15" y2="18"/></svg>
        <div>
          <div style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'.8px', marginBottom:3, color:'#67e8f9' }}>Mood Insight</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.58)', lineHeight:1.65 }}>{INSIGHTS[activeMood]}</div>
        </div>
      </div>

      {/* Picks heading */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#e0f2fe,#94a3b8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
          {moodCfg.emoji} {moodCfg.label} Picks {isMock && <span style={{ fontSize:10, WebkitTextFillColor:'rgba(255,255,255,0.2)' }}>(demo)</span>}
        </div>
        <button onClick={() => tracks[0] && play(tracks[0], tracks, 0)}
          style={{ padding:'4px 12px', borderRadius:7, border:'1px solid rgba(6,182,212,0.25)', background:'rgba(6,182,212,0.08)', color:'#67e8f9', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          ▶ Play All
        </button>
      </div>

      {/* Album cards */}
      {loading ? (
        <div style={{ display:'flex', gap:10, marginBottom:20, overflow:'hidden' }}>
          {[...Array(5)].map((_,i) => (
            <div key={i} style={{ width:120, flexShrink:0 }}>
              <div style={{ width:120, height:120, borderRadius:12, background:'rgba(6,182,212,0.06)', marginBottom:8, animation:'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ height:11, width:'80%', background:'rgba(255,255,255,0.05)', borderRadius:4, marginBottom:5 }} />
              <div style={{ height:10, width:'60%', background:'rgba(255,255,255,0.04)', borderRadius:4 }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:6, marginBottom:20, scrollbarWidth:'none' }}>
          {tracks.map((t, i) => (
            <motion.div key={t.id||i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
              whileHover={{ y:-5 }}
              style={{ width:120, flexShrink:0, cursor:'pointer' }}
              onClick={() => t.previewUrl && play(t, tracks, i)}>
              <div style={{ width:120, height:120, borderRadius:12, background:'#0d1b2a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, marginBottom:8, position:'relative', overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)', boxShadow:'0 8px 24px rgba(0,0,0,0.7)', transition:'all .25s' }}>
                {t.albumImage ? <img src={t.albumImage} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span>🎵</span>}
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.09) 0%,transparent 55%)', pointerEvents:'none' }} />
                {t.previewUrl && (
                  <div style={{ position:'absolute', bottom:7, right:7, width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#06b6d4,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'all .2s', boxShadow:'0 4px 12px rgba(6,182,212,0.5)' }}
                    className="card-play">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21"/></svg>
                  </div>
                )}
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:'#e0f2fe', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.artist}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Track list */}
      {tracks.length > 0 && (
        <>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:14, fontWeight:700, background:'linear-gradient(135deg,#e0f2fe,#94a3b8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Track List</div>
            <span style={{ fontSize:10, color:'rgba(6,182,212,0.35)' }}>{tracks.length} tracks</span>
          </div>
          <div style={{ borderRadius:14, overflow:'hidden', border:'1px solid rgba(6,182,212,0.1)', background:'rgba(2,5,15,0.7)', backdropFilter:'blur(20px)', position:'relative' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(6,182,212,0.25),transparent)' }} />
            <div style={{ display:'grid', gridTemplateColumns:'28px 38px 1fr auto', gap:10, padding:'7px 12px 5px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              {['#','','Title','Time'].map(h => <span key={h} style={{ fontSize:9, fontWeight:700, color:'rgba(6,182,212,0.3)', letterSpacing:'.8px', textTransform:'uppercase' }}>{h}</span>)}
            </div>
            {tracks.slice(0, 8).map((t, i) => (
              <div key={t.id||i} onClick={() => t.previewUrl && play(t, tracks, i)}
                style={{ display:'grid', gridTemplateColumns:'28px 38px 1fr auto', alignItems:'center', gap:10, padding:'7px 12px', cursor: t.previewUrl ? 'pointer' : 'default', borderLeft:'2px solid transparent', transition:'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(6,182,212,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.22)', textAlign:'center' }}>{i+1}</span>
                <div style={{ width:34, height:34, borderRadius:6, background:'#0d1b2a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
                  {t.albumImage ? <img src={t.albumImage} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🎵'}
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:'#e0f2fe', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.name}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>{t.artist}</div>
                </div>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)' }}>
                  {t.duration ? `${Math.floor(t.duration/60000)}:${String(Math.floor((t.duration%60000)/1000)).padStart(2,'0')}` : '--:--'}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      <style>{`@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}} .card-play{opacity:0} *:hover > .card-play{opacity:1!important}`}</style>
    </div>
  );
}
