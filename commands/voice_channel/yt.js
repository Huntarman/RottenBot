const { SlashCommandBuilder } = require("discord.js");
const {
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

const queue = new Map();
// queue(interaction.guild.id, queue_constructor object { voice_channel, text_channel, connection, song[] });
module.exports = { queue };

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
    if (
      interaction.member.voice.channelId !== connection.joinConfig.channelId
    ) {
      return await interaction.reply(
        "Nie mozesz dodac filmu do kolejki bez bycia na kanale LOL!"
      );
    }

    const url = interaction.options.getString("url");
    if (!ytdl.validateURL(url)) {
      return interaction.reply("Niepoprawny url");
    }
    const serverQueue = queue.get(interaction.guild.id);

    let song = {};
    const songInfo = await ytdl.getInfo(url);
    song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
      const queue_constructor = {
        voice_channel: interaction.member.voice.channel,
        text_channel: interaction.channel,
        connection: connection,
        songs: [],
      };
      queue.set(interaction.guild.id, queue_constructor, interaction);
      queue_constructor.songs.push(song);
      AudioPlayer(interaction.guild, queue_constructor.songs[0]);
    } else {
      serverQueue.songs.push(song);
      return interaction.reply(`Dodano do kolejki: **${song.title}**`);
    }
    return interaction.reply(`Gramy!`);
  },
};

const AudioPlayer = async (guild, song, interaction) => {
  const songQueue = queue.get(guild.id);

  if (!song) {
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song.url, { filter: "audioonly" });
  const audioPlayer = createAudioPlayer();
  const resource = createAudioResource(stream);
  songQueue.connection.subscribe(audioPlayer);
  audioPlayer.play(resource, { seek: 0, volume: 1 });
  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    songQueue.songs.shift();
    AudioPlayer(guild, songQueue.songs[0]);
  });

  await songQueue.text_channel.send(`Teraz gram: **${song.title}**`);
  audioPlayer.on("error", (error) => {
    return interaction.reply("Coś poszło nie tak 😔");
  });
};
