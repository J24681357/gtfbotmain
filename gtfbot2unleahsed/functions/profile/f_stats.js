const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

const client = new Client({
  partials: [Partials.Channel],
  intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]
});
var fs = require("fs");

module.exports.userid = function(userdata) {
  r
  return userdata["id"];
};

///COUNT
module.exports.count = function(userdata) {
  var num = gtf_LIST_EMBEDCOUNTS[userdata["id"]];
  if (isNaN(num)) {
    gtf_LIST_EMBEDCOUNTS[userdata["id"]] = 0;
    return 0;
  } else {
    return num;
  }
};
module.exports.addCount = function(userdata) {
  gtf_LIST_EMBEDCOUNTS[userdata["id"]]++;
};
module.exports.removeCount = function(userdata) {
  gtf_LIST_EMBEDCOUNTS[userdata["id"]]--;
};
///CREDITS
module.exports.credits = function(userdata) {
  if (userdata["credits"] >= gtf_GTF.creditslimit) {
    userdata["credits"] = gtf_GTF.creditslimit;
  }
  userdata["credits"] = Math.round(userdata["credits"]);
  return userdata["credits"];
};
module.exports.addCredits = function(number, userdata) {
  userdata["credits"] = parseInt(userdata["credits"]);
  userdata["credits"] += parseInt(number);
  if (userdata["credits"] >= gtf_GTF.creditslimit) {
    userdata["credits"] = gtf_GTF.creditslimit;
  }
  if (isNaN(userdata["credits"])) {
    throw new Error('The value is not a number.');
  }
};
///TOTALPLAYTIME
module.exports.totalPlayTime = function(userdata, type) {
  if (type == "MILLISECONDS") {
    return userdata["totalplaytime"]
  } else {
    return gtf_DATETIME.getFormattedTime(userdata["totalplaytime"])
  }
};
module.exports.addPlayTime = function(number, userdata) {
  userdata["totalplaytime"] = parseFloat(userdata["totalplaytime"]);

  userdata["totalplaytime"] = userdata["totalplaytime"] + parseFloat(number);

  if (isNaN(userdata["totalplaytime"]) || userdata["totalplaytime"] < 0) {
    throw new Error('The value is not a positive number.');
  }
};
///TOTALDRIFTPOINTS
module.exports.totalDriftPoints = function(userdata) {
  return userdata["totaldriftpoints"]
};
module.exports.addDriftPoints = function(number, userdata) {
  userdata["totaldriftpoints"] = parseFloat(userdata["totaldriftpoints"]);
  userdata["totaldriftpoints"] = userdata["totaldriftpoints"] + parseFloat(number);

  if (isNaN(userdata["totaldriftpoints"]) || userdata["totaldriftpoints"] < 0) {
    throw new Error('The value is not a positive number.');
  }
};
//RACEMULTI
module.exports.raceMulti = function(userdata) {
  return userdata["racemulti"];
};
module.exports.addRaceMulti = function(number, userdata) {
  userdata["racemulti"] = userdata["racemulti"] + parseFloat(number);
  userdata["racemulti"] = Math.round(userdata["racemulti"] * 10) / 10;
  if (userdata["racemulti"] >= 2) {
    userdata["racemulti"] = 2;
  }
  if (userdata["racemulti"] <= 1) {
    userdata["racemulti"] = 1;
  }
};
///EXP
module.exports.exp = function(userdata) {
  if (userdata["exp"] >= gtf_GTF.explimit) {
    userdata["exp"] = gtf_GTF.explimit;
  }
  return userdata["exp"];
};
module.exports.addExp = function(number, userdata) {
  userdata["exp"] = parseInt(userdata["exp"]);
  if (parseInt(number) < 0) {
  } else {
    userdata["exp"] += parseInt(number);
  }
  if (userdata["exp"] >= gtf_GTF.explimit) {
    userdata["exp"] = gtf_GTF.explimit;
  }
};
///LEVEL
module.exports.level = function(userdata) {
  return userdata["level"];
};
module.exports.addLevel = function(number, userdata) {
  if (number == 0) {
    return;
  } else {
    userdata["level"] += number;
  }
};

module.exports.lastOnline = function(userdata) {
  return userdata["lastonline"];
};
///MILEAGE
module.exports.mileage = function(userdata) {
  return userdata["mileage"]
};
module.exports.addMileage = function(km, userdata) {
  km = gtf_MATH.round(parseFloat(km), 2)
  userdata["mileage"] += km;

  if (isNaN(userdata["mileage"])) {
    throw new Error('The value is not a number.');
  }
};
module.exports.setMileage = function(km, userdata) {
  userdata["mileage"] = parseFloat(km);
};
module.exports.carMileageUser = function(car, userdata) {
  var mileage = [car["totalmileage"], gtf_MATH.convertKmToMi(car["totalmileage"])]
  return mileage[userdata["settings"]["UNITS"]]
};
module.exports.mileageUser = function(userdata) {
  var mileage = [userdata["mileage"], gtf_MATH.convertKmToMi(userdata["mileage"])]

  return gtf_MATH.round(mileage[userdata["settings"]["UNITS"]], 2)
};
module.exports.mileageUnits = function(userdata) {
  return ["km", "mi"][userdata["settings"]["UNITS"]]
};

module.exports.weightUnits = function(userdata) {
  return ["kg", "lbs"][userdata["settings"]["UNITS"]]
};
module.exports.weightUser = function(number, userdata) {
  var weight = [Math.round(number * 0.453592), number]
  return weight[userdata["settings"]["UNITS"]]
};

