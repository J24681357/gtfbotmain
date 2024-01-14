const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.prepRace = function(raceprep, gtfcar, embed, msg, userdata) {
  var embed = new EmbedBuilder();
  raceprep["modearg"] = raceprep["modearg"].toString();
  var racesettings = gte_RACE.setRaceSettings(raceprep, gtfcar, embed, msg, userdata);

  if (raceprep["mode"] == "DRIVINGREVOLUTION") {
    var racedetails = ""
    var finalgrid = ""
    racesettings["mode"] = "DRIVINGREVOLUTION"
    gte_RACES2.startDRevolution(racesettings, racedetails, finalgrid, [false, null], embed, msg, userdata);
    return
  }

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
  var finalgrid = raceprep["players"].length == 0 ? gte_RACE.createGridEnthu(racesettings, "") : raceprep["players"];
  var prerace = gte_RACE.preRaceMenu(racesettings, embed, msg, userdata)

  var results = prerace[0]
  var racedetails = prerace[1]
  var msgjson = prerace[2]

  if (racesettings["type"] == "TIMETRIAL") {
    gte_RACEEX.timetrialracelength(racesettings, racedetails, finalgrid, true, 50 - (racesettings["difficulty"] / 2), embed, msg, userdata);
    //var prizemoney = [gte_EMOTE.goldmedal + " " + gte_DATETIME.getFormattedLapTime(racesettings["positions"][0]["time"] * 1000), gte_EMOTE.silvermedal + " " + gte_DATETIME.getFormattedLapTime(racesettings["positions"][1]["time"] * 1000), gte_EMOTE.bronzemedal + " " + gte_DATETIME.getFormattedLapTime(racesettings["positions"][2]["time"] * 1000)]
  }
  else {
    /*
    var prizemoney = racesettings["positions"].slice(0, 3).map(function(x) {
      var credits = gtf_MATH.numFormat(x["credits"])
      return x["place"] + " " + credits + gte_EMOTE.credits;
    });
    */
  }

  var loading = gte_GTF.loadingText("__**" + racesettings["title"] + "**__" + "\n" +
    "**" + racesettings["track"]["name"] + "\n" + "**", carname);

  embed.setDescription(loading);
  var screen = true
  var emojilist = [
    {
      emoji: gte_EMOTE.flag,
      emoji_name: 'flag',
      name: 'Start',
      extra: "",
      button_id: 0
    },
    {
      emoji: gte_EMOTE.tracklogo,
      emoji_name: "trackgtfitness",
      name: 'Grid/Session Details',
      extra: "",
      button_id: 1
    }]
  var button_id = 2
  var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);
  if (true) {
    var tmenulist = [{
      emoji: "",
      name: "Passive",
      description: "A slower pace, but reduce the amount of damage you take.",
      menu_id: 0
    },
    {
      emoji: "",
      name: "Neutral",
      description: "A balanced pace between taking damage and balanced driver skill.",
      menu_id: 1
    },
    {
      emoji: "",
      name: "Aggressive",
      description: "An aggressive pace, better performance, but less immune from reckless driving.",
      menu_id: 2
    }]
    var temojilist = []
    var menu = gte_TOOLS.prepareMenu("Driver Pace " + "(" + userdata["settings"]["MODE"] + ")", tmenulist, temojilist, msg, userdata);
    buttons.unshift(menu)
  }
  embed.setColor(userdata["settings"]["COLOR"])
  var user = msg.user.displayName;
  embed.setAuthor({ name: user, iconURL: msg.user.displayAvatarURL() });


  ////DEBUG
  ////DEBUG

  gte_DISCORD.send(msg, msgjson, preracefunc, true)
  function preracefunc(msg) {
    var results2 = ""
    setTimeout(function() {
      embed.setDescription(results + racedetails);
      if (racesettings["mode"] != "ONLINE") {

        embed.setFields([{
          name: gte_STATS.menuFooterEnthu(userdata),
          value: gtf_CARS.shortName(racesettings["driver"]["car"]["name"])
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
            require(__dirname.split("/").slice(0, 4).join("/") + "/" + "commands/status").execute(msg, { options: "exit" }, userdata);
          } else {
            embed.spliceFields(0, 1);
            try {
              gte_RACES2.startSession(racesettings, racedetails, finalgrid, [false, null], embed, msg, userdata);
            } catch (error) {
              embed = new EmbedBuilder();
              gte_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**" + "\n\n" + "Check the Known Issues in <#687872420933271577> to see if this is documented.", embed: "", seconds: 0 }, msg, userdata);
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
                return "**" + x["position"] + ". " + gtf_CARS.shortName(x["name"]) + "** `" + "You" + "`";
              } else {
                return x["position"] + ". " + gtf_CARS.shortName(x["name"]);
              }
            })
            if (griddd.length >= 10) {
              griddd = griddd.slice(0, 7).concat(griddd.slice(griddd.length - 3))
            }
            var bop = ""
            if (racesettings["bop"]) {
              bop = " " + gte_EMOTE.bop
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
            buttons = gte_TOOLS.prepareButtons(emojilist.filter(x => typeof x["menu_id"] === "undefined"), msg, userdata);
            buttons.unshift(menu)
            msg.edit({ embeds: [embed], components: buttons });
          } else {
            racesettings["driver"]["tirechange"] = true
            emojilist[2]["name"] = "Optimal Tire Usage | On"
            buttons = gte_TOOLS.prepareButtons(emojilist.filter(x => typeof x["menu_id"] === "undefined"), msg, userdata);
            buttons.unshift(menu)
            msg.edit({ embeds: [embed], components: buttons });
          }
        }

        if (racesettings["mode"] == "ONLINE" || racesettings["type"] == "TIMETRIAL") {
          var functionlist = [flagstartrace, trackdetails]
        } else {
          var functionlist = [flagstartrace, trackdetails, tirechangen]
        }

        if (true) {
          var functionlist2 = []
          for (var j = 0; j < tmenulist.length; j++) {
            functionlist2.push(function(int) {
              userdata["settings"]["MODE"] = tmenulist[int]["name"]

            })
          }
          emojilist = emojilist.concat(temojilist)
          functionlist = functionlist.concat(functionlist2)
        }

        gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
      });
    }, 3000)
  }
}

