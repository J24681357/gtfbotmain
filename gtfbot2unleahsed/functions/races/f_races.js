const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.prepRace = function(raceprep, gtfcar, embed, msg, userdata) {
  var embed = new EmbedBuilder();
  raceprep["modearg"] = raceprep["modearg"].toString();
  var racesettings = gtf_RACE.setRaceSettings(raceprep, gtfcar, embed, msg, userdata);
  var carname = racesettings["driver"]["car"]["name"]

  if (raceprep["mode"] == "CAREER") {
    embed.fields = [];
  }
  else if (raceprep["mode"] == "ONLINE") {
    embed.fields = [];

    var racesettings = raceprep["racesettings"];
    racesettings["grid"] = racesettings["players"].length;
    racesettings["title"] = "__Online Lobby__"
    var finalgrid = racesettings["players"]
    racesettings["positions"] = [{ place: '1st', credits: 1000 },
    { place: '2nd', credits: 800 },
    { place: '3rd', credits: 600 },
    { place: '4th', credits: 500 },
    { place: '5th', credits: 400 },
    { place: '6th', credits: 300 },
    { place: '7th', credits: 200 },
    { place: '8th', credits: 100 }]
    racesettings["driver"] = { loading: racesettings["title"] };
  }
  var finalgrid = raceprep["players"].length == 0 ? gtf_RACE.createGrid(racesettings, "") : raceprep["players"];

  var prerace = gtf_RACE.preRaceMenu(racesettings, embed, msg, userdata)

  var results = prerace[0]
  var racedetails = prerace[1]
  var msgjson = prerace[2]

  if (racesettings["type"] == "TIMETRIAL") {
    gtf_RACEEX.timetrialracelength(racesettings, racedetails, finalgrid, true, 50 - (racesettings["difficulty"] / 2), embed, msg, userdata);
    var prizemoney = [gtf_EMOTE.goldmedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][0]["time"] * 1000), gtf_EMOTE.silvermedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][1]["time"] * 1000), gtf_EMOTE.bronzemedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][2]["time"] * 1000)]
  }
  else {
    var prizemoney = racesettings["positions"].slice(0, 3).map(function(x) {
      var credits = gtf_MATH.numFormat(x["credits"])
      return x["place"] + " " + credits + gtf_EMOTE.credits;
    });
  }

  var loading = gtf_GTF.loadingText("__**" + racesettings["title"] + "**__" + "\n" +
    "**" + racesettings["track"]["name"] + "\n" + prizemoney.join(" ") + "**", carname);

  embed.setDescription(loading);
  var screen = true
  var emojilist = [
    {
      emoji: gtf_EMOTE.flag,
      emoji_name: 'flag',
      name: 'Start',
      extra: "",
      button_id: 0
    },
    {
      emoji: gtf_EMOTE.tracklogo,
      emoji_name: "trackgtfitness",
      name: 'Grid/Session Details',
      extra: "",
      button_id: 1
    }]
  var button_id = 2
  if (racesettings["mode"] == "ONLINE" || racesettings["type"] == "TIMETRIAL") {
  } else {
    emojilist.push({
      emoji: gtf_EMOTE.tire,
      emoji_name: "tire",
      name: 'Optimal Tire Usage | On',
      extra: "",
      button_id: button_id
    })
    button_id++
  }
  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
  if (racesettings["mode"] != "ONLINE" && racesettings["type"] != "TIMETRIAL" && !racesettings["track"]["type"].includes("Dirt") && !racesettings["track"]["type"].includes("Snow") && raceprep["carselect"] == "GARAGE") {
    var tireslist = racesettings["driver"]["car"]["perf"]["tires"]["list"].filter(function(tire) {
      return gtf_GTF.checkTireRegulations(racesettings["driver"]["car"], { tires: tire }, "", embed, msg, userdata)[0]
    }).sort()
    var tmenulist = tireslist.map(function(tire, index) {
      return {
        emoji: "",
        name: tire,
        description: "",
        menu_id: (index)
      }
    })
    var temojilist = []
    var menu = gtf_TOOLS.prepareMenu("Change Tires " + "(" + racesettings["driver"]["car"]["perf"]["tires"]["current"] + ")", tmenulist, temojilist, msg, userdata);
    buttons.unshift(menu)
  }
  embed.setColor(userdata["settings"]["COLOR"])
  var user = msg.user.displayName;
  embed.setAuthor({ name: user, iconURL: msg.user.displayAvatarURL() });


  ////DEBUG
  ////DEBUG

  gtf_DISCORD.send(msg, msgjson, preracefunc, true)
  function preracefunc(msg) {
    var results2 = ""
    setTimeout(function() {
      embed.setDescription(results + racedetails);
      if (racesettings["mode"] != "ONLINE") {
        var condition = gtf_CONDITION.condition(racesettings["driver"]["car"])
        embed.setFields([{
          name: gtf_STATS.menuFooter(userdata),
          value: condition["emote"] + " `" + condition["health"] + "%` " + gtf_CARS.shortName(racesettings["driver"]["car"]["name"]) +
            " " + "**" + racesettings["driver"]["car"]["fpp"] + gtf_EMOTE.fpp + "**"
        }]);
      }

      msg.edit({ embeds: [embed], components: buttons }).then(msg => {
        userdata["raceinprogress"] = {
          active: false,
          messageid: "",
          channelid: "",
          expire: undefined,
          gridhistory: [],
          msghistory: [],
          timehistory: [], weatherhistory: [], championshipnum: 0
        }

        function flagstartrace() {
          if (userdata["raceinprogress"]["active"]) {
            require((gtf_TOOLS.homedir() +  "commands/status").execute(msg, { options: "exit" }, userdata);
          } else {
            embed.spliceFields(0, 1);
            try {
              gtf_RACES2.startSession(racesettings, racedetails, finalgrid, [false, null], embed, msg, userdata);
            } catch (error) {
              embed = new EmbedBuilder();
              gtf_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**" + "\n\n" + "Check the Known Issues in <#687872420933271577> to see if this is documented.", embed: "", seconds: 0 }, msg, userdata);
              console.error(error);
            }
            return
          }
        }
        function trackdetails() {
          if (screen == true) {
            screen = false
            var griddd = finalgrid.slice().map(function(x) {
              if (x["user"]) {
                return "**" + x["position"] + ". " + gtf_CARS.shortName(x["name"]) + "**" + " `" + x["drivername"] + "`";
              } else {
                return x["position"] + ". " + gtf_CARS.shortName(x["name"]) + " `" + x["drivername"] + "`";
              }
            })
            if (griddd.length >= 10) {
              griddd = griddd.slice(0, 7).concat(griddd.slice(griddd.length - 3))
            }
            var bop = ""
            if (racesettings["bop"]) {
              bop = " " + gtf_EMOTE.bop
            }
            results2 =
              "__**Starting Grid" +
              " | " +
              racesettings["grid"] +
              " Cars" +
              "**__" + bop +
              "\n" +
              griddd.join("\n");

            embed.setDescription(results2);
            msg.edit({ embeds: [embed], components: buttons });
          } else {
            screen = true
            embed.setDescription(results + racedetails);
            msg.edit({ embeds: [embed], components: buttons });
          }
        }
        function tirechangen() {
          if (racesettings["driver"]["tirechange"]) {
            racesettings["driver"]["tirechange"] = false
            emojilist[2]["name"] = "Optimal Tire Usage | Off"
            buttons = gtf_TOOLS.prepareButtons(emojilist.filter(x => typeof x["menu_id"] === "undefined"), msg, userdata);
            buttons.unshift(menu)
            msg.edit({ embeds: [embed], components: buttons });
          } else {
            racesettings["driver"]["tirechange"] = true
            emojilist[2]["name"] = "Optimal Tire Usage | On"
            buttons = gtf_TOOLS.prepareButtons(emojilist.filter(x => typeof x["menu_id"] === "undefined"), msg, userdata);
            buttons.unshift(menu)
            msg.edit({ embeds: [embed], components: buttons });
          }
        }

        if (racesettings["mode"] == "ONLINE" || racesettings["type"] == "TIMETRIAL") {
          var functionlist = [flagstartrace, trackdetails]
        } else {
          var functionlist = [flagstartrace, trackdetails, tirechangen]
        }

        if (racesettings["mode"] != "ONLINE" && racesettings["type"] != "TIMETRIAL" && !racesettings["track"]["type"].includes("Dirt") && !racesettings["track"]["type"].includes("Snow") && raceprep["carselect"] == "GARAGE") {
          var functionlist2 = []
          for (var j = 0; j < tmenulist.length; j++) {
            functionlist2.push(function(int) {
              racesettings["driver"]["car"]["perf"]["tires"]["current"] = tireslist[int]
              racesettings["driver"]["otires"] = tireslist[int]
            })
          }
          emojilist = emojilist.concat(temojilist)
          functionlist = functionlist.concat(functionlist2)
        }

        gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
      });
    }, 3000)
  }
}

