const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { GuildUserProfile } = require("../../util/models/index");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamblestatus")
    .setDescription("Your gambler status"),
  async execute(interaction) {
    const userProfile = await GuildUserProfile.findOne({
      where: {
        guild_id: interaction.guild.id,
        user_id: interaction.user.id,
      },
    });

    if (!userProfile) {
      await GuildUserProfile.create({
        guild_id: interaction.guild.id,
        user_id: interaction.user.id,
      });
      return interaction.reply(
        "Looks like you don't have an account here yet!\nLet me create one for you!\nPlease try again after a few seconds"
      );
    }

    var daily_bonus_available = false;
    const today = new Date().toISOString().split("T")[0];
    var last_daily = userProfile.daily_bonus;
    if (last_daily) {
      last_daily = last_daily.toISOString().split("T")[0];
      if (last_daily != today) daily_bonus_available = true;
    } else daily_bonus_available = true;
    var imageURL =
      "https://preview.redd.it/image-keep-going-v0-tfzdh7t2j9ba1.png?auto=webp&s=b5106ca0e9209b0d73473396d88e17e605bf7841";
    var evaluation = "Small time gambler";
    if (userProfile.tokens == 0) {
      evaluation = "Complete Loser";
    } else if (userProfile.times_begged > 10) {
      evaluation = "Beggar (lol)";
    } else if (userProfile.tokens < 500) {
      evaluation = "Novice";
    } else if (userProfile.tokens < 1000) {
      evaluation = "Amateur";
    } else if (userProfile.tokens < 5000) {
      evaluation = "Beginner";
    } else if (userProfile.tokens < 10000) {
      evaluation = "Money packer";
    } else if (userProfile.amount_gifted > 10000) {
      evaluation = "Biggest gifter";
    } else if (userProfile.tokens < 20000) {
      evaluation = "Rigger";
    } else if (userProfile.tokens < 50000) {
      evaluation = "The 0.01% that didn't stop";
    }

    if (userProfile.tokens > 100000) {
      evaluation = "Gambling god";
      imageURL =
        "https://wykop.pl/cdn/c3201142/comment_1606176472oBVtwLCyatShD1lxNJsvqa,w400.jpg";
    }
    if (userProfile.times_begged > 100) {
      evaluation = "Beggar king, the pathetic kind";
      imageURL = "https://i.imgflip.com/2psjma.jpg?a478680";
    }
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Your gambler status on ${interaction.guild.name}`)
      .setURL(null)
      .setDescription("Novice or true gambler?")
      .setImage(imageURL)
      .addFields(
        {
          name: "Tokens:",
          value: `💰: ${userProfile.tokens}`,
        },
        {
          name: "Times begged:",
          value: `${userProfile.times_begged}`,
        },
        {
          name: "Jackpots:",
          value: `${userProfile.jackpots}`,
        },
        {
          name: "Amount gifted:",
          value: `${userProfile.amount_gifted}`,
        },
        {
          name: "Daily bonus:",
          value: daily_bonus_available ? "Available" : "Not available",
        }
      )
      .setTimestamp()
      .setFooter({
        text: "Profile reviev: " + evaluation,
      });
    interaction.reply({ embeds: [embed] });
  },
};
