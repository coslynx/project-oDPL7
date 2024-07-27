const { music, helpers } = require('../utils/helpers');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    if (message.author.bot) return;

    const guildId = message.guild.id;
    const queue = music.getQueue(guildId);

    // Check if the bot is in a voice channel
    if (queue && music.isPlaying() && !queue.voiceChannel) {
      await music.joinVoiceChannel(message.guild, queue.voiceChannelId);
    }

    // If the message starts with the command prefix
    if (message.content.startsWith(helpers.config.getPrefix(guildId))) {
      // Remove the command prefix from the message
      const args = message.content.slice(helpers.config.getPrefix(guildId).length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      // Check if the command is registered
      const command = message.client.commands.get(commandName);

      if (command) {
        try {
          // Execute the command
          await command.execute(message, args);
        } catch (error) {
          helpers.logger.error(`Error executing command ${commandName}: ${error}`);
          await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    }
  },
};