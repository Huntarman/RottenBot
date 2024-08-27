const { SlashCommandBuilder } = require("discord.js");
const { GuildUserProfile } = require("../../util/models/index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dailyboon")
    .setDescription("Get your daily 1000 tokens"),
  async execute(interaction) {
    try {
      const userProfile = await GuildUserProfile.findOne({
        where: {
          guild_id: interaction.guild.id,
          user_id: interaction.user.id,
        },
      });

      if (!userProfile) {
        return interaction.reply(
          "It appears you don't have a gambler profile on this server yet.\nPlease use the /gamblestatus command to create one for this server."
        );
      }
      var daily_bonus_available = false;
      const today = new Date().toISOString().split("T")[0];
      var last_daily = userProfile.daily_bonus;
      if (last_daily) {
        last_daily = last_daily.toISOString().split("T")[0];
        if (last_daily != today) daily_bonus_available = true;
      } else daily_bonus_available = true;

      if (!daily_bonus_available) {
        return interaction.reply(
          "You have already claimed your daily bonus today!"
        );
      }

      userProfile.tokens += 1000;
      userProfile.daily_bonus = new Date();
      await userProfile.save();
    } catch (error) {
      return interaction.reply(
        "An error occurred while processing your request"
      );
    }
    await interaction.reply("💰 cash money!");
  },
};
