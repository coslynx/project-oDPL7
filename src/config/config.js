require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  prefix: process.env.DEFAULT_PREFIX || '!',
  defaultThumbnail: process.env.DEFAULT_THUMBNAIL || 'https://i.imgur.com/5z8d20x.png',
  // Add other configuration options as needed
};