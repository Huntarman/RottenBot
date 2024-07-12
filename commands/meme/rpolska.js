const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rpolska")
    .setDescription("Today's top post from r/Polska"),

  async execute(interaction) {
    const URL =
      "https://www.reddit.com/r/Polska/top/.json?sort=top&t=day&limit=1";
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(URL);
      const data = await response.json();
      if (
        data &&
        data.data &&
        data.data.children &&
        data.data.children.length > 0
      ) {
        const toppost = data.data.children[0].data;
        let message = toppost.selftext;
        if (message.length > 1024) {
          message = message.substring(0, 1021) + "...";
        }
        if (message === "") {
          message = "Bez treści 😔";
        }
        const exampleEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle('Dzisiejszy "najlepszy" post z r/Polska')
          .setURL("https://www.reddit.com" + toppost.permalink)
          .setAuthor({
            name: "r/Polska",
            iconURL:
              "https://styles.redditmedia.com/t5_2qiqo/styles/communityIcon_rh7ngwunhbla1.png",
            url: "https://www.reddit.com/r/Polska/",
          })
          .setDescription("Pewnie znowu odpał...")
          .addFields({
            name: toppost.title,
            value: message,
          })
          .setImage(toppost.url_overridden_by_dest)
          .setTimestamp()
          .setFooter({
            text: "u/" + toppost.author + " | " + toppost.ups + " upvotes",
          });

        return await interaction.reply({ embeds: [exampleEmbed] });
      } else {
        return interaction.reply("There was an error fetching the top post.");
      }
    } catch (error) {
      console.error("Error fetching top post:", error);
      await interaction.reply("There was an error fetching the top post.");
    }
  },
};