//TOTALMILEAGE
module.exports.totalMileage = function(userdata) {
  userdata["totalmileage"] = parseFloat(userdata["totalmileage"])
  return userdata["totalmileage"]
};
module.exports.addTotalMileage = function(km, userdata) {
  km = gtf_MATH.round(parseFloat(km), 2)
  userdata["totalmileage"] += km;
  if (isNaN(userdata["totalmileage"])) {
    throw new Error('The value is not a number.');
  }
};
module.exports.setTotalMileage = function(km, mi, userdata) {
  userdata["totalmileage"] = parseFloat(km);
};
module.exports.totalMileageUser = function(userdata) {
  var totalmileage = [userdata["totalmileage"], gtf_MATH.convertKmToMi(userdata["totalmileage"])]
  return gtf_MATH.round(totalmileage[userdata["settings"]["UNITS"]], 2)
};
module.exports.addCarTotalMileage = function(km, userdata) {
  km = gtf_MATH.round(parseFloat(km), 2)
  var id = userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["id"];

  userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["totalmileage"] += km

  id = gtf_STATS.garage(userdata).findIndex(x => x["id"] == id) + 1;
  userdata["currentcar"] = id;
};
///CURRENTCAR
module.exports.currentCar = function(userdata) {
  if (userdata["garage"].length == 0) {
    return {};
  }
  return gtf_STATS.garage(userdata)[gtf_STATS.currentCarNum(userdata) - 1];
};
module.exports.currentCarFooter = function(userdata) {
  var gtfcar = gtf_STATS.currentCar(userdata);
  if (Object.keys(gtfcar).length == 0) {
    return "No car.";
  } else {
    var carcondition = gtf_CONDITION.condition(gtfcar)
    return (
      "`" + userdata["currentcar"] + "` " + carcondition["emote"] + " `" + carcondition["health"] + "%`" + " " + gtf_CARS.shortName(gtfcar["name"]) +
      " " + "**" + gtfcar["fpp"] + gtf_EMOTE.fpp +
      gtf_EMOTE.tire +
      gtfcar["perf"]["tires"]["current"]
        .split(" ").map(function(x) {
          if (x.includes("Rally")) {
            return ""
          } else {
            return x[0]
          }}).join("") +
      "**"
    );
  }
};
module.exports.currentCarNum = function(userdata) {
  if (userdata["currentcar"] > userdata["garage"].length && userdata["garage"].length != 0) {
    userdata["currentcar"] = userdata["garage"].length;
  }
  return userdata["currentcar"];
};
module.exports.setCurrentCar = function(number, filter, userdata) {
  if (number <= 0 || isNaN(number) || number === undefined || number > userdata["garage"].length) {
    return "Invalid";
  } else {
    var car = Array.isArray(filter) ? gtf_STATS.garage(userdata).filter(x => filter.map(f => f(x)).every(x => x === true))[number - 1] : gtf_STATS.garage(userdata).filter(x => filter["function"](x, filter["args"]))[number - 1];
    var id = car["id"];
    if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
      userdata["garage"].some((item, index) => item["id"] == id && userdata["garage"].unshift(userdata["garage"].splice(index, 1)[0]));
    }
    id = gtf_STATS.garage(userdata).findIndex(x => x["id"] == id) + 1;
    if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
      userdata["currentcar"] = 1;
    } else {
      userdata["currentcar"] = id;
    }
  }
};
module.exports.updateCurrentCar = function(car, userdata) {
  var garage = gtf_STATS.garage(userdata);
  garage[userdata["currentcar"]] = car;
  userdata["garage"] = garage;
};
///MESSAGES
module.exports.messages = function(userdata) {
  return userdata["messages"]
}
module.exports.addMessage = function(name, message, userdata) {
  if (typeof userdata["messages"][name] == 'undefined') {
    userdata["messages"][name] = { "ids": [] }
  }
  userdata["messages"][name]["ids"].push(message["id"])
}
module.exports.checkMessages = function(command, callback, msg, userdata) {
  if (["dw", "dw4", "rcar", "rtrack", "rcourse", "gtf", "sr"].indexOf(command) + 1) {
    return next()
  }

  userdata["tutorial"] == "Complete" ? next() : callback()

  function next() {
    var name = command.name
    var commandmessages = gtf_LIST_MESSAGES[name]

    if (userdata["settings"]["MESSAGES"] == 0) {

      callback()
      return
    }
    if (typeof commandmessages === 'undefined') {
      callback()
      return
    } else {
      var embed = new EmbedBuilder();
      var user = msg.author.displayName;
      var avatar = msg.author.displayAvatarURL();

      embed.setColor(userdata["settings"]["COLOR"]);
      embed.setAuthor({ name: user, iconURL: avatar });
      var message = {}
      for (var x = 0; x < commandmessages.length; x++) {
        if (gtf_STATS.triggerMessage(name, commandmessages[x], userdata)) {
          if (commandmessages[x]["emote"].length == 0) {
            var character = ""
          } else {
            var character = {
              "gtfitness": " __**GT Fitness**__",
              "lewish": gtf_EMOTE.lewish + " __**Lewis Hamilton**__",
              "igorf": gtf_EMOTE.igorf + " __**Igor Fraga**__",
              "sebastienl": gtf_EMOTE.sebastienl + " __**Sebastien Loeb**__",
              "jamesp": gtf_EMOTE.jamesp + " __**James rPumphrey**__",
              "jannm": gtf_EMOTE.jannm + " __**Jann Mardenborough**__",
              "jimmyb": gtf_EMOTE.jimmyb + " __**Jimmy Broadbent**__"
            }[commandmessages[x]["emote"]]
          }
          embed.setDescription(character + "\n" + commandmessages[x]["messages"].join("\n\n"));
          if (commandmessages[x]["image"].length != 0) {
            embed.setImage(commandmessages[x]["image"])
          }
          message = commandmessages[x]
          break;
        }
      }

      if (Object.keys(message).length == 0) {
        return callback()
      }

      var emojilist = [
        {
          emoji: "",
          emoji_name: "",
          name: 'OK',
          extra: " ",
          button_id: 0,
        }]
      var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
      gtf_DISCORD.send(msg, { embeds: [embed], components: buttons }, acceptmessage)
      function acceptmessage(msgg) {
        function accept() {
          gtf_STATS.addMessage(name, message, userdata)
          gtf_STATS.save(userdata)
          msgg.delete({})
          msg.type = 0
          callback()
        }

        var functionlist = [accept]
        gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msgg, userdata)
      }
    }
  }


}
module.exports.triggerMessage = function(name, message, userdata) {
  if (typeof userdata["messages"][name] === 'undefined') {
    return true
  }
  if (userdata["messages"][name]["ids"].includes(message["id"])) {

    return false
  }
  if (message["required"][0].length == 0) {
    return true
  }

  if (message["required"].every(function(x) {
    if (x[0] == "license" && x[1] == ">=") {
      return gtf_STATS.checklicense(x[2], "", "", userdata)
    }
    var value = userdata[x[0]]
    if (value.constructor === Array) {
      value = value.length
    }
    var booleans = {
      ">": value > x[2],
      "<": value < x[2],
      "==": value == x[2],
      ">=": value >= x[2],
      "<=": value <= x[2]
    }
    return booleans[x[1]]
  })) {
    return true
  }

}

