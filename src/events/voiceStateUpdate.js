const { music } = require('../utils/helpers');

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  async execute(oldState, newState) {
    // If the user joins a voice channel
    if (newState.member && newState.channelID && !oldState.channelID) {
      // Check if there is a music queue and if the bot is playing music
      const queue = music.getQueue(newState.guild.id);
      if (queue && music.isPlaying()) {
        // Join the voice channel
        await music.joinVoiceChannel(newState.guild, newState.channelID);
      }
    }

    // If the user leaves a voice channel
    if (oldState.member && oldState.channelID && !newState.channelID) {
      // Check if the bot is the only one left in the voice channel
      if (oldState.channel.members.size === 1) {
        // Leave the voice channel
        await music.leaveVoiceChannel(oldState.guild);
      }
    }
  },
};