const mongoose = require('mongoose');
const moodSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood:      { type: String, required: true, enum: ['happy','calm','sad','energetic','focused','melancholic'] },
  intensity: { type: Number, min: 1, max: 10, default: 5 },
  note:      { type: String, maxlength: 200, default: '' },
  tracks:    [{ trackId: String, name: String, artist: String }],
  date:      { type: Date, default: Date.now }
});
module.exports = mongoose.model('Mood', moodSchema);
