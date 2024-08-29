const { SlashCommandBuilder } = require("discord.js");
const { GuildUserProfile } = require("../../util/models/index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guessthenumber")
    .setDescription("Guess the number from a range you choose")
    .addIntegerOption((option) =>
      option
        .setName("range")
        .setDescription("The range of numbers to guess from")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("The number you guess")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("tokens")
        .setDescription("The amount of tokens to bet")
        .setRequired(true)
    ),
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

      const range = interaction.options.getInteger("range");
      const number = interaction.options.getInteger("number");
      var tokens = interaction.options.getInteger("tokens");

      if (range < 2) {
        return interaction.reply("The range must be at least 2!");
      }

      if (number < 1 || number > range) {
        return interaction.reply(`The number must be between 1 and ${range}!`);
      }

      if (tokens < 1) {
        return interaction.reply("You need to gamble at least 1 token");
      }
      if (tokens > userProfile.tokens) {
        tokens = userProfile.tokens;
      }
      if (tokens < 1) {
        return interaction.reply("You don't have enough tokens to gamble");
      }
      const randomNumber = Math.floor(Math.random() * range) + 1;
      await interaction.reply("Guessing the number...");
      if (number === randomNumber) {
        userProfile.tokens += tokens * range;
        interaction.channel.send(
          `You guessed the number! You won ${tokens * range}!`
        );
      } else {
        userProfile.tokens -= tokens;

        interaction.channel.send(
          `You didn't guess the number! The number was ${randomNumber}! You lost ${tokens} tokens!`
        );
      }
      userProfile.times_gambled += 1;
      await userProfile.save();
    } catch (error) {
      return interaction.reply(
        "An error occurred while processing your request"
      );
    }
  },
};