module.exports.triggerReward = function(name, reward, extra, userdata) {
  if (gtf_STATS.checkItem(reward["name"], userdata)) {
    return false
  }

  if (reward["required"].length == 0) {
    return true
  }

  var end = reward["required"].every(function(x) {
    var milestone = x[2]
    if (x[0] == "license" && x[1] == ">=") {
      return gtf_STATS.checklicense(milestone, "", "", userdata)
    }
    var value = userdata[x[0]]
    if (typeof value !== "undefined") {
      if (value.constructor === Array) {
        value = value.length
      }
    }
    if (x[0] == "currentcar") {
      value = gtf_STATS.currentCar(userdata)
      value = value["name"]
    } else if (x[0].includes("stats-")) {
      value = userdata["stats"][x[0].split("-")[1]]
    } else if (x[0].includes("gtfauto-")) {

      value = extra[x[0].split("-")[1]]

    } else if (x[0].includes("gtfcar-")) {
      value = extra[x[0].split("-")[1]]
    }

    var booleans = {
      ">": value > milestone,
      "<": value < milestone,
      "==": value == milestone,
      ">=": value >= milestone,
      "<=": value <= milestone
    }

    if (x[1] == "includes") {
      return value.includes(milestone)
    }
    return booleans[x[1]]
  })
  if (end) {
    return true
  } else {
    return false
  }

}

///DAILY
module.exports.dailyWorkout = function(userdata) {
  return userdata["dailyworkout"]
};
module.exports.setDailyWorkout = function(bool, userdata) {
  userdata["dailyworkout"]["done"] = bool;
};


///GARAGE
module.exports.garage = function(userdata) {
  return userdata["garage"];
};
module.exports.sortGarage = function(userdata, sort) {
  if (userdata["garage"].length == 0) {
    return userdata["garage"];
  }
  if (typeof sort === "undefined") {
    sort = userdata["settings"]["GARAGESORT"];
  }
  var id = userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["id"];

  if (sort == "Alphabetical Order") {
    userdata["garage"].sort((x, y) => x["name"].localeCompare(y["name"]));
  }

  if (sort == "Newest Added") {
    userdata["garage"].sort((x, y) => parseInt(y["id"]) - parseInt(x["id"]));
  }
  if (sort == "Oldest Added") {
    userdata["garage"].sort((x, y) => parseInt(x["id"]) - parseInt(y["id"]));
  }
  if (sort == "Highest FPP") {
    userdata["garage"].sort((x, y) => parseInt(y["fpp"]) - parseInt(x["fpp"]));
  }
  if (sort == "Lowest FPP") {
    userdata["garage"].sort((x, y) => parseInt(x["fpp"]) - parseInt(y["fpp"]));
  }
  if (sort == "Highest Power") {
    userdata["garage"].sort((x, y) => gtf_PERF.perf(y, "GARAGE")["power"] - gtf_PERF.perf(x, "GARAGE")["power"]);
  }
  if (sort == "Lowest Power") {
    userdata["garage"].sort((x, y) => gtf_PERF.perf(x, "GARAGE")["power"] - gtf_PERF.perf(y, "GARAGE")["power"]);
  }
  id = userdata["garage"].findIndex(x => x["id"] == id) + 1;
  userdata["currentcar"] = id;

  return userdata["garage"];
};
module.exports.garageFull = function(embed, msg, userdata) {
  if (gtf_STATS.garage(userdata).length >= gtf_GTF.garagelimit) {
    gtf_EMBED.alert({ name: "❌ Garage Full", description: "You have reached your garage limit of " + gtf_GTF.garagelimit + " or above.\nSell one of your cars using **/garage - Sell Car** in order to add more cars to your garage.", embed: "", seconds: 7 }, msg, userdata);
    return true;
  } else {
    return false;
  }
}
//GARAGECARS
module.exports.viewCar = function(gtfcar, embed, userdata) {
  var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })
  var garage = gtf_STATS.garage(userdata);
  var perf = gtf_PERF.perf(gtfcar, "GARAGE");
  var livery = gtfcar["livery"]["current"]
  if (ocar["type"].includes("Race Car")) {
    livery = ocar["livery"][gtf_STATS.carImage(gtfcar)];
  }
  var cardetails =
    "**Car:** " +
    gtfcar["name"] +
    " `🚘ID:" +
    gtf_STATS.getIndex(gtfcar, userdata) +
    "`" +
    " `💧" +
    gtfcar["condition"]["clean"] +
    "%`\n" +
    "**Livery: **" +
    livery +
    " | " +
    gtfcar["color"]["current"] +
    "\n" +
    "**Rims: **" +
    gtfcar["rims"]["current"] +
    "\n" +
    "**Type:** " +
    ocar["type"] +
    "\n" +
    "**Mileage Driven:** " +
    gtf_STATS.mileageUser(userdata) +
    " " +
    gtf_STATS.mileageUnits(userdata) +
    "\n" +
    "**" +
    gtf_MATH.numFormat(perf["fpp"]) +
    gtf_EMOTE.fpp +
    " | " +
    gtf_MATH.numFormat(perf["power"]) +
    " hp" +
    " | " +
    gtf_MATH.numFormat(gtf_STATS.weightUser(perf["weight"], userdata)) +
    " " + gtf_STATS.weightUnits(userdata) +
    " | " +
    ocar["drivetrain"] +
    " | " +
    ocar["engine"] +
    "**" +
    "\n";

  return cardetails;
};
module.exports.viewCarTuning = function(gtfcar, userdata) {
  if (gtfcar["perf"]["transmission"]["current"] == "Default") {
    var trans1 = "Default";
  } else {
    var trans1 = gtfcar["perf"]["transmission"]["tuning"][0];
  }

  if (gtfcar["perf"]["suspension"]["current"] == "Default") {
    var susp1 = "Default";
    var susp2 = "Default";
  } else {
    var susp1 = gtfcar["perf"]["suspension"]["tuning"][0] + " in";
    var susp2 = gtfcar["perf"]["suspension"]["tuning"][1] + " in";
  }

  if (gtfcar["perf"]["aerokits"]["current"] == "Default") {
    var aero1 = "Default";
  } else {
    var aero1 = gtfcar["perf"]["aerokits"]["tuning"][0] * 5;
  }
  var ballast = 0
  if (gtfcar["perf"]["items"].length >= 1) {
    if (gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight").length != 0) {
      if (gtf_STATS.weightUnits(userdata) == "km") {
        ballast = gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight")[0]["tuning"][0] * 20
      } else {
        ballast = Math.round(gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight")[0]["tuning"][0] * 44.0925)
      }
    }

  }

  var cardetails =
    "__**Aero:**__ " +
    gtfcar["perf"]["aerokits"]["current"] +
    "\n" +
    "**Downforce Level:** " +
    aero1 +
    "\n" +
    "__**Engine:**__ " +
    gtfcar["perf"]["engine"]["current"] + " | " + gtfcar["perf"]["carengine"]["current"] +
    "\n" +
    "__**Transmission:**__ " +
    gtfcar["perf"]["transmission"]["current"] +
    "\n" +
    "**Top Speed (Final Gear):** " +
    trans1 +
    " " +
    "\n" +
    "__**Suspension:**__ " +
    gtfcar["perf"]["suspension"]["current"] +
    "\n" +
    "**Camber Angle:** " +
    susp1 +
    "\n" +
    "**Toe Angle:** " +
    susp2 +
    "\n" +
    "__**Tires:**__ " +
    gtfcar["perf"]["tires"]["current"] +
    "\n" +
    "__**Weight Reduction:**__ " +
    gtfcar["perf"]["weightreduction"]["current"] +
    "\n" +
    "__**Turbo Kit:**__ " +
    gtfcar["perf"]["turbo"]["current"] +
    "\n" +
    "__**Brakes:**__ " +
    gtfcar["perf"]["brakes"]["current"] +
    "\n\n" +
    "__**Ballast Weight:**__ " + "+" + ballast + " " + gtf_STATS.weightUnits(userdata)

    ;

  return cardetails;
};
module.exports.viewCarCondition = function(gtfcar, userdata) {
  var carcondition = gtf_CONDITION.condition(gtfcar)
  var cardetails =
    "__**Overall:**__ " + carcondition["health"] + "%" + "\n\n" +
    "**Body:** " + gtfcar["condition"]["body"] + "%" + "\n" +
    "**Oil:** " + gtfcar["condition"]["oil"] + "%" + "\n" +
    "**Engine:** " + gtfcar["condition"]["engine"] + "%" + "\n" +
    "**Transmission:** " + gtfcar["condition"]["transmission"] + "%" +
    "\n" +
    "**Suspension:** " + gtfcar["condition"]["suspension"] + "%" +
    "\n";

  return cardetails;
};

module.exports.getIndex = function (item, userdata) {
  var list = userdata["garage"]
  item = JSON.stringify(item);
  var index = 0;
  for (; index < list.length; index++) {
    if (item == JSON.stringify(list[index])) {
      return index + 1;
    }
  }
  return -1;
};
module.exports.updateFPP = function(gtfcar, userdata) {
  var id = userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["id"];
  userdata["garage"][gtf_STATS.currentCarNum(userdata) - 1]["fpp"] = gtf_PERF.perf(gtfcar, "GARAGE")["fpp"];
}
module.exports.carImage = function(gtfcar) {
  if (gtfcar["livery"]["current"] != "Default") {
    return parseInt(gtfcar["livery"]["current"].split(" ").slice(-1)[0])
  }
  if (gtfcar["perf"]["aerokits"]["current"] == "Default") {
    return 0;
  } else {
    return parseInt(gtfcar["perf"]["aerokits"]["current"].split(" ")[1]);
  }
};
module.exports.loadCarImage = async function(gtfcar, embed, userdata, callback) {

  var { request } = require('undici');
  var Canvas = require("@napi-rs/canvas");
  var color = ""

  if (!gtfcar["color"]["current"].includes("Default")) {
    if (gtfcar["color"]["current"].includes("Special")) {
      color = "./gtfbot2unleahsed/images/gtauto/paint/special/" + gtfcar["color"]["current"].split(" ").slice(1).join(" ") + ".png"
    } else {
      color = "./gtfbot2unleahsed/images/gtauto/paint/" + gtfcar["color"]["current"].split(" ").slice(1).join(" ") + ".png"
    }
  }


  var wheel = ""
  var rim = gtfcar["rims"]["current"]
  if (!gtfcar["rims"]["current"].includes("Default")) {
    var wheel = gtf_WHEELS.find({ fullname: gtfcar["rims"]["current"] })[0]["make"]
    wheel = "./gtfbot2unleahsed/images/gtauto/wheels/" + wheel + ".png"

  }

  var link = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })["image"][gtf_STATS.carImage(gtfcar)]

  const { body } = await request(link);

  const image = await Canvas.loadImage(await body.arrayBuffer());

  var width = image.naturalWidth
  var height = image.naturalHeight
  if (width >= 1500) {
    var width = image.naturalWidth / 3
    var height = image.naturalHeight / 3
  }
  var canvas = await Canvas.createCanvas(width, height);
  var context = await canvas.getContext('2d');

  context.drawImage(image, 0, 0, width, height);
  context.strokeStyle = "#000000";
  if (color.length != 0) {
    var image2 = await Canvas.loadImage(color)
    var position1 = 0
    var position2 = height - (height / 4)

    context.drawImage(image2, position1, position2, height / 4, height / 4);
    context.globalAlpha = 1;
    context.strokeRect(position1, position2, height / 4, height / 4);
    context.globalCompositeOperation = "source-over";

    var fontsize = (((width - 940) / 35) + 35) + "px"
    context.font = fontsize + " sans-serif"
    context.fillStyle = "#FFFFFF";
    context.fillText(gtfcar["color"]["current"].split(" ")[0], position1 + (width / 50), position2 + (position2 * 0.07));
    context.strokeText(gtfcar["color"]["current"].split(" ")[0], position1 + (width / 50), position2 + (position2 * 0.07));

  }
  if (wheel.length != 0) {
    var image3 = await Canvas.loadImage(wheel)
    var position1 = height / 4
    var position2 = height - (height / 4)
    context.drawImage(image3, position1, position2, (height / 4) * (4 / 3), height / 4);
    context.strokeRect(position1, position2, (height / 4) * (4 / 3), height / 4);
  }

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: "image.png" })
  await callback(attachment)
}

