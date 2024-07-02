const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join the voice channel"),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return await interaction.reply(
        "Nie jesteś na kanale, nie dołączę, bo nie mógłbym cię nękać!"
      );
    }
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    await interaction.reply("Czas szerzyć zepsucie!");
  },
};
