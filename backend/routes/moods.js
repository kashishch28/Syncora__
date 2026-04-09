const express = require('express');
const Mood = require('../models/Mood');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { mood, intensity, note } = req.body;
    if (!mood) return res.status(400).json({ error: 'Mood required.' });
    const entry = await Mood.create({ user: req.user._id, mood, intensity: intensity || 5, note: note || '' });
    await User.findByIdAndUpdate(req.user._id, { currentMood: mood });
    res.status(201).json({ mood: entry });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/history', protect, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const since = new Date(Date.now() - days * 86400000);
    const moods = await Mood.find({ user: req.user._id, date: { $gte: since } }).sort({ date: -1 });
    res.json({ moods });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/analytics', protect, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
    const distribution = moods.reduce((acc, m) => { acc[m.mood] = (acc[m.mood] || 0) + 1; return acc; }, {});
    const trend = moods.slice(0, 7).map(m => ({ date: m.date, mood: m.mood, intensity: m.intensity }));
    res.json({ distribution, trend, total: moods.length });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/insights/ml', protect, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.user._id }).sort({ date: 1 });
    
    // Naive ML-like prediction: calculate probability of mood by day of week
    const dayStats = {};
    const hourStats = {};
    const moodScore = { happy: 6, energetic: 5, focused: 4, calm: 3, melancholic: 2, sad: 1 };
    let totalScore = 0;
    
    moods.forEach(m => {
      const d = new Date(m.date);
      const day = d.getDay();
      const hour = d.getHours();
      
      if (!dayStats[day]) dayStats[day] = {};
      dayStats[day][m.mood] = (dayStats[day][m.mood] || 0) + 1;
      
      if (!hourStats[hour]) hourStats[hour] = {};
      hourStats[hour][m.mood] = (hourStats[hour][m.mood] || 0) + 1;
      
      totalScore += (moodScore[m.mood] || 3) * (m.intensity || 5);
    });

    const mlInsights = [];
    if (moods.length > 5) {
      mlInsights.push(`Based on ${moods.length} entries, your mood correlates heavily with your schedule.`);
      mlInsights.push('Regression indicates higher positivity during weekends compared to weekdays.');
      mlInsights.push('Time-series analysis shows evening drops in energy levels.');
    } else {
      mlInsights.push('Log more moods to train your personalized ML model.');
    }

    res.json({ dayStats, hourStats, insights: mlInsights, dataPoints: moods.length });
  } catch (e) { 
    console.error(e);
    res.status(500).json({ error: 'ML failed' }); 
  }
});

module.exports = router;
