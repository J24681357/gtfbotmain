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
  var fithusimraces = gte_LIST_FITHUSIMRACES;
  var final = [];
  var eventids = Object.keys(fithusimraces);

  for (var key = 0; key < eventids.length; key++) {
    var eventidkey = fithusimraces[eventids[key]];

    var count = 0;

    if (args["types"] !== undefined) {
      if (args["types"].length == 0) {
        count++;
      } else {
        var types = args["types"];
        for (var itype = 0; itype < types.length; itype++) {
          var re = new RegExp("^" + types[itype] + "-", "ig");
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
  var fithusimraces = gte_LIST_FITHUSIMRACES;
  var type = args["type"].toLowerCase();
  var number = args["number"];
  var eventid = type + "-" + number;
  if (typeof fithusimraces[eventid] === "undefined") {
    return "";
  } else {
    return fithusimraces[eventid];
  }
};

module.exports.audit = async function () {
  var list = gte_LIST_FITHUSIMRACES;
  var fs = require("fs");
  var newlist = {};

  var races = Object.keys(list);
  var count = 1;

  var league = races[0].split("-")[0];
  var group = [];
  for (var i = 0; i < races.length; i++) {
    var race = list[races[i]];
    if (league == race["eventid"].split("-")[0]) {
      group.push(race);
    } else {
      group = group.sort((a, b) => a["title"].toString().localeCompare(b["title"]));
      group.map(function (x) {
        x["eventid"] = league + "-" + count;
        newlist[x["eventid"]] = x;
        count++
      });
      group = [];
      count = 1;
      ///
      league = race["eventid"].split("-")[0];
      race["eventid"] = league + "-" + count;
      group.push(race);
    }
  }
  group = group.sort((a, b) => a["title"].toString().localeCompare(b["title"]));
  group.map(function (x) {
    x["eventid"] = league + "-" + count;
    newlist[x["eventid"]] = x;
    count++
  });

  fs.writeFile(gte_TOOLS.homeDir() + "jsonfiles/fithusimraces.json", JSON.stringify(newlist), function(err) {
    if (err) {
      console.log(err);
    }
  });
};
