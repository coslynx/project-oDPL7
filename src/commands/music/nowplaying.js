const { SlashCommandBuilder } = require('discord.js');
const { music, helpers } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Displays information about the currently playing song'),
  async execute(interaction) {
    const currentSong = music.getCurrentSong();
    if (!currentSong) {
      return await interaction.reply({
        content: 'There is no song currently playing.',
      });
    }
    const songMessage = helpers.formatSongInfo(currentSong);
    await interaction.reply({
      embeds: [songMessage],
    });
  },
};