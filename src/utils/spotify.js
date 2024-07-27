const { logger } = require('./logger');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

/**
 * Retrieves information about a Spotify song.
 *
 * @param {string} query The song URL or search query.
 * @returns {Promise<object | null>} An object containing the song information, or null if no song is found.
 */
async function getSongInfo(query) {
  try {
    // Check if the query is a valid Spotify URL
    if (query.startsWith('https://open.spotify.com/')) {
      const track = await spotifyApi.getTrack(query.split('/').pop());
      return {
        title: track.body.name,
        url: track.body.external_urls.spotify,
        thumbnail: track.body.album.images[0].url,
        source: 'spotify',
        duration: track.body.duration_ms / 1000,
      };
    } else {
      // If the query is not a URL, search Spotify for the song
      const searchResults = await spotifyApi.searchTracks(query);
      if (searchResults.body.tracks.items.length > 0) {
        const track = searchResults.body.tracks.items[0];
        return {
          title: track.name,
          url: track.external_urls.spotify,
          thumbnail: track.album.images[0].url,
          source: 'spotify',
          duration: track.duration_ms / 1000,
        };
      }
    }
  } catch (error) {
    logger.error(`Error getting Spotify song info: ${error}`);
  }
  return null;
}

/**
 * Retrieves a user's Spotify playlists.
 *
 * @param {string} accessToken The user's Spotify access token.
 * @returns {Promise<object[] | null>} An array of playlists, or null if no playlists are found.
 */
async function getPlaylists(accessToken) {
  try {
    spotifyApi.setAccessToken(accessToken);
    const playlists = await spotifyApi.getUserPlaylists();
    return playlists.body.items;
  } catch (error) {
    logger.error(`Error getting Spotify playlists: ${error}`);
  }
  return null;
}

/**
 * Plays a Spotify playlist.
 *
 * @param {string} playlistId The ID of the Spotify playlist.
 * @param {string} accessToken The user's Spotify access token.
 * @returns {Promise<object[] | null>} An array of tracks in the playlist, or null if the playlist is not found.
 */
async function playPlaylist(playlistId, accessToken) {
  try {
    spotifyApi.setAccessToken(accessToken);
    const tracks = await spotifyApi.getPlaylistTracks(playlistId);
    return tracks.body.items.map(item => ({
      title: item.track.name,
      url: item.track.external_urls.spotify,
      thumbnail: item.track.album.images[0].url,
      source: 'spotify',
      duration: item.track.duration_ms / 1000,
    }));
  } catch (error) {
    logger.error(`Error playing Spotify playlist: ${error}`);
  }
  return null;
}

module.exports = {
  getSongInfo,
  getPlaylists,
  playPlaylist,
};