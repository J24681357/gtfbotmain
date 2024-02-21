const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.randomSeasonal = function (regulations, level, number, seed) {
  var difficulty = 90
  /*
  if (level == "A") {
    var randid = 1
    var grid = gtf_MATH.randomIntSeed(6, 11, seed);
    var startingprize = 5000;
    var tracksnum = gtf_MATH.randomIntSeed(2,3, seed);
    var trackids = [1,2,3]
    var limit = 9.0;
    var fpplimit = Math.ceil(gtf_MATH.randomIntSeed(300,499, seed) / 10) * 10
    difficulty = 70
    var weatherchange = 0
  }
  */
  if (level == "IB") {
    var randid = 1
    var grid = gtf_MATH.randomIntSeed(6, 16, seed);
    var startingprize = 12500;
    var tracksnum = gtf_MATH.randomIntSeed(2,4, seed);
    var trackids = [1,2,3,4,5,6,7]
    var limit = 16.0;
    var fpplimit = Math.ceil(gtf_MATH.randomIntSeed(350,574, seed) / 10) * 10
    var weatherchange = 5
    difficulty = 60
  }
  else if (level == "IA") {
    var randid = 3
    var grid = gtf_MATH.randomIntSeed(12, 16, seed);
    var startingprize = 25000;
    var tracksnum = gtf_MATH.randomIntSeed(3,5, seed);
    var trackids = [8,9,10,11,12]
    var limit = 28.0;
    var fpplimit = Math.ceil(gtf_MATH.randomIntSeed(480,750, seed) / 10) * 10
    var weatherchange = 20

    difficulty = 45
  }
  else if (level == "S") {
    var randid = 4
    var grid = gtf_MATH.randomIntSeed(20, 24, seed);
    var startingprize = 100000;
    var tracksnum = gtf_MATH.randomIntSeed(2,3, seed);
    var trackids = [13,14,15]
    var limit = gtf_MATH.randomIntSeed(80,100, seed);
    var fpplimit = 9999
    var weatherchange = 25

    difficulty = 45
  }
  if (typeof regulations === 'string') {
    event = {}
  }
  seed = seed + randid

  var date = new Date();
  var month = date.getMonth();
  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  var year = date.getFullYear();
  var countries = []
  
  /// Cartype
  var cartypes = []
  gtf_TOOLS.unique(gtf_CARS.list("types").map(x => x.split(":")[0])).map(function(x){
    var loop = 0
    if (x == "Production") {
      loop = 60
    } else if (x == "Race Car") {
      loop = 35
    } else if (x == "Concept" || x == "Formula" || x == "Rally Car") {
      loop = 10
    }
    for (var index = 0; index < loop; index++) {
      cartypes.push(x)
    }
  })

   if (level == "S") {
    cartypes = [gtf_TOOLS.randomItem(["Race Car: GT4", "Race Car: GT3", "Race Car: GT500", "Race Car: GT1", "Rally Car: WRC", "Race Car: LMP", "Concept: VGT", "Formula"], seed)]
  } else {
  cartypes = [gtf_TOOLS.randomItem(cartypes, seed)]
  }

  var creditsmulti = 1


  /////
  var rmake = []
  var rcountry = []
  var bop = false

  if (cartypes[0].includes("Aftermarket")) {
    cartypes = ["Production", "Aftermarket"]
  }
  /////
  var makes = gtf_CARS.list("makes");
  var makes = makes.filter(function(x) {
    var list = gtf_CARS.find({ makes: [x], types: cartypes })
    return list.length >= 3 && list.some(function(y) {
      var fpp = gtf_PERF.perf(y, "DEALERSHIP")["fpp"]
      return fpp <= fpplimit && (fpp >= fpplimit - 50)
  })
  })
  var makesfilter = []
  for (var i = 0; i < randid; i++) {
for (var y = 0; y < makes.length; y++) {
  makesfilter.push(makes[y]);
}
}

  if (makesfilter.length == 0) {
    rmake = []
  } else {
    rmake = [gtf_TOOLS.randomItem(makesfilter, seed)]
  }
  
  ////
  var countries = gtf_CARS.list("countries");
  var countries = countries.filter(function(x) {
    var list = gtf_CARS.find({ countries: [x], types: cartypes })
    return list.length >= 3 && list.some(function(y) {
      var fpp = gtf_PERF.perf(y, "DEALERSHIP")["fpp"]
      return fpp <= fpplimit && (fpp >= fpplimit - 50)
  })
  })
  var countriesfilter = []
  for (var i = 0; i < randid; i++) {
for (var y = 0; y < countries.length; y++) {
  countriesfilter.push(countries[y]);
}
}

  if (countriesfilter.length == 0) {
    rcountry = []
  } else {
    rcountry = [gtf_TOOLS.randomItem(countriesfilter, seed)]
  }

  ////
  var drivetrains = gtf_CARS.list("drivetrains");
  var drivetrains = drivetrains.filter(function(x) {
    var list = gtf_CARS.find({ drivetrains: [x], types: cartypes })
    return list.length >= 3 && list.some(function(y) {
      var fpp = gtf_PERF.perf(y, "DEALERSHIP")["fpp"]
      return fpp <= fpplimit && (fpp >= fpplimit - 50)
  })
  })
  var drivetrainsfilter = []
  for (var i = 0; i < randid; i++) {
for (var y = 0; y < drivetrains.length; y++) {
  drivetrainsfilter.push(drivetrains[y]);
}
}
  if (drivetrainsfilter.length == 0) {
    var rdrivetrain = []
  } else {
    var rdrivetrain = [gtf_TOOLS.randomItem(drivetrainsfilter, seed)]
  }

  ///choosing
  var choose = ["Make", "Type", "Drivetrain", "Country"]
  var indexr = gtf_MATH.randomIntSeed(0,choose.length-1, seed)
choose = choose[indexr]
  var subtitle = ""
  if (level == "S") {
    choose = "Type"
  }
if (choose == "Make") {
  subtitle = rmake[0]
  rcountry = []
  cartypes = []
  rdrivetrain = []
} else if (choose == "Type") {
  
  subtitle = cartypes[0]
  rcountry = []
  rmake = []
  rdrivetrain = []
} else if (choose == "Country") {
  subtitle = rcountry[0]
  cartypes = []
  rmake = []
  rdrivetrain = []
} else if (choose == "Drivetrain") {
  subtitle = rdrivetrain[0]
  cartypes = []
  rmake = []
  rcountry = []
}
  if (typeof subtitle === "undefined") {
    subtitle = ""
  }

if (cartypes.length != 0) {
  if (cartypes[0].includes("Race Car") || cartypes[0].includes("Rally Car") || cartypes[0].includes("Formula") || cartypes[0].includes("Concept")) {
    var lowerfpp = 0
    bop = true
  } else {
    var lowerfpp = fpplimit - 40
    bop = false
  }
} else {
  var lowerfpp = fpplimit - 40
  bop = false
}
  
  var tracks = [];

  var eventid = "SEASONAL" + level + "-" + number;
  
  for (var x = 0; x < tracksnum; x++) {
    var track = gtf_TRACKS.random({types:["Tarmac"], versions:["Gran Turismo"], seed: seed + trackids[x]}, 1)[0]
    var km = track.length;
    var distance = gtf_RACE.lapCalc(km, limit);
    tracks.push([x + 1, track.name, distance[0]]);
  }

  var pl = ["st", "nd", "rd", "th"];
  var positions = [];

  var prize = startingprize * creditsmulti;
  date = month + day + year;
  
if (cartypes.includes("Production")) {
  if (gtf_MATH.randomIntSeed(0, 3, seed) == 1) {
    var c = gtf_CARS.random({ upperfpp: fpplimit + 50, lowerfpp: fpplimit - 50 }, 1)[0];
    var prizec =  {
      "id": -1,
      "name": "Gold Reward",
      "type": "RANDOMCAR",
      "item": {
        "makes": [
           c["make"]
        ],
        "fullnames": [c["name"] + " " + c["year"]]
      }
    }
  } 
 else {
    var prizec = {
        "id": -1,
        "name": "Gold Reward",
        "type": "CREDITS",
        "item": (prize * tracksnum)
      }
  }
} else {
   if (gtf_MATH.randomIntSeed(0, 3, seed) == 1) {
     var prizec = {
       "id": -1,
       "name": "Gold Reward",
       "type": "RANDOMCAR",
       "item": { types: cartypes}
     }
  } else {
     var prizec = {
       "id": -1,
       "name": "Gold Reward",
       "type": "CREDITS",
       "item": (prize * tracksnum)
     }
  }
  
}

  var time = [gtf_TOOLS.randomItem(["Day", "Sunrise", "Sunset", "Night"], seed)]
  var weather = [gtf_TOOLS.randomItem(["Clear", "Partly Cloudy", "Overcast", "Rain"], seed)]
  var gridstart = ["STANDING", "ROLLINGSTART"][gtf_MATH.randomIntSeed(0, 1, seed)]

  if (gtf_MATH.randomIntSeed(0,1, seed) == 1) {
    weatherchange = 0
  }

  ///
  if (cartypes.includes("Production")) {
    var tires = "Sports: Soft"
  } else {
    var tires = "Racing: Soft"
  }

  var event = {
    "title": subtitle + " " + "Seasonal Event",
    "eventid": eventid,
    "require": "",
    "positions": [
      {
        "place": "1st",
        "credits": startingprize
      }
    ],
    "startposition": 6,
    "tracks": tracks,
    "type": "LAPS",
    "time": time,
    "timeprogression": 1,
    "weather": weather,
    "weatherwetsurface": 0, 
    "weatherchange": weatherchange,
    "tireconsumption": 1, 
    "fuelconsumption": 0, 
    "grid": [
       grid
    ],
    "gridstart": gridstart,
    "difficulty": difficulty,
    "damage": true,
    "bop": true,
    "championship": false,
    "car": "GARAGE",
    "regulations": {
      "tires": tires,
      "fpplimit": fpplimit,
      "upperfpp": fpplimit,
      "lowerfpp": lowerfpp,
      "upperpower": 9999,
      "lowerpower": 0,
      "upperweight": 9999,
      "lowerweight": 0,
      "upperyear": 9999,
      "loweryear": 0,
      "countries": rcountry,
      "makes": rmake,
      "models": [

      ],
      "engines": [

      ],
      "drivetrains": rdrivetrain,
      "types": cartypes,
      "special": [

      ],
      "prohibited": []
    },
    "prize": prizec
  }
  
  event["mode"] = "CAREER"
  event["positions"] = gtf_RACE.creditsCalc(event)
  return event;
};

