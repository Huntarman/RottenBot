const { SlashCommandBuilder } = require("discord.js");
const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yt")
    .setDescription("Play youtube rot")
    .addStringOption((option) =>
      option.setName("url").setDescription("Youtube url").setRequired(true)
    ),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      return await interaction.reply(
        "Nie jestem na kanale, więc nie mogę gnić!"
      );
    }
    const audioPlayer = createAudioPlayer();
    const url = interaction.options.getString("url");
    const stream = ytdl(url, { filter: "audioonly" });
    const resource = createAudioResource(stream);
    audioPlayer.play(resource);
    connection.subscribe(audioPlayer);
    audioPlayer.on(AudioPlayerStatus.Playing, () => {
      return interaction.reply("Enjoy!🙂");
    });
    audioPlayer.on("error", (error) => {
      return interaction.reply("Coś poszło nie tak 😔");
    });
  },
};
