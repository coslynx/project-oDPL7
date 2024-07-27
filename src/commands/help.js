const { SlashCommandBuilder } = require('discord.js');
const { helpers } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of available commands'),
  async execute(interaction) {
    const commands = interaction.client.commands;
    const commandsList = commands.map(command => `\`${command.data.name}\`: ${command.data.description}`).join('\n');

    await interaction.reply({
      content: `Here are the available commands: \n${commandsList}`,
    });
  },
};