module.exports.randomSeasonalTimeTrial = function (regulations, level, number, seed) {
  var difficulty = 50
  if (level == "IB") {
    var randid = 2
    var startingprize = 7000;
    var trackid = 101
    var limit = 18.0;
    var weatherchange = 10
  }
  if (typeof regulations === 'string') {
    event = {}
  }
  seed = seed + randid

  var date = new Date();
  var month = date.getMonth();
  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  var year = date.getFullYear();
  var countries = []

  /// Cartype
  var cartypes = []
  gtf_TOOLS.unique(gtf_CARS.list("types").map(x => x.split(":")[0])).map(function(x){
    var loop = 0
    if (x == "Production") {
      loop = 60
    } else if (x == "Race Car") {
      loop = 35
    } else if (x == "Concept" || x == "Formula" || x == "Rally Car") {
      loop = 10
    }
    for (var index = 0; index < loop; index++) {
      cartypes.push(x)
    }
  })

  if (level == "S") {
    cartypes = [gtf_TOOLS.randomItem(["Race Car: GT4", "Race Car: GT3", "Race Car: GT500", "Race Car: GT1", "Rally Car: WRC", "Race Car: LMP", "Concept: VGT", "Formula"], seed)]
  } 
  else {
  cartypes = [gtf_TOOLS.randomItem(cartypes, seed)]
  }

  var creditsmulti = 1
  /////
  var rmake = []
  var rcountry = []
  var bop = false

  if (cartypes[0].includes("Aftermarket")) {
    cartypes = ["Production", "Aftermarket"]
  }

  ///choosing
  var choose = ["Make", "Type", "Drivetrain", "Country"]
  var indexr = gtf_MATH.randomIntSeed(0,choose.length-1, seed)
choose = choose[indexr]
  var subtitle = ""
  if (level == "S") {
    choose = "Type"
  }
  
  if (typeof subtitle === "undefined") {
    subtitle = ""
  }


  var car = gtf_CARS.random({ lowerfpp: 400, upperfpp: 700, types: ["Production"], seed: seed + trackid}, 1)[0]
  var carname = car["name"] + " " + car["year"]

  var tracks = [];

  var eventid = "SEASONAL" + level + "-" + number;

  var track = gtf_TRACKS.random({types:["Tarmac"], versions:["Gran Turismo"], seed: seed + trackid}, 1)[0]
  var km = track.length;
  var distance = gtf_RACE.lapCalc(km, limit);
  var tracks =[[1, track.name, "100%"]]

  var pl = ["st", "nd", "rd", "th"];
  var positions = [];

  var prize = startingprize * creditsmulti;
  date = month + day + year;

if (cartypes.includes("Production")) {
    var prizec = {
        "id": -1,
        "name": "Gold Reward",
        "type": "CREDITS",
        "item": 20000
      }
} 

  var time = [gtf_TOOLS.randomItem(["Day", "Sunrise", "Sunset", "Night"], seed)]
  var weather = [gtf_TOOLS.randomItem(["Clear", "Partly Cloudy", "Overcast", "Rain"], seed)]
  var gridstart = ["STANDING", "ROLLINGSTART"][gtf_MATH.randomIntSeed(0, 1, seed)]

  if (gtf_MATH.randomIntSeed(0,1, seed) == 1) {
    weatherchange = 0
  }

  ///

  var event = {
    "title": subtitle + "Time Trial Seasonal Event",
    "eventid": eventid,
    "require": "",
    "positions": [
      {
        "place": "1st",
        "credits": startingprize,
        "time": 0,
      }
    ],
    "startposition": 1,
    "tracks": tracks,
    "type": "TIMETRIAL",
    "time": time,
    "timeprogression": 1,
    "weather": weather,
    "weatherwetsurface": 0, 
    "weatherchange": weatherchange,
    "tireconsumption": 1, 
    "fuelconsumption": 0, 
    "grid": [
       1
    ],
    "gridstart": gridstart,
    "difficulty": difficulty,
    "damage": false,
    "bop": false,
    "championship": false,
    "car": carname,
    "regulations": {
      "tires": car["tires"],
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
      "models": [
      ],
      "engines": [
      ],
      "drivetrains": [],
      "types": [],
      "special": [],
      "prohibited": []
    },
    "prize": prizec
  }

  event["mode"] = "CAREER"
  event["positions"] = gtf_RACE.creditsCalc(event)
  return event;
}

