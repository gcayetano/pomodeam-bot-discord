class Teamodoro {
  constructor(bot, channel) {
    this.lastState = null;
    this.lastMinute = null;
    this.interval = null;
    this.timeDifference = 0;
    this.started = false;

    this.bot = bot;
    this.channel = channel;
  }

  start() {
    this.updateClock();
    this.interval = setInterval(this.updateClock.bind(this), 500);
    this.started = true;

    if (this.inBreak()){
      this.bot.channels.get(this.channel).send('@here Pomodoro! 5 minutitos de RELAX!')
    }
  }

  stop() {
    clearInterval(this.interval);
    this.started = false;
  }

  updateClock() {
    this.messageOnStateChange();
    this.lastState = this.inBreak() ? "break" : "focus";
  }

  timeCallback(response) {
    this.timeDifference = new Date() - new Date(response.datetime);
  }

  getDate() {
    return new Date((new Date()).valueOf() + this.timeDifference);
  }

  getMinutes() {
    return new Date(new Date() + this.timeDifference).getSeconds();
  }

  inBreak() {
    const minutes = this.getDate().getMinutes();
    return /*(minutes >= 25 && minutes <= 29) || */(minutes >= 55 && minutes <= 59);
  }

  messageOnStateChange() {
    if (this.inBreak() && this.lastState == "focus"){
      this.bot.channels.get(this.channel).send('@here Pomodoro! 5 minutitos de RELAX!')
    }
    else if (!this.inBreak() && this.lastState == "break"){
      this.bot.channels.get(this.channel).send('@here Se acabó el Pomodoro! ¡A TRABAJAR!')
    }
  }

  isStarted() {
    return this.started;
  }
}

module.exports = (bot, channel) => new Teamodoro(bot, channel);