module.exports.setRaceSettings = function(raceprep, gtfcar, embed, msg, userdata) {

  var carselect = raceprep["car"] == "GARAGE" ? gtfcar : gtf_CARS.addCar(gtf_CARS.find({ fullnames: [raceprep["car"]] })[0], "LOAN")

  if (typeof raceprep["track"] == "string") {
    var track = gtf_TRACKS.find({ name: [raceprep["track"]] })[0];
    var km = track["length"]
  } else {
    if (typeof raceprep["track"]["layout"] === 'undefined') {
      var track = gtf_TRACKS.random(raceprep["track"], 1)[0];
      var km = track["length"];
    } else {
      var track = raceprep["track"]
      var km = track["lengthkm"]
    }
  }

  if (Object.keys(raceprep["racesettings"]).length != 0) {
    racesettings = raceprep["racesettings"];
    if (raceprep["mode"] == "ARCADE" && raceprep["modearg"].includes("custom")) {
    } else {
      racesettings["time"] = gtf_TIME.random({ name: racesettings["time"], timeprogression: racesettings["timeprogression"] }, 1)[0];
      racesettings["weather"] = gtf_WEATHER.random({ name: racesettings["weather"], weatherchange: racesettings["weatherchange"], wetsurface: racesettings["weatherwetsurface"] }, 1)[0];
    }

    racesettings["track"] = track
    racesettings["image"] = track["image"]
    racesettings["driver"] = { name: msg.user.username, car: carselect, otires: carselect["perf"]["tires"]["current"].slice(), tirechange: true }
    if (racesettings["type"] == "TIME") {
      racesettings["distance"] = { km: "N/A", mi: "N/A" }
    }
    else if (racesettings["type"] == "TIMETRIAL") {
      var km = gtf_MATH.round(track.length * (parseFloat(racesettings["laps"].split("%")[0]) / 100), 3)
      racesettings["distance"] = { km: km, mi: gtf_MATH.convertKmToMi(km) }
    } else if (racesettings["type"] == "DRIFT") {
      //racesettings["laps"] = "75%"
      var km = gtf_MATH.round(track.length * (parseFloat(racesettings["laps"].split("%")[0]) / 100), 3)
      racesettings["distance"] = { km: km, mi: gtf_MATH.convertKmToMi(km) }

      racesettings["grid"] = 1;

      racesettings["originalsectors"] = 3;
      racesettings["sectors"] = 3;
      racesettings["current"] = 0;
      racesettings["points"] = 0;
    } else {
      if (racesettings["track"]["layout"] == "sprint") {
        racesettings["laps"] = 1
      }
      km = gtf_MATH.round((racesettings["laps"] * km), 3)
      racesettings["distance"] = { km: km, mi: gtf_MATH.convertKmToMi(km) }
    }
    return racesettings
  } else {
    var racesettings = {
      title: "",
      eventid: "",
      raceid: 1,
      image: track["image"],
      mode: raceprep["mode"],
      type: "",

      bop: false,
      championship: false,
      damage: false,

      grid: 1,
      gridstart: "STANDING",
      startposition: 1,
      positions: [],
      driver: {
        name: msg.user.displayName,
        car: carselect,
        otires: carselect["perf"]["tires"]["current"].slice(), tirechange: true
      },
      time: {},
      timeprogression: 1,
      weather: {},
      weatherwetsurface: "R",
      weatherchange: 0,
      tireconsumption: 0,
      fuelconsumption: 0,
      track: track,
      laps: 0,
      distance: { km: 0, mi: 0 },

      regulations: {
        "tires": "",
        "fpplimit": 9999,
        "upperfpp": 9999,
        "lowerfpp": 0,
        "upperpower": 9999,
        "lowerpower": 0,
        "upperweight": 9999,
        "lowerweight": 0,
        "upperyear": 9999,
        "loweryear": 0,
        "countries": [],
        "makes": [],
        "models": [],
        "engines": [],
        "drivetrains": [],
        "types": [],
        "special": [],
        "prohibited": []
      },
      difficulty: 100
    }
  }

  if (raceprep["mode"] == "ARCADE") {
    if (raceprep["modearg"].includes("custom")) {
      var difficulty = parseInt(raceprep["modearg"].split("_")[1])
      raceprep["racesettings"]["difficulty"] = difficulty
      return raceprep["racesettings"]
    }
    if (raceprep["modearg"] == "beginner") {
      var limit = 8.0;
      racesettings["title"] = "Single Race - Beginner";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = gtf_MATH.randomInt(8, 12)
      racesettings["difficulty"] = 90;
    }
    else if (raceprep["modearg"] == "amateur") {
      var limit = 12.0;
      racesettings["title"] = "Single Race - Amateur";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = gtf_MATH.randomInt(10, 16)
      racesettings["difficulty"] = 70;
    }
    else if (raceprep["modearg"] == "professional" || raceprep["modearg"] == "pro") {
      var limit = 20.0;
      racesettings["title"] = "Single Race - Professional";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = gtf_MATH.randomInt(14, 20)
      racesettings["difficulty"] = 60;
    }
    else if (raceprep["modearg"] == "endurance") {
      var limit = ["30m", "45m", "60m", "90m", "120m"];
      limit = limit[Math.floor(Math.random() * limit.length)];
      racesettings["type"] = "TIME";
      racesettings["grid"] = 24
      racesettings["difficulty"] = 40;
      racesettings["title"] = "Single Race - " + limit + " of " + track["name"];
    }
    else if (raceprep["modearg"] == "driftbeginner") {

      var limit = 1.0;
      racesettings["title"] = "Drift Trial - Beginner";
      racesettings["type"] = "DRIFT";
      racesettings["grid"] = 1
      racesettings["difficulty"] = 75;

      racesettings["originalsectors"] = 3;
      racesettings["sectors"] = 3;
      racesettings["current"] = 0;
      racesettings["points"] = 0;
    } else if (raceprep["modearg"] == "driftprofessional") {
      var limit = 2.0;
      racesettings["title"] = "Drift Trial - Professional";
      racesettings["type"] = "LAPS";
      racesettings["grid"] = 1
      racesettings["difficulty"] = 65;

      racesettings["originalsectors"] = 6;
      racesettings["sectors"] = 6;
      racesettings["current"] = 0;
      racesettings["points"] = 0;
    }
    racesettings["regulations"]["types"] = [gtf_CARS.get({ make: carselect["make"], fullname: carselect["name"] })["type"].split(":")[0]]
    racesettings["regulations"]["upperfpp"] = carselect["fpp"] + 30
    racesettings["regulations"]["lowerfpp"] = carselect["fpp"] - 50
  }
  else if (raceprep["mode"] == "SSRX") {
    var limit = 0.01;
    racesettings["title"] = "Special Stage Route X - " + gtf_MATH.numFormat(raceprep["modearg"]) + "m Top Speed Run";
    racesettings["type"] = "LAPS";
    racesettings["grid"] = 1
    racesettings["difficulty"] = 100;
  }
  else if (raceprep["mode"] == "TIMETRIAL") {
    var title = "Time Trial " + raceprep["modearg"] + " - " + raceprep["track"]["name"];
    var type = "TIMETRIAL";
    var limit = 0.01;
    var time = gtf_TIME.random({ name: ["Day"] }, 1)[0];
    var weather = gtf_WEATHER.random({ name: ["Clear", "Partly Cloudy", "Cloudy"] }, 1)[0];
    var grid = ["1"];
    var category = ["CUSTOM"];
    var chance = 0;
  }
  else if (raceprep["mode"] == "CUSTOM") {
    var limit = 8.0
    racesettings["difficulty"] = 90
    racesettings["type"] = "LAPS";
    racesettings["grid"] = gtf_MATH.randomInt(6, 12)
    if (raceprep["modearg"] != "random_free") {

      racesettings["regulations"]["types"] = [gtf_CARS.get({ make: carselect["make"], fullname: carselect["name"] })["type"].split(":")[0]]
      racesettings["regulations"]["upperfpp"] = carselect["fpp"] + 30
      racesettings["regulations"]["lowerfpp"] = carselect["fpp"] - 50
    }
  }
  else if (raceprep["modearg"] == "R" || raceprep["modearg"] == "ONLINE") {
    var title = "ONLINE LOBBY";
    var type = "LAPS";
    var track = gtf_TRACKS.random({ types: ["Tarmac"] }, 1)[0];
    var km = track["length"];
    var limit = 0;
    var time = gtf_TIME.random({}, 1)[0];
    var weather = gtf_WEATHER.random({}, 1)[0];
    var grid = [["ONLINE"]];
    var place = ["ONLINE"];
    var chance = 50;
  }

  if (track["layout"] == "sprint") {
    limit = 0.01
  }
  if (!isNaN(limit)) {
    var distance = gtf_RACE.lapCalc(km, limit);
  } else {
    distance = [limit, "N/A"];
  }

  racesettings["laps"] = distance[0]
  racesettings["distance"] = { km: distance[1], mi: gtf_MATH.convertKmToMi(distance[1]) }
  racesettings["time"] = gtf_TIME.random({}, 1)[0];
  racesettings["weather"] = gtf_WEATHER.random({}, 1)[0];

  if (racesettings["mode"] == "SSRX") {

    var km = gtf_MATH.round(raceprep["modearg"] / 1000, 3)
    racesettings["distance"] = {
      km: km,
      mi: gtf_MATH.convertKmToMi(km)
    }
  }


  if (raceprep["mode"] != "CUSTOM") {
    racesettings["positions"] = gtf_RACE.creditsCalc(racesettings, raceprep)
  }
  return racesettings;
};

