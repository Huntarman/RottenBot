const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const mocneAlko = {
  0: "Wóda",
  1: "Łycha",
  2: "Jager",
  3: "Tequila",
  4: "Rum",
  5: "Bimber",
  6: "Gin",
  7: "Absynt",
  8: "Amarena",
  9: "Campari",
  10: "Aperol",
};
const slabeAlko = {
  0: "Szampan",
  1: "Malibu",
  2: "Harnold",
  3: "Cointrau",
  4: "Likier toffi",
  5: "Wódka smakowa",
  6: "Curacao",
  7: "Sangria",
  8: "Likier brzoskwiniowy",
};
const wodkiSmakowe = {
  0: "Wiśniówka",
  1: "Cytrynówka",
  2: "Mango",
  3: "Malinówka",
  4: "Miętówka",
};
const soki = {
  0: "Sok Pomarańczowy",
  1: "Sok Jabłkowy",
  2: "Sok z cytryny",
  3: "Sok z limonki",
  4: "Sok ananasowy",
};
const topy = {
  0: "Redbull",
  1: "Sprite",
  2: "Cola",
  3: "Woda gazowana",
  4: "Corona",
  5: "Radioaktywny Monster",
};
const dodatki = {
  1: "Syrop cukrowy",
  2: "Syrop malinowy",
  3: "Syrop z agawy",
  4: "Skórka z cytrusa",
  5: "Limonka",
  6: "Pomarańcza",
  7: "Gałka muszkatołowa",
};
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ernest")
    .setDescription("Losujemy")
    .addStringOption((option) =>
      option.setName("sekret").setDescription("shhhh").setRequired(false)
    ),
  async execute(interaction) {
    if (
      interaction.options.getString("sekret") == null ||
      (interaction.options.getString("sekret") != "kociol" &&
        interaction.options.getString("sekret") != "pio")
    ) {
      let wylosowanyDrink = {
        wybor1: "",
        ilosc1: 0,
        wybor2: "",
        ilosc2: 0,
        wybor3: "",
        ilosc3: 0,
        sok: "",
        ilosc4: 0,
        top: "",
        dodatek1: "",
        dodatek2: "",
      };
      generateDrink(wylosowanyDrink);
      textDrink =
        "🥃**" +
        wylosowanyDrink.wybor1 +
        "** - " +
        wylosowanyDrink.ilosc1 +
        "ml\n" +
        "🥃**" +
        wylosowanyDrink.wybor2 +
        "** - " +
        wylosowanyDrink.ilosc2 +
        "ml\n" +
        "🥃**" +
        wylosowanyDrink.wybor3 +
        "** - " +
        wylosowanyDrink.ilosc3 +
        "ml\n" +
        "🧃**" +
        wylosowanyDrink.sok +
        "** - " +
        wylosowanyDrink.ilosc4 +
        "ml\n" +
        "🍹**" +
        wylosowanyDrink.top +
        "** - Top\n";
      if (wylosowanyDrink.dodatek1 != "") {
        textDrink += "🍊**" + wylosowanyDrink.dodatek1 + "** - dodatek\n";
      }
      if (wylosowanyDrink.dodatek2 != "") {
        textDrink += "🍋**" + wylosowanyDrink.dodatek2 + "** - dodatek\n";
      }
      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Co Ernest ugotował?")
        .setURL(null)
        .setAuthor({
          name: "Janusz Boruwa",
          iconURL:
            "https://yt3.googleusercontent.com/YYsau8rYRcYsi99E6ihQH-mrHIxeFT1fbRS1AC-qg4NaPWk-5Rg89lUxLmlGYN-MaqPBl4_0Ig=s900-c-k-c0x00ffffff-no-rj",
          url: null,
        })
        .setDescription("Jaki piekielny drink został ugotowany tym razem?")
        .setThumbnail(
          "https://yt3.googleusercontent.com/vJOLFTsnnoiT83wZff5s26aXJn-xpUPX5FsMSG0zgF1Dnlgmf3g4ffzW7JNSlmjP4vFBlmp1=s900-c-k-c0x00ffffff-no-rj"
        )
        .addFields({
          name: "Double dare you to drink this:",
          value: textDrink,
        })
        .setImage(null)
        .setTimestamp()
        .setFooter({
          text: "Ernest Hemingway by wyzerował",
          iconURL: "https://mm.pwn.pl/ency/jpg/583/2c/d10i0045.jpg",
        });

      interaction.reply({ embeds: [exampleEmbed] });
    } else if (interaction.options.getString("sekret") == "pio") {
      textDrink = "";
      for (let i = 0; i < 5; i++) textDrink += "🥃 ** Wódka ** - 40 ml\n";
      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Podwójna wóda zmieszana z potrójną wódą")
        .setURL(null)
        .setAuthor({
          name: "Ojciec Pijo",
          iconURL: "https://i.ytimg.com/vi/RhWZoBoeeX0/maxresdefault.jpg",
          url: null,
        })
        .setDescription("Barman, dolewka. Wiesz co lubię")
        .setThumbnail(
          "https://us-tuna-sounds-images.voicemod.net/8fc3b104-4d6f-4a75-9e4e-2b946a26d4c5-1690475655917.png"
        )
        .addFields({
          name: "Nie znajdziesz lepszego drinka:",
          value: textDrink,
        })
        .setImage(null)
        .setTimestamp()
        .setFooter({
          text: "Ojciec Pijo by wyzerował",
          iconURL:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA9KvUZgmf0mtBxCbwADNjKiSBbCp1lsGQSg&s",
        });

      interaction.reply({ embeds: [exampleEmbed] });
    } else {
      textDrink =
        "🪣 **Dosłowny litr wódki**\n" +
        "🪣 **2 litry piwa** \n " +
        "🪣 **700ml szampana**\n" +
        "🪣 **1 litr napoju energetycznego BePower** \n" +
        "🪣 **420ml syropu malinowego** \n";
      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Kociołek Paronamixa")
        .setURL(null)
        .setAuthor({
          name: "Druid Paronamix",
          iconURL:
            "https://yt3.googleusercontent.com/vJOLFTsnnoiT83wZff5s26aXJn-xpUPX5FsMSG0zgF1Dnlgmf3g4ffzW7JNSlmjP4vFBlmp1=s900-c-k-c0x00ffffff-no-rj",
          url: null,
        })
        .setDescription("Mikstura siły, szczęścia i młodości")
        .setThumbnail(
          "https://yt3.googleusercontent.com/vJOLFTsnnoiT83wZff5s26aXJn-xpUPX5FsMSG0zgF1Dnlgmf3g4ffzW7JNSlmjP4vFBlmp1=s900-c-k-c0x00ffffff-no-rj"
        )
        .addFields({
          name: "Jak przyrządzić:",
          value: textDrink,
        })
        .setImage(null)
        .setTimestamp()
        .setFooter({
          text: "Każdy student by wyzerował",
          iconURL:
            "https://static.wikia.nocookie.net/asterix-i-obelix/images/3/3c/Asterix.png/revision/latest?cb=20140411152835&path-prefix=pl",
        });

      interaction.reply({ embeds: [exampleEmbed] });
    }
  },
};

