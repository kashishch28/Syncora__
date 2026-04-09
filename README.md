# 🎵 Syncora — Intelligent Music & Mood Platform

A full-stack, state-of-the-art music platform featuring mood-based recommendations, true End-to-End Encrypted (E2EE) journaling, predictive ML analytics, and a vibrant glassmorphic cinematic UI.

---

## 🚀 Quick Start (2 steps)

### Step 1 — Backend API

```bash
cd backend
npm install
copy .env.example .env     # Windows
# cp .env.example .env     # Mac/Linux
```

Edit `backend/.env` — set your MongoDB URI:
```
MONGODB_URI=mongodb://127.0.0.1:27017/syncora
JWT_SECRET=your_secure_secret_here
PORT=5001
```

```bash
npm run dev
```
The API is fully free and powered by the **Apple iTunes Search API**. No keys are required!

### Step 2 — Frontend GUI

```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5174** to interact with the platform! ✅

---

## ✨ Cutting-Edge Features

| Feature | Description |
|---|---|
| 🎵 **Global Search** | Unlimited, free API integration utilizing Apple iTunes instead of Spotify to offer millions of high-quality `.m4a` music previews. |
| 📓 **The Vault (E2EE)** | Military-grade AES encrypted journaling. Encryption keys are processed entirely client-side guaranteeing zero-knowledge server storage. |
| 📊 **Advanced Analytics** | Real-time `recharts` data visualizations predicting your future mood trends using statistical ML distribution algorithms. |
| 🎨 **Cinematic UI** | Floating dynamic orbs, translucent glass UI elements, and meticulously crafted Framer Motion animations across all routing transitions. |
| 📋 **User Playlists** | Fully unrestricted drag/drop/delete playlist creation system utilizing MongoDB database reference arrays. |
| ❤️ **Fully Playable Library** | Cached `previewUrl` data allows your History and Liked songs to stream seamlessly inside your personalized library. |

---

## 🗂 Project Architecture

```
syncora/
├── backend/              Express API & MongoDB Schemas
│   ├── models/           User, Playlist, Mood
│   ├── routes/           auth, music, playlists, moods
│   └── server.js         API Entry (Port 5001)
│
├── frontend/             Vite + React
│   ├── src/
│   │   ├── components/   TrackRows, Dynamic Layouts
│   │   ├── context/      React Context (Auth, Player)
│   │   └── pages/        Routing endpoints (Analytics, Liked, Journal)
```

---

## 🔒 Security Posture

### E2EE Journal Notes
Journal entries use AES encryption via `crypto-js`. The master password resides entirely in React's memory space and is never transmitted over HTTP. **By design**, if you lose your vault password, your journal entries are permanently unrecoverable. 

### Free Open API Migration
Syncora explicitly bypassed Spotify's controversial "Premium Developer" restrictions by hot-swapping the entire music core to the public iTunes GraphQL/Search endpoints, unlocking the system for free users permanently.
