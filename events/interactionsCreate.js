const { Events } = require("discord.js");
const { User, Guild } = require("../util/models/index");
const { DataTypes } = require("sequelize");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }
    try {
      await User.findOrCreate({
        where: { user_id: interaction.user.id },
        defaults: {
          user_name: interaction.user.username,
          join_date: new Date(),
        },
      });
      await Guild.findOrCreate({
        where: { guild_id: interaction.guild.id },
        defaults: { guild_name: interaction.guild.name },
      });
    } catch (error) {
      console.error(error);
    }
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};
