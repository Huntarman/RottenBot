const { SlashCommandBuilder } = require("discord.js");
const { queue } = require("../util/queue");
const { AudioPlayer } = require("../util/AudioPlayer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song"),
  async execute(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    if (
      interaction.member.voice.channelId !==
      serverQueue.connection.joinConfig.channelId
    ) {
      return await interaction.reply(
        "Nie mozesz skipować bez bycia na kanale!"
      );
    }

    if (!serverQueue) {
      return await interaction.reply("Nie ma nic do skipowania!");
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