module.exports.removeCar = function(car, sell, userdata) {
  gtf_STATS.addCredits(sell, userdata);

  var prevcarid = gtf_STATS.currentCar(userdata)["id"];
  var removedcarid = car["id"];
  var pi;
  var ri;

  for (var i = 0; i < userdata["garage"].length; i++) {
    if (gtf_STATS.garage(userdata)[i]["id"] == removedcarid) {
      ri = i;
    }
  }

  userdata["garage"] = gtf_STATS.garage(userdata).filter(x => x["id"] != removedcarid);

  for (var i = 0; i < userdata["garage"].length; i++) {
    if (userdata["garage"][i]["id"] == prevcarid) {
      pi = i;
    }
  }

  if (ri <= pi) {
    userdata["currentcar"]--;
  }
};
module.exports.removeCars = function(start, end, userdata) {
  var count = end - start + 1;
  var total = 0;
  var car = "";

  var i = 0;
  while (i < count) {
    car = gtf_STATS.garage(userdata)[start - 1];
    total += gtf_PERF.perf(car, "GARAGE")["sell"];

    gtf_STATS.removeCar(car, car["id"], gtf_PERF.perf(car, "GARAGE")["sell"], userdata);

    i++;
  }
  return total;
};
module.exports.totalGarageSell = function(userdata) {
  var garagevalue = 0
  userdata["garage"].forEach(car => {
    var value = gtf_PERF.perf(car, "GARAGE")["value"]
    garagevalue += value;
  })
  return garagevalue
}
///GIFTS
module.exports.gifts = function(userdata) {
  return userdata["gifts"];
};
module.exports.addGift = function(gift, userdata) {
  userdata["stats"]["numgifts"]++;
  if (gift["inventory"]) {
    gift["id"] = userdata["stats"]["numgifts"]
    userdata["gifts"].unshift(gift);
    gtf_STATS.save(userdata);
  } else {
    gtf_STATS.redeemGift(gift["name"], gift, embed, msg, userdata)
  }
};
module.exports.redeemGift = function(title, gift, embed, msg, userdata) {
  var description = "";
  if (gift["type"] == "CREDITS") {
    gtf_STATS.addCredits(parseInt(gift["item"]), userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    description = "**Credits: +" + gtf_MATH.numFormat(gift["item"]) + gtf_EMOTE.credits + "**";
    if (embed != "") {
      gtf_EMBED.alert({ name: title, description: description, embed: "", seconds: 0 }, msg, userdata);
    }
    gtf_STATS.save(userdata);
    return description
  } else if (gift["type"] == "EXP") {
    gtf_STATS.addExp(parseInt(gift["item"]), userdata);
    var levelup = gtf_EXP.checkLevelUp(userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    description = "**Experience Points: +" + gtf_MATH.numFormat(gift["item"]) + " XP" + gtf_EMOTE.exp + "**";
    if (embed != "") {
      gtf_EMBED.alert({ name: title, description: description, embed: "", seconds: 0 }, msg, userdata);
    }
    gtf_STATS.save(userdata);
    return description
  } else if (gift["type"] == "RANDOMCAR") {
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    delete gift["id"];
    var prizes = gtf_CARS.random(gift["item"], 4).map(function(x) {
      x = {
        id: -1,
        type: "CAR",
        name: x["name"] + " " + x["year"],
        item: x, author: "GT FITNESS", inventory: false
      }
      return x
    })
    var description = gtf_GTF.giftRoulette(title, "**" + title + "**", prizes, "", embed, msg, userdata);
    return description
  }
  else if (gift["type"] == "CAR") {
    var car = gift["item"];
    var ocar = gtf_CARS.find({ makes: [car["make"]], fullnames: [car["name"] + " " + car["year"]] })[0];
    gtf_CARS.addCar(car, "SORT", userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    gtf_STATS.save(userdata);

    description = "**" + car["name"] + " " + car["year"] + " acquired.\nAdded to your garage.**";
    if (embed != "") {

      embed.setImage(ocar["image"][0]);
      gtf_EMBED.alert({ name: title, description: description, embed: embed, seconds: 0 }, msg, userdata);
    }
    return description
  }
  else if (gift["type"] == "ITEM") {
    gtf_STATS.addItem(gift["item"], userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    description = "**Item: " + gift["item"] + "**";
    if (embed != "") {
      gtf_EMBED.alert({ name: title, description: description, embed: "", seconds: 0 }, msg, userdata);
    }
    gtf_STATS.save(userdata);
    return description
  }
};
module.exports.clearGifts = function(userdata) {
  userdata["gifts"] = [];
  gtf_STATS.save(userdata)
};
///ITEMS
module.exports.items = function(userdata) {
  return userdata["items"];
};
module.exports.addItem = function(item, userdata) {
  userdata["items"].unshift(item);
};
module.exports.checkItem = function(item, userdata) {
  return userdata["items"].includes(item)
}

///CAREER
module.exports.careerRaces = function(userdata) {
  return userdata["careerraces"];
};


///EVENTS
module.exports.updateEvent = function(racesettings, place, userdata) {
  var eventid = racesettings['eventid'].toLowerCase();

  if (eventid.includes("license")) {
    var userevents = userdata["licenses"]
    eventid = eventid.replace("license", "")
    racesettings["raceid"] = 1
  } else {
    var userevents = userdata["careerraces"]
  }
  if (racesettings["championship"]) {
    var prevplace = userevents[eventid][0];
    var i = 1
    while (i < userevents[eventid].length) {
      var prevplace = userevents[eventid][i - 1];
      if (prevplace == 0) {
        userevents[eventid][i - 1] = place
      } else {
        if (parseInt(place.toString().split(/[A-Z]/gi)[0]) <= parseInt(prevplace.toString().split(/[A-Z]/gi)[0])) {
          userevents[eventid][i - 1] = place;
        }
      }
      i++
    }
  } else {
    var prevplace = userevents[eventid][racesettings["raceid"] - 1];
    if (prevplace == 0) {
      userevents[eventid][racesettings["raceid"] - 1] = place
    } else {
      prevplace = prevplace.toString()
      if (parseInt(place.toString().split(/[A-Z]/gi)[0]) <= parseInt(prevplace.toString().split(/[A-Z]/gi)[0])) {
        userevents[eventid][racesettings["raceid"] - 1] = place;
      }
    }

  }
};
module.exports.checkEvent = function(event, place, userdata) {
  var eventid = event["eventid"].toLowerCase();
  var total = event["eventlength"]
  var count = 0;
  var i = 0;
  if (eventid.includes("license")) {
    var userevents = userdata["licenses"]
    eventid = eventid.replace("license", "")
  } else {
    var userevents = userdata["careerraces"]
  }
  if (typeof userevents[eventid] === "undefined") {
    userevents[eventid] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  var count = userevents[eventid].filter(function(x) {
    if (x == 0) {
      return false
    } else if (x == "✅") {
      return false
    } else {
      return (parseInt(x.toString().split(/[A-Z]/gi)[0]) <= parseInt(place.toString().split(/[A-Z]/gi)[0]))
    }
  }).length

  if (count >= total) {
    return true;
  } else {
    return false;
  }
};

module.exports.completeEvent = function(event, userdata) {
  var eventid = event["eventid"].toLowerCase();
  var events = userdata["careerraces"][eventid];

  for (var i = 0; i < events.length; i++) {
    userdata["careerraces"][eventid][i] = "✅";
  }
};
///LICENSE
module.exports.license = function(userdata) {
  return userdata["license"]
}
module.exports.setLicense = function(option, userdata) {
  userdata["license"] = option.toUpperCase()
}

module.exports.checklicense = function(license, embed, msg, userdata) {
  license = license.toLowerCase()
  var ranks = { "c": 0, "n": 0, "b": 1, "a": 2, "ic": 3, "ib": 4, "ia": 5, "s": 6 }

  if (ranks[license] <= ranks[gtf_STATS.license(userdata).toLowerCase()]) {
    return true;
  } else {
    if (embed != "") {
      gtf_EMBED.alert({ name: "❌ " + "License " + license.toUpperCase() + " Required", description: "🔒 Your license does not meet the requirements." + "\n\n" + "**License " + gtf_STATS.license(userdata) + " -> " + "License " + license.toUpperCase() + "**", embed: "", seconds: 10 }, msg, userdata);
    }
    return false;
  }
};

module.exports.checkLicenseTests = function(option, place, userdata) {
  option = option.toLowerCase()
  var total = 7
  if (option.includes("ic")) {
    total = 5
  }
  var count = 0;
  var i = 0;

  for (var i; i < total; i++) {
    var license = userdata["licenses"][option + "-" + (i + 1)]
    if (license[0] == 0) {
      continue
    } else if (license[0] == "✅") {
      continue
    } else {
      if (license[0].split(/[A-Z]/gi)[0] <= place.split(/[A-Z]/gi)[0]) {
        count++
      }
    }
  }

  if (count >= total) {
    return true;
  } else {
    return false;
  }
};


module.exports.completeLicenseTests = function(option, userdata) {
  option = option.toLowerCase()
  var total = 7
  if (option.includes("ic")) {
    total = 5
  }
  var count = 0;
  var i = 0;

  for (var i; i < total; i++) {
    userdata["licenses"][option + "-" + (i + 1)][0] = "✅"
  }
}


//COURSES
module.exports.courses = function(userdata) {
  userdata["stats"]["numcourses"] = userdata["courses"].length
  return userdata["courses"]
}
module.exports.addCourse = function(course, userdata) {
  if (userdata["courses"].length >= gtf_GTF.courselimit) {
    return;
  }
  course["date"] = gtf_STATS.lastOnline(userdata);
  userdata["courses"].push(course);
  userdata["stats"]["numcourses"] =
    userdata["courses"].length
};
module.exports.removeCourse = function(index, userdata) {
  userdata["courses"] = userdata["courses"].filter(function(value, i) {
    return i != index;
  });
};
module.exports.renameCourse = async function(index, name, userdata) {
  userdata["courses"][index]["name"] = name.toString().slice(0, 32)
}
module.exports.clearCourses = function(userdata) {
  userdata["courses"] = []
};
///LOBBY EVENT SETTINGS

module.exports.eventSettings = function(userdata) {
  return userdata["eventsettings"]
}

module.exports.addEventSettings = function(customrace, userdata) {
  if (userdata["eventsettings"].length > gtf_GTF.eventlimit) {
    return;
  }
  customrace["date"] = gtf_STATS.lastOnline(userdata);
  if (typeof userdata["eventsettings"][customrace["eventid"] - 1] !== "undefined") {
    userdata["eventsettings"][customrace["eventid"] - 1] = customrace;
  } else {
    userdata["eventsettings"].push(customrace);
  }
};
module.exports.deleteEventSettings = function(index, userdata) {
  userdata["eventsettings"] = userdata["eventsettings"].filter(function(value, i) {
    return i != index;
  });
};
module.exports.clearEventSettings = function(userdata) {
  userdata["eventsettings"] = []
};

//////
module.exports.addFavoriteCar = function(number, bool, filter, userdata) {
  if (number <= 0 || isNaN(number) || number === undefined || number > userdata["garage"].length) {
    return "Invalid";
  } else {
    var car = Array.isArray(filter) ? gtf_STATS.garage(userdata).filter(x => filter.map(f => f(x)).every(p => p === true))[number - 1] : gtf_STATS.garage(userdata).filter(x => filter["function"](x, filter["args"]))[number - 1];
    var id = car["id"];
    id = gtf_STATS.garage(userdata).findIndex(x => x["id"] == id);
    userdata["garage"][id]["favorite"] = bool;
  }
};

///SEASONALS
module.exports.seasonalCheck = function(userdata) {
  return userdata["seasonalcheck"];
};

module.exports.checkNotifications = function(userdata) {
  var notifs = []
  if (gtf_STATS.mileage(userdata) == 0) {
    notifs.push("**🔔 You have not driven in the last 24 hours. Drive enough to earn your daily workout.**");
  }
  if (gtf_STATS.mileage(userdata) > 42.1 && !userdata["dailyworkout"]) {
    notifs.push("**🔔 You have enough daily mileage to receive your daily workout! Use __/daily__ to redeem.**");
  }
  if (gtf_STATS.gifts(userdata).length >= 1) {
    notifs.push("**🔔 You have 🎁" + gtf_STATS.gifts(userdata).length + " items waiting in your inventory! Use __/items__ to redeem your items.**");
  }
  if (gtf_STATS.currentCarNum(userdata) != 0) {
    if (gtf_CONDITION.condition(gtf_STATS.currentCar(userdata))["health"] < 45) {
      notifs.push("**🔔 Your current car needs to be repaired. Use the maintenance in __/tune__ to repair your car.**")
    }
  }

  if (notifs.length == 0) {
    return "**🔔 No notfications available.**" + "\n\n"
  } else if (notifs.length == 1) {
    return notifs[0] + "\n\n"
  } else {
    var message = notifs[Math.floor(Math.random() * notifs.length)] + "\n\n";
    return message
  }
}

///DRIVER
module.exports.loadAvatarImage = async function(embed, userdata, callback) {
  var Canvas = require("@napi-rs/canvas");
  var { request } = require('undici');
  var visor = await Canvas.loadImage("./gtfbot2unleahsed/images/gtauto/driver/visor.png")
  var helmet = await Canvas.loadImage("./gtfbot2unleahsed/images/gtauto/driver/helmet.png")

  var helmetcolorimage = await Canvas.loadImage("./gtfbot2unleahsed/images/gtauto/paint/" + userdata["driver"]["helmetcolor"] + ".png")
  var visorcolorimage = await Canvas.loadImage("./gtfbot2unleahsed/images/gtauto/paint/" + userdata["driver"]["visorcolor"] + ".png")

  if (typeof userdata["driver"]["helmetlogo1"] === 'undefined') {
    userdata["driver"]["helmetlogo1"] = ""
  }
  if (userdata["driver"]["helmetlogo1"].length == 0) {
    var logourl = ""
  }
  else {
    var logourl = userdata["driver"]["helmetlogo1"]
    var { body } = await request(logourl);
    var logoimage = await Canvas.loadImage(await body.arrayBuffer());
    if (logoimage.naturalHeight > logoimage.naturalWidth) {
      var ratio = logoimage.naturalWidth / logoimage.naturalHeight
    } else {
      var ratio = logoimage.naturalHeight / logoimage.naturalWidth
    }
  }

  if (typeof userdata["driver"]["helmetlogo2"] === 'undefined') {
    userdata["driver"]["helmetlogo2"] = ""
  }
  if (userdata["driver"]["helmetlogo2"].length == 0) {
    var logourl2 = ""
  } else {
    var logourl2 = userdata["driver"]["helmetlogo2"]
    var { body } = await request(logourl2);
    try {
      var logoimage2 = await Canvas.loadImage(await body.arrayBuffer());
      if (logoimage2.naturalHeight > logoimage2.naturalWidth) {
        var ratio = logoimage2.naturalWidth / logoimage2.naturalHeight
      } else {
        var ratio = logoimage2.naturalHeight / logoimage2.naturalWidth
      }
    } catch (error) {
      console.log("ERROR")
      userdata["driver"]["helmetlogo2"] = ""
      var logourl2 = ""
    }
  }

  var width = helmet.naturalWidth
  var height = helmet.naturalHeight
  var helmetcanvas = await Canvas.createCanvas(width, height)
  var visorcanvas = await Canvas.createCanvas(width, height)

  var helmetctx = helmetcanvas.getContext('2d');
  var visorctx = visorcanvas.getContext('2d');

  var canvas = await Canvas.createCanvas(width, height)
  var ctx = canvas.getContext('2d');


  visorctx.drawImage(visor, 0, 0, width, height);
  visorctx.globalCompositeOperation = "source-in"
  visorctx.drawImage(visorcolorimage, 0, 0, width, height);

  helmetctx.drawImage(helmet, 0, 0, width, height);
  helmetctx.globalCompositeOperation = "source-in"
  helmetctx.drawImage(helmetcolorimage, 0, 0, width, height);

  ctx.drawImage(helmetcanvas, 0, 0, width, height);
  ctx.drawImage(visorcanvas, 0, 0, width, height);
  if (logourl.length != 0) {
    ctx.rotate(Math.PI / 18);
    ctx.drawImage(logoimage, 270, 20, width / 5, (width / 5) * ratio);
    ctx.rotate(-Math.PI / 18);
  }
  if (logourl2.length != 0) {
    ctx.drawImage(logoimage2, 640, 370, width / 3.5, (width / 3.5) * ratio);
  }

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: "image.png" })
  await callback(attachment)
}

///RACEINPROGRESS
module.exports.getRaceCompletion = function(racesettings, raceid, userdata) {
  eventid = racesettings["eventid"].toLowerCase();

  if (userdata["careerraces"][eventid][raceid - 1] == 0) {
    return "";
  } else {
    return "`" + userdata["careerraces"][eventid][raceid - 1] + "`";
  }
};
module.exports.clearRaceInProgress = function(userdata) {
  userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: 0, gridhistory: [], msghistory: [], championshipnum: -1 };
};
module.exports.raceInProgress = function(userdata) {
  return userdata["raceinprogress"];
};

///MISC
module.exports.checkRewards = function(type, extra, userdata) {
  var rewards = gtf_LIST_REWARDS[type]

  for (var i = 0; i < rewards.length; i++) {
    var f = gtf_STATS.triggerReward(rewards[i]["name"], rewards[i], extra, userdata)
    if (f) {
      var item = rewards[i]["item"]
      gtf_STATS.addGift(item, userdata)
      gtf_STATS.addItem(rewards[i]["name"], userdata)
    }
  }
}

module.exports.raceEventStatus = function(event, userdata) {
  if (event["eventid"].toLowerCase().includes("license")) {
    var eventid = event["eventid"].toLowerCase().replace("license", "").toLowerCase();
    var eventstatus = userdata["licenses"][eventid];

    if (eventstatus[0] == "✅") {
      return "✅";
    } else if (eventstatus[0] == "1st") {
      return gtf_EMOTE.goldmedal
    } else if (eventstatus[0] == "2nd") {
      return gtf_EMOTE.silvermedal
    } else if (eventstatus[0] == "3rd") {
      return gtf_EMOTE.bronzemedal
    } else {
      return "⬛";
    }
  }
  else {
    var eventid = event["eventid"].toLowerCase();
    var eventstatus = userdata["careerraces"][eventid];

    if (eventstatus === undefined) {
      userdata["careerraces"][eventid] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      return "⬛";
    }
    eventstatus = userdata["careerraces"][eventid];
    if (eventstatus[0] == "✅") {
      return "✅";
    }
    if (eventstatus.some(item => item !== 0)) {
      var progress = "⏲"
      var length = event["tracks"].length
      var total = 3 * length
      var points = 0
      for (var i = 0; i < length; i++) {
        if (eventstatus[i] == "3rd") {
          points = points + 1
        } else if (eventstatus[i] == "2nd") {
          points = points + 2
        } else if (eventstatus[i] == "1st") {
          points = points + 3
        }
      }
      var total = parseInt((points / total) * 100)
      return progress + "`" + total + "%`"

    }
    else {
      return "⬛";
    }
  }
};


//INLOBBY
module.exports.inlobby = function(userdata) {
  return userdata["inlobby"];
};
module.exports.setinlobby = function(bool, mid, userdata) {
  if (bool === "undefined") {
  } else {
    userdata["inlobby"][0] = bool;
  }
  if (mid === undefined) {
  } else {
    userdata["inlobby"][1] = mid;
  }
  return [bool, mid];
};

///MISC
module.exports.menuFooter = function(userdata) {
  userdata["count"]++;
  userdata["mileage"] = gtf_MATH.round(userdata["mileage"], 2)

  var levelup = gtf_EXP.checkLevelUp(userdata);

  if (levelup[0]) {
    levelup = "\n" + "**⬆ Level Up!**";
  } else {
    levelup = "";
  }
  var gifts = gtf_STATS.gifts(userdata).length >= 1 ? gtf_STATS.gifts(userdata).length + " 🎁 " : "";
  var units = gtf_STATS.mileageUnits(userdata);
  var currdate = gtf_DATETIME.getFormattedDate(new Date(), userdata);

  if (userdata["lastonline"] != currdate) {
    userdata["dailyworkout"]["done"] = false;
    var mileage = parseFloat(userdata["mileage"])
    /*
    if (userdata["mileage"] > 0) {
      gtf_STATS.addRaceMulti(0.2, userdata);
    } else {
      gtf_STATS.addRaceMulti(-100, userdata);
    }
    */
    gtf_STATS.setMileage(0, userdata);
    if (userdata["dailyworkout"]["endurance"]) {
      userdata["dailyworkout"]["endurance"] = false
      gtf_STATS.setMileage(mileage, userdata)
    }

  }
  userdata["lastonline"] = currdate;
  gtf_STATS.addRaceMulti(-100, userdata);
  //gtf_EMOTE.dailyworkout + "x" + gtf_STATS.raceMulti(userdata) + " "

  return gifts + gtf_MATH.numFormat(gtf_STATS.credits(userdata)) + " " + gtf_EMOTE.credits + " " +
    "Lv." + gtf_STATS.level(userdata) + " " + gtf_EMOTE.exp + " " + gtf_MATH.numFormat(gtf_STATS.exp(userdata)) + "  " + gtf_EMOTE.dailyworkoutman + gtf_MATH.numFormat(gtf_STATS.mileageUser(userdata)) + units + levelup;
};

/////RACES//////

module.exports.addRaceDetails = function(racesettings, racedetails, finalgrid, userdata) {
  userdata["racedetails"] = [racesettings, racedetails, finalgrid];
};

module.exports.removeRaceDetails = function(userdata) {
  userdata["racedetails"] = [];
};

module.exports.createRaceHistory = function(racesettings, racedetails, finalgrid, checkpoint, timeinterval, message, embed, msg, userdata) {
  ///////TESTING
  /*
  var wins = 0
  var twins = 30
  for (var y = 0; y < twins; y++) {
    var mfinalgrid = JSON.parse(JSON.stringify(finalgrid))
   userdata["raceinprogress"]["gridhistory"] = []
  userdata["raceinprogress"]["timehistory"] = []
    userdata["raceinprogress"]["msghistory"] = []
  userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(mfinalgrid)))
  userdata["raceinprogress"]["timehistory"].push(JSON.parse(JSON.stringify(racesettings["time"])))
  for (var i = 0; i < 20; i++) {
    userdata["raceinprogress"]["msghistory"].push(JSON.parse(JSON.stringify(message)))
    message = gtf_RACEEX.updateGrid(racesettings, racedetails, mfinalgrid, checkpoint, timeinterval, i, message, embed, msg, userdata)
    //timei = gtf_TIME.advanceTime(racesettings["time"], timeinterval)

    //userdata["raceinprogress"]["timehistory"].push(JSON.parse(JSON.stringify(timei)))
    userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(mfinalgrid)))

  }
  
  mfinalgrid = userdata["raceinprogress"]["gridhistory"][userdata["raceinprogress"]["gridhistory"].length-1]
    if (mfinalgrid.filter(x => x["user"] == true && x["position"] == 1).length >= 1) {
      wins++
    }
}
  console.log("Win percentage: " + wins/twins)
  */
  ///////
  userdata["raceinprogress"]["gridhistory"] = []
  userdata["raceinprogress"]["timehistory"] = []
  userdata["raceinprogress"]["msghistory"] = []

  userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(finalgrid)))
  userdata["raceinprogress"]["timehistory"].push(JSON.parse(JSON.stringify(racesettings["time"])))

  for (var i = 0; i < 20; i++) {
    userdata["raceinprogress"]["msghistory"].push(JSON.parse(JSON.stringify(message)))
    message = gtf_RACEEX.updateGrid(racesettings, racedetails, finalgrid, checkpoint, timeinterval, i, message, embed, msg, userdata)

    timei = gtf_TIME.advanceTime(racesettings["time"], timeinterval)
    userdata["raceinprogress"]["timehistory"].push(JSON.parse(JSON.stringify(timei)))
    userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(finalgrid)))

  }
  userdata["raceinprogress"]["msghistory"].push(JSON.parse(JSON.stringify(message)))
  finalgrid = userdata["raceinprogress"]["gridhistory"][0]
}

