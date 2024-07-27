const { SlashCommandBuilder } = require('discord.js');
const { music, helpers } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the current music playback and clears the queue'),
  async execute(interaction) {
    if (!music.isPlaying()) {
      return await interaction.reply({
        content: 'There is no song currently playing.',
      });
    }

    music.stopMusic();
    await interaction.reply({
      content: 'Stopped the music and cleared the queue.',
    });
  },
};