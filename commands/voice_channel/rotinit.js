const { SlashCommandBuilder } = require("discord.js");
const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  joinVoiceChannel,
} = require("@discordjs/voice");
const join = require("./join");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rotinit")
    .setDescription("Initiate the rot")
    .addStringOption((option) =>
      option
        .setName("rot_option")
        .setDescription("Option for rotting")
        .setRequired(false)
    ),
  async execute(interaction) {
    const directoryPath = path.join(__dirname, "../..", "audio");
    let files;
    try {
      files = fs.readdirSync(directoryPath);
    } catch (err) {
      console.error(`Error reading directory: ${err}`);
      process.exit(1);
    }
    const mp3Files = files
      .filter((file) => path.extname(file) === ".mp3")
      .map((file) => path.basename(file, ".mp3"));

    var option = interaction.options.getString("rot_option");
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
      return await interaction.reply("Nie mozesz rotować bez bycia na kanale!");
    }
    if (!mp3Files.includes(option)) {
      const randomIndex = Math.floor(Math.random() * mp3Files.length);
      option = mp3Files[randomIndex];
    }
    const audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
    const resource = createAudioResource(directoryPath + "/" + option + ".mp3");
    connection.subscribe(audioPlayer);
    audioPlayer.play(resource);
    audioPlayer.on("error", (error) => {
      return interaction.reply("Coś poszło nie tak 😔");
    });
    return interaction.reply("Enjoy!🙂");
  },
};
