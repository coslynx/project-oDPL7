const { SlashCommandBuilder } = require('discord.js');
const { helpers } = require('../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    const startTime = Date.now();
    await interaction.deferReply();

    const endTime = Date.now();
    const latency = endTime - startTime;

    await interaction.editReply(`Pong! 🏓 Latency is ${latency}ms.`);
  },
};