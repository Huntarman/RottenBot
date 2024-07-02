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
    .setDescription("Unleash the rot")
    .addIntegerOption((option) =>
      option
        .setName("rot_level")
        .setDescription("How much rot do you want? (max 10)")
        .setRequired(false)
    ),
  async execute(interaction) {
    await interaction.reply("Proszę zapiąć pasy\nZaraz nie będzie dobrze");
    const rot_level = interaction.options.getInteger("rot_level");
    if (rot_level) {
      let finalmessage = "";
      for (let i = 0; i < (rot_level <= 10 ? rot_level : 10); i++) {
        rand = Math.floor(Math.random() * 10);
        finalmessage += dict[rand] + "\n";
      }
      await interaction.channel.send(finalmessage);
    }
  },
};
