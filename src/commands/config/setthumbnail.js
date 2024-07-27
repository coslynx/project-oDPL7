const { SlashCommandBuilder } = require('discord.js');
const { config, helpers } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setthumbnail')
    .setDescription('Sets the default thumbnail for the server')
    .addStringOption(option =>
      option
        .setName('thumbnail')
        .setDescription('The URL of the new thumbnail')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    const newThumbnail = interaction.options.getString('thumbnail');

    try {
      await config.setThumbnail(interaction.guild.id, newThumbnail);
      await interaction.reply({
        content: `Default thumbnail set to: ${newThumbnail}`,
      });
    } catch (error) {
      helpers.logger.error(`Error setting thumbnail: ${error}`);
      await interaction.reply({
        content: 'There was an error setting the thumbnail.',
        ephemeral: true,
      });
    }
  },
};