module.exports.setRaceSettings = function(raceprep, gtfcar, embed, msg, userdata) {

  var carselect = raceprep["car"] == "GARAGE" ? gtfcar : gte_CARS.addCarEnthu(gtf_CARS.find({ fullnames: [raceprep["car"]] })[0], "LOAN")

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
        "upperyear": 2005,
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
    var distance = gte_RACE.lapCalc(km, {"RN": 6, "RIV": 6, "RIII": 9, "RII": 10, "RI": 13, "RS": 28}[racesettings["eventid"].split("-")[0].toUpperCase()]);
  } else {
    distance = [limit, "N/A"];
  }
  racesettings["laps"] = distance[0]
  racesettings["distance"] = { km: distance[1], mi: gtf_MATH.round(distance[1] * 0.60934, 2) }
  racesettings["time"] = gtf_TIME.random({}, 1)[0];
  racesettings["weather"] = gtf_WEATHER.random({}, 1)[0];

  if (racesettings["mode"] == "SSRX") {

    var km = gtf_MATH.round(raceprep["modearg"] / 1000, 3)
    racesettings["distance"] = {
      km: km,
      mi: gtf_MATH.round(km * 0.62137119, 2)
    }
  }


  racesettings["positions"] = gte_RACE.creditsCalcEnthu(racesettings, raceprep)

  return racesettings;
};

