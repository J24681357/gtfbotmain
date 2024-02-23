const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.list = function (args) {
  var gtfparts = gte_LIST_PARTS;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "type") {
    results = Object.keys(gtfparts).map(function (x) {
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
  if (args["sort"] !== undefined) {
    var sort = args["sort"]
    delete args["sort"];
  } else {
    var sort = "costasc"
  }
  var gtfparts = gte_LIST_PARTS;
  var final = [];
  var total = Object.keys(args).length;

  var parttypes = Object.keys(gtfparts);

  for (var key = 0; key < parttypes.length; key++) {
    var typekey = gtfparts[parttypes[key]];
    for (var i = 0; i < typekey.length; i++) {
      var count = 0;
      
      if (args["type"] !== undefined) {
        var type = args["type"];
        var x = typekey[i]["type"];
        if (x.toLowerCase().replace(/ /g, "").replace(/-/g, "") == type.toLowerCase().replace(/ /g, "").replace(/-/g, "")) {
          count++;
        }
      }

      if (args["name"] !== undefined) {
        if (args["name"].length == 0) {
          count++;
        } else { 
        var name = args["name"];
        var x = typekey[i]["name"];
        if (x === name) {
          count++;
        }
      }
      }

    if (args["makes"] !== undefined) {
        if (args["makes"].length == 0) {
          count++;
        } else {
          var make = args["makes"];
          var x = typekey[i]["makes"];
          for (var makei = 0; makei < make.length; makei++) {
            if (x.toLowerCase().replace(/-/,"_").replace(/ /g, "_") === make[makei].toLowerCase().replace(/-/,"_").replace(/ /g, "_")) {
              count++;
              break;
            }
          }
        }
      }
      
     if (args["model"] !== undefined) {
        if (args["model"].length == 0) {
          count++;
        } else {
          var model = args["model"];

          if (typekey[i]["models"].length == 0) {
            count++
          }
          for (var iname = 0; iname < typekey[i]["models"].length; iname++) {
            if (model.includes(" " + typekey[i]["models"][iname])) {
              count++;
              break;
            }
          }
          
        }
      }

      if (args["cartype"] !== undefined) {
        if (args["cartype"].length == 0) {
          count++;
        } else {
          var cartype = args["cartype"];

          if (typekey[i]["types"].length == 0) {
            count++
          }
          for (var ictype = 0; ictype < typekey[i]["types"].length; ictype++) {
            if (cartype.includes(typekey[i]["types"][ictype])) {
              count++;
              break;
            }
          }
          
        }
      }
      
      if (args["upperfpp"] !== undefined) {
        if (args["upperfpp"].length == 0) {
          count++;
        } else {
          var upperfpp = args["upperfpp"];
          var x = typekey[i]["fpplimit"];
          if (x >= upperfpp) {
            count++;
          }
        }
      }
      
      if (args["lowerweight"] !== undefined) {
        if (args["lowerweight"].length == 0) {
          count++;
        } else {
          var lowerweight = args["lowerweight"];
          var x = typekey[i]["lowerweight"];
          if (x <= lowerweight) {
            count++;
          }
        }
      }
      

      if (args["prohibited"] !== undefined) {
        if (args["prohibited"].length == 0) {
          count++;
        } else {
          var prohibiteds = args["prohibited"];
          for (var iprohibited = 0; iprohibited < prohibiteds.length; iprohibited++) {
            if (typekey[i]["prohibited"].includes(prohibiteds[iprohibited])) {
              count++;
              break;
            } else {
              break;
            }
          }
        }
      }

      if (count == total) {
        final.unshift(typekey[i]);
      }
    }
  }
  if (final.length == 0) {
    return "";
  }
  final = final.sort(function (a, b) {
    if (sort == "costasc"|| sort == "Lowest Price") {
        return a["cost"] - b["cost"];
      } else if (sort == "costdesc"|| sort == "Highest Price") {
        return b["cost"] - a["cost"];
      } else if (sort == "name" || sort == "Alphabet" || sort == "Alphabetical Order") {
        return a["name"].toString().localeCompare(b["name"]);
      }
  });
  return JSON.parse(JSON.stringify(final))
};

////////////////////////////////////////////////////

module.exports.tuningList = function (part, gtfcar, embed, msg, userdata) {
  if (part["type"] == "Transmission") {
    var names = [
      [
        "__**Top Speed**__",
        " ",
        function (x) {
          return x;
        },
      ],
    ];
  }
  if (part["type"] == "Suspension") {
    var names = [
      [
        "__**Camber Angle**__",
        "in",
        function (x) {
          return x;
        },
      ],
      [
        "__**Toe Angle**__",
        "in",
        function (x) {
          return x;
        },
      ],
    ];
  }
    if (part["type"] == "Aero Kits") {
    var names = [
      [
        "__**Downforce Level**__",
        " ",
        function (x) {
          return x * 20;
        },
      ],
    ];
  }
  var tunevalues = gtfcar["perf"][part["type"].toLowerCase()]["tuning"];

  var list = [];

  for (var i = 0; i < names.length; i++) {
    if (tunevalues[i] == -999) {
      tunevalues[i] = 0;
    }
    if (tunevalues[i] < part["min"]) {
      tunevalues[i] = part["min"];
    }
    if (tunevalues[i] > part["max"]) {
      tunevalues[i] = part["max"];
    }
    var bar = [];
    for (var j = part["min"]; j < part["max"] + 1; j++) {
      if (j == tunevalues[i]) {
        bar.push(userdata["settings"]["ICONS"]["bar"][0]);
      } else {
        bar.push(userdata["settings"]["ICONS"]["bar"][1]);
      }
    }
    list.push(names[i][0] + " " + names[i][2](tunevalues[i]) + " "+ names[i][1] + "/n" + bar.join(""));
  }

  return list;
};

module.exports.checkParts = function (part, gtfcar) {
  var fpp = gte_PARTS.previewPart(part, gtfcar, "GARAGE")["fpp"].toString()

  var type = part["type"].toLowerCase().replace(/ /g, "")

  if (part["name"] == "Default") {
      if (gtfcar["perf"][type]["current"] == part["name"]) {
         return ["✅", "**" + gtfcar["fpp"] + "**"]
      }
     return ["","**" + fpp + "**"]
  }

  
  if (gtfcar["perf"][type]["list"].includes(part["name"])) {
      if (gtfcar["perf"][type]["current"] == part["name"]) {
        return ["✅", "**" + gtfcar["fpp"] + "**"];
      } else {
      return ["📦", "**" + fpp + "**"];
      }
  } else {
      return ["", "**" + fpp + "**"];
    }
};
module.exports.previewPart = function (part, car, condition) {
    var car5 = JSON.stringify(car);
    var car2 = JSON.parse(car5);
    var type = part["type"].toLowerCase().replace(/ /g, "")

  car2["perf"][type]["current"] = part["name"];
    if (typeof part["tuning"] !== 'undefined') {
      car2["perf"][type]["tuning"] = part["tuning"];
    }

if (type == "carengine") {
  car2["perf"]["engine"]["current"] = "Default"
  car2["perf"]["transmission"]["current"] = "Default"
  car2["perf"]["turbo"]["current"] = "Default"
}
  
    return gte_PERF.perfEnthu(car2, condition);
};
module.exports.installPart = function (part, userdata) {
  var type = part["type"].toLowerCase().replace(/ /g, "")

  var installedpart = userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"][type];

  installedpart["current"] = part["name"];
  // update tuning values
  for (var i = 0; i < installedpart["tuning"].length; i++) {
    if (part["name"] == "Default") {
      installedpart["tuning"][i] = -999;
    } else {
      if (type == "aerokits") {
        installedpart["tuning"][i] = 3;
      } else {
    installedpart["tuning"][i] = 0;
    }
  }
  }
  /*
  if (type == "carengine") {
      installedpart["tuning"][0] = part["percent"]
  }
  */
  ////

  if (part["name"] != "Default" && !installedpart["list"].includes(part["name"])) {
    userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"][type]["list"].push(part["name"]);
  }

if (type == 'tires') {
    if (part["name"].includes("Racing")) {
     if (!installedpart["list"].includes("Racing: Intermediate")) {
    userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"][type]["list"].push("Racing: Intermediate");
  }
  if (!installedpart["list"].includes("Racing: Heavy Wet")) {
    userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"][type]["list"].push("Racing: Heavy Wet");
  }
  }
  if (part["name"].includes("Intermediate") || part["name"].includes("Heavy Wet")) {
      if (!installedpart["list"].includes("Racing: Hard")) {
    userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"][type]["list"].push("Racing: Hard");
  }
  }
}

if (type == "carengine") {
  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["engine"]["current"] = "Default"
  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["engine"]["list"] = ["Default"]
  
    userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["transmission"]["current"] = "Default"
  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"]["turbo"]["current"] = "Default"
}

  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["perf"][type] = installedpart;

  userdata["garage"][gte_STATS.currentCarNum(userdata) - 1]["fpp"] = gte_PERF.perfEnthu(userdata["garage"][gte_STATS.currentCarNum(userdata) - 1], "GARAGE")["fpp"];
};

module.exports.costCalc = function (part, gtfcar, ocar) {
  if (part["type"] == "Tires" || part["type"] == "Car Wash") {
    return part["cost"]
  }
  if (part["type"] == "Car Engine") {
    var car = gte_CARS.findEnthu({ fullnames: [part["name"]] })[0]
    var cost = gtf_MATH.round(gtf_CARS.costCalcRaw(car, gte_PERF.perfEnthu(car, "DEALERSHIP")["fpp"])/1.5, 1);
    if (cost >= 150000) {
      return 150000
    } else {
      return Math.round(cost)
    }
  }
  var discount = gte_PERF.perfEnthu(ocar, "DEALERSHIP")["fpp"]/500
  if (discount > 1) {
     discount = discount ** 2
  }
  if (part["type"] == "Engine Repair") {
    var totalcost = ((gtf_CARS.costCalc(ocar) * 0.25) * 0.28)
    return Math.round(totalcost * ((100-gtfcar["condition"]["engine"]) / 100))
  }
  if (part["type"] == "Transmission Repair") {
    var totalcost = ((gtf_CARS.costCalc(ocar) * 0.25) * 0.13)
    return Math.round(totalcost * ( (100 -gtfcar["condition"]["transmission"]) / 100))
  }
  if (part["type"] == "Suspension Repair") {
    var totalcost = ((gtf_CARS.costCalc(ocar) * 0.25) * 0.13)
    return Math.round(totalcost * ((100 - gtfcar["condition"]["suspension"]) / 100))
  }
  if (part["type"] == "Body Damage Repair") {
    var totalcost = ((gtf_CARS.costCalc(ocar) * 0.25) * 0.2)
    return Math.round(totalcost * ((100-gtfcar["condition"]["body"]) / 100))
  }
  return Math.round(part["cost"] * discount / 100) *100
};

//////////////
module.exports.audit = async function () {
  var parts = gte_LIST_PARTS;
  var fs = require("fs");

  var names = Object.keys(parts);

  for (var i = 0; i < names.length; i++) {
    if (names[i] == "car-engine") {
      parts[names[i]] = parts[names[i]].sort((a, b) => a["name"].toString().localeCompare(b["name"]));
    }
   
  }
      gtf_CONSOLELOG.reverse();
    gtf_CONSOLELOG.fill(100, 100, 255);
    console.log("Parts updated.")
    gtf_CONSOLELOG.end();
  fs.writeFile("./jsonfiles/gtfpartlist.json", require("json-format")(parts), function (err) {
    if (err) {
      console.log(err);
    }
  });
  

};