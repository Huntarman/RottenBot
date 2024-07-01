require("dotenv").config();
const discord = require("discord.js");

const prefix = "/";

const fs = require("fs");

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.MessageContent,
  ],
});
client.commands = new discord.Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  console.log(message.content);
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split("/ +/");
  const command = args.shift().toLowerCase();

  if (command === "grzechprzeklenstwo") {
    client.commands.get("grzechprzeklenstwo").execute(message, args);
  }
  if (command === "rot") {
    client.commands.get("rot").execute(message, args);
  }
  message.delete();
});

client.login(process.env.DISCORD_TOKEN);
