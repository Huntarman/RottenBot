const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { queue } = require("../../util/queue");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the queue")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("How many songs to show?")
        .setRequired(false)
    ),
  async execute(interaction) {
    const server_queue = queue.get(interaction.guild.id);
    if (!server_queue) {
      return await interaction.reply("There's nothing in the queue!");
    }
    let queueString = "";
    let amount = interaction.options.getInteger("amount");
    let loopIterator =
      server_queue.songs.length < 6 ? server_queue.songs.length : 5;
    if (amount) {
      loopIterator =
        amount < server_queue.songs.length ? amount : server_queue.songs.length;
    }
    for (let i = 0; i < loopIterator; i++) {
      let loopString = "";
      loopString += `**${i + 1}**. ${server_queue.songs[i].title}`;
      if (i === 0) {
        loopString += " - **Currently playing**";
      }
      loopString += "\n";
      loopString += `Link - ${server_queue.songs[i].url}`;
      loopString += "\n";
      if (queueString.length + loopString.length > 1024) break;
      queueString += loopString;
    }
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Songs in the queue:")
      .setURL(null)
      .setAuthor({
        name: "RottenBot",
        iconURL:
          "https://github.com/Huntarman/RottenBot/blob/main/icon.png?raw=true",
        url: null,
      })
      .setDescription("Jakie nutki będą zaraz leciały?")
      .setThumbnail(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwDvMDBUrQe4fOXGyN7choiCIj-MMHrnxMYA&s"
      )
      .addFields({
        name: "Current playlist:",
        value: queueString,
      })
      .setImage(null)
      .setTimestamp()
      .setFooter({
        text: "I'd listen",
        iconURL:
          "https://github.com/Huntarman/RottenBot/blob/main/icon.png?raw=true",
      });

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