module.exports.randomSeasonalDriftTrial = function (regulations, level, number, seed) {
  var difficulty = 90
  if (level == "IB") {
    var randid = 2
    var startingprize = 15000;
    var trackid = 101
    var limit = 18.0;
    var fpplimit = Math.ceil(gtf_MATH.randomIntSeed(400,574, seed) / 10) * 10
    var weatherchange = 10

    difficulty = 80
  }
  else if (level == "IA") {
    var randid = 3
    var startingprize = 25000;
    var trackid = 102
    var limit = 28.0;
    var fpplimit = Math.ceil(gtf_MATH.randomIntSeed(480,750, seed) / 10) * 10
    var weatherchange = 20

    difficulty = 45
  }
  else if (level == "S") {
    var randid = 4
    var startingprize = 100000;
    var trackid = 103
    var limit = gtf_MATH.randomIntSeed(80,100, seed);
    var fpplimit = 9999
    var weatherchange = 25

    difficulty = 45
  }
  if (typeof regulations === 'string') {
    event = {}
  }
  seed = seed + randid

  var date = new Date();
  var month = date.getMonth();
  var day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  var year = date.getFullYear();
  var countries = []

  /// Cartype
  var cartypes = []
  gtf_TOOLS.unique(gtf_CARS.list("types").map(x => x.split(":")[0])).map(function(x){
    var loop = 0
    if (x == "Production") {
      loop = 60
    } else if (x == "Race Car") {
      loop = 35
    } else if (x == "Concept" || x == "Formula" || x == "Rally Car") {
      loop = 10
    }
    for (var index = 0; index < loop; index++) {
      cartypes.push(x)
    }
  })

  if (level == "S") {
    cartypes = [gtf_TOOLS.randomItem(["Race Car: GT4", "Race Car: GT3", "Race Car: GT500", "Race Car: GT1", "Rally Car: WRC", "Race Car: LMP", "Concept: VGT", "Formula"], seed)]
  } 
  else {
  cartypes = [gtf_TOOLS.randomItem(cartypes, seed)]
  }

  var creditsmulti = 1
  /////
  var rmake = []
  var rcountry = []
  var bop = false

  if (cartypes[0].includes("Aftermarket")) {
    cartypes = ["Production", "Aftermarket"]
  }

  ///choosing
  var choose = ["Make", "Type", "Drivetrain", "Country"]
  var indexr = gtf_MATH.randomIntSeed(0,choose.length-1, seed)
choose = choose[indexr]
  var subtitle = ""
  if (level == "S") {
    choose = "Type"
  }

if (cartypes.length != 0) {
  if (cartypes[0].includes("Race Car") || cartypes[0].includes("Rally Car") || cartypes[0].includes("Formula") || cartypes[0].includes("Concept")) {
    var lowerfpp = 0
    bop = true
  } else {
    var lowerfpp = fpplimit - 40
    bop = false
  }
} else {
  var lowerfpp = fpplimit - 40
  bop = false
}

var car = gtf_CARS.random({ lowerfpp: 400, upperfpp: 700, types: ["Production"], drivetrains: ["FR", "MR"], seed: seed + trackid}, 1)[0]
  car = car["name"] + " " + car["year"]

  var tracks = [];

  var eventid = "SEASONAL" + level + "-" + number;

  var track = gtf_TRACKS.random({types:["Tarmac"], versions:["Gran Turismo"], options: ["Drift"], seed: seed + trackid}, 1)[0]
  var km = track.length;
  var distance = gtf_RACE.lapCalc(km, limit);
  var tracks =[[1, track.name, "100%"]]

  var pl = ["st", "nd", "rd", "th"];
  var positions = [];

  var prize = startingprize * creditsmulti;
  date = month + day + year;


var prizec = {
       "id": -1,
       "name": "Gold Reward",
       "type": "CREDITS",
       "item": (prize)
     }

  var time = [gtf_TOOLS.randomItem(["Day", "Sunrise", "Sunset", "Night"], seed)]
  var weather = [gtf_TOOLS.randomItem(["Clear", "Partly Cloudy", "Overcast", "Rain"], seed)]
  var gridstart = ["STANDING", "ROLLINGSTART"][gtf_MATH.randomIntSeed(0, 1, seed)]

  if (gtf_MATH.randomIntSeed(0,1, seed) == 1) {
    weatherchange = 0
  }

  ///
  if (cartypes.includes("Production")) {
    var tires = "Sports: Soft"
  } else {
    var tires = "Racing: Soft"
  }

  var event = {
    "title": "Drift Trial Seasonal Event",
    "eventid": eventid,
    "require": "",
    "positions": [
      {
        "place": "1st",
        "credits": 8000,
        "time": 0,
      },
      {
        "place": "2nd",
        "credits": 5000,
        "time": 0,
      },
      {
        "place": "3rd",
        "credits": 2000,
        "time": 0,
      }
    ],
    "startposition": 1,
    "tracks": tracks,
    "type": "DRIFT",
    "time": time,
    "timeprogression": 1,
    "weather": weather,
    "weatherwetsurface": 0, 
    "weatherchange": weatherchange,
    "tireconsumption": 1, 
    "fuelconsumption": 0, 
    "grid": [
       1
    ],
    "gridstart": gridstart,
    "difficulty": difficulty,
    "damage": true,
    "bop": true,
    "championship": false,
    "car": car,
    "regulations": {
      "tires": "Comfort: Soft",
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
      "models": [
      ],
      "engines": [
      ],
      "drivetrains": [],
      "types": [],
      "special": [],
      "prohibited": []
    },
    "prize": prizec
  }

  event["mode"] = "CAREER"
  event["positions"] = gtf_RACE.creditsCalc(event)
  return event;
}

