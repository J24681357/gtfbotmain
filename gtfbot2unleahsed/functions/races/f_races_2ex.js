const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////


module.exports.raceLengthCalc = function(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  var fppavg = 0;
  finalgrid.forEach(function(x) {
    fppavg = fppavg + x["fpp"];
  });
  fppavg = fppavg / finalgrid.length;
  var racelength = 0
  for (var i = 0; i < 20; i++) {
    var speed = gtf_GTF.lengthAlpha(fppavg, userdata["raceinprogress"]["weatherhistory"][i], racesettings["track"]);
    racelength = racelength + ((racesettings["distance"]["km"] / speed) * 3600 * 1000) / 20
  }

  return racelength;
};

///SSRX///
module.exports.speedtestresults = function(racelength, racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  var fpp = gtf_PERF.perf(racesettings["driver"]["car"], "GARAGE")["fpp"];

  var carspeed = gtf_PERF.speedCalc(gtf_GTF.lengthAlpha(fpp, racesettings["weather"], racesettings["track"]), racesettings["driver"]["car"]);

  if (racesettings["title"].includes("400m")) {
    var speedkmh = Math.round(carspeed[0] / 1.6)
    var speedmph = Math.round(carspeed[1] / 1.6)
  }
  if (racesettings["title"].includes("1,000m")) {
    var speedkmh = Math.round(carspeed[0] / 1.28)
    var speedmph = Math.round(carspeed[1] / 1.28)
  }
  var speeduser = [speedkmh + " kmh", speedmph + " mph"]
  speeduser = speeduser[userdata["settings"]["UNITS"]]


  gtf_STATS.addMileage(racesettings["distance"]["km"], userdata);
  gtf_STATS.addPlayTime(racelength, userdata);
  gtf_STATS.addTotalMileage(racesettings["distance"]["km"], userdata);
  gtf_STATS.addCarTotalMileage(racesettings["distance"]["km"], userdata);


  var results2 = "**Top Speed:** " + speeduser + "\n" + "**Car:** " + racesettings["driver"]["car"]["name"] + " **" + racesettings["driver"]["car"]["fpp"] + gtf_EMOTE.fpp + "**";
  return results2;
};
///CAREER///
module.exports.careerdifficultycalc = function(difficulty, weather, racesettings) {
  var num = difficulty
  var gtfcar = racesettings["driver"]["car"]
  var otires = gtfcar["perf"]["tires"]["current"].slice()

  if (racesettings["driver"]["tirechange"] && racesettings["driver"]["otires"].includes("Racing")) {
    if (weather["wetsurface"] < 20 && (otires.includes("Wet") || otires.includes("Intermediate"))) {
      gtfcar["perf"]["tires"]["current"] = gtfcar["perf"]["tires"]["list"].filter(x => x.includes("Hard") || x.includes("Medium") || x.includes("Soft"))[0]
    }
    if (weather["wetsurface"] >= 20) {
      gtfcar["perf"]["tires"]["current"] = "Racing: Intermediate"
    }
    if (weather["wetsurface"] >= 50) {
      gtfcar["perf"]["tires"]["current"] = "Racing: Heavy Wet"
    }
  }
  if (gtfcar["perf"]["tires"]["current"] !== otires) {
    return num
  }
  var fpp = gtf_PERF.perf(gtfcar, "GARAGE")["fpp"];
  /*
    var tires = gtf_PARTS.find({ name: gtfcar["perf"]["tires"]["current"], type: "tires" })[0]
  
    if (racesettings["regulations"]["tires"].includes("Sports")) {
      if (tires["name"].includes("Comfort")) {
        num = num - 10
      }
      if (tires["name"] == "Sports: Medium") {
        num = num + 3
      }
      if (tires["name"] == "Sports: Soft") {
        num = num + 7
      }
  
      if (tires["name"].includes("Racing")) {
        if (tires["name"].includes("Wet") || tires["name"].includes("Intermediate")) {
          num = num + 15
        } else {
          if (weather["wetsurface"] >= 20) {
            num = num + (20 * ( (50-weather["wetsurface"]) /100))
          } else {
            num = num + 20
        }
        }
  
      }
    }
  
    if (racesettings["regulations"]["tires"].includes("Racing")) {
      if (tires["name"].includes("Comfort")) {
        num = num - 20
      }
      if (tires["name"].includes("Sports")) {
        num = num - 10
      }
      if (tires["name"] == "Racing: Medium") {
        num = num + 5
      }
      if (tires["name"] == "Racing: Soft") {
        num = num + 8
      }
      if (tires["name"] == "Racing: Super Soft") {
        num = num + 10
      }
  
      if (weather["wetsurface"] >= 20 && (tires["name"].includes("Wet") || tires["name"].includes("Intermediate"))) {
      } else {
        if (weather["wetsurface"] >= 20) {
          if (tires["name"].includes("Racing")) {
            num = num - (20 * ( 1 - ((100 - weather["wetsurface"]) /100)))
          } else {
          num = num - (10 * ( 1 - ((100 - weather["wetsurface"]) /100)))
          }
        }
      }
    }
    */
  racesettings["driver"]["car"] = gtfcar
  num = parseInt(num)

  return [num];
};