module.exports.createGrid = function(racesettings, special) {
  var count = racesettings["grid"]
  var car = racesettings["driver"]["car"]
  var username = racesettings["driver"]["name"]
  var bop = racesettings["bop"]

  var regulations = racesettings["regulations"]
  var object = {
    makes: regulations["makes"], names: regulations["models"], drivetrains: regulations["drivetrains"], engines: regulations["engines"], 
types: regulations["types"], countries: regulations["countries"], upperfpp: regulations["upperfpp"], lowerfpp: regulations["lowerfpp"], upperpower: regulations["upperpower"], lowerpower: regulations["lowerpower"], upperweight: regulations["upperweight"], lowerweight: regulations["lowerweight"], upperyear: regulations["upperyear"], loweryear: regulations["loweryear"], special: regulations["special"], prohibited: regulations["prohibited"]
  }

  if (count == 1) {
    fpp = gtf_PERF.perf(car, "GARAGE")["fpp"]
    var finalgrid = [{ place: 1, position: 1, drivername: username, name: car["name"], damage: 0, tires: car["perf"]["tires"]["current"].slice(), otires: car["perf"]["tires"]["current"].slice(), tirewear: 100, fuel: 100, fueleco: 100, pitstops: 0, user: true, fpp: fpp, oscore: 0, score: 0, points: 0, laps: [] }];

    return finalgrid;
  }


  if (racesettings["mode"] == "ARCADE") {
    var test = gtf_CARS.find(object)
    while (object["lowerfpp"] >= 0) {
      if (test.length == 1 || test.length == 0) {
        object["upperfpp"] = object["upperfpp"] + 30
        object["lowerfpp"] = object["lowerfpp"] - 50
        test = gtf_CARS.find(object)
      }
      if (test.length >= 2) {
        break;
      }
    }
  }
  if (racesettings["mode"] == "CAREER") {
    var test = gtf_CARS.find(object)
    while (object["lowerfpp"] >= 0) {
      if (test.length >= 1) {
        break;
      }
      if (test.length == 0) {
        object["lowerfpp"] = object["lowerfpp"] - 50
        test = gtf_CARS.find(object)
      }
    }
  }
  var randomcars = gtf_CARS.random(object, count);

  var finalgrid = [];
  var index = 0;
  if (racesettings["startposition"] == 0) {
    var position = gtf_MATH.randomInt(2, count - 1);
  } else {
    var position = racesettings["startposition"]
  }
  var fpp = 0
  if (racesettings["gridstart"] == "ROLLINGSTART") {
    var scorep = 800
  } else {
    var scorep = 400
  }

  var score = randomcars.length * scorep
  for (var index = 0; index < randomcars.length; index++) {

    if (position == (index + 1) && special != "AI") {

      var temp = gtf_PERF.perf(car, "GARAGE")
      fpp = temp["fpp"]
      var fueleco = temp["fueleco"]
      finalgrid.push({
        place: index + 1,
        position: index + 1,
        drivername: username,
        name: car["name"],
        user: true,
        fpp: fpp,
        damage: 0,
        tires: car["perf"]["tires"]["current"],
        otires: car["perf"]["tires"]["current"],
        tirewear: 100,
        fuel: 100,
        fueleco: fueleco,
        pitstops: 0,
        oscore: score,
        score: score,
        points: 0,
        laps: []
      });
    } else {
      var temp = gtf_PERF.perf(randomcars[index], "DEALERSHIP")
      fpp = temp["fpp"];
      var fueleco = temp["fueleco"]
      if (racesettings["title"].includes("GTF Grand Tour") && (index + 1) == 1) {
        drivername = "J. Pumphrey"
      } else {
        var drivername = gtf_GTF.randomDriver()
      }
      finalgrid.push({
        place: index + 1,
        position: index + 1,
        drivername: drivername,
        name: randomcars[index]["name"] + " " + randomcars[index]["year"],
        user: false,
        fpp: fpp,
        damage: 0,
        tires: randomcars[index]["tires"],
        otires: randomcars[index]["tires"],
        tirewear: 100,
        fuel: 100,
        fueleco: fueleco,
        pitstops: 0,
        oscore: score,
        score: score,
        points: 0,
        laps: []
      });

    }
    score = score - scorep
  }
  if (bop) {
    var fppmed = gtf_MATH.median(finalgrid.slice().map(x => x["fpp"]))
    var ecomed = gtf_MATH.median(finalgrid.slice().map(x => x["fueleco"]))

    finalgrid.forEach(function(x) {
      if (x["fpp"] > fppmed + 10) {
        x["fpp"] = gtf_MATH.randomInt(fppmed, fppmed + 10)
      }
      if (x["fpp"] < fppmed - 10) {
        x["fpp"] = gtf_MATH.randomInt(fppmed - 10, fppmed)
      }
      if (x["eco"] > fppmed + 0.1) {
        x["fpp"] = gtf_MATH.randomInt(fppmed, fppmed + 0.1)
      }
      if (x["eco"] < fppmed - 0.1) {
        x["fpp"] = gtf_MATH.randomInt(fppmed - 0.1, fppmed)
      }
    });
  }

  return finalgrid;
};

