const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
var fs = require("fs");

module.exports.userid = function (userdata) {
  return userdata["id"];
};

///COUNT
module.exports.count = function (userdata) {
  var num = gtf_LIST_EMBEDCOUNTS[userdata["id"]];
  if (isNaN(num)) {
    gtf_LIST_EMBEDCOUNTS[userdata["id"]] = 0;
    return 0;
  } else {
    return num;
  }
};
module.exports.addCount = function (userdata) {
  gtf_LIST_EMBEDCOUNTS[userdata["id"]]++;
};
module.exports.removeCount = function (userdata) {
  gtf_LIST_EMBEDCOUNTS[userdata["id"]]--;
};
///CREDITS
module.exports.credits = function (userdata) {
  if (userdata["credits"] >= gte_GTF.creditslimit) {
    userdata["credits"] = gte_GTF.creditslimit;
  }
  userdata["credits"] = Math.round(userdata["credits"]);
  return userdata["credits"];
};
module.exports.addCredits = function (number, userdata) {
  userdata["credits"] = parseInt(userdata["credits"]);
  userdata["credits"] += parseInt(number);
  if (userdata["credits"] >= gte_GTF.creditslimit) {
    userdata["credits"] = gte_GTF.creditslimit;
  }
  if (isNaN(userdata["credits"])) {
    throw new Error('The value is not a number.');
  }
};
module.exports.enthupoints = function (userdata) {
  return userdata["enthupoints"];
};
module.exports.addSkillPoints = function (number, userdata) {
  if (typeof userdata["skillpoints"] === 'undefined') {
    userdata["skillpoints"] = 0
  }
  if (number <= 0) {
    number = 0
  }
  userdata["skillpoints"] = parseInt(userdata["skillpoints"]);
  userdata["skillpoints"] += parseInt(number);

  if (isNaN(userdata["skillpoints"])) {
    throw new Error('The value is not a number.');
  }
};
module.exports.addEnthuPoints = function (number, userdata) {
  userdata["enthupoints"] = parseInt(userdata["enthupoints"]);
  userdata["enthupoints"] += parseInt(number);
  if (userdata["enthupoints"] >= userdata["totalenthupoints"]) {
    userdata["enthupoints"] = userdata["totalenthupoints"];
  }
  if (userdata["enthupoints"] <= 0) {
    userdata["enthupoints"] = 0
  }
  if (isNaN(userdata["enthupoints"])) {
    throw new Error('The value is not a number.');
  }
};
module.exports.addRecoveryRate = function (value, userdata) {
  if (value == "rest") {
    userdata["enthupoints"] = userdata["totalenthupoints"]
  } else if (value == "afterrace") {
    
  }
}
///TOTALPLAYTIME
module.exports.totalPlayTime = function (userdata, type) {
  if (type == "MILLISECONDS") {
    return userdata["totalplaytime"]
  } else {
  return gtf_DATETIME.getFormattedTime(userdata["totalplaytime"])
  }
};
module.exports.addPlayTime = function (number, userdata) {
  userdata["totalplaytime"] = parseFloat(userdata["totalplaytime"]);

  userdata["totalplaytime"] = userdata["totalplaytime"] + parseFloat(number);
  
  if (isNaN(userdata["totalplaytime"]) || userdata["totalplaytime"] < 0) {
    throw new Error('The value is not a positive number.');
  }
};
//RACEMULTI
module.exports.raceMulti = function (userdata) {
  return userdata["racemulti"];
};
module.exports.addRaceMulti = function (number, userdata) {
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
module.exports.exp = function (userdata) {
  if (userdata["exp"] >= gte_GTF.explimit) {
    userdata["exp"] = gte_GTF.explimit;
  }
  return userdata["exp"];
};
module.exports.addExp = function (number, userdata) {
  userdata["exp"] = parseInt(userdata["exp"]);
  if (parseInt(number) < 0) {
  } else {
    userdata["exp"] += parseInt(number);
  }
  if (userdata["exp"] >= gte_GTF.explimit) {
    userdata["exp"] = gte_GTF.explimit;
  }
};
///LEVEL
module.exports.level = function (userdata) {
  return userdata["level"];
};
module.exports.addLevel = function (number, userdata) {
  if (number == 0) {
    return;
  } else {
    userdata["level"] += number;
  }
};

module.exports.lastOnline = function (userdata) {
  return userdata["lastonline"];
};
///MILEAGE
module.exports.mileage = function (userdata) {
    return userdata["mileage"]
};
module.exports.addMileage = function (km, userdata) {
  km = gtf_MATH.round(parseFloat(km), 2)
  userdata["mileage"] += km;
  
  if (isNaN(userdata["mileage"])) {
    throw new Error('The value is not a number.');
  }
};
module.exports.setMileage = function (km, userdata) {
  userdata["mileage"] = parseFloat(km);
};
module.exports.carMileageUser = function (car, userdata) {
  var mileage = [car["totalmileage"], gtf_MATH.round(car["totalmileage"] * 0.62137119, 2)]
  return mileage[userdata["settings"]["UNITS"]]
};
module.exports.mileageUser = function (userdata) {
  var mileage = [userdata["mileage"], gtf_MATH.round(userdata["mileage"] * 0.62137119, 2)]
  
  return gtf_MATH.round(mileage[userdata["settings"]["UNITS"]], 2)
};
module.exports.mileageUnits = function (userdata) {
  return ["km", "mi"][userdata["settings"]["UNITS"]]
};

module.exports.weightUnits = function (userdata) {
  return ["kg", "lbs"][userdata["settings"]["UNITS"]]
};
module.exports.weightUser = function (number, userdata) {
   var weight = [Math.round(number * 0.453592), number]
  return weight[userdata["settings"]["UNITS"]]
};

//TOTALMILEAGE
module.exports.totalMileage = function (userdata) {
  userdata["totalmileage"] = parseFloat(userdata["totalmileage"])
  return userdata["totalmileage"]
};
module.exports.addTotalMileage = function (km, userdata) {
  km = gtf_MATH.round(parseFloat(km), 2)
  userdata["totalmileage"] += km;
  if (isNaN(userdata["totalmileage"])) {
    throw new Error('The value is not a number.');
  }
};
module.exports.setTotalMileage = function (km, mi, userdata) {
  userdata["totalmileage"] = parseFloat(km);
};
module.exports.totalMileageUser = function (userdata) {
  var totalmileage = [userdata["totalmileage"], gtf_MATH.round(userdata["totalmileage"] * 0.62137119, 2)]
    return gtf_MATH.round(totalmileage[userdata["settings"]["UNITS"]], 2)
};
module.exports.addCarTotalMileage = function (km, userdata) {
  km = gtf_MATH.round(parseFloat(km), 3)
  var id = userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["id"];

  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["totalmileage"] += km

  id = gte_STATS.garage(userdata).findIndex(x => x["id"] == id) + 1;
  userdata["currentcar"] = id;
};

///RANKING
module.exports.rankingPoints = function (userdata) {
  return userdata["rankingpoints"]
}
///CURRENTCAR
module.exports.currentCar = function (userdata) {
  if (userdata["garage"].length == 0) {
    return {};
  }
  return gte_STATS.garage(userdata)[gte_STATS.currentCarNum(userdata) - 1];
};
module.exports.currentCarFooter = function (userdata) {
  var gtfcar = gte_STATS.currentCar(userdata);
  if (Object.keys(gtfcar).length == 0) {
    return "No car.";
  } else {
    var carcondition = gte_CONDITION.condition(gtfcar)
    return (
      "`" + userdata["currentcar"] + "` " + carcondition["emote"] + " `" + carcondition["health"] + "%`" + " " + gtf_CARS.shortName(gtfcar["name"]) +
" " + "**" + gtfcar["fpp"] + gtf_EMOTE.fpp +
      gtf_EMOTE.tire +
      gtfcar["perf"]["tires"]["current"]
        .split(" ")
        .map(x => x[0])
        .join("") +
      "**"
    );
  }
};
module.exports.currentCarFooterEnthu = function (userdata) {
  var gtfcar = gte_STATS.currentCar(userdata);
  if (Object.keys(gtfcar).length == 0) {
    return "None";
  } else {
    return gtfcar["name"] + " `Lv." + gtfcar["perf"]["level"] + "`"
  }
};
module.exports.currentCarNum = function (userdata) {
  if (userdata["currentcar"] > userdata["garage"].length && userdata["garage"].length != 0) {
    userdata["currentcar"] = userdata["garage"].length;
  }
  return userdata["currentcar"];
};
module.exports.setCurrentCar = function (number, filter, userdata) {
  if (number <= 0 || isNaN(number) || number === undefined || number > userdata["garage"].length) {
    return "Invalid";
  } else {
    var car = Array.isArray(filter) ? gte_STATS.garage(userdata).filter(x => filter.map(f => f(x)).every(x => x === true))[number - 1] : gte_STATS.garage(userdata).filter(x => filter["function"](x, filter["args"]))[number - 1];
    var id = car["id"];
    if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
      userdata["garage"].some((item, index) => item["id"] == id && userdata["garage"].unshift(userdata["garage"].splice(index, 1)[0]));
    }
    id = gte_STATS.garage(userdata).findIndex(x => x["id"] == id) + 1;
    if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
      userdata["currentcar"] = 1;
    } else {
      userdata["currentcar"] = id;
    }
  }
};
module.exports.updateCurrentCar = function (car, userdata) {
  var garage = gte_STATS.garage(userdata);
  garage[userdata["currentcar"]] = car;
  userdata["garage"] = garage;
};
///MESSAGES
module.exports.messages = function (userdata) {
  return userdata["messages"]
}
module.exports.addMessage = function (name, message, userdata) {
  if (typeof userdata["messages"][name] == 'undefined') {
      userdata["messages"][name] = {"ids": []}
  }
  userdata["messages"][name]["ids"].push(message["id"])
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
      return gte_STATS.checklicense(x[2], "", "", userdata)
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
  if (gte_STATS.checkItem(reward["name"], userdata)) {
    return false
  }
  
  if (reward["required"].length == 0) {
    return true
  }

  var end = reward["required"].every(function(x) {
    var milestone = x[2]
    if (x[0] == "license" && x[1] == ">=") {
      return gte_STATS.checklicense(milestone, "", "", userdata)
    }
    var value = userdata[x[0]]
    if (typeof value !== "undefined") {
    if (value.constructor === Array) {
      value = value.length
    }
    }
    if (x[0] == "currentcar") {
      value = gte_STATS.currentCar(userdata)
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
module.exports.dailyWorkout = function (userdata) {
  return userdata["dailyworkout"]
};
module.exports.setDailyWorkout = function (bool, userdata) {
  userdata["dailyworkout"]["done"] = bool;
};


///GARAGE
module.exports.garage = function (userdata) {
  return userdata["garage"];
};
module.exports.sortGarage = function (userdata, sort) {
  if (userdata["garage"].length == 0) {
    return userdata["garage"];
  }
  if (typeof sort === "undefined") {
    sort = userdata["settings"]["GARAGESORT"];
  }
  var id = userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["id"];

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
    userdata["garage"].sort((x, y) => gte_PERF.perfEnthu(y, "GARAGE")["power"] - gte_PERF.perfEnthu(x, "GARAGE")["power"]);
  }
  if (sort == "Lowest Power") {
    userdata["garage"].sort((x, y) => gte_PERF.perfEnthu(x, "GARAGE")["power"] - gte_PERF.perfEnthu(y, "GARAGE")["power"]);
  }
  id = userdata["garage"].findIndex(x => x["id"] == id) + 1;
  userdata["currentcar"] = id;

  return userdata["garage"];
};
module.exports.garageFull = function (embed, msg, userdata) {
  if (gte_STATS.garage(userdata).length >= gte_GTF.garagelimit) {
    gte_EMBED.alert({ name: "❌ Garage Full", description: "You have reached your garage limit of " + gte_GTF.garagelimit + " or above.\nSell one of your cars using **/garage - Sell Car** in order to add more cars to your garage.", embed: "", seconds: 7 }, msg, userdata);
    return true;
  } else {
    return false;
  }
}
//GARAGECARS
module.exports.viewCar = function (gtfcar, embed, userdata) {
  var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]  })
  var garage = gte_STATS.garage(userdata);
  var perf = gte_PERF.perfEnthu(gtfcar, "GARAGE");
  var livery = gtfcar["livery"]["current"]
  if (ocar["type"].includes("Race Car")) {
    livery = ocar["livery"][gte_STATS.carImage(gtfcar)];
  }
  var cardetails =
    "**Car:** " +
    gtfcar["name"] +
    " `🚘ID:" +
    gtf_TOOLS.index(garage, gtfcar) +
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
    gte_STATS.mileageUser(userdata) +
    " " +
    gte_STATS.mileageUnits(userdata) +
    "\n" +
    "**" +
    gtf_MATH.numFormat(perf["fpp"]) +
    gtf_EMOTE.fpp +
    " | " +
    gtf_MATH.numFormat(perf["power"]) +
    " hp" +
    " | " +
    gtf_MATH.numFormat(gte_STATS.weightUser(perf["weight"], userdata)) +
    " " + gte_STATS.weightUnits(userdata) +
    " | " +
    ocar["drivetrain"] +
    " | " +
    ocar["engine"] +
    "**" +
    "\n";

  return cardetails;
};

