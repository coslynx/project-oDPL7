const { logger } = require('./logger');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { VoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { getLyrics } = require('./genius');

const queues = new Map();
let currentPlayer;

/**
 * Retrieves information about a song from various sources (YouTube, Spotify, SoundCloud).
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
    }

    // Search YouTube for the song
    const searchResults = await ytsr(query);
    const video = searchResults.items.find(item => item.type === 'video' && item.link);

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

    // TODO: Implement support for Spotify and SoundCloud
    // ...
  } catch (error) {
    logger.error(`Error getting song info: ${error}`);
  }

  return null;
}

/**
 * Gets the music queue for a specific guild.
 *
 * @param {string} guildId The ID of the guild.
 * @returns {object | null} The music queue for the guild, or null if no queue exists.
 */
function getQueue(guildId) {
  return queues.get(guildId);
}

/**
 * Adds a song to the music queue.
 *
 * @param {object} queue The music queue.
 * @param {object} song The song information to add to the queue.
 */
function queueSong(queue, song) {
  queue.songs.push(song);
}

/**
 * Plays a song in a voice channel.
 *
 * @param {object} queue The music queue.
 * @param {VoiceChannel} voiceChannel The voice channel to play the song in.
 */
async function playSong(queue, voiceChannel) {
  if (!queue.connection) {
    queue.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
  }

  if (queue.songs.length > 0) {
    const currentSong = queue.songs[0];

    const resource = createAudioResource(ytdl(currentSong.url, { filter: 'audioonly' }));
    currentPlayer = createAudioPlayer();
    currentPlayer.play(resource);

    queue.voiceChannelId = voiceChannel.id;
    queue.connection.subscribe(currentPlayer);

    currentPlayer.on(AudioPlayerStatus.Idle, () => {
      queue.songs.shift();
      playSong(queue, voiceChannel);
    });

    logger.info(`Now playing: ${currentSong.title} in ${voiceChannel.guild.name}`);
  }
}

/**
 * Skips the current song in the queue.
 */
function skipSong() {
  if (currentPlayer && currentPlayer.state.status !== AudioPlayerStatus.Idle) {
    currentPlayer.stop();
  }
}

/**
 * Stops music playback and clears the queue.
 */
function stopMusic() {
  if (currentPlayer) {
    currentPlayer.stop();
    currentPlayer = null;
  }

  queues.forEach(queue => {
    queue.songs = [];
    queue.connection.disconnect();
  });
}

/**
 * Checks if music is currently playing.
 *
 * @returns {boolean} True if music is playing, false otherwise.
 */
function isPlaying() {
  return currentPlayer && currentPlayer.state.status !== AudioPlayerStatus.Idle;
}

/**
 * Gets the current song information.
 *
 * @returns {object | null} The current song information, or null if no song is playing.
 */
function getCurrentSong() {
  const queue = queues.get(currentPlayer.guildId);
  if (queue) {
    return queue.songs[0];
  }
  return null;
}

/**
 * Joins a voice channel.
 *
 * @param {Guild} guild The guild to join the voice channel in.
 * @param {string} channelId The ID of the voice channel to join.
 */
async function joinVoiceChannel(guild, channelId) {
  const queue = queues.get(guild.id);
  if (queue && queue.songs.length > 0 && !queue.connection) {
    queue.connection = joinVoiceChannel({
      channelId,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    playSong(queue, guild.channels.cache.get(channelId));
  }
}

/**
 * Leaves a voice channel.
 *
 * @param {Guild} guild The guild to leave the voice channel in.
 */
async function leaveVoiceChannel(guild) {
  const queue = queues.get(guild.id);
  if (queue && queue.connection) {
    queue.connection.disconnect();
  }
}

/**
 * Retrieves lyrics for a song.
 *
 * @param {string} songTitle The title of the song.
 * @param {string} artist The artist of the song.
 * @returns {Promise<string | null>} The lyrics of the song, or null if no lyrics are found.
 */
async function getLyricsForSong(songTitle, artist) {
  try {
    const lyrics = await getLyrics(songTitle, artist);
    return lyrics;
  } catch (error) {
    logger.error(`Error retrieving lyrics: ${error}`);
    return null;
  }
}

module.exports = {
  getSongInfo,
  getQueue,
  queueSong,
  playSong,
  skipSong,
  stopMusic,
  isPlaying,
  getCurrentSong,
  joinVoiceChannel,
  leaveVoiceChannel,
  getLyricsForSong,
};