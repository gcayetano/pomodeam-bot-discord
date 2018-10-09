require('dotenv').config();
const Discord = require('discord.js');

let connectedChannelId = null;

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', () => {
  // ready...
  console.log('Redi');
});

bot.on('message', message => {
  // ignore messages from bots
  if (message.author.bot) {
    return;
  }

  if (message.content.substring(0, 1) != '!' && !connectedChannelId) {
    message.reply('Hello! There are no channels where to send the notifications. Please use `!start` in a channel')
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
          .addField('!start', 'Start pomodoro time counter', true)
          .setColor('#F52C28');
        message.channel.send(helpEmbed);
      break;
      case 'start':
        connectedChannelId = message.channel.id;
        const teamodoro = require('./teamodoro')(bot, connectedChannelId);
        teamodoro.start();
        message.channel.send('Pomodoro counter started!');
      break;
    }
  }
});

bot.login(process.env.BOT_TOKEN);