module.exports.createGridEnthu = function(racesettings, special) {
  var count = racesettings["grid"]
  var car = racesettings["driver"]["car"]
  var username = racesettings["driver"]["name"]
  var bop = racesettings["bop"]

  var regulations = racesettings["regulations"]
  var object = {
    makes: regulations["makes"], names: regulations["models"], drivetrains: regulations["drivetrains"], engines: regulations["engines"], types: regulations["types"], countries: regulations["countries"], upperfpp: regulations["upperfpp"], lowerfpp: regulations["lowerfpp"], upperpower: regulations["upperpower"], lowerpower:  regulations["lowerpower"], upperweight: regulations["upperweight"], lowerweight: regulations["lowerweight"], upperyear: regulations["upperyear"], loweryear: regulations["loweryear"], special: regulations["special"], prohibited: regulations["prohibited"]
  }

  if (count == 1) {
    fpp = gtf_PERF.perf(car, "GARAGE")["fpp"]
    var finalgrid = [{ place: 1, position: 1, drivername: username, name: car["name"], damage: 0, tires: car["perf"]["tires"]["current"].slice(), otires: car["perf"]["tires"]["current"].slice(), tirewear: 100, fuel: 100, fueleco: 100, pitstops: 0, user: true, fpp: fpp, oscore: 0, score: 0, points: 0, laps: [] }];

    return finalgrid;
  }


  if (racesettings["mode"] == "ARCADE") {
    var test = gtf_CARS.find(object)
    while (object["lowerfpp"] >= 0) {
      if (test.length == 1 || test.length == 0) {
        object["upperfpp"] = object["upperfpp"] + 30
        object["lowerfpp"] = object["lowerfpp"] - 50
        test = gtf_CARS.find(object)
      }
      if (test.length >= 2) {
        break;
      }
    }
  }
  if (racesettings["mode"] == "CAREER") {
    var test = gtf_CARS.find(object)
    while (object["lowerfpp"] >= 0) {
      if (test.length >= 1) {
        break;
      }
      if (test.length == 0) {
        object["lowerfpp"] = object["lowerfpp"] - 50
        test = gtf_CARS.find(object)
      }
    }
  }
  var randomcars = gtf_CARS.random(object, count);


  var finalgrid = [];
  var index = 0;
  if (racesettings["startposition"] == 0) {
    var position = gtf_MATH.randomInt(2, count - 1);
  } else {
    var position = racesettings["startposition"]
  }
  var fpp = 0
  if (racesettings["gridstart"] == "ROLLINGSTART") {
    var scorep = 800
  } else {
    var scorep = 400
  }

  var score = randomcars.length * scorep
  for (var index = 0; index < randomcars.length; index++) {

    if (position == (index + 1) && special != "AI") {

      var temp = gtf_PERF.perf(car, "GARAGE")
      fpp = temp["fpp"]
      var fueleco = temp["fueleco"]
      finalgrid.push({
        place: index + 1,
        position: index + 1,
        drivername: username,
        name: car["name"],
        user: true,
        fpp: fpp,
        damage: 0,
        tires: car["perf"]["tires"]["current"],
        otires: car["perf"]["tires"]["current"],
        tirewear: 100,
        fuel: 100,
        fueleco: fueleco,
        pitstops: 0,
        oscore: score,
        score: score,
        points: 0,
        laps: []
      });
    } 
    else {
      var ccc = randomcars[index]
      if (gtf_MATH.randomInt(0,1) == 1) {
        var object2 = {...object}
        object2["lowerfpp"] =  object2["lowerfpp"] 
        object2["upperfpp"] = object2["upperfpp"] + 30
        ccc = gtf_CARS.random(object2, count)[0]
      }
      var temp = gtf_PERF.perf(ccc, "DEALERSHIP")
      fpp = temp["fpp"];
      var fueleco = temp["fueleco"]
      finalgrid.push({
        place: index + 1,
        position: index + 1,
        drivername: gtf_GTF.randomDriver(),
        name: ccc["name"] + " " + ccc["year"],
        user: false,
        fpp: fpp,
        damage: 0,
        tires: ccc["tires"],
        otires: ccc["tires"],
        tirewear: 100,
        fuel: 100,
        fueleco: fueleco,
        pitstops: 0,
        oscore: score,
        score: score,
        points: 0,
        laps: []
      });

    }
    score = score - scorep
  }
  if (bop) {
    var fppmed = gtf_MATH.median(finalgrid.slice().map(x => x["fpp"]))
    var ecomed = gtf_MATH.median(finalgrid.slice().map(x => x["fueleco"]))

    finalgrid.forEach(function(x) {
      if (x["fpp"] > fppmed + 10) {
        x["fpp"] = gtf_MATH.randomInt(fppmed, fppmed + 10)
      }
      if (x["fpp"] < fppmed - 10) {
        x["fpp"] = gtf_MATH.randomInt(fppmed - 10, fppmed)
      }
      if (x["eco"] > fppmed + 0.1) {
        x["fpp"] = gtf_MATH.randomInt(fppmed, fppmed + 0.1)
      }
      if (x["eco"] < fppmed - 0.1) {
        x["fpp"] = gtf_MATH.randomInt(fppmed - 0.1, fppmed)
      }
    });
  }

  return finalgrid;
};

module.exports.lapCalc = function(km, limit, seed) {
  var laps = 1;
  var totalkm = km;

  while (totalkm < limit) {
    totalkm = totalkm + km;
    laps++;
  }

  totalkm = Math.round(1000 * totalkm) / 1000;
  return [laps, totalkm];
};