module.exports.randomLimitedSeasonal = function () {
var fs = require("fs")
var event = gtf_SEASONAL.randomSeasonal({}, "IA", 0, gtf_MATH.randomInt(0,9999999))
event["eventid"] = "SEASONALLIMITED-1"
event["title"] = "🚘 Limited Time Event"
event["start"] = 0
event["prize"] = gtf_LIST_BOT["seasonallimitedeventprize"]
  fs.writeFile(gtf_TOOLS.homeDir() + "jsonfiles/seasonallimitedevent_temp.json", require("json-format")(event), function (err) {
    if (err) {
      console.log(err);
    }
  });
};

module.exports.checkseasonals = function() {
   
    var date = new Date()
    var timeofday = date.getDay()

  if (timeofday == 0 || Math.abs((gtf_DATETIME.getCurrentDay() - parseInt( gtf_LIST_BOT["seasonaldate"].slice(0,-4)))) >= 7) {
  if (typeof gtf_LIST_BOT["seasonaldate"] === 'undefined' || Math.abs((gtf_DATETIME.getCurrentDay() - parseInt( gtf_LIST_BOT["seasonaldate"].slice(0,-4)))) >= 7) {
      gtf_LIST_BOT["seasonaldate"] = gtf_DATETIME.getCurrentWeekDay().toString() + date.getFullYear().toString()
      console.log("NEWROTATION")
       if ((Object.keys(gtf_LIST_SEASONALEX).length >= 1 && gtf_LIST_SEASONALEX["start"] == gtf_LIST_BOT['seasonaldate']) && gtf_LIST_SEASONALEX["start"] != 0) {
         console.log("NEWSEASONAL")
    //
       }
require("fs").writeFile(gtf_TOOLS.homeDir() + "jsonfiles/_botconfig.json", require("json-format")(gtf_LIST_BOT), function (err) {
    if (err) {
      console.log(err);
    }
  });

  }
 }

  function announceseasonal() {
    var event = gtf_LIST_SEASONALEX
    var car = gtf_CARS.get({make: event["prize"]["item"]["makes"][0], fullname: event["prize"]["item"]["fullnames"][0]})
        var message = "In Seasonal Events (**/seasonal**), complete all races in the limited time event to earn the " + "**" + car["name"] + " " + car["year"] + "**" + " in your garage!" 

          var embed = new EmbedBuilder()
          var channel = gtf_SERVERGUILD.channels.cache.find(channel => channel.id === "687872420933271577");
          embed.setTitle("🎉 __New Limited Time Event Available__")
          embed.setColor(0x0151b0)
          embed.setDescription(message)
          embed.setImage(car["image"][0])
          gtf_DISCORD.send(channel, { type1: "CHANNEL", embeds: [embed] })
  }
  }

  