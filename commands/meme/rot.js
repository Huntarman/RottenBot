const { SlashCommandBuilder } = require("discord.js");
const dict = {
  0: "Skibidi",
  1: "Rizz",
  2: "Ohio",
  3: "Gyatt",
  4: "Fanum tax",
  5: "Rizzler",
  6: "Sigma",
  7: "GRRRBARKBARK BARK WOOF MEOOOW",
  8: "SKIBIDI BOP BOP BOP YES YES",
  9: "Dolne plecy Shreka",
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rot")
    .setDescription("Unleash the rot"),
  async execute(interaction) {
    await interaction.reply("Proszę zapiąć pasy\nZaraz nie będzie dobrze");
    if (args[0]) {
      let finalmessage = "";
      for (let i = 0; i < (args[0] <= 10 ? args[0] : 10); i++) {
        rand = Math.floor(Math.random() * 10);
        finalmessage += dict[rand] + "\n";
      }
      await interaction.channel.send(finalmessage);
    }
  },
};
