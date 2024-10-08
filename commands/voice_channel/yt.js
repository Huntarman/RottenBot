const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection, joinVoiceChannel } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");
const ytpl = require("ytpl");
const { queue } = require("../../util/queue");
const { AudioPlayer } = require("../../util/AudioPlayer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("yt")
    .setDescription("Play youtube rot")
    .addStringOption((option) =>
      option.setName("url").setDescription("Youtube url").setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply("Nope");
    }
    if (!interaction.guild.id || !interaction.guild.voiceAdapterCreator) {
      return interaction.reply("Nope");
    }
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
        "You can't add a song without joining the channel LOL!"
      );
    }

    const url = interaction.options.getString("url");

    if (!ytdl.validateURL(url) && !ytpl.validateID(url)) {
      return interaction.reply("Wrong url");
    }

    const serverQueue = queue.get(interaction.guild.id);
    let song = {};
    let songs = {};
    let playlistTitle = "";
    if (ytdl.validateURL(url)) {
      const songInfo = await ytdl.getInfo(url);
      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
      };
    }
    if (ytpl.validateID(url)) {
      const playlist = await ytpl(url);
      playlistTitle = playlist.title;
      songs = playlist.items;
    }

    if (ytdl.validateURL(url) && !ytpl.validateID(url) && !serverQueue) {
      const queue_constructor = {
        voice_channel: interaction.member.voice.channel,
        text_channel: interaction.channel,
        connection: connection,
        songs: [],
      };
      queue.set(interaction.guild.id, queue_constructor, interaction);
      queue_constructor.songs.push(song);
      AudioPlayer(interaction.guild, queue_constructor.songs[0], interaction);
    } else if (ytpl.validateID(url) && !serverQueue) {
      const queue_constructor = {
        voice_channel: interaction.member.voice.channel,
        text_channel: interaction.channel,
        connection: connection,
        songs: [],
      };
      song = {
        title: songs[0].title,
        url: songs[0].shortUrl,
      };
      queue.set(interaction.guild.id, queue_constructor, interaction);
      queue_constructor.songs.push(song);
      AudioPlayer(interaction.guild, queue_constructor.songs[0], interaction);
      addPlaylist(interaction.guild, songs, 1, playlistTitle);
    } else if (ytpl.validateID(url)) {
      addPlaylist(interaction.guild, songs, 0, playlistTitle);
    } else {
      serverQueue.songs.push(song);
      return interaction.reply(`Dodano do kolejki: **${song.title}**`);
    }
    return interaction.reply("Gramy 🫡");
  },
};

const addPlaylist = async (guild, playlist, start, playlistTitle) => {
  const songQueue = queue.get(guild.id);
  for (let i = start; i < playlist.length; i++) {
    songQueue.songs.push({
      title: playlist[i].title,
      url: playlist[i].shortUrl,
    });
  }
  return songQueue.text_channel.send(
    `Do kolejki dodano playlistę: **${playlistTitle}** - ${playlist.length} utworów`
  );
};
