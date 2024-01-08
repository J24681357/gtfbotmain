const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "sr",
  title: "Sportsmanship Rating",
  cooldown: 3,
  license: "N",
  level: 0,
  channels: ["gtf-mode", "testing", "bot-mode"],

  requireuserdata: false,
  requirecar: false,
  availinmaint: true,
  usedduringrace: true,
  usedinlobby: true,
  description: [""],
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtm_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: false,
      buttons: false,
      carselectmessage: false,
      image: [],
      bimage: "",
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    var ratings = ["E", "D", "D", "C", "C", "C", "B", "B", "B", "A", "A", "S"];
    var rating = ratings[Math.floor(Math.random() * ratings.length)];

    if (query["options"] == "info") {
      embed.setTitle(gtm_EMOTE.gtlogoblue + " __Sportmanship Rating Calculator - Chances__");
      results =
        "**E:** " +
        (Math.round(1000 * (ratings.filter(x => x == "E").length / ratings.length)) / 1000) * 100 +
        "%" +
        "\n" +
        "**D:** " +
        (Math.round(1000 * (ratings.filter(x => x == "D").length / ratings.length)) / 1000) * 100 +
        "%" +
        "\n" +
        "**C:** " +
        (Math.round(1000 * (ratings.filter(x => x == "C").length / ratings.length)) / 1000) * 100 +
        "%" +
        "\n" +
        "**B:** " +
        (Math.round(1000 * (ratings.filter(x => x == "B").length / ratings.length)) / 1000) * 100 +
        "%" +
        "\n" +
        "**A:** " +
        (Math.round(1000 * (ratings.filter(x => x == "A").length / ratings.length)) / 1000) * 100 +
        "%" +
        "\n" +
        "**S:** " +
        (Math.round(1000 * (ratings.filter(x => x == "S").length / ratings.length)) / 1000) * 100 +
        "%" +
        "\n";
      embed.setDescription(results);
      gtm_DISCORD.send(msg, { embeds: [embed] });
      return;
    }

    embed.setTitle(gtm_EMOTE.gtlogoblue + " __Sportmanship Rating Calculator__");
    var content = query["message"]
    if (typeof content === 'undefined') {
      content = "`None`";
    }
    results = "**Message:** " + content + "\n" + "**Sportsmanship Rating:** " + gtm_EMOTE.loading;
    embed.setDescription(results);
    if (typeof query["image"] !== 'undefined') {
      embed.setImage(query["image"]);
    } else if (typeof query["image_url"] !== 'undefined') {
      embed.setImage(query["image"]);
    }
    gtm_DISCORD.send(msg, { embeds: [embed] }, sr)

    function sr(msg) {
      gtm_TOOLS.interval(
        function() {
          results = "**Message:** " + content + "\n" + "**Sportsmanship Rating:** " + rating;
          embed.setDescription(results);
          msg.edit({ embeds: [embed] });
        },
        2000,
        1
      );
    }
  },
};
