const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  if (args["sort"] !== undefined) {
    var sort = args["sort"];
    delete args["sort"];
  }
  var total = Object.keys(args).length;
  var gtfcareerraces = gtf_LISTS.gtfcareerraces;
  var final = [];
  var eventids = Object.keys(gtfcareerraces);

  for (var key = 0; key < eventids.length; key++) {
    var eventidkey = gtfcareerraces[eventids[key]];

      var count = 0;

      if (args["types"] !== undefined) {
        if (args["types"].length == 0) {
          count++;
        } else {
          var types = args["types"];
          for (var itype = 0; itype < types.length; itype++) {
            var re = new RegExp("^" + types[itype] + "-", 'ig');
            if (eventidkey["eventid"].match(re)) {
              count++;
              break;
            }
          }
        }
      }
      
      if (count == total) {
        final.push(eventidkey);
      }
  }
  if (final.length == 0) {
    return "";
  }

  return final;
};

///starts at 1
module.exports.get = function (args) {
  if (args === undefined) {
    return "";
  }
   var gtfcareerraces = gtf_LISTS.gtfcareerraces;
   var type = args["type"].toLowerCase()
   var number = args["number"]
   var eventid = type + "-" + number
  if (typeof gtfcareerraces[eventid] === 'undefined') {
    return ""
  } else {
   return gtfcareerraces[eventid]
  }
}
