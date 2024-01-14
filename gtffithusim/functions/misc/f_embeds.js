//REMOTE 12182023
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.alert = function (object, msg, userdata) {

  var name = object["name"];
  var desc = object["description"];
  var embed = object["embed"];
  var seconds = object["seconds"];
  var help_desc = "";

  var color = "";
  if (name.includes("⚠️")) {
    color = 0xffff00;
  }
  if (name.includes("❌")) {
    color = 0xff0000;
  }
  if (name.includes("✅") || name.includes("🎉") || name.includes(gte_EMOTE.goldmedal)) {
    color = 0x216c2a;
  }

  var message = msg.content.split("***").join(" ");
  if (message.length == 0 || name.includes("✅") || name.includes("🎉") || name.includes(gte_EMOTE.goldmedal)) {
    message = "";
  } else {
    message = ' "' + message + '"'
  }

  if (embed == "") {
    var embed = new EmbedBuilder();

    if (msg.channel.type != 1) {
        if (typeof msg.user === 'undefined') {
embed.setAuthor({name: msg.guild.members.cache.get(userdata["id"]).user.displayName, iconURL: msg.guild.members.cache.get(userdata["id"]).user.displayAvatarURL()});
  } else {
    embed.setAuthor({ name: msg.user.displayName, iconURL: msg.user.displayAvatarURL() });
  }
    }

    embed.setColor(color);
    if (["✅", "🎉", gte_EMOTE.goldmedal].indexOf(name) + 1) {
  embed.setFields([{name:name, value: desc + help_desc}]);
    } 
    else {
      embed.setFields([{name:name + message, value: desc + help_desc}]);
    }
 if (msg.type == 20 || msg.type == 0) {
        msg.channel.send({ embeds: [embed] }).then(msg => {
      if (seconds > 0) {
        gte_STATS.addCount(userdata)
          gte_DISCORD.delete(msg, {seconds: 5}, function() {
             gte_STATS.removeCount(userdata)
          })

      }
    });
           return
       } 
 else { 
    msg.followUp({ embeds: [embed] }).then(msg => {
      if (seconds > 0) {
        gte_STATS.addCount(userdata)
          gte_DISCORD.delete(msg, {seconds:5}, function() {
          gte_STATS.removeCount(userdata) 
          });
      }
    })
  }
    return 
  } 
  else {
    embed.setFields([{name: name + ' "' + message + '"', value: desc}]);
    embed.setColor(color);
  return msg.edit({ embeds: [embed] }).then(msg => {
      if (seconds > 0) {
        setTimeout(() => {
          gte_DISCORD.delete(msg, {})
          gte_MAIN.embedcounts[userdata["id"]]--;
          }, seconds * 1000)
      }
    });
  }
};
