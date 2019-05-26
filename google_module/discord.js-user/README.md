
## Better, faster, stronger.
> Discord.js is a powerful [Node.js](https://nodejs.org) module that allows you to interact with the
[Discord API](https://discordapp.com/developers/docs/intro) very easily.

**Selfbots. No ban risk. Simple and efficient.**

This library allows you to use userbots oriented methods like `acceptInvite()`, `guildCreate()`, `friendAdd()` and many stuff that got removed since the last __discord.js__ update.

This library make userbots use safer because this module behaves like a real discord client.

This way, discord is not able to recognize userbotting.

## Installation
**Node.js 8.0.0 or newer is required.**  

`npm install --save discord.js-user`

Ignore any warnings about unmet peer dependencies, as they're all optional.

## Example usage
```js
const Discord = require('discord.js-user');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.createGuild({params}).then(guild => {
    console.log(`Guild ${guild.name} created!`);
  }) // Creates a guild, see documentation for params

  client.user.acceptInvite('invite');
  // Joins a guild by following an invite link / code.
});

client.login('token');
```
