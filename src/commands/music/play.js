const { SlashCommandBuilder } = require('discord.js');
const { music, helpers } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song from YouTube, Spotify, or SoundCloud')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('The song URL or name to play')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return await interaction.reply({
        content: 'You need to be in a voice channel to play music!',
      });
    }

    const song = await music.getSongInfo(query);

    if (!song) {
      return await interaction.reply({
        content: `Could not find a song with the query: ${query}`,
      });
    }

    const queue = music.getQueue(interaction.guild.id);
    music.queueSong(queue, song);

    if (!music.isPlaying()) {
      await music.playSong(queue, voiceChannel);
    }

    await interaction.reply({
      content: `Queued ${song.title}`,
    });
  },
};