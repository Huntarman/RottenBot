const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("schizopost")
    .setDescription("Random schizopost"),
  async execute(interaction) {
    if (!process.env.NICKNAME) {
      return await interaction.reply("Schizo not set up 😔");
    }
    const URL = `https://www.reddit.com/user/${process.env.NICKNAME}/submitted.json?limit=100`;
    const URL_about_user = `https://www.reddit.com/user/${process.env.NICKNAME}/about.json`;
    for (let i = 0; i < 25; i++) {
      try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(URL);
        const data = await response.json();
        const posts = data.data.children;
        const response_about = await fetch(URL_about_user);
        const data_about = await response_about.json();
        const avatar_url = data_about.data.icon_img;
        const nickname = data_about.data.subreddit.title;
        let randomPost = posts[Math.floor(Math.random() * posts.length)].data;
        while (
          !randomPost.is_reddit_media_domain &&
          !randomPost.domain.startsWith("self.")
        ) {
          console.log(randomPost.domain);
          randomPost = posts[Math.floor(Math.random() * posts.length)].data;
        }
        if (
          data &&
          data.data &&
          data.data.children &&
          data.data.children.length > 0 &&
          avatar_url &&
          nickname
        ) {
          let message = randomPost.selftext;
          if (message.length > 1024) {
            message = message.substring(0, 1021) + "...";
          }
          if (message === "") {
            message = "Bez treści 😔";
          }
          let image_url = randomPost.url_overridden_by_dest;
          if (randomPost.domain === "v.redd.it") {
            image_url = "";
            message = "Kliknij w linka żeby obejrzeć załącznik 😉";
          }
          const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Post z r/${randomPost.subreddit}`)
            .setURL("https://www.reddit.com" + randomPost.permalink)
            .setAuthor({
              name: `u/${process.env.NICKNAME}`,
              iconURL: avatar_url,
              url: `https://www.reddit.com/u/${process.env.NICKNAME}`,
            })
            .setDescription(
              `Co zapostował ${nickname} na r/${randomPost.subreddit}`
            )
            .addFields({
              name: randomPost.title,
              value: message,
            })
            .setImage(image_url)
            .setTimestamp()
            .setFooter({
              text:
                "u/" + randomPost.author + " | " + randomPost.ups + " upvotes",
            });

          await interaction.channel.send({ embeds: [exampleEmbed] });
        }
      } catch (error) {
        await interaction.channel.send(
          "There was an error fetching the schizoposts."
        );
      }
    }
  },
};
