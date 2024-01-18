const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "settings",
  title: "GTF Settings",
  license: "N",
  level: 0,
  channels: ["gtf-fithusim-game", "testing"],

  availinmaint: false,
  requireuserdata: false,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gte_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      listsec: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: false,
      buttons: true,
      carselectmessage: false,
      image: [],
      bimage: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    embed.setTitle("__Settings__");

    if (query["options"] == "list") {
      delete query["number"]
      var list = [
        "⭕ __**Delete Save Data**__ ",
  ];

      pageargs["list"] = list;
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
      pageargs["selector"] = "options"
      pageargs["query"] = query
      gte_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }

    if (!isNaN(query["options"])) {
  query["options"] = ["deletesavedata"][parseInt(query["options"]) - 1]
    }
      if (query["options"] == "deletesavedata") {
      var emojilist = [
  { emoji: gtf_EMOTE.fithusimlogo, 
  emoji_name: 'Yes', 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }]
    var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);

        embed.setDescription("❌ Delete your save data for the game? This is permanent.");
        embed.setColor(0xff0000);
        gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, next)

        function next(msg) {
          function deletesave() {
            gte_STATS.saveEnthu(userdata, "DELETE");
            gte_EMBED.alert({ name: "✅ Success", description: "Save data deleted.", embed: embed, seconds: 0 }, msg, userdata);
          }
          var functionlist = [deletesave]

          gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
        }
      return
    }

    var results = gte_SETTINGS.settingsMenu(query, pageargs, embed, msg, userdata)

      if (results == "✅") {
        return;
      } else {
    gte_EMBED.alert({ name: "❌ Error", description: "Invalid arguments.", embed: embed, seconds: 0 }, msg, userdata);
      }
  }
};
