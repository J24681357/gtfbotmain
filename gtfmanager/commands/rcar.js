const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "rcar",
  title: "GT Fitness Car Randomizer",
  cooldown: 5,
  license: "N",
  level: 0,
  channels: ["testing", "gtf-mode", "bot-mode"],

  delete: false,
  requirecar: false,
  availitoeveryone: true,
  availinmaint: true,
  requireuserdata: true,
  usedduringrace: true,
  usedinlobby: true,
  description: [],
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtm_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      listsec: "",
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

    var filter = {}
    if (typeof query["options"] === "undefined") {
      query["options"] = "show"
    }
    if (query["options"] == "info") {

      embed.setTitle("__GTF Car Randomizer: Info__");

      gtm_CARS.stats(embed)
      gtf_DISCORD.send(msg, { embeds: [embed] });
      return;
    }

    if (typeof query["type"] !== 'undefined') {
      filter["types"] = [query["type"]]
      embed.setTitle("__**" + query["type"] + "**__")
    }

    var car = gtm_CARS.random(filter, 1)[0];
    var imagestyle = 0
    var extra = ""
    if (car["image"].length >= 2) {
      var choose = ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B"]
      if (choose[Math.floor(Math.random() * choose.length)] == "A") {
        imagestyle = gtf_MATH.randomInt(1, car["image"].length - 1)
        extra = " | `⭐" + imagestyle + "`"
      } else {
        imagestyle = 0
      }
    }
    embed.setDescription(gtm_EMOTE.gtflogo + " **" + car["name"] + " " + car["year"] + "** " + gtm_TOOLS.toEmoji(car["country"]) + " `" + car["type"] + "`\n" + gtf_MATH.numFormat(car["power"]) + " hp | " + gtf_MATH.numFormat(car["weight"]) + " lbs | " + car["drivetrain"] + " | " + car["engine"] + " " + extra);
    embed.setImage(car["image"][imagestyle]);

    var emojilist = [
      {
        emoji: gtm_EMOTE.google,
        emoji_name: "google",
        name: 'Car Info',
        extra: "https://www.google.com/search?q=" + car["name"].replace(/ /ig, "+") + "+" + car["year"],
        button_id: 0
      }
    ]
    var buttons = gtm_TOOLS.prepareButtons(emojilist, msg, userdata);
    gtf_DISCORD.send(msg, { embeds: [embed], components: buttons });
  }
}
