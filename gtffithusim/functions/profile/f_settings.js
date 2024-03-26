const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.settingsMenu = function (query, pageargs, embed, msg, userdata) {
  pageargs["rows"] = 10;

  if (query["options"] == "generationselect") {
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


  if (query["options"] == "summarysort") {
    pageargs["footer"] = "❓ **Select a sorting type for the race history in the race results summary.**";
    pageargs["list"] = [
      "Week",
      "Highest Ranking Points"
    ].map(function(x, i) {
      if (userdata["settings"]["SUMMARYSORT"] == i) {
        return x + " " + "✅"
      }
      return x
    })
    embed.setTitle("⚙ __Fithusim Life - Race Summary Sort (" + pageargs["list"].length + " Items)__");

    var applysetting = function () {
      userdata["settings"]["UNITS"] = query["number"] - 1;
      require(gte_TOOLS.homeDir() + "commands/settings").execute(msg, {options:"list", extra:"Your **Race Summary Sort** has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "✅";
    };
  }

  if (query["options"] == "time") {
    var date = new Date();
    pageargs["footer"] = "❓ **What time is it? Select with the number corresponding to your current time zone (Military Time). This will reset the cycle your daily workout and race multiplier. You MUST not have completed a daily workout and 0 miles, before applying this setting.**";

    var minutes = date.getMinutes();
    if (minutes <= 9) {
      minutes = "0" + minutes;
    }
    var applysetting = function () {
      if (userdata["dailyworkout"] || userdata["mileage"] == 0) {
        gte_EMBED.alert({ name: "❌ Invalid", description: "You can only apply this setting when you have not completed a daily workout and have 0 mileage.", embed: "", seconds: 3 }, msg, userdata);
          return "ERROR"
        }
      userdata["settings"]["TIMEOFFSET"] = query["number"] - 1;
      gte_STATS.setMileage(0, userdata);
      gte_STATS.addRaceMulti(-100, userdata)
      userdata["dailyworkout"] = true;
      require(gte_TOOLS.homeDir() + "commands/settings").execute(msg, {options:"list", extra:"Local time has been set to **" + pageargs["list"][query["number"] - 1] + "**." + "\n⚠️ Daily workout and race multiplier have been reset."}, userdata);
    };
    pageargs["list"] = []
    for (var index = 0; index < 24; index++) {
      var localTime = date.getTime();
      var localOffset = date.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = index;
      var usertime = utc + 3600000 * offset;
      usertime = new Date(usertime);

      pageargs["list"].push(usertime.getHours() + ":" + minutes);
    }
    pageargs["list"] = pageargs["list"].map(function(x, i) {
      if (userdata["settings"]["TIMEOFFSET"] == i) {
        return x + " " + "✅"
      }
      return x
    })
    embed.setTitle("⚙ __GTF Settings - Time Zones (" + pageargs["list"].length + " Items)__");

  }

  if (query["options"] == "icons") {
    pageargs["footer"] = "❓ **Select the menu icons corresponding from the list above.**";
    pageargs["list"] = [
    "Default | ⬜ ⬛",
    "White | ⬜ ⬛",
    "Black | ⬛ ⬜",
    "Red | 🟥 ⬛",
    "Orange | 🟧 ⬛",
    "Yellow | 🟨 ⬛",
    "Green | 🟩 ⬛",
    "Blue | 🟦 ⬛",
    "Purple | 🟪 ⬛",
    "Brown | 🟫 ⬛"].map(function(x, i) {
      var bar = x.split(" | ")[1].split(" ")
      var select = bar[0]
      if (userdata["settings"]["ICONS"]["select"] == select && userdata["settings"]["ICONS"]["bar"][0] == bar[0] && userdata["settings"]["ICONS"]["bar"][1] == bar[1]) {
        return x + " " + "✅"
      }
      return x
    })

  embed.setTitle("⚙ __GTF Settings - Menu Icons (" + pageargs["list"].length + " Items)__");
    var applysetting = function () {
      /*
      if (pageargs["list"][query["number"] - 1].includes("Lv.10")) {
        if (!gte_EXP.checkLevel(10, embed, msg, userdata)) {
          return "ERROR"
        }
      }
      */
      var bar = pageargs["list"][query["number"] - 1].split(" | ")[1].split(" ")
      var select = bar[0]

      userdata["settings"]["ICONS"] = {select:select, bar: bar};
      require(gte_TOOLS.homeDir() + "commands/settings").execute(msg, {options:"list", extra:"Your **Menu Icons** has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "✅";
    };
  }

  if (query["options"] == "messages") {
   pageargs["footer"] = "❓ **Enable or disable messages when you use commands. Note that this also disable messages from main characters.**";
    pageargs["list"] = [
      "Disabled",
      "Enabled"
    ].map(function(x, i) {
      if (userdata["settings"]["MESSAGES"] == i) {
        return x + " " + "✅"
      }
      return x
    })
     embed.setTitle("⚙ __GTF Settings - Messages (" + pageargs["list"].length + " Items)__");
    var applysetting = function () {
      userdata["settings"]["MESSAGES"] = query["number"] - 1;
      require(gte_TOOLS.homeDir() + "commands/settings").execute(msg, {options:"list", extra:"Messages has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "✅";
    };
  }

  if (query["options"] == "menuselect") {
   pageargs["footer"] = "❓ **Select a type of buttons to navigate through in most menus. Arrows is where you select up and down each selection; Numbers is where you select via the numbers associated with the current row.**";
    pageargs["list"] = [
      "Arrows",
      "Numbers"
    ].map(function(x, i) {
      if (userdata["settings"]["MENUSELECT"] == i) {
        return x + " " + "✅"
      }
      return x
    })
     embed.setTitle("⚙ __GTF Settings - Menu Selector (" + pageargs["list"].length + " Items)__");
    var applysetting = function () {
      userdata["settings"]["MENUSELECT"] = query["number"] - 1;
      require(__filename.split("/").slice(0,4).join("/") + "/" 
+ "commands/settings").execute(msg, {options:"list", extra:"Menu Selector has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "✅";
    };
  }

  if (query["options"] == "displaygrid") {
    pageargs["footer"] = "❓ **Select the type of names to display while racing with opponents.**";
    pageargs["list"] = [
      "Car",
      "Driver"
    ].map(function(x, i) {
      if (userdata["settings"]["GRIDNAME"] == i) {
        return x + " " + "✅"
      }
      return x
    })
    embed.setTitle("⚙ __GTF Settings - Grid Display Names (" + pageargs["list"].length + " Items)__");

    var applysetting = function () {
      userdata["settings"]["GRIDNAME"] = query["number"] - 1;
      require(gte_TOOLS.homeDir() + "commands/settings").execute(msg, {options:"list", extra:"Your **Grid Display Names** has been set to **" + pageargs["list"][query["number"] - 1] + "**."}, userdata);
      return "✅";
    };
  }
  if (query["options"] == "reset") {
      userdata["settings"] = gte_GTF.defaultsettings
      require(gte_TOOLS.homeDir() + "commands/settings").execute(msg, {options:"list", extra:"Settings has been reset to default."}, userdata);
      return "✅";
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