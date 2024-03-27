const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.settingsMenu = function (option, embed, msg, userdata) {

  if (option == "generationselect") {
    pageargs["rows"] = 10;
    pageargs["footer"] = "⚠ Selecting a Generation will reset your Fithusim Life except for your garage!\n❓ **Select a generation that you would want to switch to. Note that when switching different generations, Ranking, Week, Enthu Points, and starter car will be reset. Any collected cars will still be remained and can be still used when applicable.**";
    pageargs["list"] = [
      "Generation 1 (1960 - 1989)",
      "Generation 2 (1990 - 2009)",
      "Generation 3 (2010 - Present)"
    ].map(function(x, i) {
      if (userdata["settings"]["GMODE"] == i) {
          x = "**" + x + "**"
      }
      if (gte_STATS.checkItem("Generation " + (i+1), userdata)) {
        x = x + " `Complete`"
      }
      return x
    })
    embed.setTitle("__Generation Select (" + pageargs["list"].length + " Modes)__");

    var applysetting = function () {
      if (query["number"] != 1) {
      if (!gte_STATS.checkItem("Generation " + (query["number"]-1), userdata)) {
        gte_EMBED.alert({ name: "❌ Generation Locked", description: "You must complete **Generation " + (query["number"] - 1) + "** " + "in order to proceed." , embed: "", seconds: 0 }, msg, userdata);
          return "ERROR"
        }
        
      }
      userdata["settings"] = gte_GTF.defaultsettings
      userdata["settings"]["GMODE"] = query["number"] - 1;
      userdata["currentcar"] = -1
      userdata["ranking"] = 1000
      userdata["rankinghistory"] = []
      userdata["rankingpoints"] = 0
      userdata["exp"] = 0
      userdata["level"] = 1
      userdata["skillpoints"] = 0
      userdata["week"] = 0
      userdata["weekseed"] = gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString() +gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString()
      userdata["enthupoints"] = 300
      userdata["totalenthupoints"] = 300
      require(gte_TOOLS.homeDir() + "commands/settings").execute(msg, {options:"list", extra:"Mode has been changed to **" + pageargs["list"][query["number"] - 1] + "**." + " " + "Ranking, Week, Enthu points, and starter car will be reset when starting Fithusim Life."}, userdata);
      return "✅";
    };
  }

  if (option == "summarysort") {
    var list = [
      "Week",
      "Ranking Points"
    ].map(function(x, i) {
      if (userdata["settings"]["SUMMARYSORT"] == i) {
        var name = x + " " + "✅"
      } else {
        var name = x
      
      }
      return {
              name: name,
              emoji: "",
              extra: "",
              description: "",
              menu_id: i
      }
    })
    

    var applysetting = function (num) {
      userdata["settings"]["SUMMARYSORT"] = num;
      return "✅ **Race Summary Sort** has been set to **" + list[num]["name"] + "**."
    };
    return [list, applysetting]
  }

  if (option == "reset") {
      userdata["settings"] = gte_GTF.defaultsettings
      require(gte_TOOLS.homeDir() + "commands/settings").execute(msg, {options:"list", extra:"Settings has been reset to default."}, userdata);
      return "✅";
  }
  if (option == "deletesavedata") {
     var emojilist = [
      { emoji: gtf_EMOTE.yes, 
      emoji_name: 'Yes', 
      name: 'Confirm', 
      extra: "Once",
      button_id: 0 }]
        var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);

            embed.setDescription("❌ **Delete your save data for GTF: Fithusim? This is permanent.**");
            embed.setColor(0xff0000);

            gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, next)

            function next(msg) {
              function deletesave() {
                gte_STATS.saveEnthu(userdata, "DELETE");
                gtf_EMBED.alert({ name: "✅ Success", description: "Save data deleted.", embed: embed, seconds: 0 }, msg, userdata);
              }
              var functionlist = [deletesave]

              gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
            }
     return ["", ""]
  }

  if (!gtf_MATH.betweenInt(query["number"], 1, pageargs["list"].length + 1)) {
    if (typeof query["number"] !== "undefined") {
      gte_EMBED.alert({ name: "⚠️ Invalid Number", description: "Invalid arguments.", embed: "", seconds: 3 }, msg, userdata);
      return ""
    }
  } else {
    if (pageargs["list"][query["number"] - 1].includes("✅")) {
      gte_EMBED.alert({ name: "❌ Current Setting", description: "You already have this current setting.", embed: "", seconds: 3 }, msg, userdata);
      return ""
    }
    applysetting();
    return "✅";
  }

  pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
  pageargs["selector"] = "number";
  gte_TOOLS.formPages(pageargs, embed, msg, userdata);
  return "✅";
};