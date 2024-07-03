const { Events } = require("discord.js");
module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (!message.content.includes("🤓")) return;
    else {
      message.channel.send(`<@${message.author.id}> 🤓`);
    }
  },
};
