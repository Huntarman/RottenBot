const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { GuildUserProfile } = require("../../util/models/index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("duel")
    .setDescription("Duel another user for tokens")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to duel")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of tokens you want to duel for")
        .setRequired(true)
    ),
  async execute(interaction) {
    challenger = interaction.user;
    target = interaction.options.getUser("user");
    amount = interaction.options.getInteger("amount");
    if (challenger.id === target.id) {
      return interaction.reply("You can't duel yourself!");
    }
    if (target.bot) {
      return interaction.reply("You can't duel a bot!");
    }
    if (amount < 1) {
      return interaction.reply("You must duel for at least 1 token!");
    }
    try {
      const challengerProfile = await GuildUserProfile.findOne({
        where: { user_id: challenger.id, guild_id: interaction.guild.id },
      });
      const targetProfile = await GuildUserProfile.findOne({
        where: { user_id: target.id, guild_id: interaction.guild.id },
      });
      if (!challengerProfile) {
        return interaction.reply(
          "You do not have a gambler profile yet! Use /gamblestatus to create one."
        );
      }
      if (!targetProfile) {
        return interaction.reply(
          "You can't duel someone who doesn't have a gambler profile!"
        );
      }
      if (challengerProfile.tokens < amount) {
        return interaction.reply("You don't have enough tokens to duel!");
      }
      if (targetProfile.tokens < amount) {
        return interaction.reply(
          "Your target doesn't have enough tokens to duel!"
        );
      }
    } catch (error) {
      console.error(error);
      return interaction.reply(
        "There was an error while executing this command!"
      );
    }
    await interaction.reply("A brawl is surely brewing!");
    const embed = new EmbedBuilder()
      .setTitle("Duel Challenge!")
      .setDescription(
        `<@${challenger.id}> has challenged <@${target.id}> to a duel!`
      )
      .setColor(0xff0000);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("accept")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("decline")
        .setLabel("Decline")
        .setStyle(ButtonStyle.Danger)
    );
    const duelMsg = await target.send({
      content: `<@${target.id}>, you have been challenged, by <@${challenger.id}> to a duel over ${amount} tokens! Do you accept?`,
      embeds: [embed],
      components: [row],
    });
    const filter = (i) =>
      i.user.id === target.id &&
      (i.customId === "accept" || i.customId === "decline");
    const collector = duelMsg.createMessageComponentCollector({
      filter,
      time: 60 * 1000,
    });
    collector.on("collect", async (i) => {
      if (i.customId === "accept") {
        await interaction.editReply({
          content: `<@${target.id}> has accepted the duel!`,
          components: [],
        });
        duelMsg.delete();
        await Duel(interaction, challenger, target, amount);
      } else if (i.customId === "decline") {
        await interaction.editReply({
          content: `<@${target.id}> has declined the duel.`,
          components: [],
        });
        duelMsg.delete();
      }
    });

    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        await interaction.channel.send({
          content: `<@${target.id}> did not respond in time. The duel has been cancelled.`,
          components: [],
        });
        duelMsg.delete();
      }
    });
    try {
    } catch (error) {
      console.error(error);
      return interaction.reply(
        "There was an error while executing this command!"
      );
    }
  },
};

