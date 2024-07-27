const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { logger } = require('./logger');

/**
 * Retrieves information about a YouTube song.
 *
 * @param {string} query The song URL or search query.
 * @returns {Promise<object | null>} An object containing the song information, or null if no song is found.
 */
async function getSongInfo(query) {
  try {
    // Check if the query is a valid YouTube URL
    if (ytdl.validateURL(query)) {
      const info = await ytdl.getInfo(query);
      return {
        title: info.videoDetails.title,
        url: info.videoDetails.video_url,
        thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
        source: 'youtube',
        duration: info.videoDetails.lengthSeconds,
      };
    } else {
      // If the query is not a URL, search YouTube for the song
      const searchResults = await ytsr(query);
      const video = searchResults.items.find(
        item => item.type === 'video' && item.link
      );

      if (video) {
        const info = await ytdl.getInfo(video.link);
        return {
          title: info.videoDetails.title,
          url: info.videoDetails.video_url,
          thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
          source: 'youtube',
          duration: info.videoDetails.lengthSeconds,
        };
      }
    }
  } catch (error) {
    logger.error(`Error getting YouTube song info: ${error}`);
  }
  return null;
}

module.exports = {
  getSongInfo,
};