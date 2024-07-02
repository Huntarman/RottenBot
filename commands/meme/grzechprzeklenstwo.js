const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("grzechprzeklenstwo")
    .setDescription("Funny polish word gif"),
  async execute(interaction) {
    interaction.reply("https://media1.tenor.com/m/g4vrhU9n4doAAAAd/pai.gif");
  },
};