module.exports.createGridEnthu = function(racesettings, special) {
  var count = racesettings["grid"]
  var car = racesettings["driver"]["car"]
  var username = racesettings["driver"]["name"]
  var bop = racesettings["bop"]

  var regulations = racesettings["regulations"]
  var object = {
    makes: regulations["makes"], names: regulations["models"], drivetrains: regulations["drivetrains"], engines: regulations["engines"], types: regulations["types"], countries: regulations["countries"], upperfpp: regulations["upperfpp"], lowerfpp: regulations["lowerfpp"], upperpower: regulations["upperpower"], lowerpower: regulations["lowerpower"], upperweight: regulations["upperweight"], lowerweight: regulations["lowerweight"], upperyear: regulations["upperyear"], loweryear: regulations["loweryear"], special: regulations["special"], prohibited: regulations["prohibited"], seed: racesettings["tracks"][0]["seed"],
  }
  if (count == 1) {
    fpp = gte_PERF.perfEnthu(car, "GARAGE")["fpp"]
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
  object["seed"] = racesettings["tracks"][0]["seed"]
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
  var fastoppseed = 1
  for (var index = 0; index < randomcars.length; index++) {

    if (position == (index + 1) && special != "AI") {

      var temp = gte_PERF.perfEnthu(car, "GARAGE")
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
      if (gtf_MATH.randomIntSeed(0, fastoppseed, object["seed"]) == 1) {
        fastoppseed++
        var object2 = { ...object }
        object2["seed"] = racesettings["tracks"][0]["seed"]
        object2["lowerfpp"] = object2["lowerfpp"]
        object2["upperfpp"] = object2["upperfpp"] + 30
        ccc = gtf_CARS.random(object2, count)[0]
      }

      var temp = gte_PERF.perfEnthu(ccc, "DEALERSHIP")
      fpp = temp["fpp"];
      var fueleco = temp["fueleco"]
      finalgrid.push({
        place: index + 1,
        position: index + 1,
        drivername: gte_GTF.randomDriver(),
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
        var fpp = gte_PERF.perfEnthu(racesettings["driver"]["car"], "GARAGE")["fpp"];
        var numx = gte_GTF.lengthAlpha(fpp, "0%", racesettings["track"]);
        var speed111 = gte_PERF.speedCalcConstant(numx, racesettings["driver"]["car"]);
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
        var fpp = gte_PERF.perfEnthu(racesettings["driver"]["car"], "GARAGE")["fpp"];
        var numx = gte_GTF.lengthAlpha(fpp, "0%", racesettings["track"]);
        var speed111 = gte_PERF.speedCalcConstant(numx, racesettings["driver"]["car"]);
        speed111[1] = Math.round(speed111[0] / 1.4)
        var km = Math.round((parseInt(racesettings["laps"].split("m")[0]) / 60) * speed111[1])
        temp["credits"] = Math.round(parseFloat(credits * (km / 80)));
      } else {
        if (racesettings["laps"] <= 1) {

          temp["credits"] = Math.round(parseFloat(credits * (racesettings["distance"]["km"] / 10)));
        } else {
          var fpp = gte_PERF.perfEnthu(racesettings["driver"]["car"], "GARAGE")["fpp"];

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

module.exports.creditsCalcEnthu = function(racesettings, raceprep) {
  var positions = racesettings["positions"]
  var start = racesettings["positions"][0]["points"]

  var perc = [1, 0.6, 0.4, 0.2, 0.05, 0.025]
  if (racesettings["grid"] == 2) {
    var positions = [{ place: '1st', points: start },
    { place: '2nd', points: 0.05 }
    ]
    return positions
  }
  var positions = [{ place: '1st', points: start * perc[0] },
  { place: '2nd', points: start * perc[1] },
  { place: '3rd', points: start * perc[2] },
  { place: '4th', points: start * perc[3] },
  { place: '5th', points: start * perc[4] },
  { place: '6th', points: start * perc[5] }];
  return positions
}

module.exports.scoreCalcEnthu = function(scores, pattern) {
  var keys = Object.keys(scores)
  var scores = Object.keys(scores).map(function(x) {
    return {
      name: x,
      number: scores[x],
      percent: Math.round((scores[x] / pattern.length) * 100)
    }
  })
  var final = (((6 * scores[0]["percent"]) + (3 * scores[1]["percent"]) + (1 * scores[2]["percent"])) / 600) * 100
  //gtf_MATH.weightedAverage(scores.map(x=> x["percent"]).slice(3,5),  [0.25, 0.75])
  var classs = "D"
  if (final >= 60) {
    classs = "C"
  }
  if (final >= 70) {
    classs = "B"
  }
  if (final >= 80) {
    classs = "A"
  }
  if (final >= 90 && scores[2]["percent"] == 0 && scores[3]["percent"] == 0 && scores[4]["percent"] == 0) {
    classs = "S"
  }
  return classs
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
        var fpp = gte_PERF.perfEnthu(racesettings["driver"]["car"], "GARAGE")["fpp"];
        var numx = gte_GTF.lengthAlpha(fpp, racesettings["weather"], racesettings["track"]);
        var speed111 = gte_PERF.speedCalcConstant(numx, racesettings["driver"]["car"]);
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
          var fpp = gte_PERF.perfEnthu(racesettings["driver"]["car"], "GARAGE")["fpp"];

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
  var points = 0;
  var mprize = 0;
  var racemultibonus = ""
  var championship = ""
  var championshippos = ""
  var position = user["position"]
  var positionlist = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31th", "32th"]
  var championshippoints = [100, 80, 60, 50, 40, 30, 25, 20, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  //////CAREER/////
  var odds = user["odds"]

  var points = Math.round(positions[position - 1]["points"] * odds)

  var exp = Math.round(prize / 20);
  if (racesettings["mode"] == "CAREER") {
    exp = Math.round(Math.round(prize / 20) * 1.3);
  }

  var enthupointso = parseInt(userdata["enthupoints"])
  gte_CONDITION.updateDamageEnthu(racesettings, user, userdata)
  var diff = userdata["enthupoints"] - enthupointso
  var ofp = gtf_MATH.randomInt(1,10) / 3
  var cwp = gtf_MATH.randomInt(1,10) / 3
  var ccp = 1 - ofp - cwp
  
  var ofdamage = Math.round(diff * (ofp/10)) * -1
  var cwdamage = Math.round(diff * (cwp/10)) * -1
  var ccdamage = Math.round(diff * (ccp/10))

  if (position == 1) {
    userdata["stats"]["numwins"]++
  }
  userdata["stats"]["numraces"]++

  // gte_STATS.addCredits(prize, userdata);
  gte_STATS.addRankingRace(racesettings, positionlist[position - 1], points, ofdamage+cwdamage+ccdamage, userdata);
  gte_STATS.addMileage(racesettings["distance"]["km"], userdata);
  gte_STATS.addTotalMileage(racesettings["distance"]["km"], userdata);
  gte_STATS.addCarTotalMileage(racesettings["distance"]["km"], userdata);
  // gte_STATS.addExp(exp, userdata);
  /*
    if (racesettings["mode"] == "CAREER" && !racesettings["championship"]) {
        gte_STATS.updateEvent(racesettings, positionlist[position - 1], userdata);
    }
    */
  //gte_STATS.checkRewards("gtfrace", "", userdata);
  exp = 0

  racedetails = finalgrid.slice().map(function(x) {
    var gap = x["position"] == 1 ? "" : "`+" + x["gap"] + '`'
    if (racesettings["mode"] == "ONLINE") {
      var name = x["name"] + " `" + x["drivername"] + "`"
      return x["position"] + ". " + gap + " " + name
    }
    if (x["user"]) {
      return "**" + x["position"] + ". " + gap + " " + gtf_CARS.shortName(x["name"]) + "**"
    } else {
      return x["position"] + ". " + gap + " " + gtf_CARS.shortName(x["name"]);
    }
  })

  return [gte_EMOTE.goldmedal + " __**1st", gte_EMOTE.silvermedal + " __**2nd", gte_EMOTE.bronzemedal + " __**3rd", "__**4th", "__**5th", "__**6th", "__**7th", "__**8th", "__**9th", "__**10th", "__**11th", "__**12th", "__**13th", "__**14th", "__**15th", "__**16th", "__**17th", "__**18th", "__**19th", "__**20th", "21st", "__**22nd", "__**23rd", "__**24th", "__**25th", "__**26th", "__**27th", "__**28th", "__**29th", "__**30th", "__**31st", "__**32nd"][position - 1] + " Place**__ " + "**+" + gtf_MATH.numFormat(points) + " pts** " + "`" + odds + "`" + "\n" +
    gte_EMOTE.enthuoffcourse + " " + ofdamage + " | " + gte_EMOTE.enthucollisionwall + " " + cwdamage + " | " + gte_EMOTE.enthucollisioncar + " " + ccdamage +
    championship;
};

module.exports.startDR = function(racesettings, racedetails, finalgrid, userdata) {
  var score;

  var prize = 0;
  var points = 0;
  var mprize = 0;
  var racemultibonus = ""
  var championship = ""
  var championshippos = ""
  var positionlist = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31th", "32th"]
  var championshippoints = [100, 80, 60, 50, 40, 30, 25, 20, 15, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  //////CAREER/////

  var points = 0

  //gte_STATS.addMileage(racesettings["distance"]["km"], userdata);
  //gte_STATS.addTotalMileage(racesettings["distance"]["km"], userdata);

  /*
    if (racesettings["mode"] == "CAREER" && !racesettings["championship"]) {
        gte_STATS.updateEvent(racesettings, positionlist[position - 1], userdata);
    }
    */
  //gte_STATS.checkRewards("gtfrace", "", userdata);
  exp = 0

  racedetails = " "

  return "";
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
      positions.push({ place: gte_EMOTE.goldmedal + " " + (x + 1) + "st", credits: prize });
    } else if (x % 10 == 1 && x + 1 != 12) {
      positions.push({ place: gte_EMOTE.silvermedal + " " + (x + 1) + "nd", credits: prize });
    } else if (x % 10 == 2 && x + 1 != 13) {
      positions.push({ place: gte_EMOTE.bronzemedal + " " + (x + 1) + "rd", credits: prize });
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
      winners.push("**" + position + "** " + "<@" + x["id"] + ">" + " " + "**+" + prize + gte_EMOTE.credits + " +" + exp + gte_EMOTE.exp + "**" + "\n" + x["car"]["name"]);
    } else {
      winners.push("**" + position + "** `" + x["drivername"] + "` " + "**+" + prize + gte_EMOTE.credits + " +" + exp + gte_EMOTE.exp + "**" + "\n" + x["car"]["name"]);
    }

    if (x["user"]) {
      gte_LOBBY.saveUserdata(x, exp, prize, racesettings)
    }
  });

  return winners.slice(0, 5).join("\n");
};

///////////////CAREER/////////////////

module.exports.careerRaceselect = function(event, query, callback, embed, msg, userdata) {

  var screen = false
  var gtfcar = gte_STATS.currentCar(userdata);

  if (event["car"] != "GARAGE") {
    continuee()
    return
  } else {
    gte_GTF.checkRegulations(gtfcar, event, checktires, embed, msg, userdata);
  }

  function checktires() {
    gtfcar = gte_STATS.currentCar(userdata);

    embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }])
    gte_GTF.checkTireRegulations(gtfcar, event["regulations"], continuee, embed, msg, userdata);
  }
  function continuee() {
    embed.setColor(userdata["settings"]["COLOR"]);
    var results = "";

    var tracks = event["tracks"];
    var numberlist = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    var title = event["type"] != "TIMETRIAL" ? gte_STATS.raceEventStatus(event, userdata) + " __" + event["title"] + " (" + tracks.length + " Races)" + "__" : gte_STATS.raceEventStatus(event, userdata) + " __" + event["title"] + " (" + tracks.length + " Events)" + "__"
    embed.setTitle(title);

    if (typeof query["track"] !== 'undefined') {
      func(parseInt(query["track"]) - 1)
      return
    }

    event["mode"] = "CAREER"
    event["positions"] = gte_RACE.creditsCalcEnthu(event)
    for (var j = 0; j < tracks.length; j++) {
      var raceid = j + 1
      if (typeof tracks[j][2] === "string") {
        lapsx = tracks[j][2].replace("m", " minutes")
      } else {
        var lapsx = tracks[j][2] + (tracks[j][2] == 1 ? " Lap" : " Laps")
      }
      var trackname = Object.assign({}, tracks[j][1]);
      if (typeof tracks[j][1] !== "string") {
        if (event["eventid"].match(/rally/ig)) {
          trackname = "Stage " + (j + 1)
        }
      } else {
        trackname = tracks[j][1]
      }
      results = results + numberlist[j] + " " + trackname + " **" + lapsx + "** " + gte_STATS.getRaceCompletion(event, raceid, userdata) + "\n";
    }
    if (event["type"] == "TIMETRIAL") {
      var prizemoney = ["**" + gte_EMOTE.goldmedal + " " + gte_DATETIME.getFormattedLapTime(event["positions"][0]["time"] * 1000), gte_EMOTE.silvermedal + " " + gte_DATETIME.getFormattedLapTime(event["positions"][1]["time"] * 1000) + " ", gte_EMOTE.bronzemedal + " " + gte_DATETIME.getFormattedLapTime(event["positions"][2]["time"] * 1000) + "**"]
    } else {
      /*
      var prizemoney = event["positions"].slice(0, 3).map(function(x) {
        var credits = gtf_MATH.numFormat(x["credits"]);
        return "**" + x["place"] + "**" + " **" + credits + "**" + gte_EMOTE.credits;
      });
      */
    }

    if (event["prize"]["type"] == "RANDOMCAR") {
      var prizename = "Mystery Car";
    }
    if (event["prize"]["type"] == "CREDITS") {
      var prizename = "||" + "**" + gtf_MATH.numFormat(event["prize"]["item"]) + "**" + gte_EMOTE.credits + "||";
    }
    var bop = ""
    var weather = ""
    var championship = ""
    var timetrial = ""
    var requirement = ""

    if (event["require"].length != 0) {
      requirement = gte_EMOTE.bronzemedal + " **Finish in at least 3rd place or Bronze overall to advance.**" + "\n"
    }
    if (event["bop"]) {
      bop = "\n" + gte_EMOTE.bop + " **BOP will be used for balanced gameplay.**"
    }
    if (event["weatherchange"] > 0) {
      weather = "\n" + gte_EMOTE.weather + " **There is ~" + event["weatherchange"] + "%" + " of weather changeability in this event.**"
    }
    if (event["championship"]) {
      championship = "\n" + "🏆" + " **This championship must be fully completed in order to reward credits.**"
    }
    if (event["type"] == "TIMETRIAL" || event["type"] == "DRIFT") {
      return func(0)
    } else {
      var limits = "**" +
        event["regulations"]["fpplimit"].toString().replace("9999", "--") + gte_EMOTE.fpp + " " +
        event["regulations"]["upperpower"].toString().replace("9999", "--") + " hp" + " " + gtf_MATH.numFormat(event["regulations"]["upperweight"].toString().replace("9999", "--")) + " Lbs" + " " +
        gte_EMOTE.tire + event["regulations"]["tires"] +
        "**"
    }

    results = results + "\n" +
      limits +
      bop + championship + weather + timetrial + "\n\n" + requirement + gte_EMOTE.goldmedal + " **Reward:** " + prizename
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
    var repair = gte_CONDITION.condition(gtfcar)["health"] < 70
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
        var part = gte_PARTS.find({ type: type })[0];
        costs.push(gte_PARTS.costCalc(part, gtfcar, ocar))
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
      emoji: gte_EMOTE.exit,
      emoji_name: "gtfexit",
      name: "Back",
      extra: "Once",
      button_id: index
    })

    /////

    function func(index) {
      var trackname = tracks[index][1];
      gtfcar = gte_STATS.currentCar(userdata)
      if (typeof trackname !== 'string') {
        var t = gte_COURSEMAKER.createCourse(trackname);
        var track = gte_COURSEMAKER.displayCourse(t, bcallback)
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
        event["title"] = (event["type"] != "TIMETRIAL" || event["type"] != "DRIFT") ? event["title"] + " - Race " + (index + 1) : event["title"]
        event["raceid"] = event["tracks"][index][0]
        event["eventlength"] = event["tracks"].length
        event["track"] = trackname
        callback(event);
      }
    }


    var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);

    gte_DISCORD.send(msg, { embeds: [embed], components: buttons }, nextfunc)
    function nextfunc(msg) {
      setTimeout(function() {
        var complete = gte_STATS.checkEvent(event, "1st", userdata);
        if (complete) {
          gte_STATS.completeEvent(event, userdata);
          gte_STATS.redeemGift(gte_EMOTE.goldmedal + " Congrats! Completed " + event["title"] + " " + gte_EMOTE.goldmedal, event["prize"], embed, msg, userdata);
        }
      }, 3000)

      function repaircar() {
        //////
        gte_CONDITION.updateCondition(100, "all", userdata)
        gte_STATS.addCredits(-repaircost, userdata);

        embed.setDescription(results + "\n\n" + "✅ Car repaired. **" + gtf_MATH.numFormat(repaircost) + gte_EMOTE.credits + "**")
        embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }])
        gte_STATS.saveEnthu(userdata)
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
            return "**" + gte_EMOTE.goldmedal + " " + x["place"] + ":**" + " **" + credits + "**" + gte_EMOTE.credits;
          }
          if (x["place"] == "2nd") {
            return "**" + gte_EMOTE.silvermedal + " " + x["place"] + ":**" + " **" + credits + "**" + gte_EMOTE.credits;
          }
          if (x["place"] == "3rd") {
            return "**" + gte_EMOTE.bronzemedal + " " + x["place"] + ":**" + " **" + credits + "**" + gte_EMOTE.credits;
          }
          return "**" + x["place"] + ":**" + " **" + credits + "**" + gte_EMOTE.credits;
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
          require(__dirname.split("/").slice(0, 4).join("/") + "/" + "commands/seasonal").execute(msg, { options: event["eventid"].split("SEASONAL")[1].split("-")[0] }, userdata);
        })
      } else {
        functionlist.push(function() {
          require(__dirname.split("/").slice(0, 4).join("/") + "/" + "commands/career").execute(msg, { options: event["eventid"].split("-")[0] }, userdata);
        })
      }
      gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
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
    var fpp = gte_PERF.perfEnthu(racesettings["driver"]["car"], "GARAGE")["fpp"];
    var numx = gte_GTF.lengthAlpha(fpp, "0%", racesettings["track"]);
    var speed111 = gte_PERF.speedCalc(numx, racesettings["driver"]["car"]);
    speed111[0] = Math.round(speed111[0] / 1.4)
    racesettings["distance"]["km"] = Math.round((parseInt(racesettings["laps"].split("m")[0]) / 60) * speed111[0])
    racesettings["distance"]["mi"] = Math.round(racesettings["distance"]["km"] * 0.62137119)
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
    lapntime;

  if (racesettings["mode"] == "CAREER") {
    if (racesettings["type"] == "TIMETRIAL") {
      if (racesettings["eventid"].includes("gtacademy")) {
        racedetails = racedetails + "\n\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "gtacademy", name2: racesettings["eventid"].split("-")[1] }) + "`"
      }
    }
    else {
      if (racesettings["eventid"].includes("gtacademy")) {
        racedetails = racedetails + "\n\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "gtacademy", name2: racesettings["eventid"].split("-")[1] }) + "`"
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

