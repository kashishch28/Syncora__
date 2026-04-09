const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'syncora_secret', { expiresIn: '7d' });

router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 30 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ error: 'Email or username already taken' });
    const user = await User.create({ username, email, password, displayName: username });
    res.status(201).json({ token: sign(user._id), user: user.toJSON() });
  } catch (e) { res.status(500).json({ error: 'Registration failed' }); }
});

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: sign(user._id), user: user.toJSON() });
  } catch (e) { res.status(500).json({ error: 'Login failed' }); }
});

router.get('/me', protect, (req, res) => res.json({ user: req.user.toJSON() }));

router.put('/profile', protect, async (req, res) => {
  try {
    const { displayName, bio, currentMood } = req.body;
    const update = {};
    if (displayName !== undefined) update.displayName = displayName;
    if (bio !== undefined) update.bio = bio;
    if (currentMood !== undefined) update.currentMood = currentMood;
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });
    res.json({ user: user.toJSON() });
  } catch (e) { res.status(500).json({ error: 'Update failed' }); }
});

router.post('/like/:trackId', protect, async (req, res) => {
  try {
    const { trackId } = req.params;
    const user = req.user;
    const idx = user.likedTracks.findIndex(t => t.trackId === trackId);
    let liked = false;
    
    if (idx !== -1) {
      user.likedTracks.splice(idx, 1);
    } else {
      const { name, artist, albumImage, previewUrl } = req.body;
      user.likedTracks.unshift({ trackId, name, artist, albumImage, previewUrl, likedAt: new Date() });
      liked = true;
    }
    
    await user.save();
    res.json({ liked, likedTracks: user.likedTracks });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/history', protect, async (req, res) => {
  try {
    const { trackId, name, artist, albumImage, previewUrl } = req.body;
    const user = req.user;
    user.recentTracks = user.recentTracks.filter(t => t.trackId !== trackId);
    user.recentTracks.unshift({ trackId, name, artist, albumImage, previewUrl, playedAt: new Date() });
    if (user.recentTracks.length > 50) user.recentTracks = user.recentTracks.slice(0, 50);
    await user.save();
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

module.exports = router;
