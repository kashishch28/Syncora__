const express = require('express');
const Playlist = require('../models/Playlist');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    res.json({ playlists });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/public', protect, async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate('owner', 'username displayName avatar')
      .sort({ createdAt: -1 }).limit(20);
    res.json({ playlists });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const pl = await Playlist.findById(req.params.id).populate('owner', 'username displayName avatar');
    if (!pl) return res.status(404).json({ error: 'Not found' });
    res.json({ playlist: pl });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, isPublic, tags } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const pl = await Playlist.create({ owner: req.user._id, name, description: description || '', isPublic: isPublic !== false, tags: tags || [] });
    res.status(201).json({ playlist: pl });
  } catch (e) { res.status(500).json({ error: 'Failed to create' }); }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const pl = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!pl) return res.status(404).json({ error: 'Not found' });
    const { name, description, isPublic, tags } = req.body;
    if (name !== undefined) pl.name = name;
    if (description !== undefined) pl.description = description;
    if (isPublic !== undefined) pl.isPublic = isPublic;
    if (tags !== undefined) pl.tags = tags;
    await pl.save();
    res.json({ playlist: pl });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/:id/tracks', protect, async (req, res) => {
  try {
    const pl = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!pl) return res.status(404).json({ error: 'Not found' });
    const track = req.body;
    if (pl.tracks.some(t => t.trackId === track.trackId)) return res.status(409).json({ error: 'Already in playlist' });
    pl.tracks.push(track);
    await pl.save();
    res.json({ playlist: pl });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.delete('/:id/tracks/:trackId', protect, async (req, res) => {
  try {
    const pl = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!pl) return res.status(404).json({ error: 'Not found' });
    pl.tracks = pl.tracks.filter(t => t.trackId !== req.params.trackId);
    await pl.save();
    res.json({ playlist: pl });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/:id/like', protect, async (req, res) => {
  try {
    const pl = await Playlist.findById(req.params.id);
    if (!pl) return res.status(404).json({ error: 'Not found' });
    const idx = pl.likes.indexOf(req.user._id);
    if (idx === -1) pl.likes.push(req.user._id);
    else pl.likes.splice(idx, 1);
    await pl.save();
    res.json({ likes: pl.likes.length });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

module.exports = router;
