require('dotenv').config();
const Discord = require('discord.js');

const instances = [];

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

  if (message.content.startsWith(`<@${bot.user.id}>`)) {
    const args = message.content.split(' ');
    const cmd = args[1];
    const serverFound = instances.find(x => x.id === message.guild.id);

    switch (cmd) {
      case 'help':
        const helpEmbed = new Discord.RichEmbed()
          .setTitle('Commands list by mentioning this bot')
          .addField('start', 'Start pomodoro time counter')
          .addField('stop', 'Stop pomodoro time counter')
          .setColor('#F52C28');
        message.channel.send(helpEmbed);
      break;
      case 'start':
        if (!serverFound || !serverFound.teamodoro.isStarted()) {
          const teamodoro = require('./teamodoro')(bot, message.channel.id);
          teamodoro.start();
          instances.push({ id: message.guild.id, teamodoro});

          const startEmbed = new Discord.RichEmbed()
          .setTitle('Started!')
          .setDescription('Pomodoro counter has been started!')
          .setColor('#F52C28');
          message.channel.send(startEmbed);
        } else {
          message.reply(`The counter is already started. Use \`@${bot.user.tag} stop\` to stop it.`)
        }
      break;
      case 'stop':
        if (serverFound && serverFound.teamodoro.isStarted()) {
          serverFound.teamodoro.stop();

          const stopEmbed = new Discord.RichEmbed()
            .setTitle('Stopped!')
            .setDescription('Pomodoro counter has been stopped!')
            .setColor('#F52C28');
          message.channel.send(stopEmbed);
        } else {
          message.reply(`Pomodoro counter has not been started yet! Use  \`@${bot.user.tag} start\` to start it.`);
        }
      break;
      default:
        if (!serverFound || !serverFound.teamodoro.isStarted()) {
          message.reply(`Hello! mention me to start the pomodoro counter using \`@${bot.user.tag} start\``);
        } else {
          message.reply(`The counter is already started. Use \`@${bot.user.tag} stop\` to stop it.`)
        }
      break;
    }
  }
});

bot.login(process.env.BOT_TOKEN);