const Duel = async (interaction, challenger, target, amount) => {
  var controller = false;
  const embed = new EmbedBuilder()
    .setTitle("Your choice!")
    .setDescription(`Which do you choose?`)
    .setColor(0xff0000);
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("rock")
      .setLabel("Rock")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("paper")
      .setLabel("Paper")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId("scissors")
      .setLabel("Scissors")
      .setStyle(ButtonStyle.Success)
  );
  const duelMsgTarget = await target.send({
    content: `You must make a choice, your victory depends on it!`,
    embeds: [embed],
    components: [row],
  });
  const duelMsgChallenger = await challenger.send({
    content: `You must make a choice, your victory depends on it!`,
    embeds: [embed],
    components: [row],
  });
  const filter = (i) => [interaction.user.id, target.id].includes(i.user.id);

  const choicesMap = {};

  const createCollector = (userMessage, userId) => {
    const filter = (i) => i.user.id === userId;
    const collector = userMessage.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      const updatedEmbed = EmbedBuilder.from(
        userMessage.embeds[0]
      ).setDescription(i.customId);
      choicesMap[i.user.id] = i.customId;
      await i.update({
        content: `You chose ${i.customId}. Waiting for the other player...`,
        embeds: [updatedEmbed],
        components: [],
      });

      if (choicesMap[interaction.user.id] && choicesMap[target.id]) {
        collector.stop();
      }
    });

    collector.on("end", async () => {
      if (controller) return;
      controller = true;
      try {
        const challengerProfile = await GuildUserProfile.findOne({
          where: { user_id: challenger.id, guild_id: interaction.guild.id },
        });
        const targetProfile = await GuildUserProfile.findOne({
          where: { user_id: target.id, guild_id: interaction.guild.id },
        });
        if (choicesMap[interaction.user.id] && choicesMap[target.id]) {
          const player1Choice = choicesMap[interaction.user.id];
          const player2Choice = choicesMap[target.id];

          let result = "";
          if (player1Choice === player2Choice) {
            result = `It's a tie! You both chose ${player1Choice}.`;
          } else if (
            (player1Choice === "rock" && player2Choice === "scissors") ||
            (player1Choice === "paper" && player2Choice === "rock") ||
            (player1Choice === "scissors" && player2Choice === "paper")
          ) {
            result = `${interaction.user.username} wins! ${player1Choice} beats ${player2Choice}.\n<@${interaction.user.id}> won ${amount} tokens.\n<@${target.id}> lost ${amount} tokens.`;
            challengerProfile.tokens += amount;
            targetProfile.tokens -= amount;
            await challengerProfile.save();
            await targetProfile.save();
          } else {
            result = `<@${target.id}> wins! ${player2Choice} beats ${player1Choice}.\n<@${interaction.user.id}> lost ${amount} tokens.\n<@${target.id}> won ${amount} tokens.`;
            challengerProfile.tokens -= amount;
            targetProfile.tokens += amount;
            await challengerProfile.save();
            await targetProfile.save();
          }
          await interaction.channel.send(result);
        } else {
          const player1Choice = choicesMap[interaction.user.id];
          const player2Choice = choicesMap[target.id];
          if (!player1Choice && !player2Choice) {
            await interaction.channel.send(
              "Both players have not made their choice. The duel has been cancelled. No tokens have been lost or won."
            );
            duelMsgChallenger.delete();
            duelMsgTarget.delete();
          } else if (!player1Choice && player2Choice) {
            const updatedEmbed = EmbedBuilder.from(
              duelMsgChallenger.embeds[0]
            ).setDescription("You chose nothing and lost shamefully.");
            await duelMsgChallenger.edit({
              content: `You chose nothing. The duel has ended.`,
              embeds: [updatedEmbed],
              components: [],
            });
            await interaction.channel.send(
              `<@${interaction.user.id}> did not make a choice. <@${target.id}> wins by default.\n<@${interaction.user.id}> lost ${amount} tokens.\n<@${target.id}> won ${amount} tokens.`
            );
            challengerProfile.tokens -= amount;
            targetProfile.tokens += amount;
            await challengerProfile.save();
            await targetProfile.save();
          } else if (player1Choice && !player2Choice) {
            const updatedEmbed = EmbedBuilder.from(
              duelMsgTarget.embeds[0]
            ).setDescription("You chose nothing and lost shamefully.");
            await duelMsgTarget.edit({
              content: `You chose nothing. The duel has ended.`,
              embeds: [updatedEmbed],
              components: [],
            });
            await interaction.channel.send(
              `<@${target.id}> did not make a choice. <@${interaction.user.id}> wins by default.\n<@${interaction.user.id}> won ${amount} tokens.\n<@${target.id}> lost ${amount} tokens.`
            );
            challengerProfile.tokens += amount;
            targetProfile.tokens -= amount;
            await challengerProfile.save();
            await targetProfile.save();
          }
        }
      } catch (error) {
        console.error(error);
        return interaction.reply(
          "There was an error while executing this command!"
        );
      }
    });
  };

  createCollector(duelMsgChallenger, interaction.user.id);
  createCollector(duelMsgTarget, target.id);
};
