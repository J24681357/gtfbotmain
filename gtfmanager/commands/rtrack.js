const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "rtrack",
  title: "GT Fitness Track Randomizer",
  cooldown: 3,
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

    /* Setup */
    if ("options" in query) {
      if (query["options"] == "info") {
        embed.setTitle(gtf_EMOTE.tracklogo + " __GTF Track Randomizer: Info__");
        results = "**Total Tracks:** " +
          gtf_TRACKS.find({}).length
        embed.setFields([{
          name: "Type", value: "**Original Tracks:** " +
            gtf_TRACKS.find({ types: ["Original"] }).length +
            "\n" +
            "**Real Tracks:** " +
            gtf_TRACKS.find({ types: ["Real"] }).length +
            "\n" +
            "**City Tracks:** " +
            gtf_TRACKS.find({ types: ["City"] }).length +
            "\n" +
            "**Dirt Tracks:** " +
            gtf_TRACKS.find({ types: ["Dirt"] }).length, inline: true
        }, {
          name: "By Latest Version", value: "**Gran Turismo 2:** " +
            gtf_TRACKS.find({ "versions": ["Gran Turismo 2"] }).length +
            "\n" +
            "**Gran Turismo 3:** " +
            gtf_TRACKS.find({ "versions": ["Gran Turismo 3"] }).length +
            "\n" +
            "**Gran Turismo 4:** " +
            gtf_TRACKS.find({ "versions": ["Gran Turismo 4"] }).length +
            "\n" +
            "**Gran Turismo 5:** " +
            gtf_TRACKS.find({ "versions": ["Gran Turismo 5"] }).length +
            "\n" +
            "**Gran Turismo 6:** " +
            gtf_TRACKS.find({ "versions": ["Gran Turismo 6"] }).length +
            "\n" +
            "**Gran Turismo Sport:** " +
            gtf_TRACKS.find({ "versions": ["Gran Turismo Sport"] }).length +
            "\n" + "**Gran Turismo 7:** " +
            gtf_TRACKS.find({ "versions": ["Gran Turismo 7"] }).length +
            "\n", inline: true
        }])

        embed.setDescription(results);
        gtf_DISCORD.send(msg, { embeds: [embed] });
        return;
      }
    }

    embed.setTitle(gtf_EMOTE.tracklogo + " __GTF Track Randomizer__");
    var track = gtf_TRACKS.random({}, 1)[0];
    var imagestyle = 0
    var extra = ""
    embed.setDescription("**" + track["name"] + "**" + " `" + track["type"] + "`\n\n" +
      "**Length:** " + track["length"] + "km | " + gtf_MATH.round((track["length"] * 0.62137119), 2) + "mi " + "\n" +
      "**Latest Version:** " + track["version"] + "\n" +
      "**Corners:** " + track["corners"] + extra);

    gtf_DISCORD.send(msg, { embeds: [embed] });
  },
};
