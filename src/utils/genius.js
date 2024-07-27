const { Genius } = require('genius-lyrics');

const genius = new Genius(process.env.GENIUS_ACCESS_TOKEN);

/**
 * Retrieves the lyrics for a song from the Genius API.
 *
 * @param {string} songTitle The title of the song.
 * @param {string} artist The artist of the song.
 * @returns {Promise<string | null>} The lyrics of the song, or null if no lyrics are found.
 */
async function getLyrics(songTitle, artist) {
  try {
    const searchResults = await genius.search(songTitle);
    const song = searchResults.hits.find(hit => hit.result.artist_names.includes(artist));

    if (song) {
      const lyrics = await song.result.getLyrics();
      return lyrics.trim();
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching lyrics for ${songTitle} by ${artist}:`, error);
    return null;
  }
}

module.exports = {
  getLyrics,
};