function generateDrink(Drink) {
  Drink.wybor1 = mocneAlko[Math.floor(Math.random() * 11)];
  Drink.ilosc1 = Math.floor(Math.random() * 3) * 10 + 30;
  if (Math.random() < 0.5) {
    Drink.wybor2 = mocneAlko[Math.floor(Math.random() * 11)];
    Drink.ilosc2 = Math.floor(Math.random() * 2) * 10 + 20;
  } else {
    let wybor = Math.floor(Math.random() * 9);
    if (wybor == 5) {
      Drink.wybor2 = wodkiSmakowe[Math.floor(Math.random() * 5)];
    } else Drink.wybor2 = slabeAlko[wybor];
    Drink.ilosc2 = Math.floor(Math.random() * 3) * 10 + 20;
  }
  let wybor = Math.floor(Math.random() * 9);
  if (wybor == 5) {
    Drink.wybor3 = wodkiSmakowe[Math.floor(Math.random() * 5)];
  } else Drink.wybor3 = slabeAlko[wybor];
  Drink.ilosc3 = Math.floor(Math.random() * 3) * 10 + 20;
  Drink.sok = soki[Math.floor(Math.random() * 5)];
  Drink.ilosc4 = Math.floor(Math.random() * 4) * 10 + 20;
  Drink.top = topy[Math.floor(Math.random() * 6)];
  if (Math.random() < 0.5) {
    Drink.dodatek1 = dodatki[Math.floor(Math.random() * 7) + 1];
  }
  if (Math.random() < 0.5) {
    Drink.dodatek2 = dodatki[Math.floor(Math.random() * 7) + 1];
  }
}