module.exports.addTuningPoints = function (points, userdata) {
  if (points <= 0) {
    points = 0
  }
  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["points"] = parseInt(userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["points"] + points)
}

module.exports.checkTuningLevel = function (userdata) {
  var levels = [0, 50, 100, 200, 300, 400, 550, 700, 850, 1000]
  var parts = ["", 
               "Weight Reduction-Stage 1", 
               "Suspension-Stage 1",
               "Engine-Stage 1", 
               "Weight Reduction-Stage 2", 
               "Suspension-Stage 2", 
               "Engine-Stage 2",
               "Weight Reduction-Stage 3",
               "Suspension-Stage 3", 
               "Engine-Stage 3"]
  var partsn = []
  var levelup = false
  var prev = userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["level"]
  var curr = userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["level"]
  var currpoints = userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["points"]
  
  for (var i = curr; i < levels.length; i++) {
    if (currpoints >= levels[i]) {
      curr = i + 1
      var part = gte_PARTS.find({type: parts[curr-1].split("-")[0], name:parts[curr-1].split("-")[1] })[0]
      partsn.push("⬆ " + part["type"] + " " + part["name"])
      gte_PARTS.installPart(part, userdata)
      levelup = true
    } else {
      break;
    }
  }
  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["level"] = curr

  return [levelup, prev, curr, partsn, currpoints]
}

