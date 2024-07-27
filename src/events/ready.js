const { helpers } = require('../utils/helpers');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    helpers.logger.info(`Logged in as ${client.user.tag}!`);

    // Register all slash commands globally
    // Replace with specific guild registration if needed
    client.application.commands.set(client.commands.map(command => command.data));
  },
};