const { SlashCommandBuilder } = require("discord.js");
const { GuildUserProfile } = require("../../util/models/index");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gift")
    .setDescription("Send the poorfags some tokens")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to gift tokens to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of tokens to gift")
        .setRequired(true)
    ),
  async execute(interaction) {
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

    const user = interaction.options.getUser("user");
    var amount = interaction.options.getInteger("amount");

    if (amount < 1) {
      return interaction.reply("You can't gift less than 1 token!");
    }

    if (userProfile.user_id === user.id) {
      return interaction.reply("You can't gift tokens to yourself!");
    }

    if (user.bot) {
      return interaction.reply("You can't gift tokens to a bot!");
    }

    if (userProfile.tokens < amount) {
      amount = userProfile.tokens;
    }
    if (amount < 1) {
      return interaction.reply("You don't have enough tokens gift");
    }
    var recipientProfile = await GuildUserProfile.findOne({
      where: {
        guild_id: interaction.guild.id,
        user_id: user.id,
      },
    });

    if (!recipientProfile) {
      return interaction.reply(
        "The user you are trying to gift tokens to does not have a gambler profile on this server yet."
      );
    }

    userProfile.tokens -= amount;
    recipientProfile.tokens += amount;

    await userProfile.save();
    await recipientProfile.save();

    await interaction.reply(
      `<@${interaction.user.id}> has <@${user.id}> gifted ${amount} tokens`
    );
  },
};
