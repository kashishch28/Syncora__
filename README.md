# 🎵 Syncora — Mood Intelligence Music Platform

A full-stack music app with mood tracking, encrypted journal, Spotify integration, analytics, and a cinematic UI.

---

## 🚀 Quick Start (2 steps)

### Step 1 — Backend

```bash
cd backend
npm install
copy .env.example .env     # Windows
# cp .env.example .env     # Mac/Linux
```

Edit `backend/.env` — set your MongoDB URI at minimum:
```
MONGODB_URI=mongodb://127.0.0.1:27017/syncora
JWT_SECRET=any_long_random_string
SPOTIFY_CLIENT_ID=    (optional — demo tracks work without it)
SPOTIFY_CLIENT_SECRET=(optional)
```

```bash
npm run dev
```

Open **http://localhost:5000** ✅

### Step 2 (dev mode only — optional hot reload)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🎨 Also Included

**`syncora_standalone_preview.html`** — Open this HTML file directly in any browser to see the full cinematic UI instantly, no server needed. Great for demos.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Auth | JWT login/register with bcrypt |
| 🎭 Mood tracking | 6 moods, logged to MongoDB |
| 🎵 Music player | Real audio playback with 30s previews |
| 🔍 Search | Live search with Spotify API |
| 📋 Playlists | Create, manage, add/remove tracks |
| ❤️ Liked songs | Heart any track |
| ⏱ History | Recently played tracks |
| 📓 Journal | Encrypted notes (AES) with mood tags |
| 📊 Analytics | 7-day trend chart, mood distribution, AI insights |
| 👤 Profile | Personal info, analytics summary, Premium upgrade |
| 🎨 UI | Cinematic dark theme, Framer Motion, animated player bar |
| 🧭 Nav | Top header nav + sidebar, profile dropdown, user menu |

---

## 🗂 Structure

```
syncora/
├── backend/              Node.js + Express API
│   ├── models/           User, Playlist, Mood
│   ├── routes/           auth, music, playlists, moods
│   ├── middleware/       JWT auth
│   ├── public/           Built React app (served here)
│   └── server.js
│
├── frontend/             React 18 + Vite
│   ├── src/
│   │   ├── components/   Layout (with player+nav), TrackRow, AlbumCard
│   │   ├── context/      Auth, Player
│   │   ├── pages/        Home, Search, Analytics, Profile, Playlist...
│   │   ├── services/     api.js (axios)
│   │   └── utils/        helpers.js
│   └── dist/             Built output
│
└── syncora_standalone_preview.html   Open in browser — no server needed
```

---

## 🎵 Spotify Setup

1. Go to https://developer.spotify.com/dashboard
2. Create app → copy Client ID & Secret
3. Add to `backend/.env`
4. Restart server

Without Spotify: demo tracks still load and player works.

---

## 🔒 Encryption

Journal notes use AES encryption client-side (CryptoJS). Password never stored — losing it means losing the note. Intentional by design.
