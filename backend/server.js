require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/music',     require('./routes/music'));
app.use('/api/moods',     require('./routes/moods'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Syncora API running' }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ status: 'API running', message: 'Build frontend first: cd frontend && npm run build && cp -r dist ../backend/public' });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/syncora';

mongoose.connect(MONGO)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log('🎵 Syncora running on http://localhost:' + PORT));
  })
  .catch(err => { console.error('❌ MongoDB failed:', err.message); process.exit(1); });