///DRIFT///
module.exports.driftsection = function(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, last) {
  var difficulty = racesettings["difficulty"]; // low numbers = more difficult
  var score = gtf_MATH.randomInt(0, 99);
  ((racesettings["distance"]["km"] * 666) * racesettings["originalsectors"])
  var maxpoints = Math.ceil(((racesettings["distance"]["km"] * 666) * racesettings["originalsectors"]) / 1000) * 1000;
  var gold = Math.ceil(((racesettings["distance"]["km"] * 666 * 0.9) * racesettings["originalsectors"]) / 100) * 100;
  var silver = Math.ceil(((racesettings["distance"]["km"] * 666 * 0.7) * racesettings["originalsectors"]) / 100) * 100;
  var bronze = Math.ceil(((racesettings["distance"]["km"] * 666 * 0.45) * racesettings["originalsectors"]) / 100) * 100;

  var tire = gtf_PARTS.find({ name: racesettings["driver"]["car"]["perf"]["tires"]["current"], type: "tires" })[0]["name"];
  var points = gtf_MATH.randomInt(Math.round(maxpoints / 10), Math.round(maxpoints / 4));
  if (tire.includes("Racing")) {
    points = Math.round(points * 0.2);
  }
  if (tire.includes("Comfort")) {
    points = Math.round(points * 1.3);
  }
  points = Math.round(points * ((racesettings["difficulty"] / 50)))
  if (last && racesettings["sectors"] >= 1) {
    racesettings["sectors"]--;
    return [points, gold, silver, bronze];
  }

  if (racesettings["sectors"] <= 0) {
    points = 0;
  }

  if (gtf_MATH.randomInt(1,2) == 1) {
    points = 0;
  } else {
    racesettings["sectors"]--;
  }
  return [points, gold, silver, bronze];
};