module.exports.viewCarTuning = function (gtfcar, userdata) {
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
    "\n";

  return cardetails;
};
module.exports.viewCarCondition = function (gtfcar, userdata) {
  var carcondition = gte_CONDITION.condition(gtfcar)
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

module.exports.updateFPP = function (gtfcar, userdata) {
  var id = userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["id"];
  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["fpp"] = gte_PERF.perfEnthu(gtfcar, "GARAGE")["fpp"];
}
module.exports.carImage = function (gtfcar) {
  if (gtfcar["livery"]["current"] != "Default") {
    return parseInt(gtfcar["livery"]["current"].split(" ").slice(-1)[0])
  }
  if (gtfcar["perf"]["aerokits"]["current"] == "Default") {
    return 0;
  } else {
    return parseInt(gtfcar["perf"]["aerokits"]["current"].split(" ")[1]);
  }
};
module.exports.loadCarImage = async function (gtfcar, embed, userdata, callback) {

var { request } = require('undici');
var Canvas = require("@napi-rs/canvas");
var color = ""

if (!gtfcar["color"]["current"].includes("Default")) {
  if (gtfcar["color"]["current"].includes("Special")) {
    color = "./images/gtauto/paint/special/" + gtfcar["color"]["current"].split(" ").slice(1).join(" ") + ".png"
  } else {
  color = "./images/gtauto/paint/" + gtfcar["color"]["current"].split(" ").slice(1).join(" ") + ".png"
  }
}


var wheel = ""
var rim = gtfcar["rims"]["current"]
if (!gtfcar["rims"]["current"].includes("Default")) {
   var wheel = gtf_WHEELS.find({fullname: gtfcar["rims"]["current"]})[0]["make"]
  wheel = "./images/gtauto/wheels/" + wheel + ".png"

}

var link = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })["image"][gte_STATS.carImage(gtfcar)]

  const { body } = await request(link);
  
	const image = await Canvas.loadImage(await body.arrayBuffer());

  var width = image.naturalWidth
  var height = image.naturalHeight
  if (width >= 1500) {
    var width = image.naturalWidth/3
    var height = image.naturalHeight/3
  }
  var canvas = await Canvas.createCanvas(width, height);
  var context = await canvas.getContext('2d');

  context.drawImage(image, 0, 0, width, height);
  context.strokeStyle= "#000000";
  if (color.length != 0) {
  var image2 = await Canvas.loadImage(color)
  var position1 = 0
  var position2 = height - (height/4)

  context.drawImage(image2, position1, position2, height/4, height/4);
  context.globalAlpha = 1;
  context.strokeRect(position1, position2, height/4, height/4);
  context.globalCompositeOperation = "source-over";
    
  context.font = `40px sans-serif`
  context.fillStyle = "#FFFFFF";
  context.fillText(gtfcar["color"]["current"].split(" ")[0], position1+(width/50), position2 + (position2*0.07));  
  context.strokeText(gtfcar["color"]["current"].split(" ")[0], position1+(width/50), position2 + (position2*0.07));
  
  }
  if (wheel.length != 0) {
  var image3 = await Canvas.loadImage(wheel)
  var position1 = height/4
  var position2 = height - (height/4)
  context.drawImage(image3, position1, position2, (height/4) * (4/3), height/4);
  context.strokeRect(position1, position2, (height/4) * (4/3), height/4);
  }

  const attachment = new AttachmentBuilder(await canvas.encode('png'), {name: "image.png"})
  await callback(attachment)
}

