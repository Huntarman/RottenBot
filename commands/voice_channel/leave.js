const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel"),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      return await interaction.reply(
        "Nie jestem na kanale, więc nie mogę wyjść!"
      );
    }
    if (
      interaction.member.voice.channelId !== connection.joinConfig.channelId
    ) {
      return await interaction.reply(
        "Nie rozłączysz mnie bez wejścia na kanał!"
      );
    }
    connection.destroy();
    await interaction.reply("Wiedziałem że nie wytrzymasz mojego rizzu");
  },
};
