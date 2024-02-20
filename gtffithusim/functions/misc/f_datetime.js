const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

// OFFSET PST 16
module.exports.getFormattedWeekEnthu = function (week) {
    var day = (((week-1) % 4) + 1).toString()
    var year = Math.ceil(week / 48).toString()

    var month = (Math.ceil(week/4) - (12*(year-1))).toString()
    day = day.length > 1 ? day : "0" + day;
    month = month.length > 1 ? month : "0" + month;
    year = year.length > 1 ? year : "0" + year;

   return year +"/" + month + "/" + day
};
