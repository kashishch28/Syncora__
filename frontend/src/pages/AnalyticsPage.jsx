import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Calendar, Zap, Activity } from 'lucide-react';
import { musicAPI } from '../services/api';
import { MOODS, getMood } from '../utils/helpers';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const card = { background:'rgba(2,5,15,0.7)', backdropFilter:'blur(14px)', border:'1px solid rgba(6,182,212,0.1)', borderRadius:12, padding:14, position:'relative', overflow:'hidden', marginBottom:12 };

export default function AnalyticsPage() {
  const [moodHistory, setMoodHistory] = useState([]);
  const [insights, setInsights] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      musicAPI.moodHistory(14).then(r => setMoodHistory(r.data.moods)).catch(() => {}),
      musicAPI.moodInsights().then(r => setInsights(r.data.insights)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (moodHistory.length > 0) {
      // Map moods to a score for line charting
      const scoreMap = { happy: 100, energetic: 85, focused: 70, calm: 50, melancholic: 30, sad: 15 };
      const data = moodHistory.slice(0, 14).reverse().map(m => ({
        date: format(new Date(m.date), 'MMM dd'),
        score: scoreMap[m.mood] || 50,
        mood: getMood(m.mood).label,
        emoji: getMood(m.mood).emoji
      }));
      setChartData(data);
    }
  }, [moodHistory]);

  const moodCounts = moodHistory.reduce((a, m) => { a[m.mood] = (a[m.mood] || 0) + 1; return a; }, {});
  const topMood = Object.entries(moodCounts).sort((a,b)=>b[1]-a[1])[0];
  const streak = Math.min(moodHistory.length, 12);

  if (loading) {
    return <div className="p-8 text-cyan-400">Loading AI Insights...</div>;
  }

  return (
    <div style={{ padding:'24px', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", color:'#f8fafc', maxWidth:'800px', margin: '0 auto' }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:11, color:'rgba(6,182,212,0.6)', fontWeight:600, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:3 }}>Deep Dive</div>
        <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:900, background:'linear-gradient(135deg,#e0f2fe 40%,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>AI Analytics</div>
      </div>

      {/* Hero Chart */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-6">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2 font-[Playfair_Display] text-lg">
          <Activity className="text-cyan-400" size={20} /> Mood Progression Graph
        </h3>
        {chartData.length > 0 ? (
            <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ background: 'rgba(5,10,20,0.9)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '8px', color: 'white', fontSize: 12 }}
                    itemStyle={{ color: '#06b6d4' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}
                    formatter={(val, name, props) => [`${props.payload.emoji} ${props.payload.mood}`, 'Mood']}
                />
                <Area type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
            </ResponsiveContainer>
            </div>
        ) : (
            <div className="h-[200px] flex items-center justify-center text-white/30 text-sm">Log some moods to generate the graph.</div>
        )}
      </motion.div>

      {/* Grid containing Quick Stats and ML Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Quick Stats */}
          <div className="flex flex-col gap-4">
              <div className="glass-card p-4 flex items-center justify-between hover:border-cyan-400/30 transition-colors">
                  <div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Dominant Mood</div>
                      <div className="text-xl font-bold flex items-center gap-2">
                          {topMood ? `${getMood(topMood[0]).emoji} ${getMood(topMood[0]).label}` : 'None'}
                      </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center"><Brain size={18} className="text-cyan-400" /></div>
              </div>
              <div className="glass-card p-4 flex items-center justify-between hover:border-purple-400/30 transition-colors">
                  <div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Streak</div>
                      <div className="text-xl font-bold text-amber-400">{streak} Days 🔥</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center"><Zap size={18} className="text-amber-400" /></div>
              </div>
          </div>

          {/* ML Insights */}
          <motion.div initial={{ opacity:0, x: 20 }} animate={{ opacity:1, x:0 }} className="glass-card p-5 border border-purple-500/20" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.05), rgba(139,92,246,0.1))' }}>
              <h3 className="font-bold text-white mb-4 flex items-center gap-2 font-[Playfair_Display]">
                  <Brain size={18} className="text-purple-400" /> Machine Learning Output
              </h3>
              {insights && insights.length > 0 ? (
                  <ul className="space-y-3">
                      {insights.map((ins, i) => (
                          <li key={i} className="text-xs text-white/70 flex items-start gap-3">
                              <span className="w-[4px] h-[4px] bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                              <span className="leading-relaxed">{ins}</span>
                          </li>
                      ))}
                  </ul>
              ) : (
                  <p className="text-xs text-white/40">Gathering enough data to provide personalized ML models...</p>
              )}
          </motion.div>
      </div>

      {/* Distributions */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-white mb-4 font-[Playfair_Display]">Mood Distribution Score</h3>
        <div className="space-y-3">
          {Object.entries(moodCounts).sort((a,b)=>b[1]-a[1]).map(([m, count], i) => {
            const cfg = getMood(m);
            const pct = Math.round((count / moodHistory.length) * 100);
            return (
                <div key={m} className="flex items-center gap-4">
                    <span className="text-sm font-semibold w-24 text-right">{cfg.emoji} {cfg.label}</span>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full" style={{ background: cfg.color }} />
                    </div>
                    <span className="text-xs text-white/50 w-8">{pct}%</span>
                </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
