const { Client, IntentsBitField, Collection } = require('discord.js');
const { Client: VoiceClient } = require('@discordjs/voice');
const { token, prefix } = require('./config/config');
const { logger } = require('./utils/logger');

// Import all commands
const commands = new Collection();
const commandFiles = require('fs').readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.data.name, command);
}

// Import all events
const eventFiles = require('fs').readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildVoiceStates] });

client.commands = commands;
client.voiceClient = new VoiceClient();

// Login to Discord
client.login(token).then(() => {
  logger.info(`Bot is logged in as ${client.user.tag}`);
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`Error executing command ${interaction.commandName}: ${error}`);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});