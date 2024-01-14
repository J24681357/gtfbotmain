// REMOTE
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.list = function(args) {
  var gtfcars = gtf_LIST_CARS;
  var results = "";
  if (args.length == 0) {
    return results;
  }
  if (args == "all") {
    return gtfcars;
  }
  if (args == "makes") {
    results = Object.keys(gtfcars).map(function(x) {
      if (x == 'bac') {
        return "BAC"
      }
      if (x == 'bmw') {
        return "BMW"
      }
      if (x == 'deltawing') {
        return "DeltaWing"
      }
      if (x == "ford-au") {
        return "Ford AU"
      }
      if (x == "hks") {
        return "HKS"
      }
      if (x == "ktm") {
        return "KTM"
      }
      if (x == "tvr") {
        return "TVR"
      }
      if (x == "ruf") {
        return "RUF"
      }
      if (x == "seat") {
        return "SEAT"
      }
      if (x == "sema-gt") {
        return "SEMA GT"
      }
      return x
        .split("-")
        .map(name => name.charAt(0).toUpperCase() + name.slice(1))
        .join();
    }).sort();
    return results;
  }
  if (args == "countries") {
    results = []

    for (var i = 0; i < Object.keys(gtfcars).length; i++) {
      var make = gtfcars[Object.keys(gtfcars)[i]]
      if ((make[0]["country"] in results)) {
      } else {
        results.push(make[0]["country"])
      }
    }
    results = gtf_TOOLS.unique(results)
  }
  if (args == "drivetrains") {
    results = ["FF", "FR", "4WD", "4WD-MR", "MR", "RR"];
  }
  if (args == "types") {
    results = []

    for (var i = 0; i < Object.keys(gtfcars).length; i++) {
      var make = gtfcars[Object.keys(gtfcars)[i]]
      if ((make[0]["type"] in results)) {
      } else {
        results.push(make[0]["type"])
      }
    }
    results = gtf_TOOLS.unique(results)
  }

  return results.sort();
};

module.exports.stats = function(embed) {
  var results = ""
  var list = gtf_CARS.list("all")
  var countries = {}
  var types = {}
  var total = 0
  var maketotal = 0
  for (var i = 0; i < Object.keys(list).length; i++) {
    var make = list[Object.keys(list)[i]]
    maketotal++
    for (var j = 0; j < make.length; j++) {
      total++
      var car = make[j]
      if (car["country"] in countries) {
        countries[car["country"]]++
      } else {
        countries[car["country"]] = 1
      }
      if (car["type"] in types) {
        types[car["type"]]++
      } else {
        types[car["type"]] = 1
      }
    }
  }
  countries = Object.keys(countries).sort().reduce(
    (obj, key) => {
      obj[key] = countries[key];
      return obj;
    },
    {}
  );
  types = Object.keys(types).sort().reduce(
    (obj, key) => {
      obj[key] = types[key];
      return obj;
    },
    {}
  );
  var fcountries = []
  var ftypes = []
  for (var key = 0; key < Object.keys(countries).length; key++) {
    fcountries.push("**" + Object.keys(countries)[key] + ":** " + countries[Object.keys(countries)[key]])
  }
  var racecar = false
  var rallycar = false
  var totalr = 0
  for (var key = 0; key < Object.keys(types).length; key++) {
    if (Object.keys(types)[key].includes("Race Car")) {
      if (racecar) {
        continue;
      }
      racecar = true
      totalr = Object.entries(types).filter(([key]) => key.includes('Race')).map(x => x[1]).reduce((a, b) => a + b)
      ftypes.push("**Race Car:** " + totalr)
    } else if (Object.keys(types)[key].includes("Rally Car")) {
      if (rallycar) {
        continue;
      }
      rallycar = true
      totalr = Object.entries(types).filter(([key]) => key.includes('Rally')).map(x => x[1]).reduce((a, b) => a + b)
      ftypes.push("**Rally Car:** " + totalr)
    } else {
      ftypes.push("**" + Object.keys(types)[key] + ":** " + types[Object.keys(types)[key]])
    }
  }

  results =
    "**Total Manufacturers:** " +
    maketotal +
    "\n" +
    "**Total Cars:** " +
    total
  embed.setDescription(results);
  embed.addFields([{ name: "__Type__", value: ftypes.join("\n"), inline: true }, { name: "__Country__", value: fcountries.join("\n"), inline: true }])
}

