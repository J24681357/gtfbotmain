const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.condition = function (gtfcar) {
  var conditions = [gtfcar["condition"]["oil"],
                    gtfcar["condition"]["engine"],
                    gtfcar["condition"]["transmission"],
                    gtfcar["condition"]["suspension"] ,gtfcar["condition"]["body"]].map(function(x) {
   if (x <= 0) {
     x = 0
   }
      return x
        })
  var weights = [0.06, 0.28, 0.13, 0.13, 0.2]
  var conditionavg = gtf_MATH.weightedAverage(conditions, weights)
  var icon = gtf_EMOTE.carexcellent
  var name = "Excellent"
  if (conditionavg < 70) {
    icon = gtf_EMOTE.carnormal
    name = "Normal"
  }
  if (conditionavg < 45) {
    icon = gtf_EMOTE.carworn
    name = "Worn"
  }
  if (conditionavg < 20) {
    icon = gtf_EMOTE.carbad
    name = "Bad"
  }
  if (conditionavg <= 5) {
    icon = gtf_EMOTE.cardead
    name = "Wreaked"
  }
  var health = gtf_MATH.round(conditionavg, 1)
  if (health <= 0) {
    health = 0
  }
  return {
  health: health,
  name: name,
  emote: icon
  }
}
module.exports.updateCondition = function(number, condition, userdata) {
  var conditionlist = userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["condition"];

  if (condition == "all") {
    var keys = Object.keys(conditionlist)
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == "oil" || keys[i] == "clean") {
        continue;
      }
      conditionlist[keys[i]] = number
    }
  } else {
  conditionlist[condition] = Math.round(conditionlist[condition] + number)

  if (conditionlist[condition] >= 100) {
    conditionlist[condition] = 100
  }
  if (conditionlist[condition] <= 0) {
    conditionlist[condition] = 0
  }
  }
  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["condition"] = conditionlist

  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["fpp"] = gte_PERF.perfEnthu(userdata["garage"][gte_STATS.currentCarNum(userdata) - 1], "GARAGE")["fpp"];
}
module.exports.updateDamage = function (racesettings, car, userdata) {

  var id = userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["id"];
  var length = racesettings["distance"]["km"]
  var damage = car["damage"] 
  if (racesettings["type"] == "TIME") {
    if (length >= 2000) {
      damage = 100
    }
  }
  damage = damage - (damage * (0.4 * (gte_STATS.level(userdata)/50)))

 ///CLEAN
  var rclean = gtf_MATH.round(gtf_MATH.randomInt(1, 5) * (length/45), 2);
  gte_CONDITION.updateCondition(-rclean, "clean", userdata)

  ////OIL
  var roil = gtf_MATH.round(length/6, 2);

  gte_CONDITION.updateCondition(-roil, "oil", userdata)

  while (damage >= 0) {
    var d = gtf_MATH.randomInt(2,5)
    var select = ["engine", "transmission", "suspension", "body"][gtf_MATH.randomInt(0,3)]
    gte_CONDITION.updateCondition(-d, select, userdata)
    damage = damage - d
  }
}

module.exports.updateDamageEnthu = function (racesettings, car, userdata) {

  var length = racesettings["distance"]["km"]
  var damage = car["damage"] 
  if (racesettings["type"] == "TIME") {
    if (length >= 2000) {
      damage = 100
    }
  }
  var multiplier = {"Passive": 0.75, "Neutral": 1.5, "Aggressive": 2.5}[userdata["settings"]["MODE"]]
  var pointslost = Math.round(damage * 10) * multiplier

  gte_STATS.addEnthuPoints(-pointslost, userdata)
}