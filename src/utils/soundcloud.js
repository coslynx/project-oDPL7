const { logger } = require('./logger');
const SoundCloud = require('soundcloud-api');

const soundcloud = new SoundCloud({
  client_id: process.env.SOUNDCLOUD_CLIENT_ID,
  client_secret: process.env.SOUNDCLOUD_CLIENT_SECRET,
});

/**
 * Retrieves information about a SoundCloud song.
 *
 * @param {string} query The song URL or search query.
 * @returns {Promise<object | null>} An object containing the song information, or null if no song is found.
 */
async function getSongInfo(query) {
  try {
    // Check if the query is a valid SoundCloud URL
    if (query.startsWith('https://soundcloud.com/') || query.startsWith('https://soundcloud.app.goo.gl/')) {
      const track = await soundcloud.resolve(query);
      return {
        title: track.title,
        url: track.permalink_url,
        thumbnail: track.artwork_url,
        source: 'soundcloud',
        duration: track.duration / 1000,
      };
    } else {
      // If the query is not a URL, search SoundCloud for the song
      const searchResults = await soundcloud.search({ q: query });
      const track = searchResults.collection.find(track => track.kind === 'track');
      if (track) {
        return {
          title: track.title,
          url: track.permalink_url,
          thumbnail: track.artwork_url,
          source: 'soundcloud',
          duration: track.duration / 1000,
        };
      }
    }
  } catch (error) {
    logger.error(`Error getting SoundCloud song info: ${error}`);
  }
  return null;
}

module.exports = {
  getSongInfo,
};