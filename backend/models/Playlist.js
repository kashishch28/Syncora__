const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  trackId: String, name: String, artist: String,
  album: String, albumImage: String, previewUrl: String,
  spotifyUrl: String, duration: Number, addedAt: { type: Date, default: Date.now }
});

const playlistSchema = new mongoose.Schema({
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, default: '', maxlength: 300 },
  coverImage:  { type: String, default: '' },
  isPublic:    { type: Boolean, default: true },
  tags:        [String],
  tracks:      [trackSchema],
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt:   { type: Date, default: Date.now },
  updatedAt:   { type: Date, default: Date.now }
});

playlistSchema.pre('save', function(next) { this.updatedAt = new Date(); next(); });
module.exports = mongoose.model('Playlist', playlistSchema);
