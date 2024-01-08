const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var wheels = gtf_LISTS.gtfwheellist;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "makes") {
    results = Object.keys(wheels).map(function (x) {
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join(" ");
    });
    return results;
  }
}

module.exports.find = function (args) {
  if (args === undefined) {
    return "";
  }
  var wheels = gtf_LISTS.gtfwheellist;
  var final = [];
  var total = Object.keys(args).length;

  var makes = Object.keys(wheels);

  for (var key = 0; key < makes.length; key++) {
    var makekey = wheels[makes[key]];
    for (var i = 0; i < makekey.length; i++) {
      var count = 0;
      if (args["make"] !== undefined) {
        var make = args["make"];
        var x = makekey[i]["make"];
        if (x.toLowerCase().replace(/-/,"_").replace(/ /g, "_") === make.toLowerCase().replace(/-/,"_").replace(/ /g, "_")) {
          count++;
        }
      }

      if (args["name"] !== undefined) {
        var name = args["name"];
        var x = makekey[i]["name"];
        if (x === name) {
          count++;
        }
      }

      if (args["fullname"] !== undefined) {
        var fullname = args["fullname"];
        var x = makekey[i]["make"] + " " + makekey[i]["name"]
        if (x === fullname) {
          count++;
        }
      }

      if (count == total) {
        final.unshift(makekey[i]);
      }
    }
  }
  if (final.length == 0) {
    return "";
  }
  return JSON.parse(JSON.stringify(final)).sort((x, y) => x["cost"] - y["cost"]);
};

module.exports.applyWheels = function(part, userdata) {
  var id = userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["ID"]

  var installedpart = userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["rims"];

  installedpart["current"] = part["make"] + " " + part["name"];
  if (part["name"] == "Default") {
      installedpart["current"] = part["name"];
      installedpart["list"] = []
  }
  for (var i = 0; i < installedpart["tuning"].length; i++) {
    if (part["name"] == "Default") {
      installedpart["tuning"][i] = -999;
    } else {
    installedpart["tuning"][i] = 0;
    }
  }

  if (!installedpart["list"].includes(part["make"] + " " + part["name"]) && part["name"] != "Default") {
    userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["rims"]["list"] = [part["make"] + " " + part["name"]]
  }

  userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["rims"] = installedpart;
};
module.exports.checkWheels = function (part, gtfcar) {
  if (part["name"] == "Default") {
    if (gtfcar["rims"]["current"] == part["name"]) {
      return ["✅", ""]
    } else {
      return ["", ""]
    }

  }
  if (gtfcar["rims"]["list"].includes(part["make"] + " " + part["name"])) {
      if (gtfcar["rims"]["current"] == (part["make"] + " " + part["name"])) {
       return ["✅", ""]
      } else {
        return ["📦", ""]
      }
  }
  return ["", ""];
};