module.exports.resumeRace = function(userdata, client) {
  if (userdata["racedetails"].length == 0) {
    console.log("EMPTY")
    return;
  }
  var user = {};
  var server = client.guilds.cache.get(gtf_SERVERID);
  var server2 = server.channels.cache.get(userdata["raceinprogress"]["channelid"]);
  var totmembers = server.members.fetch().then(totmembers => {
    user = totmembers.filter(member => member.user.id == userdata["id"]).get(userdata["id"]);
    continuee(user);
  });
  async function continuee(user) {

    var racesettings = userdata["racedetails"][0];
    var racedetails = userdata["racedetails"][1];
    var finalgrid = userdata["racedetails"][2];

    if (typeof server2 === "undefined") {
      server2 = await user.createDM()
      ///return;
    }

    server2.messages.fetch({ around: userdata["raceinprogress"]["messageid"], limit: 1 }).then(messages => {
      var msg = messages.first();
      if (msg === undefined) {
        console.log(userdata["id"] + "Race Aborted (message error)");
        userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "" };
        gtf_STATS.save(userdata);
        return;
      }
      if (msg.content.includes("FINISH")) {
        console.log(userdata["id"] + ": Race Aborted");
        userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "" };
        gtf_STATS.save(userdata);
        return;
      }
      var embed = new EmbedBuilder(msg.embeds[0]);

      gtf_CONSOLELOG.reverse();
      gtf_CONSOLELOG.fill(0, 255, 0);
      if (userdata["raceinprogress"]["championshipnum"] >= 1) {
        console.log(userdata["id"] + ": Championship Resumed");
      } else {
        console.log(userdata["id"] + ": Race Resumed");
      }

      gtf_CONSOLELOG.end();

      gtf_RACES2.startSession(racesettings, racedetails, finalgrid, [true], embed, msg, userdata);
    });
    return true;
  }
};

