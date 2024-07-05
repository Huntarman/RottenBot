const { SlashCommandBuilder } = require("discord.js");
const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  joinVoiceChannel,
} = require("@discordjs/voice");

const fs = require("fs");
const path = require("path");
const join = require("./join");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("eulogy")
    .setDescription("Eulogy of an electrocuted rat"),

  async execute(interaction) {
    const directoryPath = path.join(__dirname, "../..", "audio");

    try {
      let files = fs.readdirSync(directoryPath);
    } catch (err) {
      console.error(`Error reading directory: ${err}`);
      process.exit(1);
    }

    var eulogyTitle = "eulogy";
    let connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
    }
    if (
      interaction.member.voice.channelId !== connection.joinConfig.channelId
    ) {
      return await interaction.reply(
        "Nie mozesz puścić eulogi bez oświecenia (dołączenia na kanał)"
      );
    }

    const audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    const resource = createAudioResource(
      directoryPath + "/" + eulogyTitle + ".mp3"
    );
    connection.subscribe(audioPlayer);
    audioPlayer.play(resource);
    audioPlayer.on("error", (error) => {
      return interaction.reply("Coś poszło nie tak 😔");
    });
    return interaction.reply("https://i.redd.it/f59q9ezqqm231.jpg");
  },
};