module.exports.creditsCalc = function(racesettings, raceprep) {
  var positions = racesettings["positions"]

  if (racesettings["mode"] == "CAREER") {
    if (racesettings["type"] == "DRIFT") {
      return racesettings["positions"]
    }
    var positions = createpositions(parseInt(positions[0]["credits"]))
    return positions
  }
  else if (racesettings["mode"] == "ARCADE") {
    if (raceprep["modearg"] == "beginner") {
      var positions = createpositions(1000)
    }
    else if (raceprep["modearg"] == "amateur") {
      var positions = createpositions(3500)
    }
    else if (raceprep["modearg"] == "professional" || raceprep["modearg"] == "pro") {
      var positions = createpositions(10000)
    }
    else if (raceprep["modearg"] == "endurance") {
      var positions = createpositions(50000)
    }
    else if (raceprep["modearg"] == "driftbeginner") {
      var positions = [{ place: '1st', credits: 1000 },
      { place: '2nd', credits: 750 },
      { place: '3rd', credits: 400 },
      { place: '4th', credits: 100 }];
      for (var x = 0; x < positions.length; x++) {
        positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (racesettings["distance"]["km"] / 2)));
      }
      return positions
    }
    else if (raceprep["modearg"] == "driftprofessional") {
      var positions = [{ place: '1st', credits: 2000 },
      { place: '2nd', credits: 850 },
      { place: '3rd', credits: 500 },
      { place: '4th', credits: 250 }]
      for (var x = 0; x < positions.length; x++) {
        positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (racesettings["distance"]["km"] / 2)));
      }
      return positions
    }
    for (var x = 0; x < positions.length; x++) {
      if (racesettings["type"] == "TIME") {
        var fpp = gtf_PERF.perf(racesettings["driver"]["car"], "GARAGE")["fpp"];
        var numx = gtf_GTF.lengthAlpha(fpp, "0%", racesettings["track"]);
        var speed111 = gtf_PERF.speedCalcConstant(numx, racesettings["driver"]["car"]);
        speed111[1] = Math.round(speed111[0] / 1.4)
        var km = Math.round((parseInt(racesettings["laps"].split("m")[0]) / 60) * speed111[1])
        positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (km / 120)));
      } else {
        if (racesettings["laps"] <= 1) {
          positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] * (racesettings["distance"]["km"] / 10)));
        } else {

          positions[x]["credits"] = Math.round(parseFloat(positions[x]["credits"] + positions[x]["credits"] * (racesettings["distance"]["km"] / 50)));


        }
      }
    }
  }


  else if (racesettings["mode"] == "SSRX") {
    var positions = [{ place: "1st", credits: 0 }];
  }
  else if (raceprep["mode"] == "CUSTOM") {
    var positions = customcalc(racesettings, raceprep, finalgrid)
    return positions
  }

  return positions
  //216,000 - (216,000 * 0.30)
  function createpositions(startcredits) {
    var positions = []
    var percentagecut = 1
    for (var x = 0; x < 30; x++) {
      var temp = {}
      if (x % 10 == 0 && x + 1 != 11) {
        temp["place"] = (x + 1) + "st"
      } else if (x % 10 == 1 && x + 1 != 12) {
        temp["place"] = (x + 1) + "nd"
        percentagecut = percentagecut * (0.65)
      } else if (x % 10 == 2 && x + 1 != 13) {
        temp["place"] = (x + 1) + "rd"
        percentagecut = percentagecut * (0.77)
      } else {
        temp["place"] = (x + 1) + "th"
        percentagecut = percentagecut * (0.90)
      }
      temp["credits"] = startcredits * percentagecut
      temp["credits"] = Math.ceil(temp["credits"] / 10) * 10;
      positions.push(temp)
    }
    return positions
  }
  function customcalc(racesettings, raceprep, finalgrid) {
    var credits = ((100 - racesettings["difficulty"]) * 105) + (racesettings["grid"] - 8) * 200
    var positions = []
    for (var x = 0; x < racesettings["grid"]; x++) {
      var temp = {}
      if (x % 10 == 0 && x + 1 != 11) {
        temp["place"] = (x + 1) + "st"
      } else if (x % 10 == 1 && x + 1 != 12) {
        temp["place"] = (x + 1) + "nd"
      } else if (x % 10 == 2 && x + 1 != 13) {
        temp["place"] = (x + 1) + "rd"
      } else {
        temp["place"] = (x + 1) + "th"
      }

      if (racesettings["type"] == "TIME") {
        var fpp = gtf_PERF.perf(racesettings["driver"]["car"], "GARAGE")["fpp"];
        var numx = gtf_GTF.lengthAlpha(fpp, "0%", racesettings["track"]);
        var speed111 = gtf_PERF.speedCalcConstant(numx, racesettings["driver"]["car"]);
        speed111[1] = Math.round(speed111[0] / 1.4)
        var km = Math.round((parseInt(racesettings["laps"].split("m")[0]) / 60) * speed111[1])
        temp["credits"] = Math.round(parseFloat(credits * (km / 80)));
      } else {
        if (racesettings["laps"] <= 1) {

          temp["credits"] = Math.round(parseFloat(credits * (racesettings["distance"]["km"] / 10)));
        } else {
          var fpp = gtf_PERF.perf(racesettings["driver"]["car"], "GARAGE")["fpp"];

          var percentage = (1 - (fpp / 700)) / 5
          if (percentage <= 0) {
            percentage = 1 - Math.abs(percentage)
          } else {
            percentage = 1 + percentage
          }

          var minfpp = finalgrid.slice(0).sort((x, y) => x["fpp"] - y["fpp"])[0]["fpp"]
          if (minfpp >= fpp) {
            percentage = percentage
          } else {
            percentage = percentage - ((fpp - minfpp) * 0.0005)
          }
          if (percentage <= 0.5) {
            percentage = 0.5
          }
          temp["credits"] = Math.round(parseFloat(credits + credits * (racesettings["distance"]["km"] / 60)) * percentage);
        }
      }
      positions.push(temp)

      credits = Math.ceil((credits - (credits / (racesettings["grid"] / 2))) / 100) * 100;
    }
    return positions
  }
}