module.exports.find = function(args) {
  var gtfcars = gtf_LIST_CARS

  if (args === undefined) {
    return "";
  }

  if (args["sort"] !== undefined) {
    var sort = args["sort"];
    delete args["sort"];
  }

  var total = Object.keys(args).length;
  var final = [];
  var makes = Object.keys(gtfcars);
  var carid = 0

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
          var x = parseInt(makekey[i]["year"])
          if (upperyear >= x) {
            count++
          }
        }
      }

      if (args["loweryear"] !== undefined) {
        if (args["loweryear"].length == 0) {
          count++;
        } else {
          var loweryear = args["loweryear"];
          var x = parseInt(makekey[i]["year"])
          if (loweryear <= x) {
            count++
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
          var x = makekey[i]["carcostm"]
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
          var x = makekey[i]["carcostm"]
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



  ///sorting
  final.sort(function(a, b) {
    if (typeof sort !== 'undefined') {
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
  final.map(function(x, i) {
    x["id"] = i;
  });

  return JSON.parse(JSON.stringify(final));
};

module.exports.get = function(args) {
  var make = args["make"].toLowerCase().replace(/ /g, "-")
  var makelist = gtf_LIST_CARS[make]
  var car = makelist.find(function(x) {
    var name = x["name"] + " " + x["year"]
    return name.includes(args["fullname"])
  })
  return car
};

module.exports.random = function(args, num) {
  var seed = -1
  if (typeof args["seed"] !== "undefined") {
    seed = args["seed"]
    delete args["seed"]
  }
  var rlist = [];
  var list = gtf_CARS.find(args);
  for (var i = 0; i < num; i++) {
    if (seed == -1) {
      rlist.push(list[Math.floor(Math.random() * list.length)]);
    } else {
      rlist.push(list[gtf_MATH.randomIntSeed(0, list.length - 1, seed)])
    }
  }
  return rlist;
};

module.exports.shortName = function(fullname) {
  fullname = fullname.split(" ")
  var year = fullname.pop()
  if (fullname.join(" ").length <= 45) {
    return fullname.join(" ") + " " + year
  } else {
    fullname = fullname.join(" ").substring(0, 41) + "... " + year
    return fullname
  }
}

module.exports.checkCar = function(carname, userdata) {
  if (userdata["garage"].some(x => x["name"] === carname)) {
    return " ✅";
  } else {
    return "";
  }
};

module.exports.addCar = function(car, arg, userdata) {
  var fullname = car["name"] + " " + car["year"];

  if (arg != "LOAN") {
    if (gtf_STATS.garage(userdata).length == 0) {
      gtf_STATS.setCurrentCar(1, undefined, userdata);
      userdata["currentcar"]++;
    }
  }
  car["condition"] = 100

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

  var condition = { oil: car["condition"], clean: car["condition"], engine: car["condition"], transmission: car["condition"], suspension: car["condition"], body: car["condition"] }

  var fpp = gtf_PERF.perf(car, "DEALERSHIP")["fpp"];
  var sell = gtf_GTFAUTO.sellCalc(car);
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
      items: []
    },
    rims: { current: "Default", list: [], tuning: [-999, -999, -999] },
    condition: condition,
    totalmileage: 0
  };
  newcar["fpp"] = gtf_PERF.perf(newcar, "GARAGE")["fpp"];


  if (arg == "ITEM" || arg == "LOAN") {
    return newcar;
  } else {
    userdata["garage"].push(newcar);
    if (arg == "SORT") {
      userdata["garage"] = gtf_STATS.sortGarage(userdata);
    }
    gtf_STATS.save(userdata);
    return;
  }
};


module.exports.costCalc = function(car, fpp, discount) {
  if (car["carcostm"] <= 0.25) {
    return (10000 * car["carcostm"]) - ((10000 * car["carcostm"]) * (car["discount"] / 100))
  }
  var cost = car["carcostm"] * 10000;

  if (fpp == undefined) {

  } else {
    var offset = fpp - 250;
    if (offset < 0) {
      cost = -((-offset) ** 1.8) + cost;
    } else {
      cost = offset ** 1.8 + cost;
    }
  }
  cost = cost - (cost * (car["discount"] / 100))
  
  if (cost >= 1000000) {
    return Math.round(cost / 10000) * 10000;
  }
  if (cost >= 300000) {
    return Math.round(cost / 1000) * 1000;
  }
  
  return Math.round(cost / 100) * 100;
};

module.exports.costCalcRaw = function(car, fpp) {
  if (car["carcostm"] <= 0.25) {
    return (10000 * car["carcostm"]) - ((10000 * car["carcostm"]) * (car["discount"] / 100))
  }
  var cost = car["carcostm"] * 10000;

  if (fpp == undefined) {

  } else {
    var offset = fpp - 250;
    if (offset < 0) {
      cost = -((-offset) ** 1.8) + cost;
    } else {
      cost = offset ** 1.8 + cost;
    }
  }

  return Math.round(cost / 100) * 100;
};


//////////////
module.exports.audit = async function() {
  var gtfcars = gtf_LIST_CARS;
  var fs = require("fs");
  var newcars = [];
  var fppupdate = [];

  var index = 0;
  var makes = Object.keys(gtfcars);

  for (var make = 0; make < makes.length; make++) {
    var group = [];
    for (var i = 0; i < gtfcars[makes[make]].length; i++) {
      index++
      var car = gtfcars[makes[make]][i];
      car["_id"] = index

      var totalimages = car["image"].length;
      var makee = car["make"].replace(/ /gi, "").toLowerCase();
      var name = car["name"].replace(/ /gi, "").toLowerCase();
      car["special"] = car["special"].sort()

      for (var j = 0; j < totalimages; j++) {

        if (!car["image"][j].includes("raw.githubusercontent.com") && !car["image"][j].includes("github.com")) {
          if (j >= 1) {
            newcars.push(car["name"] + " " + car["year"] + " - " + j);
          } else {
            newcars.push(car["name"] + " " + car["year"]);
          }
          var oldcar = JSON.parse(JSON.stringify(car));
          await downloadimage2(oldcar, oldcar["image"][j], j);
          if (j >= 1) {
            var extra = "-" + j.toString();
          } else {
            var extra = "";
          }
          var urll = "https://raw.githubusercontent.com/J24681357/gtfbotmain/master/gtfbot2unleahsed/" + "images/cars/" + makee + "/" + name + "" + car["year"] + extra + ".png";
          car["image"][j] = urll;
        }
        delete car["id"];
      }
      /*
      var perf = gtf_PERF.perf(car, "DEALERSHIP")
      fppupdate.push(car["name"] + " " + car["year"] + " - " + perf["fpp"] + "->" + perf["nfpp"])
      */
      
      group.push(car);
    }
    group = group.sort((a, b) => a["name"].toString().localeCompare(b["name"]));
    gtfcars[makes[make]] = group;

  }

  fs.writeFile("./jsonfiles/gtfcarlist.json", require("json-format")(gtfcars), function(err) {
    if (err) {
      console.log(err);
    }
  });



  fs.writeFile("./jsonfiles/newcars.json", JSON.stringify(newcars), function(err) {
    if (err) {
      console.log(err);
    }
  });

  fs.writeFile("./jsonfiles/fppupdate.json", JSON.stringify(fppupdate), function(err) {
    if (err) {
      console.log(err);
    }
  });

  if (newcars.length == 0) {
    console.log("No new cars.")
  }
  async function downloadimage2(oldcar, imagelink, j) {
    var { request } = require("undici");
    var type = "error";
    var name = oldcar["name"].replace(/ /gi, "").toLowerCase();
    var make = oldcar["make"].replace(/ /gi, "").toLowerCase();
    var download2 = async function(uri, filename, callback) {
      try {
        var { statusCode, headers, trailers, body } = await request(uri);
        body = await body.arrayBuffer();
      } catch (error) {
        console.log("The image may not be available for " + uri);
        return;
      }

      if (headers === undefined) {
        console.log("The image may not be available for " + uri);
        return;
      }
      if (headers["content-type"] === undefined) {
        console.log("The image may not be available for " + uri);
        return;
      }

      var type = headers["content-type"].toLowerCase();
      var file = filename.split("/");
      file.pop();
      if (j >= 1) {
        var extra = (filename = filename + "-" + j.toString() + ".png");
      } else {
        filename = filename + ".png";
      }

      var shell = require("shelljs");
      shell.mkdir("-p", file.join("/"));
      console.log(filename + " " + "image saved.");
      if (!type.includes("image")) {
        console.log("The image may not be available for " + uri);
      }
      fs.writeFileSync(filename, Buffer.from(body));
    };

    await download2(imagelink, "./images/cars/" + make + "/" + name + "" + oldcar["year"], function() { });

    //download2(imagelink, "", function () {});
  }
};
