// REMOTE
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.findEnthu = function (args) {
  var gtfcars = gtf_LIST_CARS;

  if (args === undefined) {
    return "";
  }

  if (args["sort"] !== undefined) {
    var sort = args["sort"];
    delete args["sort"];
  }

 

  var total = Object.keys(args).length;
  var final = [];
  var makes = [
    "alfa-romeo",
    "alpine",
    "aston-martin",
    "audi",
    "bmw",
    "bugatti",
    "cadillac",
    "caterham",
    "chevrolet",
    "chrysler",
    "citroen",
    "daihatsu",
    "de-tomaso",
    "dodge",
    "fiat",
    "ford",
    "honda",
    "hyundai",
    "jaguar",
    "lancia",
    "land-rover",
    "lotus",
    "mazda",
    "mercedes-benz",
    "mini",
    "mitsubishi",
    "nismo",
    "nissan",
    "opel",
    "peugeot",
    "pontiac",
    "renault",
    "ruf",
    "shelby",
    "smart",
    "subaru",
    "suzuki",
    "tommykaira",
    "toyota",
    "tvr",
    "volkswagen",
    "volvo",
  ];

  var carid = 0;

  for (var key = 0; key < makes.length; key++) {
    var makekey = gtfcars[makes[key]];
    for (var i = 0; i < makekey.length; i++) {
      var count = 0;
      if (args["makes"] !== undefined) {
        if (args["makes"].length == 0) {
          count++;
        } else {
          var make = args["makes"];
          var x = makekey[i]["make"];
          for (var makei = 0; makei < make.length; makei++) {
            if (x.toLowerCase().replace(/-/, "_").replace(/ /g, "_") === make[makei].toLowerCase().replace(/-/, "_").replace(/ /g, "_")) {
              count++;
              break;
            }
          }
        }
      }

      if (args["names"] !== undefined) {
        if (args["names"].length == 0) {
          count++;
        } else {
          var names = args["names"];
          for (var iname = 0; iname < names.length; iname++) {
            if (makekey[i]["name"].includes(names[iname])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["fullnames"] !== undefined) {
        if (args["fullnames"].length == 0) {
          count++;
        } else {
          var fullnames = args["fullnames"];
          for (var ifname = 0; ifname < fullnames.length; ifname++) {
            var text = makekey[i]["name"].toLowerCase() + " " + makekey[i]["year"];
            if (text.includes(fullnames[ifname].toLowerCase())) {
              count++;
              break;
            }
          }
        }
      }

      if (args["drivetrains"] !== undefined) {
        if (args["drivetrains"].length == 0) {
          count++;
        } else {
          var drivetrains = args["drivetrains"];
          for (var idt = 0; idt < drivetrains.length; idt++) {
            if (makekey[i]["drivetrain"].includes(drivetrains[idt])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["engines"] !== undefined) {
        if (args["engines"].length == 0) {
          count++;
        } else {
          var engines = args["engines"];
          for (var enginet = 0; enginet < engines.length; enginet++) {
            if (makekey[i]["engine"].includes(engines[enginet])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["year"] !== undefined) {
        if (args["year"].length == 0) {
          count++;
        } else {
          var years = args["year"];
          for (var iyear = 0; iyear < years.length; iyear++) {
            if (years[iyear].includes(makekey[i]["year"])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["upperyear"] !== undefined) {
        if (args["upperyear"].length == 0) {
          count++;
        } else {
          var upperyear = args["upperyear"];
          var x = parseInt(makekey[i]["year"]);
          if (upperyear >= x) {
            count++;
          }
        }
      }

      if (args["loweryear"] !== undefined) {
        if (args["loweryear"].length == 0) {
          count++;
        } else {
          var loweryear = args["loweryear"];
          var x = parseInt(makekey[i]["year"]);
          if (loweryear <= x) {
            count++;
          }
        }
      }

      if (args["types"] !== undefined) {
        if (args["types"].length == 0) {
          count++;
        } else {
          var types = args["types"];
          for (var itype = 0; itype < types.length; itype++) {
            if (makekey[i]["type"].includes(types[itype])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["countries"] !== undefined) {
        if (args["countries"].length == 0) {
          count++;
        } else {
          var countries = args["countries"];
          for (var icountry = 0; icountry < countries.length; icountry++) {
            if (makekey[i]["country"] == countries[icountry]) {
              count++;
              break;
            }
          }
        }
      }
      if (args["uppercostm"] !== undefined) {
        if (args["uppercostm"].length == 0) {
          count++;
        } else {
          var uppercostm = args["uppercostm"];
          var x = makekey[i]["carcostm"];
          if (x <= uppercostm) {
            count++;
          }
        }
      }

      if (args["upperfpp"] !== undefined) {
        if (args["upperfpp"].length == 0) {
          count++;
        } else {
          var upperfpp = args["upperfpp"];
          var x = gtf_PERF.perf(makekey[i], "DEALERSHIP")["fpp"];
          if (x <= upperfpp) {
            count++;
          }
        }
      }

      if (args["upperpower"] !== undefined) {
        if (args["upperpower"].length == 0) {
          count++;
        } else {
          var upperpower = args["upperpower"];
          var x = makekey[i]["power"];
          if (x <= upperpower) {
            count++;
          }
        }
      }

      if (args["upperweight"] !== undefined) {
        if (args["upperweight"].length == 0) {
          count++;
        } else {
          var upperweight = args["upperweight"];
          var x = makekey[i]["weight"];
          if (x <= upperweight) {
            count++;
          }
        }
      }

      if (args["lowercostm"] !== undefined) {
        if (args["lowercostm"].length == 0) {
          count++;
        } else {
          var lowercostm = args["lowercostm"];
          var x = makekey[i]["carcostm"];
          if (x >= lowercostm) {
            count++;
          }
        }
      }

      if (args["lowerfpp"] !== undefined) {
        if (args["lowerfpp"].length == 0) {
          count++;
        } else {
          var lowerfpp = args["lowerfpp"];
          var x = gtf_PERF.perf(makekey[i], "DEALERSHIP")["fpp"];
          if (x >= lowerfpp) {
            count++;
          }
        }
      }

      if (args["lowerpower"] !== undefined) {
        if (args["lowerpower"].length == 0) {
          count++;
        } else {
          var lowerpower = args["lowerpower"];
          var x = makekey[i]["power"];
          if (x >= lowerpower) {
            count++;
          }
        }
      }

      if (args["lowerweight"] !== undefined) {
        if (args["lowerweight"].length == 0) {
          count++;
        } else {
          var lowerweight = args["lowerweight"];
          var x = makekey[i]["weight"];
          if (x >= lowerweight) {
            count++;
          }
        }
      }

      if (args["special"] !== undefined) {
        if (args["special"].length == 0) {
          count++;
        } else {
          var specials = args["special"];
          for (var ispecial = 0; ispecial < specials.length; ispecial++) {
            if (makekey[i]["special"].includes(specials[ispecial])) {
              count++;
              break;
            }
          }
        }
      }

      if (args["prohibited"] !== undefined) {
        if (args["prohibited"].length == 0) {
          count++;
        } else {
          var prohibiteds = args["prohibited"];
          for (var iprohibited = 0; iprohibited < prohibiteds.length; iprohibited++) {
            if (!makekey[i]["special"].includes(prohibiteds[iprohibited])) {
              count++;
              break;
            } else {
              break;
            }
          }
        }
      }

      ///DISCOUNTS

      ////

      if (count == total) {
        final.unshift(makekey[i]);
      }
    }
  }
  if (final.length == 0) {
    return "";
  }
  final = final.filter(function(x){
    return (x["type"] == "Production" || x["type"] == "Aftermarket" || x["type"].includes("Race Car") || x["type"].includes("Rally Car"))
  })
  ///sorting

  final.sort(function (a, b) {
    if (typeof sort !== "undefined") {
      if (sort == "alphabet" || sort == "Alphabetical Order") {
        return a["name"].toString().localeCompare(b["name"].toString());
      }
      if (sort == "hpasc" || sort == "Lowest Power") {
        return gtf_PERF.perf(a, "DEALERSHIP")["power"] - gtf_PERF.perf(b, "DEALERSHIP")["power"];
      } else if (sort == "hpdesc" || sort == "Highest Power") {
        return gtf_PERF.perf(b, "DEALERSHIP")["power"] - gtf_PERF.perf(a, "DEALERSHIP")["power"];
      } else if (sort == "weightasc" || sort == "Lowest Weight") {
        return gtf_PERF.perf(a, "DEALERSHIP")["weight"] - gtf_PERF.perf(b, "DEALERSHIP")["weight"];
      } else if (sort == "weightdesc" || sort == "Highest Weight") {
        return gtf_PERF.perf(b, "DEALERSHIP")["weight"] - gtf_PERF.perf(a, "DEALERSHIP")["weight"];
      } else if (sort == "fppasc" || sort == "Lowest FPP") {
        return gtf_PERF.perf(a, "DEALERSHIP")["fpp"] - gtf_PERF.perf(b, "DEALERSHIP")["fpp"];
      } else if (sort == "fppdesc" || sort == "Highest FPP") {
        return gtf_PERF.perf(b, "DEALERSHIP")["fpp"] - gtf_PERF.perf(a, "DEALERSHIP")["fpp"];
      } else if (sort == "costasc" || sort == "Lowest Price") {
        a = gtf_CARS.costCalcRaw(a, gtf_PERF.perf(a, "DEALERSHIP")["fpp"]);
        b = gtf_CARS.costCalcRaw(b, gtf_PERF.perf(b, "DEALERSHIP")["fpp"]);
        return a - b;
      } else if (sort == "costdesc" || sort == "Highest Price") {
        a = gtf_CARS.costCalcRaw(a, gtf_PERF.perf(a, "DEALERSHIP")["fpp"]);
        b = gtf_CARS.costCalcRaw(b, gtf_PERF.perf(b, "DEALERSHIP")["fpp"]);
        return b - a;
      } else {
        return a["name"].toString().localeCompare(b["name"]);
      }
    } else {
      return a["name"].toString().localeCompare(b["name"]);
    }
  });
  final.map(function (x, i) {
    x["id"] = i;
  })

  return JSON.parse(JSON.stringify(final));
};

module.exports.randomEnthu = function (args, num) {
  var seed = -1;
  if (typeof args["seed"] !== "undefined") {
    seed = args["seed"];
    delete args["seed"];
  }
  var rlist = [];
  var list = gte_CARS.findEnthu(args);
  for (var i = 0; i < num; i++) {
    if (seed == -1) {
      rlist.push(list[Math.floor(Math.random() * list.length)]);
    } else {
      rlist.push(list[gtf_MATH.randomIntSeed(0, list.length - 1, seed + i)]);
    }
  }
  return rlist;
};

module.exports.addCarEnthu = function (car, arg, userdata) {
  var fullname = car["name"] + " " + car["year"];

  if (arg != "LOAN") {
    if (gte_STATS.garage(userdata).length == 0) {
      gte_STATS.setCurrentCar(1, undefined, userdata);
      userdata["currentcar"] = 1
    }
  }
  car["condition"] = 100;

  var tires = { current: car["tires"], list: [car["tires"]], tuning: [0, 0, 0] };
  if (car["tires"].includes("Racing")) {
    tires["list"].push("Racing: Intermediate");
    tires["list"].push("Racing: Heavy Wet");
  }
  if (car["tires"].includes("Dirt")) {
    tires["list"].push("Rally: Snow");
    tires["list"].push("Racing: Hard");
    tires["list"].push("Racing: Intermediate");
    tires["list"].push("Racing: Heavy Wet");
  }
  if (car["tires"].includes("Snow")) {
    tires["list"].push("Rally: Dirt");
    tires["list"].push("Racing: Hard");
    tires["list"].push("Racing: Intermediate");
    tires["list"].push("Racing: Heavy Wet");
  }
  var engine = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var trans = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var susp = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var weight = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var turbo = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var brakes = { current: "Default", list: [], tuning: [-999, -999, -999] };
  var aerokits = { current: "Default", list: [], tuning: [-999, -999, -999] };

  var condition = { oil: car["condition"], clean: car["condition"], engine: car["condition"], transmission: car["condition"], suspension: car["condition"], body: car["condition"] };

  var fpp = gte_PERF.perfEnthu(car, "DEALERSHIP")["fpp"];

  if (arg != "LOAN") {
    userdata["stats"]["numcarpurchases"]++;
    var id1 = userdata["stats"]["numcarpurchases"];
  } else {
    var id1 = 0;
  }
  var newcar = {
    id: id1,
    name: fullname,
    make: car["make"],
    year: car["year"],
    color: { current: "Default" },
    livery: { current: "Default" },
    fpp: fpp,
    perf: {
      level: 1,
      points: 0,
      engine: engine,
      transmission: trans,
      suspension: susp,
      tires: tires,
      weightreduction: weight,
      turbo: turbo,
      aerokits: aerokits,
      brakes: brakes,
      carengine: { current: "Default", list: [], tuning: [-999, -999, -999] },
      nitrous: { current: "Default", tuning: [-999, -999, -999] },
      items: [],
    },
    rims: { current: "Default", list: [], tuning: [-999, -999, -999] },
    condition: condition,
    totalmileage: 0,
  };
  newcar["fpp"] = gte_PERF.perfEnthu(newcar, "GARAGE")["fpp"];

  if (arg == "ITEM" || arg == "LOAN") {
    return newcar;
  } else {
    userdata["garage"].push(newcar);
    if (arg == "SORT") {
      userdata["garage"] = gte_STATS.sortGarage(userdata);
    }
    if (arg == "FORCECHANGE") {
      userdata["currentcar"] = userdata["garage"].filter(function(x) {
          var year = gtf_CARS.get({ make: x["make"], fullname: x["name"]})["year"]
          var upperyear = [1989, 2009, 9999][userdata["settings"]["GMODE"]]
          var loweryear = [1960, 1990, 2010][userdata["settings"]["GMODE"]]
          return (loweryear <= year && upperyear >= year)
      }).length
      gte_STATS.setCurrentCar(
        userdata["currentcar"],
        [
          function (x) {
            var year = gtf_CARS.get({ make: x["make"], fullname: x["name"] })["year"];
            var upperyear = [1989, 2009, 9999][userdata["settings"]["GMODE"]];
            var loweryear = [1960, 1990, 2010][userdata["settings"]["GMODE"]];
            return loweryear <= year && upperyear >= year;
          }
        ],
        userdata
      );
      //userdata["garage"] = gte_STATS.sortGarage(userdata);
    }
    return;
  }
};
