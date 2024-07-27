const { SlashCommandBuilder } = require('discord.js');
const { music, helpers } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current music queue'),
  async execute(interaction) {
    const queue = music.getQueue(interaction.guild.id);
    if (!queue) {
      return await interaction.reply({
        content: 'There are no songs in the queue.',
      });
    }
    const queueMessage = helpers.formatQueue(queue);
    await interaction.reply({
      embeds: [queueMessage],
    });
  },
};