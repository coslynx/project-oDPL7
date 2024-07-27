const { SlashCommandBuilder } = require('discord.js');
const { music, helpers } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song'),
  async execute(interaction) {
    if (!music.isPlaying()) {
      return await interaction.reply({
        content: 'There is no song currently playing.',
      });
    }

    music.skipSong();
    await interaction.reply({
      content: 'Skipped the current song.',
    });
  },
};