module.exports.driftresults = function(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  var medal = "COMPLETE";
  var racemultibonus = ""
  var place = 3
  var place2 = "4th"
  var places = ["3rd", "2nd", "1st"]
  var prize = 0
  let final = require((__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/" + "functions/races/f_races_2ex").driftsection(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, true);
  racesettings["points"] += final[0];
  if (racesettings["points"] >= final[3]) {
    medal = gtf_EMOTE.bronzemedal + " BRONZE";
    place = 2
    place2 = "3rd"
  }
  if (racesettings["points"] >= final[2]) {
    medal = gtf_EMOTE.silvermedal + " SILVER";
    place = 1
    place2 = "2nd"
  }
  if (racesettings["points"] >= final[1]) {
    medal = gtf_EMOTE.goldmedal + " GOLD";
    place = 0
    place2 = "1st"
  }

  if (racesettings["mode"] == "CAREER") {
    var eventid = racesettings["eventid"]

    if (typeof userdata["careerraces"][eventid] === 'undefined') {
      var current = 0
    } else {
      var current = userdata["careerraces"][eventid][0];

    }

    if (current == 0) {
      current = "4th"
    } else if (current == "✅") {
      current = "1st"
    }


    for (var i = 0; i < places.length; i++) {
      if (parseInt(places[i].split(/[A-Z]/gi)[0]) < parseInt(current.split(/[A-Z]/gi)[0]) && place2 != "4th") {
        prize = prize + racesettings["positions"][(places.length - 1) - i]["credits"]
      }
      if (places[i] == place2) {
        break;
      }
    }

  } else {

    var prize = racesettings["positions"][place]["credits"]
    prize = Math.round(parseFloat(prize * (racesettings["distance"]["km"] / 10)));
  }

  if (gtf_STATS.raceMulti(userdata) > 1) {
    prize = Math.round(prize * gtf_STATS.raceMulti(userdata))
    racemultibonus = " `x" + gtf_STATS.raceMulti(userdata).toString() + "`"
  }

  gtf_STATS.addCredits(prize, userdata);
  gtf_STATS.addMileage(racesettings["distance"]["km"], userdata);
  gtf_STATS.addTotalMileage(racesettings["distance"]["km"], userdata);
  gtf_STATS.addDriftPoints(racesettings["points"], userdata)

  if (racesettings["mode"] == "CAREER") {
    if (place2 == "1st" || place2 == "2nd" || place2 == "3rd") {
      if (racesettings["eventid"].includes("gtacademy") || racesettings["eventid"].includes("grandtour")) {
        gtf_STATS.updateEvent(racesettings, place2, userdata)
      } else {
        /*
      setTimeout(function() {
      gtf_STATS.redeemGift("🎉 Completed " + racesettings["title"] + " 🎉", racesettings["prize"], embed, msg, userdata);
      }, 2000)
      */
      }
    }

  }
  var mileage = [gtf_MATH.round(racesettings["distance"]["km"], 3), gtf_MATH.round(racesettings["distance"]["mi"], 2)]

  var results2 = "**Points: " + gtf_MATH.numFormat(racesettings["points"]) + "pts"
    + " " + mileage[userdata["settings"]["UNITS"]] + ["km", "mi"][userdata["settings"]["UNITS"]] + gtf_EMOTE.mileage + "**\n" + "**" + medal + " " + "+" + gtf_MATH.numFormat(prize) + gtf_EMOTE.credits + racemultibonus + "**"

  return results2;
}

///ONLINE///
module.exports.onlinedifficultycalc = function(player, racesettings) {
  var num = 0
  var tires = gtf_PARTS.find({ name: player["tires"], type: "tires" })[0]

  if (tires["name"].includes("Comfort")) {
    num = num + 1
  }
  if (tires["name"] == "Sports: Hard") {
    num = num + 5
  }
  if (tires["name"] == "Sports: Medium") {
    num = num + 7
  }
  if (tires["name"] == "Sports: Soft") {
    num = num + 9
  }

  if (racesettings["weather"]["wetsurface"] >= 20 && (tires["name"].includes("Wet") || tires["name"].includes("Intermediate"))) {
    num = num + 20
  }
  else if (racesettings["weather"]["wetsurface"] >= 20 && tires["name"].includes("Racing")) {
    if (tires["name"].includes("Racing")) {
      num = num - (20 * (1 - ((100 - racesettings["weather"]["wetsurface"]) / 100)))
    } else {
      num = num - (10 * (1 - ((100 - racesettings["weather"]["wetsurface"]) / 100)))
    }
  } else {
    if (tires["name"] == "Racing: Hard") {
      num = num + 20
    }
    else if (tires["name"] == "Racing: Medium") {
      num = num + 23
    }
    else if (tires["name"] == "Racing: Soft") {
      num = num + 27
    }
    else if (tires["name"] == "Racing: Super Soft") {
      num = num + 30
    }
  }

  return [parseInt(num) / 30];
};
module.exports.onlineracelength = function(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  var fppavg = 0;
  racesettings["players"].forEach(function(x) {
    fppavg = fppavg + x["car"]["fpp"];
  });
  fppavg = fppavg / racesettings["players"].length;

  var racelength = 0
  for (var i = 0; i < 20; i++) {
    var speed = gtf_GTF.lengthAlpha(fppavg, userdata["raceinprogress"]["weatherhistory"][i], racesettings["track"]);
    racelength = racelength + ((racesettings["distance"]["km"] / speed) * 3600 * 1000) / 20
  }
  return racelength;
};

////TIMETRIAL///
module.exports.licensecheck = function(racesettings, racedetails, finalgrid, embed, msg, userdata) {
  var embed = new EmbedBuilder()
  var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0]

  var licenses = [...gtf_CAREERRACES.find({ types: ["LICENSE" + option] })]
  var ids = Object.keys(licenses)
  var bronzecomplete = gtf_STATS.checkLicenseTests(option, "3rd", userdata);
  var goldcomplete = gtf_STATS.checkLicenseTests(option, "1st", userdata);
  if (bronzecomplete && !gtf_STATS.checklicense(option, "", msg, userdata)) {
    setTimeout(function() { gtf_STATS.setLicense(option.toUpperCase(), userdata) }, 5000)

    var option = option.toLowerCase()
    var total = 6
    if (option.includes("ic")) {
      total = 4
    }
    var prize = licenses[ids[total - 1]]["prize"]
    gtf_STATS.redeemGift("🎉 License " + option.toUpperCase() + " Achieved 🎉", prize, embed, msg, userdata);
  }
  if (goldcomplete && gtf_STATS.raceEventStatus(licenses[0], userdata) != "✅") {
    var option = option.toLowerCase()
    var total = 6
    if (option.includes("ic")) {
      total = 4
    }
    gtf_STATS.setLicense(option.toUpperCase(), userdata);
    var args = licenses[ids[total]]["prize"]["item"]
    var car = gtf_CARS.random(args, 1)[0];
    gtf_STATS.addGift({
      id: -1, type: "CAR", name: "License " + option.toUpperCase() + ": All Gold Reward", item: car, author: "GT FITNESS", inventory: true
    }, userdata)
  }
}

////

module.exports.timetrialracelength = function(racesettings, racedetails, finalgrid, checkpoint, difficulty, embed, msg, userdata) {
  var fppavg = finalgrid[0]["fpp"];

  var speed = gtf_GTF.lengthAlpha(fppavg, racesettings["weather"], racesettings["track"]);

  var racelength = ((racesettings["distance"]["km"] / speed) * 3600 * 1000) * 0.8;
  var jstat = require("jstat");
  /*
  var levels = [1,5,10,15,20,25,30,35,40,45,50]
  levels.map(level => {
   var list = []

  for (var i = 0; i < 1; i++) {
     var beta = 0.5 - (0.2 * ((level/50)))
var value = (racelength * 0.94) + ((racelength * 0.94) * (jstat.gamma.mean(11, beta)/10))
  list.push(value)
}

  console.log("Level " + level + " Expected: " + gtf_DATETIME.getFormattedLapTime(gtf_MATH.median(list)))

  })
  */
  var beta = 0.5 - (0.2 * ((difficulty / 50)))
  var gold = (racelength * 0.94) + ((racelength * 0.94) * (jstat.gamma.mean(11, beta) / 10))
  gold = parseFloat((gold / 1000).toFixed(1))
  racesettings["positions"][0]["time"] = gold
  racesettings["positions"][1]["time"] = parseFloat((gold * 1.04).toFixed(1))
  racesettings["positions"][2]["time"] = parseFloat((gold * 1.12).toFixed(1))

  var beta = 0.5 - (0.2 * ((gtf_STATS.level(userdata) / 50)))
  racelength = (racelength * 0.94) + ((racelength * 0.94) * (jstat.gamma.sample(11, beta) / 10))
  if (racelength < racesettings["positions"][0]["time"]) {
    racelength = racelength + (0.7 * (racesettings["positions"][0]["time"] - racelength))
  }
  return racelength;
};

module.exports.timetriallap = function(racesettings, racedetails, finalgrid, checkpoint, racelength, embed, msg, userdata) {
  var rfail = 5 + (35 *
    ((100 - racesettings["difficulty"]) / 100)
  ) - (35 *
    ((50 - gtf_STATS.level(userdata)) / 100)
    )
  if (rfail <= 5) {
    rfail = 5
  } else if (rfail >= 40) {
    rfail = 40
  }
  var time = parseFloat(racelength)
  if (gtf_MATH.randomInt(1, 100) <= rfail) {
    time = 3600000
  }

  finalgrid[0]["laps"] = Object.assign([], userdata["raceinprogress"]["gridhistory"][0][0]["laps"])
  var newlap = {
    userid: userdata["id"],
    eventid: parseInt(racesettings["title"].split(" - ")[0].split(" ")[2]),
    time: time,
    lapnum: finalgrid[0]["laps"].length + 1,
    date: new Date(), best: false, medal: "NONE"
  }
  finalgrid = userdata["raceinprogress"]["gridhistory"][userdata["raceinprogress"]["gridhistory"].length - 1]

  newlap["medal"] = "NONE"
  newlap["medalemote"] = "⬛"

  var medals = ["GOLD", "SILVER", "BRONZE"]
  var medalemotes = [gtf_EMOTE.goldmedal, gtf_EMOTE.silvermedal, gtf_EMOTE.bronzemedal]
  for (var x = 0; x < medals.length; x++) {
    if (newlap["time"] == 3600000) {
      newlap["medal"] = "FAIL"
      newlap["medalemote"] = "❌"
      break;
    }
    if (newlap["time"] <= (racesettings["positions"][x]["time"]) * 1000) {
      newlap["medal"] = medals[x]
      newlap["medalemote"] = medalemotes[x]
      break;
    }
  }
  finalgrid[0]["laps"].push(newlap)

  var besttimeindex = finalgrid[0]["laps"].indexOf(finalgrid[0]["laps"].slice().sort(function(a, b) { return a.time - b.time }).filter(x => x["medal"] != "FAIL" || x["medal"] != "NONE")[0])
  finalgrid[0]["laps"].map(function(x, index) {
    if (index == besttimeindex) {
      x["best"] = true
    } else {
      x["best"] = false
    }
    return x
  })
  userdata["raceinprogress"]["gridhistory"].map(finalgrids => {
    finalgrids[0]["laps"] = finalgrid[0]["laps"]
    return finalgrids
  })
  return [newlap]

};

module.exports.timetrialresults = function(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  if (finalgrid[0]["laps"].filter(function(x) { return x["best"] == true }).length == 0) {
    return "NONE"
  }
  var bestlap = finalgrid[0]["laps"].filter(function(x) { return x["best"] == true && x["medal"] != "FAIL" })[0]
  if (typeof bestlap === 'undefined') {
    bestlap = { time: 0, medal: "NONE", medalemote: "⬛" }
  }

  var place = "4th"
  var places = ["3rd", "2nd", "1st"]
  var prize = 0
  var racemultibonus = ""

  if (racesettings["eventid"].includes("LICENSE")) {
    var eventid = racesettings["eventid"].replace("LICENSE", "").toLowerCase()

    if (typeof userdata["licenses"][eventid] === 'undefined') {
      var current = 0
    } else {
      var current = userdata["licenses"][eventid][0];
    }

  } else {

    if (typeof userdata["careerraces"][eventid] === 'undefined') {
      var current = 0
    } else {
      var current = userdata["careerraces"][eventid][0];
    }

  }


  if (current == 0) {
    current = "4th"
  } else if (current == "✅") {
    current = "1st"
  }

  if (bestlap["medal"] == "BRONZE") {
    place = "3rd"
  } else if (bestlap["medal"] == "SILVER") {
    place = "2nd"
  } else if (bestlap["medal"] == "GOLD") {
    place = "1st"
  }

  for (var i = 0; i < places.length; i++) {
    if (parseInt(places[i].split(/[A-Z]/gi)[0]) < parseInt(current.split(/[A-Z]/gi)[0]) && place != "4th") {
      
      prize = prize + racesettings["positions"][(places.length - 1) - i]["credits"]
    }
    if (places[i] == place) {
      break;
    }
  }
  /*
    if (gtf_STATS.raceMulti(userdata) > 1) {
      prize = Math.round(prize * gtf_STATS.raceMulti(userdata))
      racemultibonus = " `x" + gtf_STATS.raceMulti(userdata).toString() + "`"
    }
    */

  if (prize == 0) {
    racemultibonus = ""
  }

  var exp = Math.round(prize / 80);

  gtf_STATS.addCredits(prize, userdata);
  var mileage = [gtf_MATH.round(racesettings["distance"]["km"] * finalgrid[0]["laps"].length, 3), gtf_MATH.round(racesettings["distance"]["mi"] * finalgrid[0]["laps"].length, 2)]
  gtf_STATS.addMileage(mileage[0], userdata);
  gtf_STATS.addTotalMileage(mileage[0], userdata);
  gtf_STATS.addExp(exp, userdata);
  if (racesettings["mode"] == "LICENSE" || racesettings["type"] == "TIMETRIAL") {
    var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0]
    if (option == "b" || option == "a" || option == "ic" || option == "ib" || option == "ia" || option == "s") {
      gtf_STATS.updateEvent(racesettings, place, userdata);
    } else {
      if (place == "1st" || place == "2nd" || place == "3rd") {
        if (racesettings["eventid"].includes("gtacademy") || racesettings["eventid"].includes("grandtour")) {
          gtf_STATS.updateEvent(racesettings, place, userdata)
        } else {
          setTimeout(function() {
            gtf_STATS.redeemGift("🎉 Completed " + racesettings["title"] + " 🎉", racesettings["prize"], embed, msg, userdata);
          }, 2000)
        }
      }

    }
  }


  var results2 = "**Best Lap:** " + gtf_DATETIME.getFormattedLapTime(bestlap["time"]) + " **" + mileage[userdata["settings"]["UNITS"]] + ["km", "mi"][userdata["settings"]["UNITS"]] + gtf_EMOTE.mileage + "\n" +
    gtf_DATETIME.getFormattedLapTime(bestlap["medalemote"]) + " " + gtf_DATETIME.getFormattedLapTime(bestlap["medal"]) + " +" + gtf_MATH.numFormat(prize) + gtf_EMOTE.credits + " +" + gtf_MATH.numFormat(exp) + gtf_EMOTE.exp + "**"
  /* else {
    var results2 = "**Best Lap In Session: **" + gtf_DATETIME.getFormattedLapTime(bestlap["time"]) +  " **+" + mileage[userdata["settings"]["UNITS"]] + " " + ["km", "mi"][userdata["settings"]["UNITS"]] + gtf_EMOTE.mileage + "**"
  }(/)
  */

  return results2;
}

