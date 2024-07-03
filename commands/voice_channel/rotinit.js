const { SlashCommandBuilder } = require("discord.js");
const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rotinit")
    .setDescription("Initiate the rot"),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      return await interaction.reply(
        "Nie jestem na kanale, więc nie mogę gnić!"
      );
    }
    const audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    const resource = createAudioResource(
      "C:/Users/micha/Desktop/RottenBot/audio/skibidipl.mp3"
    );
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