module.exports.removeCar = function (car, sell, userdata) {
  gte_STATS.addCredits(sell, userdata);

  var prevcarid = gte_STATS.currentCar(userdata)["id"];
  var removedcarid = car["id"];
  var pi;
  var ri;

  for (var i = 0; i < userdata["garage"].length; i++) {
    if (gte_STATS.garage(userdata)[i]["id"] == removedcarid) {
      ri = i;
    }
  }

  userdata["garage"] = gte_STATS.garage(userdata).filter(x => x["id"] != removedcarid);

  for (var i = 0; i < userdata["garage"].length; i++) {
    if (userdata["garage"][i]["id"] == prevcarid) {
      pi = i;
    }
  }

  if (ri <= pi) {
    userdata["currentcar"]--;
  }
};
module.exports.removeCars = function (start, end, userdata) {
  var count = end - start + 1;
  var total = 0;
  var car = "";

  var i = 0;
  while (i < count) {
    car = gte_STATS.garage(userdata)[start - 1];
    total += gte_PERF.perfEnthu(car, "GARAGE")["sell"];

    gte_STATS.removeCar(car, car["id"], gte_PERF.perfEnthu(car, "GARAGE")["sell"], userdata);

    i++;
  }
  return total;
};
module.exports.totalGarageSell = function (userdata) {
  var garagevalue = 0
        userdata["garage"].forEach(car => {
          var value = gte_PERF.perfEnthu(car, "GARAGE")["value"]
    garagevalue += value;
})
  return garagevalue
}
///GIFTS
module.exports.gifts = function (userdata) {
  return userdata["gifts"];
};
module.exports.addGift = function (gift, userdata) {
  userdata["stats"]["numgifts"]++;
  if (gift["inventory"]) {
   gift["id"] = userdata["stats"]["numgifts"]
   userdata["gifts"].unshift(gift);
   gte_STATS.saveEnthu(userdata);
  } else {
     gte_STATS.redeemGift(gift["name"], gift, embed, msg, userdata)
  }
};
module.exports.redeemGift = function (title, gift, embed, msg, userdata) {
  var description = "";
  if (gift["type"] == "CREDITS") {
    gte_STATS.addCredits(parseInt(gift["item"]), userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    description = "**Credits: +" + gtf_MATH.numFormat(gift["item"]) + gtf_EMOTE.credits + "**";
    if (embed != "") {
    gte_EMBED.alert({ name: title, description: description, embed: "", seconds: 0 }, msg, userdata);
    }
    gte_STATS.saveEnthu(userdata);
    return description
  } else if (gift["type"] == "EXP") {
    gte_STATS.addExp(parseInt(gift["item"]), userdata);
    var levelup = gte_EXP.checkLevelUp(userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    description = "**Experience Points: +" + gtf_MATH.numFormat(gift["item"]) + " XP" + gtf_EMOTE.exp + "**";
    if (embed != "") {
    gte_EMBED.alert({ name: title, description: description, embed: "", seconds: 0 }, msg, userdata);
    }
    gte_STATS.saveEnthu(userdata);
    return description
  } else if (gift["type"] == "RANDOMCAR") {
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    delete gift["id"];
    var prizes = gtf_CARS.random(gift["item"], 4).map(function(x) {
      x = {id: -1,
           type:"CAR",
           name: x["name"] + " " + x["year"],
           item: x, author: "GT FITNESS", inventory: false
          }
      return x
    })
    var description = gte_GTF.giftRoulette(title, "**" + title + "**", prizes, "", embed, msg, userdata);
    return description
  }
  else if (gift["type"] == "CAR") {
    var car = gift["item"];
    var ocar = gtf_CARS.find({ makes: [car["make"]], fullnames: [car["name"] + " " + car["year"]] })[0];
    gte_CARS.addCarEnthu(car, "SORT", userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    gte_STATS.saveEnthu(userdata);

    description = "**" + car["name"] + " " + car["year"] + " acquired.\nAdded to your garage.**";
    if (embed != "") {

    embed.setImage(ocar["image"][0]);
    gte_EMBED.alert({ name: title, description: description, embed: embed, seconds: 0 }, msg, userdata);
    }
    return description
  }
  else if (gift["type"] == "ITEM") {
    gte_STATS.addItem(gift["item"], userdata);
    userdata["gifts"] = userdata["gifts"].filter(x => x["id"] !== gift["id"]);
    description = "**Item: " + gift["item"] + "**";
    if (embed != "") {
    gte_EMBED.alert({ name: title, description: description, embed: "", seconds: 0 }, msg, userdata);
    }
    gte_STATS.saveEnthu(userdata);
    return description
  }
};
module.exports.clearGifts = function (userdata) {
  userdata["gifts"] = [];
  gte_STATS.saveEnthu(userdata)
};
///ITEMS
module.exports.items = function (userdata) {
  return userdata["items"];
};
module.exports.addItem = function (item, userdata) {
   userdata["items"].unshift(item);
};
module.exports.checkItem = function(item, userdata) {
  return userdata["items"].includes(item)
}

///CAREER
module.exports.careerRaces = function (userdata) {
  return userdata["careerraces"];
};


///EVENTS
module.exports.updateEvent = function (racesettings, place, userdata) {
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

module.exports.updateEventEnthu = function (racesettings, place, userdata) {
      var eventid = racesettings['eventid'].toLowerCase();
   racesettings["raceid"] = 1

      var prevplace = userdata["drprogression"][eventid][racesettings["raceid"] - 1];
          if (prevplace == 0) {
               userdata["drprogression"][eventid][racesettings["raceid"] - 1] = place
          } else {
            prevplace = prevplace.toString()
            if (parseInt(place.toString().split(/[A-Z]/gi)[0]) <= parseInt(prevplace.toString().split(/[A-Z]/gi)[0])) {
              userdata["drprogression"][racesettings["raceid"] - 1] = place;
            }
          }
          
        };
module.exports.checkEvent = function (event, place, userdata) {
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
    userevents[eventid] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
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

module.exports.completeEvent = function (event, userdata) {
  var eventid = event["eventid"].toLowerCase();
  var events = userdata["careerraces"][eventid];

  for (var i = 0; i < events.length; i++) {
    userdata["careerraces"][eventid][i] = "✅";
  }
};
///LICENSE
module.exports.license = function (userdata) {
  return userdata["license"]
}
module.exports.setLicense = function (option, userdata) {
  userdata["license"] = option.toUpperCase()
}

module.exports.checkLeague = function (league, embed, msg, userdata) {
  league = league.toLowerCase()
  var ranks = {"rn": 1000, "riv": 990, "riii":800, "rii":500, "ri":300, "rs":50, "rss": 6}

  if (ranks[league] >= userdata["ranking"]) {
    return true;
  } else {
    if (embed != "") {
    gte_EMBED.alert({ name: "❌ " + "Ranking " + ranks[league] + " Required", description: "🔒 Your Ranking must be **" + ranks[league] + "** or better to participate in " + "**" + league.toUpperCase() + "**" + ".", embed: "", seconds: 0 }, msg, userdata);
    }
    return false;
  }
};

module.exports.checkEnthuPoints = function (embed, msg, userdata) {

  if (userdata["enthupoints"] > 0) {
    return true;
  } else {
    if (embed != "") {
    gte_EMBED.alert({ name: "❌ No Enthu Points", description: "**You have lost all Enthu Points.**\nYou cannot earn skill points since you have no Enthu points.\nYou cannot join the next race.", embed: "", seconds: 0 }, msg, userdata);
    }
    return false;
  }
};

module.exports.checkLicenseTests = function (option, place, userdata) {
  option = option.toLowerCase()
  var total = 7
  if (option.includes("ic")) {
    total = 5
  }
  var count = 0;
  var i = 0;
  
  for (var i; i < total; i++) {
    var license = userdata["licenses"][option + "-" + (i+1)]
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


module.exports.completeLicenseTests = function (option, userdata) {
  option = option.toLowerCase()
  var total = 7
  if (option.includes("ic")) {
    total = 5
  }
  var count = 0;
  var i = 0;
  
  for (var i; i < total; i++) {
    userdata["licenses"][option + "-" + (i+1)][0] = "✅"
  }
}

///REPLAYS
module.exports.replays = function(userdata) {
  return userdata["replays"]
}
module.exports.addReplay = function (replay, userdata) {
if (userdata["replays"].length > gte_GTF.replaylimit) {
return
  }

    replay["date"] = gte_STATS.lastOnline(userdata)
    userdata["replays"].push(replay)
};
module.exports.removeReplay = function (index, userdata) {
userdata["replays"] = userdata["replays"].filter(function(value, i){ 
        return i != index;
    });
};
module.exports.clearReplays = function(userdata) {
userdata["replays"] = []
}

//COURSES
module.exports.courses = function(userdata) {
  userdata["stats"]["numcourses"] = userdata["courses"].length
  return userdata["courses"]
}
module.exports.addCourse = function (course, userdata) {
  if (userdata["courses"].length >= gte_GTF.courselimit) {
          return;
  }
  course["date"] = gte_STATS.lastOnline(userdata);
  userdata["courses"].push(course);
  userdata["stats"]["numcourses"] = 
  userdata["courses"].length
};
module.exports.removeCourse = function (index, userdata) {
userdata["courses"] = userdata["courses"].filter(function(value, i){ 
        return i != index;
    });
};
module.exports.renameCourse = async function (index, name, userdata) {
userdata["courses"][index]["name"] = name.toString().slice(0, 32)
}
module.exports.clearCourses = function (userdata) {
userdata["courses"] = []
};
///LOBBY EVENT SETTINGS

module.exports.eventSettings = function(userdata) {
  return userdata["eventsettings"]
}

module.exports.addEventSettings = function (customrace, userdata) {
  if (userdata["eventsettings"].length > gte_GTF.eventlimit) {
          return;
  }
  customrace["date"] = gte_STATS.lastOnline(userdata);
  if (typeof userdata["eventsettings"][customrace["eventid"] - 1] !== "undefined") {
        userdata["eventsettings"][customrace["eventid"] - 1] = customrace;
      } else {
        userdata["eventsettings"].push(customrace);
      }
};
module.exports.deleteEventSettings = function (index, userdata) {
userdata["eventsettings"] = userdata["eventsettings"].filter(function(value, i){ 
        return i != index;
    });
};
module.exports.clearEventSettings = function (userdata) {
userdata["eventsettings"] = []
};

//////
module.exports.addFavoriteCar = function (number, bool, filter, userdata) {
  if (number <= 0 || isNaN(number) || number === undefined || number > userdata["garage"].length) {
    return "Invalid";
  } else {
    var car = Array.isArray(filter) ? gte_STATS.garage(userdata).filter(x => filter.map(f => f(x)).every(p => p === true))[number - 1] : gte_STATS.garage(userdata).filter(x => filter["function"](x, filter["args"]))[number - 1];
    var id = car["id"];
    id = gte_STATS.garage(userdata).findIndex(x => x["id"] == id);
    userdata["garage"][id]["favorite"] = bool;
  }
};

module.exports.checkNotifications = function(userdata) {
   var notifs = []
    if (gte_STATS.mileage(userdata) == 0) {
      notifs.push("**🔔 You have not driven in the last 24 hours. Drive enough to earn your daily workout.**");
    }
    if (gte_STATS.mileage(userdata) > 42.1 && !userdata["dailyworkout"]) {
      notifs.push("**🔔 You have enough daily mileage to receive your daily workout! Use __/daily__ to redeem.**");
    }
    if (gte_STATS.gifts(userdata).length >= 1) {
      notifs.push("**🔔 You have 🎁" + gte_STATS.gifts(userdata).length + " items waiting in your inventory! Use __/items__ to redeem your items.**");
    }
  if (gte_STATS.currentCarNum(userdata) != 0) {
  if (gte_CONDITION.condition(gte_STATS.currentCar(userdata))["health"] < 45) {
    notifs.push("**🔔 Your current car needs to be repaired. Use the maintenance in __/tune__ to repair your car.**")
  }
  }

     if (notifs.length == 0) {
  return "**🔔 No notfications available.**" + "\n\n"
     } else if (notifs.length == 1){
      return notifs[0]+ "\n\n"  
     } else {
    var message = notifs[Math.floor(Math.random() * notifs.length)] + "\n\n";
       return message
     }
}

///DRIVER
module.exports.loadAvatarImage = async function (embed, userdata, callback) {
var Canvas = require("@napi-rs/canvas");
var { request } = require('undici');
var visor = await Canvas.loadImage("./images/gtauto/driver/visor.png")
var helmet = await Canvas.loadImage("./images/gtauto/driver/helmet.png")

var helmetcolorimage = await Canvas.loadImage("./images/gtauto/paint/" + userdata["driver"]["helmetcolor"] + ".png")
var visorcolorimage = await Canvas.loadImage("./images/gtauto/paint/" + userdata["driver"]["visorcolor"] + ".png")
  
if (typeof userdata["driver"]["helmetlogo1"] === 'undefined') {
  userdata["driver"]["helmetlogo1"] = ""
}
if (userdata["driver"]["helmetlogo1"].length == 0) {
  var logourl = "" }
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
    ctx.rotate(Math.PI/18);
ctx.drawImage(logoimage, 270, 20, width/5, (width/5) * ratio);
    ctx.rotate(-Math.PI/18);
  }
  if (logourl2.length != 0) {
ctx.drawImage(logoimage2, 640, 370, width/3.5, (width/3.5) * ratio);
  }

  const attachment = new AttachmentBuilder(await canvas.encode('png'), {name: "image.png"})
  await callback(attachment)
}

module.exports.loadAvatarImage2 = async function (embed, userdata, callback) {
var Canvas = require("@napi-rs/canvas");
var { request } = require('undici');
const canvas = Canvas.createCanvas(30 + (16*52), 100);
const context = canvas.getContext('2d');

	// Select the font size and type from one of the natively available fonts
	context.font = '30px sans-serif';

	// Select the style that will be used to fill the text in
	context.fillStyle = '#ffffff';
context.fillText("|  Ranking         ", 10,35)
context.fillText("|", 10,57.5)
context.fillText("|  " + userdata["ranking"] + " ".repeat(4 - userdata["ranking"].toString().length) + "              ", 10,80)
  
context.fillText("  Ranking Points  ", 10 + ((16*10)+8),35)
context.fillText("  " + userdata["rankingpoints"] + " ".repeat(5 - userdata["rankingpoints"].toString().length) + "                ", 10 + ((16*10)+8),80)
//context.fillText("  00000                ", 10 + ((16*10)+8),80)

context.fillText("  Skill Level    ", 10 + ((16*26)+8),35)
context.fillText("  " + userdata["level"] + " ".repeat(2 - userdata["level"].toString().length) + "                  ", 10 + ((16*26)+8),80)
context.fillText("  Enthu Points    ", 10 + ((16*38)),35)
context.fillText("  " + userdata["enthupoints"] + " / " + userdata["totalenthupoints"] + " ".repeat(4 - userdata["totalenthupoints"].toString().length) + "      ", 10 + ((16*38)),80)

  const attachment = new AttachmentBuilder(await canvas.encode('png'), {name: "bimage.png"})
  await callback(attachment)
}

///RACEINPROGRESS
module.exports.getRaceCompletion = function (racesettings, raceid, userdata) {
  eventid = racesettings["eventid"].toLowerCase();

  if (userdata["careerraces"][eventid][raceid - 1] == 0) {
    return "";
  } else {
    return "`" + userdata["careerraces"][eventid][raceid - 1] + "`";
  }
};
module.exports.clearRaceInProgress = function (userdata) {
  userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: 0, gridhistory: [], msghistory: [], championshipnum:-1};
};
module.exports.raceInProgress = function (userdata) {
  return userdata["raceinprogress"];
};
module.exports.week = function (userdata) {

  return userdata["week"] + userdata["weekseed"]
}
module.exports.rankingHistory = function(userdata) {
  return userdata["rankinghistory"]
}
module.exports.addRankingRace = function (racesettings, place, points, damage, userdata) {

  var skillpoints = 50 ///base
  
  skillpoints += Math.round((racesettings["distance"]["km"] * 1094)/150) ///track distance
  ///ranking
  if (racesettings["positions"].length == 2) {
    skillpoints = skillpoints + {"1st": 10, "2nd": 1}[place]
  } else {
    skillpoints = skillpoints + {"1st": 10, "2nd": 6, "3rd": 4, "4th": 3, "5th": 2, "6th": 1}[place]
  }

  ///fastest 
  
  if (gte_STATS.currentCar(userdata)["level"] == 10) {
    skillpoints = skillpoints + 25
  }
  ///

  ///offcourse,collision fence, collision car
  if (typeof userdata["races"] === 'undefined') {
    userdata["races"] = {}
  }
var league = racesettings["eventid"].split("-")[0].toUpperCase()
  if ((league == "RII" || league == "RI")) {
    if (typeof userdata["races"][racesettings["title"] + " " + league] !== "undefined") {
      if (userdata["races"][racesettings["title"] + " " + league] == 3) {
        userdata["races"][racesettings["title"] + " " + league] = 4
      } else {
        userdata["races"][racesettings["title"] + " " + league]++
      }
    } else {
    userdata["races"][racesettings["title"] + " " + league] = 1
    }
  }
  
  userdata["rankinghistory"].push({title:racesettings["title"],
league: racesettings["eventid"].split("-")[0].toUpperCase(),
week:userdata["week"], 
place: place, 
car: racesettings["driver"]["car"]["name"] + " `Lv." + racesettings["driver"]["car"]["perf"]["level"] + "`",
points: Math.round(points), 
skillpoints:Math.round(skillpoints),
      damage: damage
      })
  userdata["rankingpoints"] += points
  userdata["week"]++
  gte_STATS.addSkillPoints(Math.round(skillpoints - (0.8 * damage)), userdata)
  gte_STATS.addTuningPoints(Math.round(skillpoints - (0.8 * damage)), userdata)
}

module.exports.checkRanking = function (userdata) {
  
  userdata["rankingpoints"] = gtf_MATH.sum(userdata["rankinghistory"].map(x => x["points"]).slice(0).slice(-12).sort(function(a, b) {
      return b - a;
    }).slice(0,9))
  if (userdata["rankingpoints"] >= 0) {
    userdata["ranking"] = Math.round((-userdata["rankingpoints"]/2)+1000)
  } 
  if (userdata["rankingpoints"] >= 400) {
    userdata["ranking"] = 
      Math.round(((-3/7.2) * userdata["rankingpoints"]) + 1000)
  }
  if (userdata["rankingpoints"] >= 1200) {
     userdata["ranking"] = Math.round(((-7/23) * userdata["rankingpoints"]) + 1000)
  }
  if (userdata["rankingpoints"] >= 2300) {
    userdata["ranking"] = Math.round(((-5.24/30) * userdata["rankingpoints"]) + 836)
  }
  if (userdata["rankingpoints"] >= 4500) {
    userdata["ranking"] = Math.round(((-2/225) * userdata["rankingpoints"]) + 90)
    userdata["ranking"] = 50
  }
  if (userdata["ranking"] <= 1) {
    userdata["ranking"] = 1
  }
  
}
module.exports.checkSkillLevel = function (userdata) {
  var nextskillpoints = 0
  var levelup = false
  var levelo = parseInt(userdata["level"])
  
  for (var i = 1; i <= 99; i++) {
    nextskillpoints += Math.round(100 * Math.exp(((i-1)+0.7)/ 33.5))
    if (i == levelo) {
    if (userdata["skillpoints"] >= nextskillpoints) {
      userdata["level"]++
      levelup = true
    }
    }
  }
  userdata["totalenthupoints"] = ((userdata["level"]-1) * 15) + 300
  if (userdata["level"] >= 99) {
    userdata["level"] = 99
  }
  return [levelup, levelo, userdata["level"], userdata["skillpoints"]]
}

///MISC

module.exports.checkMessages = function(command, callback, msg, userdata) {
  if (["dw", "dw4", "rcar", "rtrack", "rcourse", "gtf", "sr"].indexOf(command) + 1) {
    return next()
  }

  userdata["tutorial"] == "Complete" ? next() : callback()

  function next() {
    var name = command.name
    var commandmessages = gte_LIST_MESSAGES[name]

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
    embed.setAuthor({name: user, iconURL: avatar});
    var message = {}
    for (var x = 0; x < commandmessages.length; x++) {
        if (gte_STATS.triggerMessage(name, commandmessages[x], userdata)) {
          if (commandmessages[x]["emote"].length == 0) {
            var character = ""
          } else {
        var character = {
          "gtfitness":" __**GT Fitness**__",
          "lewish":gtf_EMOTE.lewish + " __**Lewis Hamilton**__", 
          "igorf":gtf_EMOTE.igorf + " __**Igor Fraga**__", 
          "sebastienl":gtf_EMOTE.sebastienl + " __**Sebastien Loeb**__", 
          "jannm": gtf_EMOTE.jannm + " __**Jann Mardenborough**__",
      "jimmyb": gtf_EMOTE.jimmyb + " __**Jimmy Broadbent**__"}[commandmessages[x]["emote"]]
        }
        embed.setDescription(character + "\n" + commandmessages[x]["messages"].join("\n\n"));
        message = commandmessages[x]
        break;
        }
    }

  if (Object.keys(message).length == 0) {
    return callback()
  }

  var emojilist = [
  { emoji: "",
  emoji_name: "",
  name: 'OK',
  extra: " ",
  button_id: 0,
  }]
   var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);
      gtf_DISCORD.send(msg, {embeds: [embed], components:buttons}, acceptmessage)
   function acceptmessage(msgg) {
    function accept() {
      gte_STATS.addMessage(name, message, userdata)
      gte_STATS.saveEnthu(userdata)
      msgg.delete({})
      msg.type = 0
      callback()
    }

    var functionlist = [accept]
      gte_TOOLS.createButtons(buttons, emojilist, functionlist, msgg, userdata)
  }
    }
  }


}
module.exports.checkRewards = function (type, extra, userdata) {
  /*
    var rewards = .gtfrewards[type]
  
  for (var i = 0; i < rewards.length; i++) {
    var f = gte_STATS.triggerReward(rewards[i]["name"], rewards[i], extra, userdata)
    if (f) {
    var item = rewards[i]["item"]
    gte_STATS.addGift(item, userdata)
    gte_STATS.addItem(rewards[i]["name"], userdata)
    }
  }
  */
}

module.exports.raceEventStatus = function (event, userdata) {
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
      var total = parseInt((points/total) * 100)
        return progress + "`" + total + "%`"
      
    } 
    else {
      return "⬛";
    }
  }
};

module.exports.DRStageStatus = function (event, userdata) {
            var eventid = event["eventid"].toLowerCase();
            var eventstatus = userdata["drprogression"][eventid];

          if (typeof eventstatus === 'undefined') {
            userdata["drprogression"][eventid] = [0, 0, 0, 0, 0];
             return "⬛";
          }
          eventstatus = userdata["drprogression"][eventid];
  if (eventstatus[0] == 0) {
    return "⬛"
  }
            if (eventstatus[0] == "✅") {
              return "S";
            }
              var length = 1
              var total = 5
            for (var i = 0; i < length; i++) {
              if (eventstatus[i] == "5th") {
                return "D"
              } else if (eventstatus[i] == "4th") {
                return "C"
              } else if (eventstatus[i] == "3rd") {
                return "B"
              } else if (eventstatus[i] == "2nd") {
                return "A"
              } else if (eventstatus[i] == "1st") {
                return "S"
              }
            }
            
            
    
        };

//INLOBBY
module.exports.inlobby = function (userdata) {
  return userdata["inlobby"];
};
module.exports.setinlobby = function (bool, mid, userdata) {
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
module.exports.menuFooter = function (userdata) {
  userdata["count"]++;
  userdata["mileage"] = gtf_MATH.round(userdata["mileage"], 2)

  var levelup = gte_EXP.checkLevelUp(userdata);

  if (levelup[0]) {
    levelup = "\n" + "**⬆ Level Up!**";
  } else {
    levelup = "";
  }
  var gifts = gte_STATS.gifts(userdata).length >= 1 ? gte_STATS.gifts(userdata).length + " 🎁 " : "";
  var units = gte_STATS.mileageUnits(userdata);
  var currdate = gtf_DATETIME.getFormattedDate(new Date(), userdata);

  if (userdata["lastonline"] != currdate) {
    userdata["dailyworkout"]["done"] = false;
    var mileage = parseFloat(userdata["mileage"])
    /*
    if (userdata["mileage"] > 0) {
      gte_STATS.addRaceMulti(0.2, userdata);
    } else {
      gte_STATS.addRaceMulti(-100, userdata);
    }
    */
    gte_STATS.setMileage(0, userdata);
    if (userdata["dailyworkout"]["endurance"]) {
      userdata["dailyworkout"]["endurance"] = false
      gte_STATS.setMileage(mileage, userdata)
    }
    
  }
  userdata["lastonline"] = currdate;
  gte_STATS.addRaceMulti(-100, userdata);
  //gtf_EMOTE.dailyworkout + "x" + gte_STATS.raceMulti(userdata) + " "

  return gifts + gtf_MATH.numFormat(gte_STATS.credits(userdata)) + " " + gtf_EMOTE.credits + " " +
    "Lv." + gte_STATS.level(userdata)+ " " + gtf_EMOTE.exp + " " + gtf_MATH.numFormat(gte_STATS.exp(userdata)) + "  " + gtf_EMOTE.dailyworkoutman + gtf_MATH.numFormat(gte_STATS.mileageUser(userdata)) + units + levelup;
};

module.exports.menuFooterEnthu = function (userdata) {
  userdata["count"]++;

  return "Car"
};

/////RACES//////

module.exports.addRaceDetails = function (racesettings, racedetails, finalgrid, userdata) {
  userdata["racedetails"] = [racesettings, racedetails, finalgrid];
};

module.exports.removeRaceDetails = function (userdata) {
  userdata["racedetails"] = [];
};

 
module.exports.createRaceHistory = function (racesettings, racedetails, finalgrid, checkpoint, timeinterval, message, embed, msg, userdata) {
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
    message = gte_RACEEX.updateGrid(racesettings, racedetails, mfinalgrid, checkpoint, timeinterval, i, message, embed, msg, userdata)
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
    message = gte_RACEEX.updateGrid(racesettings, racedetails, finalgrid, checkpoint, timeinterval, i, message, embed, msg, userdata)

    timei = gtf_TIME.advanceTime(racesettings["time"], timeinterval)
    userdata["raceinprogress"]["timehistory"].push(JSON.parse(JSON.stringify(timei)))
    userdata["raceinprogress"]["gridhistory"].push(JSON.parse(JSON.stringify(finalgrid)))

  }
  userdata["raceinprogress"]["msghistory"].push(JSON.parse(JSON.stringify(message)))
  finalgrid = userdata["raceinprogress"]["gridhistory"][0]
}

module.exports.resumeRace = function (userdata, client) {
  if (userdata["racedetails"].length == 0) {
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
        gte_STATS.saveEnthu(userdata);
        return;
      }
      if (msg.content.includes("FINISH")) {
        console.log(userdata["id"] + ": Race Aborted");
        userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "" };
        gte_STATS.saveEnthu(userdata);
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

gte_RACES2.startSession(racesettings, racedetails, finalgrid, [true], embed, msg, userdata);
    });
    return true;
  }
};