module.exports.createRaceButtons = function(racesettings, racedetails, finalgrid, checkpoint, results2, buttons, emojilist, embed, msg, userdata) {
  var screen = true
  function goback() {
    userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: '', gridhistory: [], timehistory: [], weatherhistory: [], msghistory: [], championshipnum: 0 }

    msg.channel.messages.fetch().then(messages => {
      embed.thumbnail = ""
      var m = messages.filter(msge => msge.content.includes("**FINISH**") && msge.author.id == gtf_USERID).first();
      gtf_DISCORD.delete(m, { seconds: 2 })
    });
    if (racesettings["mode"] == "LICENSE") {
      if (racesettings['title'].includes("Invitation")) {
        var command = require((__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/" + "commands/car");
        command.execute(msg, { options: "list" }, userdata);
      } else {
        var e = racesettings["eventid"].replace("LICENSE", "").split("-");
        var command = require((__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/" + "commands/license")
        command.execute(msg, { options: e[0] }, userdata);
      }
    } else if (racesettings["mode"] == "CAREER") {
      var e = racesettings["eventid"].split("-");
      if (racesettings["title"].includes("Seasonal Event")) {
        var command = require((__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/" + "commands/seasonal");
        command.execute(msg,
          { options: e[0].split("SEASONAL")[1], number: e[1] }, userdata);
      } else {
        var command = require((__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/" + "commands/career");
        command.execute(msg, { options: e[0], number: e[1] }, userdata);
      }
    }
    else if (racesettings["mode"] == "ARCADE" || racesettings["mode"] == "DRIFT" || racesettings["mode"] == "SSRX") {
      var command = require((__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/" + "commands/arcade");
      command.execute(msg, { options: racesettings["mode"] }, userdata);
    }
  }
  function sessiondetails() {
    if (screen) {
      screen = false
      var griddd = finalgrid.slice().map(function(x) {
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
      if (griddd.length >= 10) {
        griddd = griddd.slice(0, 7).concat(griddd.slice(griddd.length - 3))
      }

      embed.setDescription(griddd.join("\n"));
      msg.edit({ embeds: [embed], components: buttons });
    } else {
      screen = true
      embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0])
      msg.edit({ embeds: [embed] });
    }
  }
  function continuechampionship() {
    clearInterval(timer)
    var championshipnum = userdata["raceinprogress"]["championshipnum"]
    if (isNaN(championshipnum)) {
      gtf_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred. Race Aborted.", embed: "", seconds: 0 }, msg, userdata);
        console.log(userdata["id"] + ": Championship Aborted ERROR");
        userdata["raceinprogress"] = {active:false, messageid: "", channelid: "", expire:'', gridhistory: [], timehistory: [], weatherhistory: [], msghistory: [], championshipnum:0 };
        gtf_STATS.save(userdata);
      return
    }
    if (userdata["raceinprogress"]["championshipnum"] == "DONE") {
      goback()
      return
    }

    embed.setTitle("__Points Standings__")
    var griddd = finalgrid.sort(function(a, b) { return b.points - a.points }).map(function(x, index) {
      if (x["user"]) {
        return "**" + (index + 1) + ". " + "`" + x["points"] + "pts`" + " " + x["name"] + "**"
      } else {
        return (index + 1) + ". " + "`" + x["points"] + "pts`" + " " + x["name"];
      }
    }).slice(0, 10)
    results2 = griddd
    finalgrid = finalgrid.reverse().map(function(x) {
      x["score"] = x["oscore"]
      x["tirewear"] = 100
      x["pitstops"] = 0
      x["fuel"] = 100
      x["laps"] = []
      return x
    })
    ////nexttrack

    racesettings = { ...gtf_LISTS.gtfcareerraces[racesettings["eventid"].toLowerCase().replace("-", "")] }

    var carselect = racesettings["car"] == "GARAGE" ? gtf_STATS.currentCar(userdata) : gtf_CARS.addCar(gtf_CARS.find({ fullnames: [racesettings["car"]] })[0], "LOAN")

    if (typeof msg.user === 'undefined') {
      racesettings["driver"] = { name: msg.guild.members.cache.get(userdata["id"]).user.displayName, car: carselect, otires: carselect["perf"]["tires"]["current"].slice(), tirechange: true }
    } else {
      racesettings["driver"] = { name: msg.user.displayName, car: carselect, otires: carselect["perf"]["tires"]["current"].slice(), tirechange: true }
    }
    var trackname = racesettings["tracks"][championshipnum][1]
    var laps = racesettings["tracks"][championshipnum][2]
    racesettings["mode"] = "CAREER"
    racesettings["eventlength"] = racesettings["tracks"].length

    if (typeof trackname !== 'string') {
      var t = gtf_COURSEMAKER.createCourse(trackname);
      racesettings["track"] = gtf_COURSEMAKER.displayCourse(t, bcallback)
      function bcallback(track) {
        racesettings["track"] = track
        racesettings["image"] = track["image"]
        racesettings["laps"] = 1
        racesettings["distance"] = { km: track["lengthkm"], mi: track["length"] }
        racesettings["track"]["name"] = "Stage " + (championshipnum + 1)
        racesettings["track"]["options"] = ["Drift"];
        racesettings["track"]["author"] = "GTFITNESS";

        continuenextrace()
      }
    } else {
      racesettings["track"] = gtf_TRACKS.find({
        name: [trackname]
      })[0]
      racesettings["image"] = racesettings["track"]["image"]
      racesettings["laps"] = laps
      racesettings["distance"] = { mi: Math.round((racesettings["track"]["length"] * laps) * 100) / 100, km: Math.round(((racesettings["track"]["length"] * laps) / 1.609) * 100) / 100 }
      continuenextrace()
    }
    ////
    function continuenextrace() {
      racesettings["positions"] = gtf_RACE.creditsCalc(racesettings, "")
      racesettings["title"] = racesettings["title"].split(" - ")[0] + " - " + "Race " + (championshipnum + 1)
      racesettings["time"] = gtf_TIME.random({ name: racesettings["time"], timeprogression: racesettings["timeprogression"] }, 1)[0];
      racesettings["weather"] = gtf_WEATHER.random({ name: racesettings["weather"], weatherchange: racesettings["weatherchange"], wetsurface: racesettings["weatherwetsurface"] }, 1)[0];
      racesettings["raceid"] = (championshipnum + 1)

      var prerace = gtf_RACE.preRaceMenu(racesettings, embed, msg, userdata)
      results = prerace[0]
      racedetails = prerace[1]
      var msgjson = prerace[2]

      embed.setDescription(results2.join("\n") + "\n\n" +
        racedetails + "\n" +
        gtf_EMOTE.loading + " Loading " + gtf_EMOTE.loading)
      msgjson.embeds[0].fields = []
      embed.fields = []

      msg.edit(msgjson).then(msg => {
        gtf_RACES2.startSession(racesettings, racedetails, finalgrid, false, embed, msg, userdata);
      })
    }
  }
  function continuelicense() {
    userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: '', gridhistory: [], timehistory: [], weatherhistory: [], msghistory: [], championshipnum: 0 }
    msg.channel.messages.fetch().then(messages => {
      var m = messages.filter(msge => msge.content.includes("**FINISH**") && msge.author.id == gtf_USERID).first();
      gtf_DISCORD.delete(m, { seconds: 2 })
    });
    var e = racesettings["eventid"].replace("LICENSE", "").split("-");
    var command = require((__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/" + "commands/license");
    var total = 7
    if (e[0] == "IC") {
      total = 5
    }
    if (parseInt(e[1]) + 1 > total) {
      command.execute(msg, { options: e[0] }, userdata);
    } else {
      command.execute(msg, { options: e[0], number: (parseInt(e[1]) + 1) }, userdata);
    }
  }
  function restart() {
    if (!racesettings["championship"] && racesettings["damage"] && racesettings["car"] == "GARAGE" && gtf_CONDITION.condition(gtf_STATS.currentCar(userdata))["health"] <= 20) {
      return
    }
    embed.setColor(0x0151b0);
    embed.spliceFields(0, 1);
    finalgrid = finalgrid.map(function(x) {
      x["score"] = x["oscore"]
      x["tirewear"] = 100
      x["pitstops"] = 0
      x["fuel"] = 100
      x["laps"] = []
      return x
    })
    gtf_RACES2.startSession(racesettings, racedetails, finalgrid, [false, null], embed, msg, userdata);
  }

  if (racesettings["mode"] == "CAREER") {
    if (racesettings["championship"]) {
      var functionlist = [continuechampionship, sessiondetails]
      if (userdata["raceinprogress"]["championshipnum"] != "DONE") {
        var timer = setInterval(function() {
          continuechampionship()
        }, 1000 * 10)
      }
    }
    else {
      var functionlist = [restart, sessiondetails, goback]
    }
  }
  else if (racesettings["mode"] == "LICENSE") {
    if (racesettings["title"].includes("Invitation")) {
      var functionlist = [sessiondetails, goback]
    } else {
      var functionlist = [restart, continuelicense, sessiondetails, goback]
    }
  }
  else if (racesettings["mode"] == "ONLINE") {
    var functionlist = [sessiondetails]
  }
  else {
    var functionlist = [restart, sessiondetails, goback]
  }
  gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
};

module.exports.updateGrid = function(racesettings, racedetails, finalgrid, checkpoint, timeinterval, number, message, embed, msg, userdata) {

  var playerpos = 0
  var difficulty = racesettings["difficulty"]
  var boost = 0
  var weather = userdata["raceinprogress"]["weatherhistory"][number]

  if (racesettings["mode"] == "CAREER") {
    difficulty = gtf_RACEEX.careerdifficultycalc(difficulty, weather, racesettings)[0]
  }

  var minfpp = finalgrid.slice(0).sort((x, y) => x["fpp"] - y["fpp"])[0]["fpp"]
  for (var i = 0; i < finalgrid.length; i++) {
    var fpp = finalgrid[i]["fpp"]
    var fppadj = gtf_PERF.tires(fpp, finalgrid[i], weather, racesettings)

    finalgrid[i]["overtakes"] = 0
    finalgrid[i]["prevposition"] = finalgrid[i]["position"]
    if (racesettings["mode"] == "ONLINE") {
      boost = 0.5 * (finalgrid[i]["level"] / 50)
      boost = boost + (0.2 * gtf_RACEEX.careerdifficultycalc(finalgrid[i], racesettings)[0])
    }
    var jstat = require("jstat")
    if (finalgrid[i]["user"]) {
      var rnum = gtf_MATH.randomInt(0, 99);
    }

    if (difficulty <= -1 && finalgrid[i]["user"]) {
      playerpos = finalgrid[i]["position"]
      var score = ((Math.abs(
        jstat.normal.sample(((fppadj * (0.90 + boost)) - minfpp), 35)
      ) * timeinterval) / 1000)
    }
    else if (rnum < difficulty && finalgrid[i]["user"]) {
      playerpos = finalgrid[i]["position"]
      var score = ((Math.abs(
        jstat.normal.sample(((fppadj * (1.20 + boost)) - minfpp), 35)
      ) * timeinterval) / 1000)

    }
    else if (finalgrid[i]["user"]) {
      playerpos = finalgrid[i]["position"]
      if (finalgrid[i]["position"] > 5) {
        var score = (Math.abs(
          jstat.normal.sample(((fppadj * (1.035 + boost)) - minfpp), 35)
        ) * timeinterval) / 1000

      } else {
        var score = (Math.abs(
          jstat.normal.sample(((fppadj * (1 + boost)) - minfpp), 35)
        ) * timeinterval) / 1000
      }
    }
    else {
      if (finalgrid[i]["position"] == 1) {
        var score =
          ((Math.abs(
            jstat.normal.sample(((fppadj * (1 + boost)) - minfpp), 35)
          ) * timeinterval) / 1000) / 1.15
      }
      else if (playerpos == 1) {
        var score = (Math.abs(
          jstat.normal.sample(((fppadj * (1.15 + boost)) - minfpp), 35)
        ) * timeinterval) / 1000
      } else {
        ///1
        var score = (Math.abs(
          jstat.normal.sample(((fppadj * (1 + boost)) - minfpp), 35)
        ) * timeinterval) / 1000
      }
    }
    finalgrid[i]["score"] = finalgrid[i]["score"] + Math.ceil((score / 2.2) * 100) / 100;


    ///tires
    if (typeof racesettings["driver"]["car"] === 'undefined') {
      finalgrid[i]["tires"] = "Sports: Hard"
    } else {
      finalgrid[i]["tires"] = racesettings["driver"]["car"]["perf"]["tires"]["current"].slice()
      if (racesettings["tireconsumption"] >= 1) {
        finalgrid[i]["tirewear"] = gtf_MATH.round(
          finalgrid[i]["tirewear"] - gtf_PERF.tireWearCalc(racesettings, finalgrid[i]["tires"]), 2)
        if (finalgrid[i]["tirewear"] <= 0) {
          finalgrid[i]["tirewear"] = 0
        }
        //180 RM and 270 for RH??
        var lapdiff = Math.ceil((number / 20) * racesettings["laps"]) != Math.ceil(((number + 1) / 20) * racesettings["laps"])
        if (finalgrid[i]["tirewear"] <= 35 && lapdiff) {
          finalgrid[i]["pitstops"] = finalgrid[i]["pitstops"] + 1
          finalgrid[i]["score"] = finalgrid[i]["score"] - 20000
          finalgrid[i]["tirewear"] = 100
        }
      }
    }


    if (racesettings["fuelconsumption"] >= 1) {
      finalgrid[i]["fuel"] = gtf_MATH.round(
        finalgrid[i]["fuel"] - gtf_PERF.fuelCalc(racesettings, finalgrid[i]["fueleco"]), 2)
      if (finalgrid[i]["fuel"] <= 0) {
        finalgrid[i]["fuel"] = 0
      }
      var lapdiff = Math.ceil((number / 20) * racesettings["laps"]) != Math.ceil(((number + 1) / 20) * racesettings["laps"])
      /*
      if (finalgrid[i]["fuel"] <= 20 && lapdiff) {
         finalgrid[i]["pitstops"] = finalgrid[i]["pitstops"] + 1
         finalgrid[i]["score"] = finalgrid[i]["score"] - 20000
        finalgrid[i]["fuel"] = 100
      }
      */
    }


    ////
  }



  finalgrid = finalgrid.sort((x, y) => y["score"] - x["score"])
  finalgrid = finalgrid.map(function(x, index) {
    x["position"] = index + 1
    if (x["position"] == 1) {
      x["gap"] = (0.000).toString()
    } else {
      var gap = ((finalgrid[0]["score"] - x["score"]) / 1000)
      x["gap"] = ((Math.ceil(gap * 1000) / 1000) * 1.16).toFixed(3);
      if (parseFloat(x["gap"]) >= 60) {
        x["gap"] = gtf_DATETIME.getFormattedTime(parseInt(x["gap"]) * 1000)
      }
    }
    if (x["user"]) {
      playerpos = x["position"]
    }
    x["overtakes"] = x["prevposition"] - x["position"]

    if (x["prevposition"] > x["position"] && x["position"] == 1) {
      if (racesettings["mode"] == "CAREER") {
        var name = [x["name"].split(" ").slice(0, -1).join(" "), x["drivername"]][userdata["settings"]["GRIDNAME"]]
        message = "\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "race-overtake-1st", name2: name }) + "`"
      }
    }
    if (x["prevposition"] > x["position"] && x["position"] <= 8 && x["overtakes"] >= 2) {
      if (racesettings["mode"] == "CAREER") {
        var name = [x["name"].split(" ").slice(0, -1).join(" ") + " " + "(#" + x["position"] + ")", x["drivername"]][userdata["settings"]["GRIDNAME"]]
        message = "\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "race-overtake-fast", name2: name }) + "`"
      }
    }
    if (x["prevposition"] < x["position"] && x["position"] <= 8 && x["overtakes"] <= -2) {
      if (racesettings["mode"] == "CAREER") {
        var name = [x["name"].split(" ").slice(0, -1).join(" ") + " " + "(#" + x["position"] + ")", x["drivername"]][userdata["settings"]["GRIDNAME"]]
        message = "\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "race-overtake-bad", name2: name }) + "`"
      }
    }
    ///DAMAGE
    if (gtf_MATH.randomInt(1, 10) <= 2) {
      var alpha = 2.5 * (timeinterval / 15000)
      x["damage"] = x["damage"] + alpha
    }

    return x
  })

  var xx = finalgrid.filter(x => x["user"] == true)[0]
  finalgrid = finalgrid.sort((x, y) => y["score"] - x["score"])

  return message

}
