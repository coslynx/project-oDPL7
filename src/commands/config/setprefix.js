const { SlashCommandBuilder } = require('discord.js');
const { config, helpers } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Sets the command prefix for the server')
    .addStringOption(option =>
      option
        .setName('prefix')
        .setDescription('The new command prefix')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    const newPrefix = interaction.options.getString('prefix');

    try {
      await config.setPrefix(interaction.guild.id, newPrefix);
      await interaction.reply({
        content: `Command prefix set to: ${newPrefix}`,
      });
    } catch (error) {
      helpers.logger.error(`Error setting prefix: ${error}`);
      await interaction.reply({
        content: 'There was an error setting the prefix.',
        ephemeral: true,
      });
    }
  },
};