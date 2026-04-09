import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Save, X, Star, Crown, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { musicAPI } from '../services/api';
import { MOODS, getMood } from '../utils/helpers';

const card = { background:'rgba(2,5,15,0.7)', backdropFilter:'blur(14px)', border:'1px solid rgba(6,182,212,0.1)', borderRadius:12, padding:14, position:'relative', overflow:'hidden', marginBottom:12 };
const cardLine = { position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(6,182,212,0.2),transparent)' };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [activeMood, setActiveMood] = useState(user?.currentMood || 'calm');

  useEffect(() => {
    musicAPI.moodHistory(14).then(r => setMoodHistory(r.data.moods)).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { authAPI } = await import('../services/api');
      const r = await authAPI.updateProfile({ displayName, bio, currentMood: activeMood });
      updateUser(r.data.user);
      setEditing(false);
    } catch {}
    finally { setSaving(false); }
  };

  const handleMoodLog = async mood => {
    setActiveMood(mood);
    try {
      await musicAPI.logMood({ mood, intensity: 5 });
      const { authAPI } = await import('../services/api');
      await authAPI.updateProfile({ currentMood: mood });
      updateUser({ currentMood: mood });
    } catch {}
  };

  const moodCounts = moodHistory.reduce((a, m) => { a[m.mood] = (a[m.mood]||0)+1; return a; }, {});
  const topMood = Object.entries(moodCounts).sort((a,b)=>b[1]-a[1])[0];
  const initials = (user?.username || 'AK').substring(0, 2).toUpperCase();

  return (
    <div style={{ padding:'22px 24px 48px', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", color:'#f8fafc', maxWidth:720 }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:11, color:'rgba(6,182,212,0.6)', fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:3 }}>Your Space</div>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:24, fontWeight:900, background:'linear-gradient(135deg,#e0f2fe 40%,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Profile</div>
      </div>

      {/* Hero */}
      <div style={{ ...card, marginBottom:16 }}>
        <div style={cardLine} />
        <div style={{ display:'flex', alignItems:'flex-end', gap:16 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#06b6d4,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, flexShrink:0, boxShadow:'0 0 24px rgba(6,182,212,0.4)' }}>{initials}</div>
          <div style={{ flex:1 }}>
            {editing ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display name"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(6,182,212,0.2)', borderRadius:8, color:'#e0f2fe', padding:'7px 12px', fontSize:14, fontWeight:700, outline:'none', fontFamily:'inherit', maxWidth:260 }} />
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Short bio..."
                  rows={2} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(6,182,212,0.2)', borderRadius:8, color:'#e0f2fe', padding:'7px 12px', fontSize:12, outline:'none', fontFamily:'inherit', resize:'vertical', maxWidth:380 }} />
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={handleSave} disabled={saving}
                    style={{ padding:'6px 14px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#06b6d4,#8b5cf6)', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}>
                    <Save size={12} />{saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(false)}
                    style={{ padding:'6px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.4)', fontSize:12, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}>
                    <X size={12} />Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:900, background:'linear-gradient(135deg,#e0f2fe,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:4 }}>
                  {user?.displayName || user?.username || 'Syncora User'}
                </div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:6 }}>{user?.email} · Member since 2025</div>
                {user?.bio && <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:8 }}>{user.bio}</div>}
                <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:6, background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.2)', fontSize:10, fontWeight:700, color:'#67e8f9' }}>✦ Free Plan</div>
              </>
            )}
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)}
              style={{ padding:'6px 14px', borderRadius:8, border:'1px solid rgba(6,182,212,0.25)', background:'rgba(6,182,212,0.08)', color:'#67e8f9', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6, alignSelf:'flex-start' }}>
              <Edit2 size={11} />Edit
            </button>
          )}
        </div>
      </div>

      {/* 2 col grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
        {/* Personal Info */}
        <div style={card}>
          <div style={cardLine} />
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(6,182,212,0.5)', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:10 }}>Personal Info</div>
          {[
            ['Full Name', user?.displayName || user?.username || 'Not set'],
            ['Email', user?.email || 'Not set'],
            ['Age', user?.age || '—'],
            ['Gender', user?.gender || '—'],
            ['Location', user?.location || '—'],
          ].map(([lbl, val]) => (
            <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{lbl}</span>
              <span style={{ fontSize:11, fontWeight:600, color:'#e0f2fe', maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Analytics Summary */}
        <div style={card}>
          <div style={cardLine} />
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(6,182,212,0.5)', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:10 }}>Analytics Summary</div>
          {[
            ['Mood Entries', moodHistory.length || 47, '#67e8f9'],
            ['Streak', Math.min(moodHistory.length, 12) + ' days 🔥', '#f59e0b'],
            ['Top Mood', topMood ? getMood(topMood[0]).label + ' ' + getMood(topMood[0]).emoji : '😊 Happy', '#f59e0b'],
            ['Top Genre', 'Ambient', '#e0f2fe'],
            ['Tracks Played', 284, '#e0f2fe'],
          ].map(([lbl, val, color]) => (
            <div key={lbl} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{lbl}</span>
              <span style={{ fontSize:11, fontWeight:600, color: color || '#e0f2fe' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mood selector */}
      <div style={card}>
        <div style={cardLine} />
        <div style={{ fontSize:14, fontWeight:700, color:'#e0f2fe', marginBottom:6 }}>How are you feeling today?</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:14 }}>Your mood shapes your music recommendations.</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
          {MOODS.map(m => (
            <button key={m.id} onClick={() => handleMoodLog(m.id)}
              style={{ padding:'6px 14px', borderRadius:500, fontSize:12, fontWeight:600, cursor:'pointer', border:'1px solid', borderColor: activeMood===m.id ? m.color+'66' : 'rgba(255,255,255,0.13)', background: activeMood===m.id ? m.color+'20' : 'transparent', color: activeMood===m.id ? m.color : 'rgba(255,255,255,0.4)', transition:'all .15s', fontFamily:'inherit' }}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
        {topMood && (
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>
            Most frequent this week: <strong style={{ color: getMood(topMood[0]).color }}>{getMood(topMood[0]).emoji} {getMood(topMood[0]).label}</strong> ({topMood[1]}× logged)
          </div>
        )}
      </div>

      {/* Premium Upgrades */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#e0f2fe', marginBottom:12 }}>Subscription Plans</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12 }}>
            {[
                { name: 'Plus', price: '$2.99', perks: ['Basic Insights', '50 Journal Notes'], border: 'rgba(6,182,212,0.5)' },
                { name: 'Premium', price: '$4.99', perks: ['Advanced AI Insights', 'Unlimited Journal', 'Spotify Connect'], border: 'rgba(139,92,246,0.7)', popular: true },
                { name: 'Max', price: '$9.99', perks: ['Everything in Premium', 'Priority Support', 'Exclusive Themes', 'Early Access Features'], border: 'rgba(245,158,11,0.5)' }
            ].map(plan => (
                <motion.div 
                    key={plan.name}
                    whileHover={{ scale: 1.02, y: -4 }}
                    style={{ ...card, marginBottom:0, background:'rgba(2,5,15,0.8)', border:`1px solid ${plan.border}`, display:'flex', flexDirection:'column' }}
                >
                    {plan.popular && (
                        <div style={{ position:'absolute', top:0, right:0, background:'linear-gradient(135deg,#8b5cf6,#06b6d4)', color:'black', fontSize:9, fontWeight:800, padding:'3px 8px', borderBottomLeftRadius:8 }}>
                            MOST POPULAR
                        </div>
                    )}
                    <div style={{ fontSize:16, fontWeight:800, color:'#fff', fontFamily:'Playfair Display,serif', marginBottom:4 }}>{plan.name}</div>
                    <div style={{ fontSize:18, fontWeight:900, color: plan.border, marginBottom:12 }}>{plan.price}<span style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>/mo</span></div>
                    <div style={{ flex:1, marginBottom:12 }}>
                        {plan.perks.map(p => (
                            <div key={p} style={{ fontSize:10, color:'rgba(255,255,255,0.6)', marginBottom:6, display:'flex', alignItems:'center', gap:4 }}>
                                <span style={{ color:plan.border }}>✓</span> {p}
                            </div>
                        ))}
                    </div>
                    <button style={{ width:'100%', padding:'8px', borderRadius:8, background: plan.popular ? 'linear-gradient(135deg,#06b6d4,#8b5cf6)' : 'rgba(255,255,255,0.05)', color: plan.popular?'#000':'#fff', fontSize:11, fontWeight:700, border: plan.popular ? 'none' : `1px solid ${plan.border}`, cursor:'pointer' }}>
                        Upgrade
                    </button>
                </motion.div>
            ))}
        </div>
      </div>

      {/* Mood history */}
      {moodHistory.length > 0 && (
        <div style={card}>
          <div style={cardLine} />
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:13, fontWeight:700, color:'#e0f2fe', marginBottom:12 }}>Recent Mood History</div>
          {moodHistory.slice(0, 6).map((entry, i) => {
            const cfg = getMood(entry.mood);
            return (
              <motion.div key={entry._id || i} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:8, background:'rgba(6,182,212,0.03)', border:'1px solid rgba(6,182,212,0.06)', marginBottom:6 }}>
                <span style={{ fontSize:16 }}>{cfg.emoji}</span>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:cfg.color }}>{cfg.label}</span>
                  {entry.note && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{entry.note}</div>}
                </div>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>
                  {new Date(entry.date).toLocaleDateString('en', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' })}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
