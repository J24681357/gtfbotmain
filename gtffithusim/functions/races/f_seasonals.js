const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.randomSeasonal = function (regulations, level, number, seed) {
  var difficulty = 90
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
  else if (level == "IB") {
    var randid = 2
    var grid = gtf_MATH.randomIntSeed(12, 16, seed);
    var startingprize = 15000;
    var tracksnum = gtf_MATH.randomIntSeed(2,4, seed);
    var trackids = [4,5,6,7]
    var limit = 18.0;
    var fpplimit = Math.ceil(gtf_MATH.randomIntSeed(400,574, seed) / 10) * 10
    var weatherchange = 10

    difficulty = 55
  }
  else if (level == "IA") {
    var randid = 3
    var grid = gtf_MATH.randomIntSeed(12, 16, seed);
    var startingprize = 25000;
    var tracksnum = gtf_MATH.randomIntSeed(3,5, seed);
    var trackids = [8,9,10,11,12]
    var limit = 28.0;
    var fpplimit = Math.ceil(gtf_MATH.randomIntSeed(500,799, seed) / 10) * 10
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
    var weatherchange = 30

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
  gte_TOOLS.unique(gtf_CARS.list("types").map(x => x.split(":")[0])).map(function(x){
    var loop = 0
    if (x == "Production") {
      loop = 60
    } else if (x == "Race Car") {
      loop = 30
    } else if (x == "Concept" || x == "Formula" || x == "Rally Car") {
      loop = 15
    }
    for (var index = 0; index < loop; index++) {
      cartypes.push(x)
    }
  })

  if (level == "A") {
    cartypes = ["Production"]
  } else if (level == "S") {
    cartypes = [gte_TOOLS.randomItem(["Race Car: GT4", "Race Car: GT3", "Race Car: LMP", "Concept", "Concept: VGT", "Formula"], seed)]
  } else {
  cartypes = [gte_TOOLS.randomItem(cartypes, seed)]
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
      var fpp = gte_PERF.perfEnthu(y, "DEALERSHIP")["fpp"]
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
    rmake = [gte_TOOLS.randomItem(makesfilter, seed)]
  }
  
  if (cartypes[0].includes("Race Car") || cartypes[0].includes("Rally Car") || cartypes[0].includes("Formula")) {
    var lowerfpp = 0
    bop = true
  } else {
    var lowerfpp = fpplimit - 30
  }
  
  ////
  var countries = gtf_CARS.list("countries");
  var countries = countries.filter(function(x) {
    var list = gtf_CARS.find({ countries: [x], types: cartypes })
    return list.length >= 3 && list.some(function(y) {
      var fpp = gte_PERF.perfEnthu(y, "DEALERSHIP")["fpp"]
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
    rcountry = [gte_TOOLS.randomItem(countriesfilter, seed)]
  }

  ////
  var drivetrains = gtf_CARS.list("drivetrains");
  var drivetrains = drivetrains.filter(function(x) {
    var list = gtf_CARS.find({ drivetrains: [x], types: cartypes })
    return list.length >= 3 && list.some(function(y) {
      var fpp = gte_PERF.perfEnthu(y, "DEALERSHIP")["fpp"]
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
    var rdrivetrain = [gte_TOOLS.randomItem(drivetrainsfilter, seed)]
  }

  ///choosing
  var choose = ["Make", "Type", "Type", "Country"]
  var indexr = gtf_MATH.randomIntSeed(0,choose.length-1, seed)
choose = choose[indexr]
  var subtitle = ""
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
  
  var tracks = [];

  var eventid = "SEASONAL" + level + "-" + number;
  
  for (var x = 0; x < tracksnum; x++) {
    var track = gtf_TRACKS.random({types:["Tarmac"], seed: seed + trackids[x]}, 1)[0]
    var km = track.length;
    var distance = gte_RACE.lapCalc(km, limit);
    tracks.push([x + 1, track.name, distance[0]]);
  }

  var pl = ["st", "nd", "rd", "th"];
  var positions = [];

  var prize = startingprize * creditsmulti;
  date = month + day + year;
  
if (cartypes.includes("Production")) {
  if (gtf_MATH.randomIntSeed(0, 1, seed) == 1) {

  var prizec = {
      "id": -1,
      "name": "Gold Reward",
      "type": "CREDITS",
      "item": prize * tracksnum
    }
  } else {
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
} else {
   if (gtf_MATH.randomIntSeed(0, 1, seed) == 1) {
  var prizec = {
      "id": -1,
      "name": "Gold Reward",
      "type": "CREDITS",
      "item": prize * tracksnum
    }
  } else {
    var prizec = {
      "id": -1,
      "name": "Gold Reward",
      "type": "RANDOMCAR",
      "item": { types: cartypes}
    }
  }
  
}

  var time = [gte_TOOLS.randomItem(["Day", "Sunrise", "Sunset", "Night"], seed)]
  var weather = [gte_TOOLS.randomItem(["Clear", "Partly Cloudy", "Overcast", "Rain"], seed)]
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
      "upperyear": 2005,
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
  event["positions"] = gte_RACE.creditsCalc(event)
  return event;
};

module.exports.randomLimitedSeasonal = function () {
var fs = require("fs")
var event = gte_SEASONAL.randomSeasonal({}, "IA", 0, (0+0) * 999)
event["eventid"] = "SEASONALLIMITED-1"
event["title"] = "🚘 Limited Time Event"
event["start"] = 0
event["prize"] = gte_MAIN.bot["seasonallimitedeventprize"]
  fs.writeFile("./jsonfiles/seasonallimitedevent_temp.json", require("json-format")(event), function (err) {
    if (err) {
      console.log(err);
    }
  });
};
