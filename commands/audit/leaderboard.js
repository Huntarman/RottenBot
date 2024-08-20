const {
  SlashCommandBuilder,
  AuditLogEvent,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the leaderboard"),
  async execute(interaction) {
    const auditLog = await interaction.guild.fetchAuditLogs({
      type: AuditLogEvent.MemberDisconnect,
    });
    const leaderboard = new Map();
    for (const entry of auditLog.entries.values()) {
      if (!leaderboard.has(entry.executor.id)) {
        leaderboard.set(entry.executor.id, entry.extra.count);
      } else {
        const newCount = leaderboard.get(entry.executor.id) + entry.extra.count;
        leaderboard.set(entry.executor.id, newCount);
      }
    }
    leaderboardArray = Array.from(leaderboard);
    leaderboardArray.sort((a, b) => b[1] - a[1]);
    let message = "";
    let i = 0;
    for (const [key, value] of leaderboardArray) {
      message += `${1 + i++}.<@${key}> - **${value}**\n`;
    }
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Leaderboard of forced disconnects")
      .setURL(null)
      .setDescription("Who kicked, and how much?")
      .setThumbnail(
        "https://static.vecteezy.com/system/resources/previews/020/379/626/original/one-continuous-line-drawing-of-young-talented-football-player-take-a-free-kick-soccer-match-sports-concept-single-line-draw-design-illustration-vector.jpg"
      )
      .addFields({
        name: "Leaderboard:",
        value: message,
      })
      .setImage(null)
      .setTimestamp();
    interaction.reply({ embeds: [exampleEmbed] });
  },
};
