const { SlashCommandBuilder } = require("discord.js");
const { GuildUserProfile } = require("../../util/models/index");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Rock, Paper, Scissors")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Choose rock, paper or scissors")
        .setRequired(true)
        .addChoices(
          { name: "Rock", value: "rock" },
          { name: "Paper", value: "paper" },
          { name: "Scissors", value: "scissors" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of tokens to gamble")
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

    const choice = interaction.options.getString("choice");
    var amount = interaction.options.getInteger("amount");

    if (amount < 1) {
      return interaction.reply("You need to gamble at least 1 token");
    }

    if (amount > userProfile.tokens) {
      amount = userProfile.tokens;
    }

    if (amount < 1) {
      return interaction.reply("You don't have enough tokens to gamble");
    }

    const choices = ["rock", "paper", "scissors"];
    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    if (choice === botChoice) {
      return interaction.reply(
        `It's a tie! You chose ${choice} and I chose ${botChoice}`
      );
    }

    if (
      (choice === "rock" && botChoice === "scissors") ||
      (choice === "paper" && botChoice === "rock") ||
      (choice === "scissors" && botChoice === "paper")
    ) {
      await GuildUserProfile.update(
        { tokens: userProfile.tokens + amount * 2 },
        {
          where: {
            guild_id: interaction.guild.id,
            user_id: interaction.user.id,
          },
        }
      );
      return interaction.reply(
        `You won! You chose ${choice} and I chose ${botChoice}. You won ${
          amount * 2
        } tokens!`
      );
    }

    await GuildUserProfile.update(
      { tokens: userProfile.tokens - amount },
      {
        where: {
          guild_id: interaction.guild.id,
          user_id: interaction.user.id,
        },
      }
    );
    return interaction.reply(
      `You lost! You chose ${choice} and I chose ${botChoice}. You lost ${amount} tokens!`
    );
  },
};
