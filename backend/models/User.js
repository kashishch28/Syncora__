const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true, minlength: 6, select: false },
  displayName: { type: String, default: '' },
  bio:         { type: String, default: '', maxlength: 200 },
  avatar:      { type: String, default: '' },
  following:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likedTracks: [{ trackId: String, name: String, artist: String, albumImage: String, previewUrl: String, likedAt: { type: Date, default: Date.now } }],
  recentTracks:[{ trackId: String, name: String, artist: String, albumImage: String, previewUrl: String, playedAt: { type: Date, default: Date.now } }],
  playlists:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  currentMood: { type: String, enum: ['happy','calm','sad','energetic','focused','melancholic',null], default: null },
  spotifyId:   { type: String, default: '' },
  createdAt:   { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function(pw) { return bcrypt.compare(pw, this.password); };
userSchema.methods.toJSON = function() { const o = this.toObject(); delete o.password; return o; };

module.exports = mongoose.model('User', userSchema);
