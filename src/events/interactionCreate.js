const { music, helpers } = require('../utils/helpers');

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      helpers.logger.error(`Error executing command ${interaction.commandName}: ${error}`);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  },
};