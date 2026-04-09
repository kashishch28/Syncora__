const express = require('express');
const { protect } = require('../middleware/auth');
const Mood = require('../models/Mood');
const User = require('../models/User');
const router = express.Router();

const MOOD_PARAMS = {
  happy:       'seed_genres=pop%2Cdance&min_valence=0.6&min_energy=0.6&target_valence=0.9',
  calm:        'seed_genres=ambient%2Cclassical&max_energy=0.4&max_tempo=100&target_valence=0.5',
  sad:         'seed_genres=blues%2Csoul&max_valence=0.4&max_energy=0.4',
  energetic:   'seed_genres=edm%2Crock&min_energy=0.8&min_tempo=130',
  focused:     'seed_genres=classical%2Cambient&max_energy=0.5&max_speechiness=0.1',
  melancholic: 'seed_genres=indie%2Cfolk&max_valence=0.5&target_acousticness=0.7'
};

function mapITunesTrack(t) {
  return {
    trackId: String(t.trackId), id: String(t.trackId),
    name: t.trackName || 'Unknown Title',
    artist: t.artistName || 'Unknown Artist',
    album: t.collectionName || '',
    albumImage: (t.artworkUrl100 || '').replace('100x100bb', '600x600bb'),
    previewUrl: t.previewUrl || null,
    spotifyUrl: t.trackViewUrl || '',
    duration: t.trackTimeMillis || 0,
    explicit: t.trackExplicitness === 'explicit',
    popularity: 80
  };
}

const MOOD_QUERIES = {
  happy: 'upbeat pop',
  calm: 'ambient acoustic',
  sad: 'sad soul',
  energetic: 'edm party',
  focused: 'lofi beats',
  melancholic: 'indie folk'
};

function mapTrack(t) { return t; } // Keep for mockTracks signature
function mockTracks(mood) {
  const songs = [
    { id:'m1', name:'Blinding Lights', artists:[{name:'The Weeknd'}], album:{name:'After Hours',images:[{url:''}]}, preview_url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', external_urls:{spotify:'#'}, duration_ms:200000, explicit:false, popularity:99 },
    { id:'m2', name:'Levitating', artists:[{name:'Dua Lipa'}], album:{name:'Future Nostalgia',images:[{url:''}]}, preview_url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', external_urls:{spotify:'#'}, duration_ms:203000, explicit:false, popularity:95 },
    { id:'m3', name:'Stay With Me', artists:[{name:'Sam Smith'}], album:{name:'Lonely Hour',images:[{url:''}]}, preview_url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', external_urls:{spotify:'#'}, duration_ms:169000, explicit:false, popularity:88 },
    { id:'m4', name:'Watermelon Sugar', artists:[{name:'Harry Styles'}], album:{name:'Fine Line',images:[{url:''}]}, preview_url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', external_urls:{spotify:'#'}, duration_ms:174000, explicit:false, popularity:93 },
    { id:'m5', name:'Good 4 U', artists:[{name:'Olivia Rodrigo'}], album:{name:'SOUR',images:[{url:''}]}, preview_url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', external_urls:{spotify:'#'}, duration_ms:178000, explicit:false, popularity:91 },
    { id:'m6', name:'Industry Baby', artists:[{name:'Lil Nas X'}], album:{name:'Montero',images:[{url:''}]}, preview_url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', external_urls:{spotify:'#'}, duration_ms:212000, explicit:true, popularity:89 },
    { id:'m7', name:'As It Was', artists:[{name:'Harry Styles'}], album:{name:'Harry House',images:[{url:''}]}, preview_url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', external_urls:{spotify:'#'}, duration_ms:167000, explicit:false, popularity:97 },
    { id:'m8', name:'Heat Waves', artists:[{name:'Glass Animals'}], album:{name:'Dreamland',images:[{url:''}]}, preview_url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', external_urls:{spotify:'#'}, duration_ms:238000, explicit:false, popularity:92 },
  ];
  return songs.map((s, i) => ({
    trackId: mood + '_' + i, id: mood + '_' + i,
    name: s.name, artist: s.artists[0].name, album: s.album.name, albumImage: '',
    previewUrl: s.preview_url, spotifyUrl: '#', duration: s.duration_ms, explicit: s.explicit, popularity: s.popularity
  }));
}

router.get('/recommendations/:mood', protect, async (req, res) => {
  try {
    const { mood } = req.params;
    const query = MOOD_QUERIES[mood] || 'pop hits';
    const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=25`);
    if (!r.ok) throw new Error('itunes_error');
    const data = await r.json();
    res.json({ tracks: data.results.map(mapITunesTrack), mood, isMock: false });
  } catch (e) {
    res.json({ tracks: mockTracks(req.params.mood), mood: req.params.mood, isMock: true });
  }
});

router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    const r = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=25`);
    const data = await r.json();
    res.json({ tracks: data.results.map(mapITunesTrack), artists: [] });
  } catch (e) {
    const term = req.query.q.toLowerCase();
    const allMocks = mockTracks('happy');
    const matches = allMocks.filter(t => t.name.toLowerCase().includes(term) || t.artist.toLowerCase().includes(term));
    res.json({ error: 'requires_api', tracks: matches, artists: [] });
  }
});

router.get('/new-releases', protect, async (req, res) => {
  try {
    const r = await fetch('https://itunes.apple.com/search?term=latest+hits&entity=song&limit=15');
    const data = await r.json();
    res.json({ albums: data.results.map(mapITunesTrack) });
  } catch (e) { res.json({ error: 'requires_api', albums: [] }); }
});

router.get('/featured', protect, async (req, res) => {
  try {
    const r = await fetch('https://itunes.apple.com/search?term=top+charts&entity=song&limit=10');
    const data = await r.json();
    res.json({ playlists: data.results.map(mapITunesTrack) });
  } catch (e) { res.json({ error: 'requires_api', playlists: [] }); }
});

router.post('/mood', protect, async (req, res) => {
  try {
    const { mood, intensity, note, tracks } = req.body;
    if (!mood) return res.status(400).json({ error: 'Mood required' });
    const entry = await Mood.create({ user: req.user._id, mood, intensity: intensity || 5, note: note || '', tracks: tracks || [] });
    await User.findByIdAndUpdate(req.user._id, { currentMood: mood });
    res.status(201).json({ mood: entry });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

router.get('/mood/history', protect, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const since = new Date(Date.now() - days * 86400000);
    const moods = await Mood.find({ user: req.user._id, date: { $gte: since } }).sort({ date: -1 });
    res.json({ moods });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
});

module.exports = router;
