const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../../util/queue");
const { AudioPlayer } = require("../../util/AudioPlayer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song")
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("How many songs to skip?")
        .setRequired(false)
    ),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    console.log(serverQueue);
    if (
      interaction.member.voice.channelId !==
      serverQueue.connection.joinConfig.channelId
    ) {
      return await interaction.reply(
        "You can't skip without being on the voice channel!"
      );
    }

    if (!serverQueue) {
      return await interaction.reply("Nie ma nic do skipowania!");
    }
    const amount = interaction.options.getString("amount");
    console.log(amount);
    console.log(serverQueue.songs.length);
    if (amount) {
      if (
        amount.toLowerCase() === "all" ||
        amount >= serverQueue.songs.length
      ) {
        serverQueue.connection.destroy();
        queue.delete(interaction.guild.id);
        return await interaction.reply("Skipuje wszystko");
      }
      if (amount < 1) {
        return await interaction.reply("Podaj liczbę większą od 0");
      } else {
        for (let i = 0; i < amount; i++) {
          serverQueue.songs.shift();
        }
        AudioPlayer(interaction.guild, serverQueue.songs[0]);
        return await interaction.reply(
          `Skipuje piosenki - ilosc: **${amount}**`
        );
      }
    }
    if (serverQueue.songs.length === 1) {
      serverQueue.connection.destroy();
      queue.delete(interaction.guild.id);
      return await interaction.reply("Kolejka jest pusta, ide sobie stąd");
    } else {
      serverQueue.songs.shift();
      AudioPlayer(interaction.guild, serverQueue.songs[0]);
      return await interaction.reply("Skipuje");
    }
  },
};
