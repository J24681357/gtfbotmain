const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.checkLevel = function (level, embed, msg, userdata) {
  
  var exp = gte_STATS.exp(userdata);
  var currentlevel = gte_STATS.level(userdata);
  if (currentlevel >= level || level == 0) {
    return true;
  } else {
    gte_EMBED.alert({ name: "❌ " + "Level " + level + " Required", description: "🔒 Your level does not meet the requirements." + "\n\n" + "**Lv." + currentlevel + gtf_EMOTE.exp + " -> " + "Lv." + level + "**", embed: "", seconds: 10 }, msg, userdata);
    return false;
  }
};

module.exports.checkLevelUp = function (userdata) {
  var exp = gte_STATS.exp(userdata);
  var level = gte_STATS.level(userdata);
  var levelup = 0;
  var leveldetails = [""];
  var explevels = gte_LISTS.gtfexp;

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
  gte_STATS.addLevel(levelup, userdata);
  var bool = (levelup >= 1)
  return [bool, levelup, leveldetails.slice(0, 5).join("\n")];
};