module.exports.customRaceCreditsCalc = function(racesettings, raceprep, finalgrid) {
  var positions = racesettings["positions"]
  var positions = customcalc(racesettings, raceprep, finalgrid)

  return positions
  function createpositions(startcredits) {
    var positions = []
    var percentagecut = 1
    for (var x = 0; x < 30; x++) {
      var temp = {}
      if (x % 10 == 0 && x + 1 != 11) {
        temp["place"] = (x + 1) + "st"
      } else if (x % 10 == 1 && x + 1 != 12) {
        temp["place"] = (x + 1) + "nd"
        percentagecut = percentagecut * (0.65)
      } else if (x % 10 == 2 && x + 1 != 13) {
        temp["place"] = (x + 1) + "rd"
        percentagecut = percentagecut * (0.77)
      } else {
        temp["place"] = (x + 1) + "th"
        percentagecut = percentagecut * (0.90)
      }
      temp["credits"] = startcredits * percentagecut
      temp["credits"] = Math.ceil(temp["credits"] / 10) * 10;
      positions.push(temp)
    }
    return positions
  }
  function customcalc(racesettings, raceprep, finalgrid) {
    //105
    if (racesettings["grid"] >= 9) {
      var credits = ((100 - racesettings["difficulty"]) * 105) + (racesettings["grid"] - 8) * 200
    } else {
      var credits = ((100 - racesettings["difficulty"]) * 105) + (((racesettings["grid"] - 1)) / 8) * 200
    }


    var positions = []
    for (var x = 0; x < racesettings["grid"]; x++) {
      var temp = {}
      if (x % 10 == 0 && x + 1 != 11) {
        temp["place"] = (x + 1) + "st"
      } else if (x % 10 == 1 && x + 1 != 12) {
        temp["place"] = (x + 1) + "nd"
      } else if (x % 10 == 2 && x + 1 != 13) {
        temp["place"] = (x + 1) + "rd"
      } else {
        temp["place"] = (x + 1) + "th"
      }

      if (racesettings["type"] == "TIME") {
        var fpp = gtf_PERF.perf(racesettings["driver"]["car"], "GARAGE")["fpp"];
        var numx = gtf_GTF.lengthAlpha(fpp, racesettings["weather"], racesettings["track"]);
        var speed111 = gtf_PERF.speedCalcConstant(numx, racesettings["driver"]["car"]);
        speed111[1] = Math.round(speed111[0] / 1.4)
        var km = Math.round((parseInt(racesettings["laps"].split("m")[0]) / 60) * speed111[1])
        var percentage = (1 - (fpp / 700)) / 5
        if (percentage <= 0) {
          percentage = 1 - Math.abs(percentage)
        } else {
          percentage = 1 + percentage
        }

        var minfpp = finalgrid.slice(0).sort((x, y) => x["fpp"] - y["fpp"])[0]["fpp"]
        var maxfpp = finalgrid.slice(0).sort((x, y) => y["fpp"] - x["fpp"])[0]["fpp"]
        if (minfpp == fpp) {
          percentage = percentage + ((maxfpp - fpp) * 0.0005)
        } else {
          percentage = percentage - ((fpp - minfpp) * 0.002)
        }
        if (percentage <= 0.1) {
          percentage = 0.1
        }

        temp["credits"] = Math.round(parseFloat(credits * (km / 40)) * percentage);
      } else {
        if (racesettings["laps"] <= 1) {

          temp["credits"] = Math.round(parseFloat(credits * (racesettings["distance"]["km"] / 10)));
        } else {
          var fpp = gtf_PERF.perf(racesettings["driver"]["car"], "GARAGE")["fpp"];

          var percentage = (1 - (fpp / 700)) / 5
          if (percentage <= 0) {
            percentage = 1 - Math.abs(percentage)
          } else {
            percentage = 1 + percentage
          }

          var minfpp = finalgrid.slice(0).sort((x, y) => x["fpp"] - y["fpp"])[0]["fpp"]
          var maxfpp = finalgrid.slice(0).sort((x, y) => y["fpp"] - x["fpp"])[0]["fpp"]
          if (minfpp == fpp) {
            percentage = percentage + ((maxfpp - fpp) * 0.0005)
          } else {
            percentage = percentage - ((fpp - minfpp) * 0.002)
          }
          //0.0005
          if (percentage <= 0.1) {
            percentage = 0.1
          }
          temp["credits"] = Math.round(parseFloat((credits + credits * (racesettings["distance"]["km"] / 7))) * percentage);
        }
      }
      positions.push(temp)

      credits = Math.ceil((credits - (credits / (racesettings["grid"] / 2))) / 100) * 100;
    }
    return positions
  }
}
//////////////////////////////////////
module.exports.start = function(racesettings, racedetails, finalgrid, userdata) {
  var score;
  var positions = [...racesettings["positions"]];
  var user = finalgrid.slice().filter(x => x["user"] == true)[0]

  var prize = 0;
  var mprize = 0;
  var racemultibonus = ""
  var championship = ""
  var championshippos = ""
  var position = user["position"]
  var positionlist = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31th", "32th"]
  var championshippoints = [100, 80, 60, 50, 40, 30, 25, 20, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  //////CAREER/////
  if (racesettings["mode"] == "CAREER") {
    if (racesettings["championship"]) {
      finalgrid = finalgrid.map(function(x, index) {
        if (index >= championshippoints.length) {
          x["points"] = x["points"] + 0
        } else {
          x["points"] = x["points"] + championshippoints[index]
        }
        return x
      })

      finalgrid.slice().sort(function(a, b) {
        if (a.points === b.points) {
          return a.position - b.position
        }
        return b.points - a.points
      }).map(function(x, index) {
        if (x["user"]) {
          championshippos = [index, positionlist[index]]
        }
        return x
      })
    }
  }


  if (racesettings["mode"] == "CAREER") {
    if (racesettings["championship"]) {
      championship = "\n" + "__Total Points__" + "\n" +
        "**" + championshippos[1] + " Place: **" + "`" + user["points"] + "pts`"

      userdata["raceinprogress"]["championshipnum"]++
      if (userdata["raceinprogress"]["championshipnum"] >= racesettings["eventlength"]) {
        userdata["raceinprogress"]["championshipnum"] = "DONE"
        gtf_STATS.updateEvent(racesettings, championshippos[1], userdata);
        prize = positions[championshippos[0]]["credits"];
      } else {
        prize = 0
      }

    } else if (typeof positions[position - 1] === 'undefined') {
      prize = 0
    } else {
      prize = positions[position - 1]["credits"];
    }

  } else if (typeof positions[position - 1] === 'undefined') {
    prize = 0
  } else {
    prize = positions[position - 1]["credits"];
  }


  var exp = Math.round(prize / 20);
  if (racesettings["mode"] == "CAREER") {
    exp = Math.round(Math.round(prize / 20) * 1.3);
  }

  if (gtf_STATS.raceMulti(userdata) > 1) {
    prize = Math.round(prize * gtf_STATS.raceMulti(userdata))
    racemultibonus = " `x" + gtf_STATS.raceMulti(userdata).toString() + "`"
  }

  if (prize == 0) {
    racemultibonus = ""
  }

  if (racesettings["damage"]) {
    gtf_CONDITION.updateDamage(racesettings, user, userdata)
  }

  if (position == 1) {
    userdata["stats"]["numwins"]++
  }
  userdata["stats"]["numraces"]++

  gtf_STATS.addCredits(prize, userdata);
  gtf_STATS.addMileage(racesettings["distance"]["km"], userdata);
  gtf_STATS.addTotalMileage(racesettings["distance"]["km"], userdata);
  gtf_STATS.addCarTotalMileage(racesettings["distance"]["km"], userdata);
  gtf_STATS.addExp(exp, userdata);

  if (racesettings["mode"] == "CAREER" && !racesettings["championship"]) {
    gtf_STATS.updateEvent(racesettings, positionlist[position - 1], userdata);
  }
  gtf_STATS.checkRewards("gtfrace", "", userdata);

  return [gtf_EMOTE.goldmedal + " __**1st", gtf_EMOTE.silvermedal + " __**2nd", gtf_EMOTE.bronzemedal + " __**3rd", "__**4th", "__**5th", "__**6th", "__**7th", "__**8th", "__**9th", "__**10th", "__**11th", "__**12th", "__**13th", "__**14th", "__**15th", "__**16th", "__**17th", "__**18th", "__**19th", "__**20th", "21st", "__**22nd", "__**23rd", "__**24th", "__**25th", "__**26th", "__**27th", "__**28th", "__**29th", "__**30th", "__**31st", "__**32nd"][position - 1] + " Place**__ " + "**+" + gtf_MATH.numFormat(prize) + gtf_EMOTE.credits + racemultibonus + " +" + gtf_MATH.numFormat(exp) + gtf_EMOTE.exp + "**" + championship;
};

module.exports.startOnline = function(racesettings, racedetails, finalgrid, user, userdata) {

  var positions = [];
  var position;
  var prize = 1000;
  var winners = [];
  var finalgridwinners = racesettings["players"];

  if (racesettings["type"] == "TIME") {
    prize = Math.round(parseFloat(prize * (racesettings["distance"]["km"] / 120)))
  } else {
    if (racesettings["laps"] <= 1) {
      prize = Math.round(parseFloat(prize + prize * (racesettings["distance"]["km"] / 60)));
    } else {
      prize = Math.round(parseFloat(prize + prize * (racesettings["distance"]["km"] / 60)));
    }
  }

  for (var x = 0; x < finalgridwinners.length; x++) {
    if (x % 10 == 0 && x + 1 != 11) {
      positions.push({ place: gtf_EMOTE.goldmedal + " " + (x + 1) + "st", credits: prize });
    } else if (x % 10 == 1 && x + 1 != 12) {
      positions.push({ place: gtf_EMOTE.silvermedal + " " + (x + 1) + "nd", credits: prize });
    } else if (x % 10 == 2 && x + 1 != 13) {
      positions.push({ place: gtf_EMOTE.bronzemedal + " " + (x + 1) + "rd", credits: prize });
    } else {
      positions.push({ place: x + 1 + "th", credits: prize });
    }
    prize = Math.ceil((prize - (prize / finalgridwinners.length)) / 100) * 100;
  }


  finalgridwinners = finalgridwinners.sort((x, y) => y["score"] - x["score"]);

  var index = 0;

  var exp = 0;

  finalgridwinners.forEach(function(x, i) {
    position = positions[x["position"] - 1]["place"]
    prize = positions[x["position"] - 1]["credits"]
    if (racesettings["laps"] <= 1) {
      prize = Math.round(parseFloat(prize * (racesettings["distance"]["km"] / 10)));
    } else {
      prize = Math.round(parseFloat(prize + prize * (racesettings["distance"]["km"] / 10)));
    }

    if (x["user"]) {
      winners.push("**" + position + "** " + "<@" + x["id"] + ">" + " " + "**+" + prize + gtf_EMOTE.credits + " +" + exp + gtf_EMOTE.exp + "**" + "\n" + x["car"]["name"]);
    } else {
      winners.push("**" + position + "** `" + x["drivername"] + "` " + "**+" + prize + gtf_EMOTE.credits + " +" + exp + gtf_EMOTE.exp + "**" + "\n" + x["car"]["name"]);
    }

    if (x["user"]) {
      gtf_LOBBY.saveUserdata(x, exp, prize, racesettings)
    }
  });

  return winners.slice(0, 5).join("\n");
};

///////////////CAREER/////////////////

module.exports.careerRaceselect = function(event, query, callback, embed, msg, userdata) {

  var screen = false
  var gtfcar = gtf_STATS.currentCar(userdata);

  if (event["car"] != "GARAGE") {
    continuee()
    return
  } else {
    gtf_GTF.checkRegulations(gtfcar, event, checktires, embed, msg, userdata);
  }

  function checktires() {
    gtfcar = gtf_STATS.currentCar(userdata);

    embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }])
    gtf_GTF.checkTireRegulations(gtfcar, event["regulations"], continuee, embed, msg, userdata);
  }
  function continuee() {
    embed.setColor(userdata["settings"]["COLOR"]);
    var results = "";

    var tracks = event["tracks"];
    var numberlist = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    var title = event["type"] != "TIMETRIAL" ? gtf_STATS.raceEventStatus(event, userdata) + " __" + event["title"] + " (" + tracks.length + " Races)" + "__" : gtf_STATS.raceEventStatus(event, userdata) + " __" + event["title"] + " (" + tracks.length + " Events)" + "__"
    embed.setTitle(title);

    if (typeof query["track"] !== 'undefined') {
      func(parseInt(query["track"]) - 1)
      return
    }

    event["mode"] = "CAREER"
    event["positions"] = gtf_RACE.creditsCalc(event)
    for (var j = 0; j < tracks.length; j++) {
      var raceid = j + 1
      if (typeof tracks[j][2] === "string") {
        lapsx = tracks[j][2].replace("m", " minutes")
      } else {
        var lapsx = tracks[j][2] + (tracks[j][2] == 1 ? " Lap" : " Laps")
      }
      var trackname = Object.assign({}, tracks[j][1]);
      if (typeof tracks[j][1] !== "string") {
        trackname = "Custom Course #" + (j + 1)
      } else {
        trackname = tracks[j][1]
      }
      results = results + numberlist[j] + " " + trackname + " **" + lapsx + "** " + gtf_STATS.getRaceCompletion(event, raceid, userdata) + "\n";
    }
    if (event["type"] == "TIMETRIAL") {
      var prizemoney = ["**" + gtf_EMOTE.goldmedal + " " + gtf_DATETIME.getFormattedLapTime(event["positions"][0]["time"] * 1000), gtf_EMOTE.silvermedal + " " + gtf_DATETIME.getFormattedLapTime(event["positions"][1]["time"] * 1000) + " ", gtf_EMOTE.bronzemedal + " " + gtf_DATETIME.getFormattedLapTime(event["positions"][2]["time"] * 1000) + "**"]
    } else {
      var prizemoney = event["positions"].slice(0, 3).map(function(x) {
        var credits = gtf_MATH.numFormat(x["credits"]);
        return "**" + x["place"] + "**" + " **" + credits + "**" + gtf_EMOTE.credits;
      });
    }

    if (event["prize"]["type"] == "RANDOMCAR") {
      var prizename = "Mystery Car";
    }
    if (event["prize"]["type"] == "CREDITS") {
      var prizename = "||" + "**" + gtf_MATH.numFormat(event["prize"]["item"]) + "**" + gtf_EMOTE.credits + "||";
    }
    var bop = ""
    var weather = ""
    var chili = ""
    var championship = ""
    var timetrial = ""
    var requirement = ""

    if (event["require"].length != 0) {
      requirement = gtf_EMOTE.bronzemedal + " **Finish in at least 3rd place or Bronze overall to advance.**" + "\n"
    }
    if (event["bop"]) {
      bop = "\n" + gtf_EMOTE.bop + " **BOP will be used for balanced gameplay.**"
    }
    if (event["weatherchange"] > 0) {
      weather = "\n" + gtf_EMOTE.weather + " **There is ~" + event["weatherchange"] + "%" + " of weather changeability in this event.**"
    }
    if (event["title"].includes("🌶")) {
      chili = "\n" + "🌶" + " **This event has more difficult opponents.**"
    }
    if (event["championship"]) {
      championship = "\n" + "🏆" + " **This championship must be fully completed in order to reward credits.**"
    }
    if (event["type"] == "TIMETRIAL" || event["type"] == "DRIFT") {
      return func(0)
    } else {
      var limits = "**" +
        event["regulations"]["fpplimit"].toString().replace("9999", "--") + gtf_EMOTE.fpp + " " +
        event["regulations"]["upperpower"].toString().replace("9999", "--") + " hp" + " " + gtf_MATH.numFormat(event["regulations"]["upperweight"].toString().replace("9999", "--")) + " Lbs" + " " +
        gtf_EMOTE.tire + event["regulations"]["tires"] +
        "**"
    }

    results = prizemoney.join(" ") + "\n"
      + results + "\n" +
      limits +
      bop + chili + championship + weather + timetrial + "\n\n" + requirement + gtf_EMOTE.goldmedal + " **Reward:** " + prizename
    if (userdata["settings"]["TIPS"] == 0) {
      results = results + "\n\n" +
        "**❓ React to one of the numbers below this message that corresponds to a specific race for entry.**"
    }

    embed.setDescription(results);

    var emojilist = [];
    var functionlist = []

    ////
    var index = 0
    var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] });
    var repair = gtf_CONDITION.condition(gtfcar)["health"] < 70
    var repaircost = 0
    for (index; index < tracks.length; index++) {
      if (event["championship"]) {
        emojilist.push({
          emoji: numberlist[index],
          emoji_name: numberlist[index],
          name: "Start Championship",
          extra: "",
          button_id: index
        })
        index++
        break;
      }
      emojilist.push({
        emoji: numberlist[index],
        emoji_name: numberlist[index],
        name: "",
        extra: "",
        button_id: index
      })

    }
    emojilist.push({
      emoji: "🏆",
      emoji_name: "🏆",
      name: "Standings",
      extra: "",
      button_id: index
    })
    index++
    if (repair) {
      var parts = ["Engine Repair", "Transmission Repair", "Suspension Repair", "Body Damage Repair"]
      var costs = []
      for (var x = 0; x < parts.length; x++) {
        var type = parts[x]
        var part = gtf_PARTS.find({ type: type })[0];
        costs.push(gtf_PARTS.costCalc(part, gtfcar, ocar))
      }
      repaircost = Math.round(gtf_MATH.sum(costs))
      emojilist.push({
        emoji: "🛠",
        emoji_name: "🛠",
        name: "Repair " + gtf_MATH.numFormat(repaircost) + " Cr",
        extra: "",
        button_id: index
      })
      index++
    }
    emojilist.push({
      emoji: gtf_EMOTE.exit,
      emoji_name: "gtfexit",
      name: "Back",
      extra: "Once",
      button_id: index
    })

    /////

    function func(index) {
      var trackname = tracks[index][1];
      gtfcar = gtf_STATS.currentCar(userdata)
      if (typeof trackname !== 'string') {
        var t = gtf_COURSEMAKER.createCourse(trackname);
        var track = gtf_COURSEMAKER.displayCourse(t, bcallback)
        function bcallback(track) {
          track["name"] = "Stage " + (index + 1)
          track["options"] = ["Drift"];
          track["author"] = "GTFITNESS";
          event["title"] = event["title"] + " - Race " + (index + 1)
          event["raceid"] = event["tracks"][index][0]
          event["eventlength"] = event["tracks"].length
          event["track"] = track
          callback(event);
        }
      } else {
        event["laps"] = tracks[index][2]
        event["title"] = (event["type"] != "TIMETRIAL" && event["type"] != "DRIFT") ? event["title"] + " - Race " + (index + 1) : event["title"]
        event["raceid"] = event["tracks"][index][0]
        event["eventlength"] = event["tracks"].length
        event["track"] = trackname
        callback(event);
      }
    }


    var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

    gtf_DISCORD.send(msg, { embeds: [embed], components: buttons }, nextfunc)
    function nextfunc(msg) {
      setTimeout(function() {
        var complete = gtf_STATS.checkEvent(event, "1st", userdata);
        if (complete) {
          gtf_STATS.completeEvent(event, userdata);
          gtf_STATS.redeemGift(gtf_EMOTE.goldmedal + " Congrats! Completed " + event["title"] + " " + gtf_EMOTE.goldmedal, event["prize"], embed, msg, userdata);
        }
      }, 3000)

      function repaircar() {
        //////
        gtf_CONDITION.updateCondition(100, "all", userdata)
        gtf_STATS.addCredits(-repaircost, userdata);

        embed.setDescription(results + "\n\n" + "✅ Car repaired. **" + gtf_MATH.numFormat(repaircost) + gtf_EMOTE.credits + "**")
        embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }])
        gtf_STATS.save(userdata)
        repaircost = 0
        msg.edit({ embeds: [embed] })
      }

      function creditrewards() {
        //////
        if (screen == true) {
          screen = false
          embed.setDescription(results)
          msg.edit({ embeds: [embed] })
          return
        }
        screen = true
        results2 = event["positions"].slice(0, 6).map(function(x) {
          var credits = gtf_MATH.numFormat(x["credits"])
          if (x["place"] == "1st") {
            return "**" + gtf_EMOTE.goldmedal + " " + x["place"] + ":**" + " **" + credits + "**" + gtf_EMOTE.credits;
          }
          if (x["place"] == "2nd") {
            return "**" + gtf_EMOTE.silvermedal + " " + x["place"] + ":**" + " **" + credits + "**" + gtf_EMOTE.credits;
          }
          if (x["place"] == "3rd") {
            return "**" + gtf_EMOTE.bronzemedal + " " + x["place"] + ":**" + " **" + credits + "**" + gtf_EMOTE.credits;
          }
          return "**" + x["place"] + ":**" + " **" + credits + "**" + gtf_EMOTE.credits;
        });
        results2.unshift("__Prizes__")
        results2 = results2.join("\n")
        if (userdata["settings"]["TIPS"] == 0) {
          results2 = results2 + "\n\n" +
            "**❓ Click the button again to go back to the previous screen.**"
        }
        embed.setDescription(results2)
        msg.edit({ embeds: [embed] })
        return
      }
      //////
      index = 0
      for (index; index < tracks.length; index++) {
        if (event["championship"]) {
          functionlist.push(func)
          break;
        }
        functionlist.push(func)
      }
      functionlist.push(creditrewards)
      if (repair) {
        functionlist.push(repaircar)
      }
      if (event["eventid"].includes("SEASONAL")) {
        functionlist.push(function() {
          require(gtf_TOOLS.homedir() +  "commands/seasonal").execute(msg, { options: event["eventid"].split("SEASONAL")[1].split("-")[0] }, userdata);
        })
      } else {
        functionlist.push(function() {
          require(gtf_TOOLS.homedir() +  "commands/career").execute(msg, { options: event["eventid"].split("-")[0] }, userdata);
        })
      }
      gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
    }
  }

};
module.exports.preRaceMenu = function(racesettings, embed, msg, userdata) {
  var results = ""
  embed.setTitle("__" + racesettings["title"] + "__");

  var laps = racesettings["laps"];
  if (racesettings["type"] == "LAPS" || racesettings["type"] == "DRIFT") {
    var lapntime = "**Lap(s):** " + laps + "\n" + "**Total Distance:** " + [racesettings["distance"]["km"] + " km", racesettings["distance"]["mi"] + " mi"][userdata["settings"]["UNITS"]] + "\n"
  }

  if (racesettings["type"] == "TIME") {
    var fpp = gtf_PERF.perf(racesettings["driver"]["car"], "GARAGE")["fpp"];
    var numx = gtf_GTF.lengthAlpha(fpp, "0%", racesettings["track"]);
    var speed111 = gtf_PERF.speedCalc(numx, racesettings["driver"]["car"]);
    speed111[0] = Math.round(speed111[0] / 1.4)
    racesettings["distance"]["km"] = Math.round((parseInt(racesettings["laps"].split("m")[0]) / 60) * speed111[0])
    racesettings["distance"]["mi"] = gtf_MATH.convertKmToMi(racesettings["distance"]["km"])
    var lapntime = "**Time:** " + laps.replace("m", " minutes") + "\n" + "**Total Distance (Estimated):** " + [racesettings["distance"]["km"] + " km", racesettings["distance"]["mi"] + " mi"][userdata["settings"]["UNITS"]] + "\n";
  }

  if (racesettings["type"] == "TIMETRIAL" || racesettings["type"] == "DRIFT") {
    var lapntime = "**Distance:** " + [racesettings["distance"]["km"] + " km", racesettings["distance"]["mi"] + " mi"][userdata["settings"]["UNITS"]] + "\n"
  }
  var starttype = { "ROLLINGSTART": "`Rolling Start`", "STANDING": '`Grid Start`' }[racesettings["gridstart"]]
  var racedetails = "__Session Details__" + "\n" +
    "**Track:** " + racesettings["track"]["name"] + "\n" +
    "**Track Conditions:** " + racesettings["time"]["emoji"] +
    " " + racesettings["time"]["hour"].toString() + ":" + racesettings["time"]["minutes"] + " | " +
    racesettings["weather"]["emoji"] + " " + racesettings["weather"]["name"] + " 💧" + racesettings["weather"]["wetsurface"] + "%" + "\n" +
    lapntime + "**Grid:** " + racesettings["grid"] + (racesettings["grid"] == 1 ? " car " : " cars ") + starttype;

  if (racesettings["mode"] == "CAREER") {
    if (racesettings["type"] == "TIMETRIAL") {
      if (racesettings["eventid"].includes("gtacademy")) {
        racedetails = racedetails + "\n\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "gtacademy", name2: racesettings["eventid"].split("-")[1] }) + "`"
      } else if (racesettings["eventid"].includes("grandtour")) {
        racedetails = racedetails + "\n\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "grandtour", name2: racesettings["eventid"].split("-")[1] }) + "`"
      }
    }
    else {
      if (racesettings["eventid"].includes("gtacademy")) {
        racedetails = racedetails + "\n\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "gtacademy", name2: racesettings["eventid"].split("-")[1] }) + "`"
      } else if (racesettings["eventid"].includes("grandtour")) {
        racedetails = racedetails + "\n\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "grandtour", name2: racesettings["eventid"].split("-")[1] }) + "`"
      } else {
        racedetails = racedetails + "\n\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "race-conditions", name2: racesettings["weather"]["name"] }) + " " + gtf_ANNOUNCER.say({ name1: "pre-race-comments" }) + "`"
      }
    }
  }

  var msgjson = { embeds: [embed], components: [] }

  if (racesettings["image"].length != 0) {
    if (racesettings["track"]["author"] != "GTFITNESS") {

      embed.setThumbnail(racesettings["image"]);
    } else {
      var attachment = Buffer.isBuffer(racesettings["image"]) ? new AttachmentBuilder(racesettings["image"], { name: "course.png" }) : new AttachmentBuilder(racesettings["image"].buffer, { name: "course.png" });

      embed.setThumbnail("attachment://course.png");
      msgjson = { embeds: [embed], files: [attachment], components: [] }
    }
  }
  return [results, racedetails, msgjson]
}
