const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join the voice channel"),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return await interaction.reply(
        "You're not on the voice channel, I won't join, I wouldn't be able to bully you!"
      );
    }
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    await interaction.reply("Time to rot!");
  },
};
