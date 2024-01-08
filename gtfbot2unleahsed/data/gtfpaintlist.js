const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var paint = gtf_LISTS.gtfpaintslist;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "type") {
    results = Object.keys(paint).map(function (x) {
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join();
    });
    return results;
  }
};

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  var paint = gtf_LISTS.gtfpaintlist;
  var final = [];
  var total = Object.keys(args).length;

  var types = Object.keys(paint);

  for (var key = 0; key < types.length; key++) {
    var typekey = paint[types[key]];
    for (var i = 0; i < typekey.length; i++) {
      var count = 0;
      if (args["type"] !== undefined) {
        var type = args["type"];
        var x = typekey[i]["type"];
        if (x.toLowerCase().replace(/ /g, "-") === type.toLowerCase().replace(/ /g, "-")) {
          count++;
        }
      }

      if (args["name"] !== undefined) {
        var name = args["name"];
        var x = typekey[i]["name"];
        if (x === name) {
          count++;
        }
      }

      if (count == total) {
        final.push(typekey[i]);
      }
    }
  }
  if (final.length == 0) {
    return "";
  }
  return JSON.parse(JSON.stringify(final)).sort((x, y) => x["cost"] - y["cost"]);
};

////////////////////////////////////////////////////

module.exports.applyPaint = function (paint, userdata) {
  if (paint["type"] == "Livery") {
     var installedpart = userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["livery"];
  } else {
  var installedpart = userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["color"];
  }

  if (paint["name"] == "Default") {
    installedpart["current"] = paint["name"];
  } else {
  installedpart["current"] = paint["type"] + " " + paint["name"];
  }


if (paint["type"] == "Livery") {
      userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["livery"] = installedpart
  } else {
   userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["color"] = installedpart
  }

};

module.exports.checkPaints = function (paint, gtfcar) {
  var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] });

  if (ocar["type"].includes("Race Car") || ocar["type"].includes("Rally Car")) {
    if (paint["name"] == "Default") {
      if (gtfcar["livery"]["current"] == paint["name"]) {
       return "✅"
      } else {
        return ""
      }
    }
    var nameid = parseInt(paint["name"].split(" ").pop()) - 1
    var list = ["❌","❌","❌"]
    var liveries = ocar["image"].length - 1
    for (var x = 0; x < liveries; x++) {
      if (gtfcar["livery"]["current"].includes(paint["name"])) {
      if (gtfcar["livery"]["current"] == "Livery " + paint["name"]) {
       list[x] = "✅"
      } else {
        list[x] = ""
      }
      continue;
    }
      list[x] = ""
    }
    return list[nameid]

  } else {
    if (paint["name"] == "Default" && gtfcar["color"]["current"] == "Default") {
      return "✅"
    }

  if (gtfcar["color"]["current"] == paint["type"] + " " + paint["name"]) {
    return "✅";
  } else if (gtfcar["color"]["current"] == "Default") {
    return "";
  }

    return ""

  }
};