module.exports.save = async function(userdata, condition) {
  if (userdata === undefined) {
    return;
  }
  if (Object.keys(userdata).length <= 6) {
    return;
  }
  var { MongoClient, ServerApiVersion } = require('mongodb');


  try {
    var db = await MongoClient.connect(process.env.MONGOURL, {
      serverApi: ServerApiVersion.v1 
    })
    var dbo = db.db("GTFitness");
    if (condition == "DELETE") {
      dbo.collection("GTF2SAVES").deleteOne({ id: userdata["id"] });
    } else {

      dbo
        .collection("GTF2SAVES")
        .replaceOne({ id: userdata["id"] }, userdata)
        .then(() => {
          db.close();
        });
    }
    //delete data[row["id"]]["_id"]

  } catch (error) {
    throw error
  }
};

module.exports.load = async function(collection, userdata, callback) {
  if (typeof callback === 'undefined') {
    callback = function() { }
  }
  var { MongoClient, ServerApiVersion } = require('mongodb');

  var results = {}
  var find = (collection == "SEASONALS") ? {} : { id: userdata["id"] }
  if (collection == "LOBBIES") {
    if (!userdata["inlobby"]["active"]) {
      return callback({})
    } else {
      find = { channelid: userdata["inlobby"]["channelid"] }
    }

  }
  var found = false

  var db = await MongoClient.connect(process.env.MONGOURL, {
    serverApi: ServerApiVersion.v1 
  })
  var dbo = db.db("GTFitness");
  dbo
    .collection(collection)
    .find(find)
    .forEach(row => {
      results = row
      if (!found) {
        found = true
        callback(results);
        db.close()
      }
    })

};
