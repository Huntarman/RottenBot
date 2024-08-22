const { User, Guild } = require("../../util/models/index");
const { SlashCommandBuilder } = require("discord.js");
const sequelize = require("../../util/sequelize");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("testdb")
    .setDescription("Like, testing, but for database"),
  async execute(interaction) {
    var msg = "";
    const user = await User.findByPk(interaction.user.id).catch((error) => {
      console.error("Error:", error);
    });
    if (user) {
      msg =
        "User: " +
        user.dataValues.user_name +
        " is accounted for in the database\n";
    } else {
      await User.create({
        user_id: interaction.user.id,
        user_name: interaction.user.username,
      });
      msg = "User: " + interaction.user.username + " added to database\n";
    }

    const guild = await Guild.findByPk(interaction.guild.id).catch((error) => {
      console.error("Error:", error);
    });
    if (guild) {
      msg +=
        "Guild: " +
        guild.dataValues.guild_name +
        " is accounted for in the database\n";
    } else {
      await Guild.create({
        guild_id: interaction.guild.id,
        guild_name: interaction.guild.name,
      });
      msg += "Guild: " + interaction.guild.name + " added to database\n";
    }
    return interaction.reply(msg);
  },
};
