//REMOTE 12182023
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

// OFFSET PST 16
module.exports.getFormattedDate = function (date, userdata) {
  var localTime = date.getTime();
  var localOffset = date.getTimezoneOffset() * 60000;
  var utc = localTime + localOffset;
  var offset = userdata["settings"]["TIMEOFFSET"];
  var usertime = utc + 3600000 * offset;
  usertime = new Date(usertime);
  var year = usertime.getFullYear();

  var month = (1 + usertime.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  var day = usertime.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return month + "/" + day + "/" + year;
};

module.exports.getCurrentDay = function () {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
};

module.exports.getFormattedTime = function (duration) {
  var durationeconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (hours < 10) {
    if (hours != 0) {
      hours = "0" + hours + ":";
    } else {
      hours = "";
    }
  } else {
    hours = hours + ":";
  }

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + minutes + ":" + seconds;
};

module.exports.getFormattedLapTime = function (duration) {
  if (isNaN(duration)) {
    return duration;
  }
  var seconds = duration.toFixed(5).toString().split(".")[0].slice(0, -3);

  var mill = (duration / 1000).toFixed(5).toString().split(".")[1].slice(0, 3);
  return gte_DATETIME.getFormattedTime(seconds * 1000) + "." + mill;
};

module.exports.getFormattedWeekEnthu = function (week) {
    var day = (((week-1) % 4) + 1).toString()
    var year = Math.ceil(week / 48).toString()

    var month = (Math.ceil(week/4) - (12*(year-1))).toString()
    day = day.length > 1 ? day : "0" + day;
    month = month.length > 1 ? month : "0" + month;
    year = year.length > 1 ? year : "0" + year;

   return year +"/" + month + "/" + day
};
