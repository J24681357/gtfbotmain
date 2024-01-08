const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "settings",
  title: "GTF Settings",
  license: "N",
  level: 0,
  channels: ["testing", "gtf-2u-game", "gtf-demo"],

  availinmaint: false,
  requireuserdata: false,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(embed, results, query, {
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

    embed.setTitle("⚙ __GTF Settings__");

    if (query["options"] == "list") {
      delete query["number"]
        var units = ["Kilometers", "Miles"];
        var enabled = ["Disabled", "Enabled"]
        var menutype = ["Arrows", "Numbers"]
        var gridname = ["Car", "Driver"]
      var list = [
         "__**Embed Color**__ " + "`" + userdata["settings"]["COLOR"] + "`",
        "__**Dealership Catalog Sort**__ " + "`" + userdata["settings"]["DEALERSORT"] + "`",
        "__**Garage Sort**__ " + "`" + userdata["settings"]["GARAGESORT"] + "`",
        "__**Grid Display Names**__ " + "`" + gridname[userdata["settings"]["GRIDNAME"]] + "`",
        "__**Menu Icons**__ " + userdata["settings"]["ICONS"]["select"] + " " + userdata["settings"]["ICONS"]["bar"].join(" "),
        "__**Menu Selector**__ " + 
 "`" + menutype[userdata["settings"]["MENUSELECT"]] + "`",
        "__**Metric Units**__ " + "`" + units[userdata["settings"]["UNITS"]] + "`",
        "__**Daily Workout - Time Zone Offset**__ " + "`"+ userdata["settings"]["TIMEOFFSET"] + "`",
        "__**Messages**__ " + 
"`" + enabled[userdata["settings"]["MESSAGES"]] + "`",
        "🔁 __**Reset To Default Settings**__ ",
        "⭕ __**Delete Save Data**__ ",
  ];

      pageargs["list"] = list;
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      pageargs["selector"] = "options"
      pageargs["query"] = query
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }

    if (!isNaN(query["options"])) {
  query["options"] = ["color", "dealersort", "garagesort", "displaygrid", "icons", "menuselect", "units", "time", "messages", "reset", "deletesavedata"][parseInt(query["options"]) - 1]
    }
      if (query["options"] == "deletesavedata") {
      var emojilist = [
  { emoji: gtf_EMOTE.yes, 
  emoji_name: 'Yes', 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }]
    var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

        embed.setDescription("❌ Delete your save data for GTF 2: Unleahsed? This is permanent.");
        embed.setColor(0xff0000);
        gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, next)
        
        function next(msg) {
          function deletesave() {
            gtf_STATS.save(userdata, "DELETE");
            gtf_EMBED.alert({ name: "✅ Success", description: "Save data deleted.", embed: embed, seconds: 0 }, msg, userdata);
          }
          var functionlist = [deletesave]

          gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
        }
      return
    }

    var results = gtf_SETTINGS.settingsMenu(query, pageargs, embed, msg, userdata)

      if (results == "✅") {
        return;
      } else {
    gtf_EMBED.alert({ name: "❌ Error", description: "Invalid arguments.", embed: embed, seconds: 0 }, msg, userdata);
      }
  }
};
