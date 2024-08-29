const { SlashCommandBuilder } = require("discord.js");
const { GuildUserProfile } = require("../../util/models/index");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Heads or Tails")
        .setRequired(true)
        .addChoices(
          { name: "Heads", value: "heads" },
          { name: "Tails", value: "tails" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("token")
        .setDescription("How much tokens to gamble?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const choice = interaction.options.getString("choice");
    var token = interaction.options.getInteger("token");
    if (token < 1) {
      return interaction.reply("You need to gamble at least 1 token");
    }
    if (choice !== "heads" && choice !== "tails") {
      return interaction.reply("You need to choose either heads or tails");
    }
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

      await interaction.reply("Flipping the coin...");

      if (token > userProfile.tokens) {
        token = userProfile.tokens;
      }
      if (token < 1) {
        return interaction.reply("You don't have enough tokens to gamble");
      }
      const coin = Math.random() < 0.5 ? "heads" : "tails";
      let result;
      if (coin === choice) {
        result = "You won";
      } else {
        result = "You lost";
      }
      if (result === "You won") {
        userProfile.tokens += token;
      } else {
        userProfile.tokens -= token;
      }
      userProfile.times_gambled += 1;
      await userProfile.save();
      interaction.channel.send(
        `<@${interaction.user.id}> flipped a coin and bet ${token} tokens on ${choice}!`
      );
      interaction.channel.send(`The coin landed on ${coin}! ${result}!`);
      interaction.channel.send(
        `${result} ${token} tokens! You now have ${userProfile.tokens} tokens!`
      );
    } catch (error) {
      return interaction.reply(
        "An error occurred while processing your request"
      );
    }
  },
};