module.exports.save = async function (userdata, condition) {
  if (userdata === undefined) {
    return;
  }
  if (Object.keys(userdata).length <= 6) {
    return;
  }
  var { MongoClient, ServerApiVersion } = require('mongodb');

  try {
    var db = await MongoClient.connect(process.env.MONGOURL,
    {
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
module.exports.saveEnthu = async function (userdata, condition) {

  if (userdata === undefined) {
    return;
  }
  if (Object.keys(userdata).length <= 6) {
    return;
  }
  var { MongoClient, ServerApiVersion } = require('mongodb');

  try {
    var db = await MongoClient.connect(process.env.MONGOURL,
    {
      serverApi: ServerApiVersion.v1 
    })
      var dbo = db.db("GTFitness");
      if (condition == "DELETE") {
        dbo.collection("FITHUSIMSAVES").deleteOne({ id: userdata["id"] });
      } else {
        
        dbo
          .collection("FITHUSIMSAVES")
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

module.exports.load = async function (collection, userdata, callback) {
  if (typeof callback === 'undefined') {
    callback = function () {}
  }
 var { MongoClient, ServerApiVersion } = require('mongodb');


  var results = {}
  var find = (collection == "SEASONALS") ? {} : { id: userdata["id"] }
  if (collection == "LOBBIES") {
    if (!userdata["inlobby"]["active"]) {
      return callback({})
    } else {
    find = { channelid:userdata["inlobby"]["channelid"] }
    }
    
  }
  var found = false

  var db = await MongoClient.connect(process.env.MONGOURL,
  {
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
