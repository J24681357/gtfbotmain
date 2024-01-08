const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.checkLevel = function (level, embed, msg, userdata) {
  var exp = gtf_STATS.exp(userdata);
  var currentlevel = gtf_STATS.level(userdata);
  if (currentlevel >= level || level == 0) {
    return true;
  } else {
    gtf_EMBED.alert({ name: "❌ " + "Level " + level + " Required", description: "🔒 Your level does not meet the requirements." + "\n\n" + "**Lv." + currentlevel + gtf_EMOTE.exp + " -> " + "Lv." + level + "**", embed: "", seconds: 10 }, msg, userdata);
    return false;
  }
};

module.exports.expBar = function (userdata) {
  var progress = userdata["settings"]["ICONS"]["bar"][0];
    var progressb = userdata["settings"]["ICONS"]["bar"][1];
    var expbar = [progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb, progressb];
    
    var nextlevel = gtf_STATS.level(userdata) + 1;
    if (nextlevel >= 50) {
      nextlevel = 50;
    }
    var nextlevelexp = gtf_LISTS.gtfexp[nextlevel.toString()]["exp"];

    var curr = gtf_STATS.level(userdata)
    var currexp = gtf_STATS.exp(userdata);
    var currlevelexp = gtf_LISTS.gtfexp[curr.toString()]["exp"];
    for (var i = 0; i < expbar.length; i++) {
      if (currlevelexp <= currexp) {
        currlevelexp += nextlevelexp / 10
        expbar[i] = progress;
      }
    }
  return expbar
}

module.exports.checkLevelUp = function (userdata) {
  var exp = gtf_STATS.exp(userdata);
  var level = gtf_STATS.level(userdata);
  var levelup = 0;
  var leveldetails = [""];
  var explevels = gtf_LISTS.gtfexp;

  for (var i = level; i < Object.keys(explevels).length; i++) {
    if (exp >= explevels[(i + 1).toString()]["exp"]) {
      levelup++;
      if (typeof explevels[(i + 1).toString()]["rewards"] != "undefined") {
        leveldetails.push(explevels[(i + 1).toString()]["rewards"].slice(0,2).join("/n"));
      }
    } else {
      break;
    }
  }
  gtf_STATS.addLevel(levelup, userdata);
  var bool = (levelup >= 1)
  return [bool, levelup, leveldetails.slice(0, 5).join("\n")];
};
