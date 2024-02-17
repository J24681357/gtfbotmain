const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////



module.exports.settingsMenu = function (option, embed, msg, userdata) {

  if (option == "color") {
    var list = [
    "Default | #0151b0",
    "White | #F2F2F2",
    "Black | #383838",
    "Red | #E81224",
    "Orange | #F7630C",
    "Yellow | #FFF100",
    "Green | #16C60C",
    "Blue | #0078D7",
    "Purple | #886CE4",
    "Brown | #8E562E"
    ].map(function(x, i) {
      if (userdata["settings"]["COLOR"] == x.split(" | ")[1]) {
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
      userdata["settings"]["COLOR"] = list[num]["name"].split(" | ")[1]
      return "✅ **Embed Color** has been set to **" + list[num]["name"] + "**";
    };
    return [list, applysetting]
  }

  if (option == "dealersort") {
    var list = [
      "Alphabetical Order",
      "Lowest Price",
      "Highest Price",
      "Highest FPP",
      "Lowest FPP",
      "Highest Power",
      "Lowest Power"
    ].map(function(x, i) {
      if (userdata["settings"]["DEALERSORT"] == x) {
        var name = x + " " + "✅"
      }
      var name = x
      return {
              name: name,
              emoji: "",
              extra: "",
              description: "",
              menu_id: i
      }
    })
    var applysetting = function (num) {
      userdata["settings"]["DEALERSORT"] = list[num]["name"]
      return "✅ **GTF Dealership Sort** has been set to **" + list[num]["name"] + "**.";
    };
    return [list, applysetting]
  }

  if (option == "garagesort") {
    var list = [
        "Alphabetical Order",
        "Recently Used",
        "Oldest Added",
        "Newest Added",
        "Highest FPP",
        "Lowest FPP",
        "Highest Power",
        "Lowest Power"
      ].map(function(x, i) {
      if (userdata["settings"]["GARAGESORT"] == x) {
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
      userdata["settings"]["GARAGESORT"] = list[num]["name"]
      gtf_STATS.sortGarage(userdata)    
    
      return "✅ **GTF Garage Sort** has been set to **" + list[num]["name"] + "**.";
    };
    return [list, applysetting]
  }

  if (option == "displaygrid") {
    var list = [
      "Car",
      "Driver"
    ].map(function(x, i) {
      if (userdata["settings"]["GRIDNAME"] == i) {
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
      userdata["settings"]["GRIDNAME"] = num;
      return "✅ **Grid Display Names** has been set to **" + list[num]["name"] + "**.";
    };
    return [list, applysetting];
  }

  if (option == "icons") {
    var list = [
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
      var bar = list[num]["name"].split(" | ")[1].split(" ")
      var select = bar[0]

      userdata["settings"]["ICONS"] = {select:select, bar: bar};
      
      return "✅ **Menu Icons** has been set to **" + list[num]["name"] + "**.";
    };
    return [list, applysetting]
  }

  if (option == "menuselect") {
      var list = [
        "Arrows",
        "Numbers"
      ].map(function(x, i) {
        if (userdata["settings"]["MENUSELECT"] == i) {
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
        userdata["settings"]["MENUSELECT"] = num;
        
        return "✅ **Navigation Menu Type** has been set to **" + list[num]["name"] + "**."
      };
    return [list, applysetting]
    }

  if (option == "time") {
    var date = new Date();
    var minutes = date.getMinutes();
    if (minutes <= 9) {
      minutes = "0" + minutes;
    }
    var list = []
    for (var index = 0; index < 24; index++) {
      var localTime = date.getTime();
      var localOffset = date.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = index;
      var usertime = utc + 3600000 * offset;
      usertime = new Date(usertime);

      list.push(usertime.getHours() + ":" + minutes);
    }
    list = list.map(function(x, i) {
      if (userdata["settings"]["TIMEOFFSET"] == i) {
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
      if (userdata["dailyworkout"]["status"] || userdata["mileage"] != 0) {
          return "❌ **You can only apply this setting when you have not completed a daily workout and have 0 mileage.**"
        }
      userdata["settings"]["TIMEOFFSET"] = num;
      gtf_STATS.setMileage(0, userdata);
      gtf_STATS.addRaceMulti(-100, userdata)
      userdata["dailyworkout"] = true;
    return "✅ **Local Time** has been set to **" + list[num]["name"] + "**." + "\n⚠️ Daily workout and race multiplier have been reset."
    };
    return [list, applysetting]
  }
  
  if (option == "units") {
    var list = [
      "Kilometers (KM)",
      "Miles (MI)"
    ].map(function(x, i) {
      if (userdata["settings"]["UNITS"] == i) {
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
      userdata["settings"]["UNITS"] = num;
      return "✅ **Metric Units** has been set to **" + list[num]["name"] + "**."
    };
    return [list, applysetting]
  }

  if (option == "messages") {
    var list = [
      "Disabled",
      "Enabled"
    ].map(function(x, i) {
      if (userdata["settings"]["MESSAGES"] == i) {
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
      userdata["settings"]["MESSAGES"] = num;
      return "✅ **Career/Info Messages** has been set to **" + list[num]["name"] + "**."
    };
    return [list, applysetting]
  }
  
  if (option == "reset") {
      userdata["settings"] = gtf_GTF.defaultsettings
      return "✅ Settings has been reset to default."
  }


  if (option == "deletesavedata") {
     var emojilist = [
      { emoji: gtf_EMOTE.yes, 
      emoji_name: 'Yes', 
      name: 'Confirm', 
      extra: "Once",
      button_id: 0 }]
        var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

            embed.setDescription("❌ **Delete your save data for GTF 2: Unleahsed? This is permanent.**");
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
          return ["", ""]
  }

  if (!gtf_MATH.betweenInt(query["number"], 1, pageargs["list"].length + 1)) {
    if (typeof query["number"] !== "undefined") {
      gtf_EMBED.alert({ name: "⚠️ Invalid Number", description: "Invalid arguments.", embed: "", seconds: 3 }, msg, userdata);
      return ""
    }
  } else {
    if (pageargs["list"][query["number"] - 1].includes("✅")) {
      gtf_EMBED.alert({ name: "❌ Current Setting", description: "You already have this current setting.", embed: "", seconds: 3 }, msg, userdata);
      return ""
    }
    applysetting();
    return "✅";
  }

  pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
  pageargs["selector"] = "number";
  gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
  return "✅";
};