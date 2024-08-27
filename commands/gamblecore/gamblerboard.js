const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { GuildUserProfile } = require("../../util/models/index");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamblerboard")
    .setDescription("Like, leaderboard, but for gamblers"),

  async execute(interaction) {
    try {
      const topUsers = await GuildUserProfile.findAll({
        where: { guild_id: interaction.guild.id },
        order: [["tokens", "DESC"]],
        limit: 5,
      });
      var message = "";

      for (let i = 0; i < topUsers.length; i++) {
        message += `**${i + 1}.** <@${topUsers[i].user_id}> **-** ${
          topUsers[i].tokens
        } tokens\n`;
      }
      if (message === "") {
        message = "No gamblers on the server! BORING!";
      }
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`Gambler leaderboard on ${interaction.guild.name}`)
        .setURL(null)
        .setDescription("Novice or true gambler?")
        .setImage(
          "https://preview.redd.it/fun-fact-99-of-gamblers-quit-before-hitting-it-grand-v0-q18mifl211nc1.jpeg?width=1080&format=pjpg&auto=webp&s=5d3ab740d7a7d443120cc6d497f32ca8128d30f3"
        )
        .addFields({
          name: "Top gamblers:",
          value: message,
        })
        .setTimestamp()
        .setFooter({
          text: "Keep on gambling Kings!",
        });
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply(
        "An error occurred while processing your request"
      );
    }
  },
};
