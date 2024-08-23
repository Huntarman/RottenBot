const { SlashCommandBuilder } = require("discord.js");
const { User, Guild, GuildUserProfile } = require("../../util/models/index");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("beg")
    .setDescription("Lose all your pride for some tokens!"),
  async execute(interaction) {
    var message;

    var i = Math.floor(Math.random() * 3);
    switch (i) {
      case 0:
      default:
        message =
          "https://media1.tenor.com/m/aSkdq3IU0g0AAAAC/laughing-cat.gif";
        break;

      case 1:
        message =
          "https://media1.tenor.com/m/C57n0c8tEPwAAAAd/berserk-skeleton-skeleton.gif";
        break;

      case 2:
        message =
          "https://media1.tenor.com/m/tgXQ-yWDKggAAAAd/crazy-no-one-cares.gif";
        break;
    }

    const newTokens = 10 + Math.floor(Math.random() * 6);
    const userProfile = await GuildUserProfile.findOne({
      where: {
        user_id: interaction.user.id,
        guild_id: interaction.guild.id,
      },
    });
    if (userProfile) {
      userProfile.tokens += newTokens;
      userProfile.times_begged += 1;
      await userProfile.save();
    } else {
      return interaction.reply(
        "It appears you don't have a gambler profile on this server yet.\nPlease use the /gamblestatus command to create one for this server."
      );
    }
    await interaction.reply("💀");
    await interaction.channel.send(message);
    await interaction.channel.send(
      `Awarded <@${interaction.user.id}> ${newTokens} tokens in exchange for their dignity`
    );
  },
};
