const { Events } = require("discord.js");
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    if (message.content.includes("🤓")) {
      message.react("🤓");
    } else if (message.content.includes("💀")) {
      message.react("💀");
    }
  },
};
