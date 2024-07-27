const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  prefix: {
    type: String,
    default: '!',
  },
  thumbnail: {
    type: String,
    default: 'https://i.imgur.com/5z8d20x.png',
  },
  voiceChannelId: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Server', serverSchema);