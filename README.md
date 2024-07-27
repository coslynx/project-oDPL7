# Discord Music Bot

This repository contains the source code for a Discord music bot built with Node.js and Discord.js. This bot allows users to play music from various platforms like YouTube, Spotify, and SoundCloud within their Discord servers.

## Features

- **Music Playback:** Play music from YouTube, Spotify, and SoundCloud.
- **Playback Control:** Pause, resume, skip, and stop music playback.
- **Queue Management:** View the current music queue and add new songs.
- **Visual Enhancements:** Display song thumbnails, title, and progress bar.
- **Channel Management:** Designate a custom control channel for music requests.
- **Customization:** Configure command prefixes and default thumbnails.
- **Slash Commands:** Use Discord's slash commands for a modern and intuitive experience.
- **Error Handling:** Robust error handling to ensure stability and reliability.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/discord-music-bot.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and add the following environment variables:

```
DISCORD_TOKEN=your_discord_bot_token
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
SOUNDCLOUD_CLIENT_SECRET=your_soundcloud_client_secret
GENIUS_ACCESS_TOKEN=your_genius_access_token
```

4. Invite the bot to your server:

- Go to the Discord Developer Portal and create a new application.
- Create a bot user for your application.
- Obtain the bot token from the Discord Developer Portal.
- Use the generated invite link to invite the bot to your server.

## Usage

After installation and setup, you can use the following commands:

- `/play [song URL]` or `/play [song name]` - Play a song from YouTube, Spotify, or SoundCloud.
- `/queue` - View the current music queue.
- `/skip` - Skip the current song.
- `/stop` - Stop music playback and clear the queue.
- `/nowplaying` - Display information about the currently playing song.
- `/setprefix [new prefix]` - Change the command prefix for the server.
- `/setthumbnail [thumbnail URL]` - Change the default thumbnail for the server.
- `/help` - Get a list of available commands.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with descriptive commit messages.
4. Push your changes to your fork.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.