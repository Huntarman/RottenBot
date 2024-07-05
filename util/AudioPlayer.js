const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const { queue } = require("./queue");
const AudioPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id);

  if (!song) {
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song.url, {
    filter: "audioonly",
    quality: "lowestaudio",
  });
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
    return songQueue.text_channel.send("Coś poszło nie tak z odwarzaczem 😔");
  });
};
module.exports = { AudioPlayer };
