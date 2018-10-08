require('dotenv').config();
const Discord = require('discord.js');

let connectedChannelId = null;

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', () => {
  // ready...
});

bot.on('message', message => {
  // ignore messages from bots
  if (message.author.bot) {
    return;
  }
  
  if (message.content.substring(0, 1) != '!' && !connectedChannelId) {
    message.reply('Hello! There are no channels where to send the notifications. Please use `!channel <channelName>`')
    return;
  } else if (message.content.substring(0, 1) != '!') {
    message.reply('Use `!help` to view the commands list');
    return;
  }

  if (message.content.substring(0, 1) == '!') {
    let args = message.content.substring(1).split(' ');
    const cmd = args[0];
    args = args.splice(1);

    switch(cmd) {
      case 'help':
        const helpEmbed = new Discord.RichEmbed()
          .setTitle('Help')
          .addField('!channel <name>', 'Set channel for notifications', true)
          .addField('!start', 'Start pomodoro time counter', true)
          .setColor('#F52C28');
        message.channel.send(helpEmbed);
      break;
      case 'channel':
        const found = bot.channels.find(x => x.name === args[0]);

        if (found) {
          connectedChannelId = found.id;
          message.channel.send(`Connected to channel: \`${args[0]}\``);
        } else {
          message.channel.send('Channel not found');
        }
      break;
      case 'start':
        const teamodoro = require('./teamodoro')(bot, connectedChannelId);
        teamodoro.start();
      break;
    }
  }
});

bot.login(process.env.BOT_TOKEN);
