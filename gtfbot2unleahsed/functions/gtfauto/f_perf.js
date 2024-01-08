//REMOTE
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.perf = function(gtfcar, condition) {
  var power = gtfcar["power"];
  var weight = gtfcar["weight"];
  var aero = gtfcar["aerom"];
  var drivetrain = gtfcar["drivetrain"];

  if (condition == "DEALERSHIP") {
    var value = gtf_CARS.costCalc(gtfcar)
    var sell = gtf_GTFAUTO.sellCalc(value);

    var offset = 3000 - weight;
    offset = Math.round(offset / 30);

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }


    var nnfpp1 = (aero - 1)

    if (gtfcar["tires"].includes("Comfort")) {
      var tirechoices = { "Comfort: Hard": 0, "Comfort: Medium": 1, "Comfort: Soft": 2 }
      var rank = tirechoices[gtfcar["tires"]]
      rank = rank - 2
      nnfpp1 = nnfpp1 + (0.4 * rank)
    }
    else if (gtfcar["tires"].includes("Sports")) {
      var tirechoices = { "Sports: Hard": 0, "Sports: Medium": 1, "Sports: Soft": 2 }
      var rank = tirechoices[gtfcar["tires"]]
      nnfpp1 = nnfpp1 + (0.5 * rank)
    }
    else if (gtfcar["tires"].includes("Racing")) {
      var tirechoices = { "Racing: Hard": 0, "Racing: Medium": 1, "Racing: Soft": 2 }
      var rank = tirechoices[gtfcar["tires"]]
      rank = rank - 2
      nnfpp1 = nnfpp1 + (0.5 * rank) + 1.4
    }
    //0.5
    ///weight 35
    var powerratio = (power / weight) - 0.50
    var nnfpp2 = 22 * Math.pow(power, (0.5 + ((nnfpp1) * 0.008))) - 50
    var nnfpp3 = ((3000 - weight) / 15) + 100
    var nnfpp4 = (900 * offset_dt) + ((nnfpp1) * 5)
    var nnfpp = nnfpp2 + (nnfpp3 / 1200) * nnfpp4

    nnfpp = (nnfpp * 1) + (20 * (powerratio)) + 25
    if (aero <= 2 && nnfpp >= 590) {
      nnfpp = nnfpp - (-nnfpp * (0.2 * ((nnfpp + 348) / 590) - 1)) + (590 - 187.60)
    }
    ////

    var fueleco = (-power / 30) + 100
    if (gtfcar["type"].includes("Race Car") && gtfcar["type"] != "Race Car: Other") {
      fueleco = (-power / 100) + 80
    }
    if (gtfcar["engine"] == "EV") {
      fueleco = 20
    }
    if (fueleco <= 5) {
      fueleco = 5
    }
    return {
      fpp: Math.round(nnfpp),
      opower: power,
      power: power,
      oweight: weight,
      weight: weight,
      fueleco: fueleco,
      osell: gtfcar["cost"],
      sell: sell
    };
  }

  if (condition == "GARAGE") {
    var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })
    var condition = gtf_CONDITION.condition(gtfcar)

    power = ocar["power"];
    weight = ocar["weight"];
    aero = ocar["aerom"];
    drivetrain = ocar["drivetrain"];

    var value = gtf_CARS.costCalc(ocar)
    var sell = gtf_GTFAUTO.sellCalc(value, condition["health"]);
    if (sell <= 1000) {
      sell = 1000
    }
    var osell = sell.valueOf()

    /// PARTS
    var engine = gtf_PARTS.find({ name: gtfcar["perf"]["engine"]["current"], type: "engine" })[0];
    var transmission = gtf_PARTS.find({ name: gtfcar["perf"]["transmission"]["current"], type: "transmission" })[0];
    var suspension = gtf_PARTS.find({ name: gtfcar["perf"]["suspension"]["current"], type: "suspension" })[0];
    var weightred = gtf_PARTS.find({ name: gtfcar["perf"]["weightreduction"]["current"], type: "weight-reduction" })[0];
    var turbo = gtf_PARTS.find({ name: gtfcar["perf"]["turbo"]["current"], type: "turbo" })[0];
    var brakes = gtf_PARTS.find({ name: gtfcar["perf"]["brakes"]["current"], type: "brakes" })[0];
    var aeropart = gtf_PARTS.find({ name: gtfcar["perf"]["aerokits"]["current"], type: "aerokits" })[0];
    var carengine = gtf_PARTS.find({ name: gtfcar["perf"]["carengine"]["current"], type: "carengine" })[0];
    var ballast = undefined

    if (gtfcar["perf"]["items"].length != 0) {
      var ballast = gtf_PARTS.find({ type: gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight")[0]["name"] })[0]
    }
    if (carengine !== undefined) {
      power = carengine["percent"]
      weight = weight + (weight * (carengine["weight"]))
      value += carengine["cost"]
      sell += gtf_GTFAUTO.sellCalc(carengine["cost"]);
    }
    if (engine !== undefined) {
      var enginep = (100 + engine["percent"]) / 100;
      power = power * enginep;
      value += engine["cost"]
      sell += gtf_GTFAUTO.sellCalc(engine["cost"]);
    }
    if (suspension !== undefined) {
      var suspp = suspension["percent"] / 100;
      aero = aero * suspp;
      value += suspension["cost"]
      sell += gtf_GTFAUTO.sellCalc(suspension["cost"]);
    }
    if (weightred !== undefined) {
      var weightredp = (100 - weightred["percent"]) / 100;
      if (carengine !== undefined) {
        weight = (weight * weightredp) + (weight * 0.05)
      } else {
        weight = weight * weightredp;
      }
      value += weightred["cost"]
      sell += gtf_GTFAUTO.sellCalc(weightred["cost"]);
    }
    if (turbo !== undefined) {
      var turbop = (100 + turbo["percent"]) / 100;
      power = power * turbop;
      value += turbo["cost"]
      sell += gtf_GTFAUTO.sellCalc(turbo["cost"]);
    }
    if (brakes !== undefined) {
      var brakesp = brakes["percent"] / 100;
      aero = aero * brakesp;
      value += brakes["cost"]
      sell += gtf_GTFAUTO.sellCalc(brakes["cost"]);
    }
    if (aeropart !== undefined) {
      var aeropartp = (100 + aeropart["percent"]) / 100;
      if (aeropart["name"] != "Default") {
        if (gtfcar["perf"]["aerokits"]["tuning"][0] == 0 || gtfcar["perf"]["aerokits"]["tuning"][0] == -999) {
          aero = aero * aeropartp
        } else {
          aero = aero * (aeropartp + (0.1 * (gtfcar["perf"]["aerokits"]["tuning"][0] - 3)));
        }
      }
      value += aeropart["cost"]
      sell += gtf_GTFAUTO.sellCalc(aeropart["cost"]);
    }
    ///////
    if (ballast !== undefined) {
      if (typeof gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight")[0]["tuning"] !== "undefined") {
        weight = weight + ((20 * gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight")[0]["tuning"][0]) * 2.20462)
      }
    }
    ///////
    var oil = gtfcar["condition"]['oil']
    if (oil <= 60) {
      power = power - (power * (0.05 * ((60 - oil) / 60)))
    }
    var enginecond = gtfcar["condition"]['engine']
    if (enginecond <= 30) {
      power = power - (power * (0.10 * ((30 - enginecond) / 30)))
    }
    ///////

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }

    var nnfpp1 = (aero - 1)

    if (ocar["tires"].includes("Comfort")) {
      var tirechoices = { "Comfort: Hard": 0, "Comfort: Medium": 1, "Comfort: Soft": 2 }
      var rank = tirechoices[ocar["tires"]]
      rank = rank - 2
      nnfpp1 = nnfpp1 + (0.4 * rank)
    }
    else if (ocar["tires"].includes("Sports")) {
      var tirechoices = { "Sports: Hard": 0, "Sports: Medium": 1, "Sports: Soft": 2 }
      var rank = tirechoices[ocar["tires"]]
      nnfpp1 = nnfpp1 + (0.5 * rank)
    }
    else if (ocar["tires"].includes("Racing")) {
      var tirechoices = { "Racing: Hard": 0, "Racing: Medium": 1, "Racing: Soft": 2 }
      var rank = tirechoices[ocar["tires"]]
      rank = rank - 2
      nnfpp1 = nnfpp1 + (0.5 * rank) + 1.4
    }
    //0.5
    ///weight 35
    var powerratio = (power / weight) - 0.50
    var nnfpp2 = 22 * Math.pow(power, (0.5 + ((nnfpp1) * 0.008))) - 50
    var nnfpp3 = ((3000 - weight) / 15) + 100
    var nnfpp4 = (900 * offset_dt) + ((nnfpp1) * 5)
    var nnfpp = nnfpp2 + (nnfpp3 / 1200) * nnfpp4

    nnfpp = (nnfpp * 1) + (20 * (powerratio)) + 25

    if (aero <= 2 && nnfpp >= 590) {
      nnfpp = nnfpp - (-nnfpp * (0.2 * ((nnfpp + 348) / 590) - 1)) + (590 - 187.60)
    }
    //// 

    var fueleco = (-power / 30) + 100
    if (ocar["type"].includes("Race Car") && ocar["type"] != "Race Car: Other") {
      fueleco = (-power / 100) + 80
    }
    if (ocar["engine"] == "EV") {
      fueleco = 20
    }
    if (fueleco <= 5) {
      fueleco = 5
    }
    return {
      fpp: Math.round(nnfpp),
      opower: ocar["power"],
      power: Math.round(power),
      oweight: ocar["weight"],
      weight: Math.round(weight),
      fueleco: fueleco,
      value: value,
      osell: Math.round(osell),
      sell: Math.round(sell)
    };
  }
};
module.exports.perfEnthu = function (gtfcar, condition) {
  var power = gtfcar["power"];
  var weight = gtfcar["weight"];
  var aero = gtfcar["aerom"];
  var drivetrain = gtfcar["drivetrain"];

  if (condition == "DEALERSHIP") {
    var value = gtf_CARS.costCalc(gtfcar)
    var sell = gtf_GTFAUTO.sellCalc(value);

    var offset = 3000 - weight;
    offset = Math.round(offset / 30);

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }


      var nnfpp1 = (aero - 1) 

     if (gtfcar["tires"].includes("Comfort")) {
       var tirechoices = {"Comfort: Hard": 0, "Comfort: Medium": 1, "Comfort: Soft": 2}
      var rank = tirechoices[gtfcar["tires"]]
      rank = rank - 2
      nnfpp1 = nnfpp1 + (0.4*rank)
    } 
     else if (gtfcar["tires"].includes("Sports")) { 
      var tirechoices = {"Sports: Hard": 0, "Sports: Medium": 1, "Sports: Soft": 2}
      var rank = tirechoices[gtfcar["tires"]]
      nnfpp1 = nnfpp1 + (0.5*rank) 
    } 
     else if (gtfcar["tires"].includes("Racing")) {
      var tirechoices = {"Racing: Hard": 0, "Racing: Medium": 1, "Racing: Soft": 2}
      var rank = tirechoices[gtfcar["tires"]]
      rank = rank - 2
      nnfpp1 = nnfpp1 + (0.5*rank) + 1.4
    }
      //0.5
      ///weight 35
    var powerratio = (power/weight) - 0.50
     var nnfpp2 = 22 * Math.pow(power, (0.5 + ((nnfpp1) * 0.008))) - 50
      var nnfpp3 = ( (3000 - weight)/15 ) + 100
      var nnfpp4 = (900 * offset_dt) + ((nnfpp1) * 5)
      var nnfpp = nnfpp2 + (nnfpp3 /1200) * nnfpp4

      nnfpp = (nnfpp * 1) + (20 * (powerratio)) + 25
  if (aero <= 2 && nnfpp >= 590) {
    nnfpp = nnfpp - (-nnfpp * (0.2*((nnfpp+348)/590)-1)) + (590-187.60)
  }
    ////

    var fueleco = (-power/30) + 100
    if (gtfcar["type"].includes("Race Car") && gtfcar["type"] != "Race Car: Other") {
      fueleco = (-power/100) + 80
    }
    if (gtfcar["engine"] == "EV") {
      fueleco = 20
    }
    if (fueleco <= 5) {
      fueleco = 5
    }

    var classs = "F"

      if (nnfpp >= 309) {
        classs = "E"
      } 
      if (nnfpp >= 389) {
        classs = "D"
      } 
      if (nnfpp >= 469) {
        classs = "C"
      } 
      if (nnfpp >= 549) {
        classs = "B"
      } 
      if (nnfpp >= 619) {
        classs = "A"
      }
      if (gtfcar["type"].includes("Race Car") || gtfcar["type"].includes("Rally Car")) {
        classs = "R"
      }

    return {fpp: Math.round(nnfpp),
            class: classs,
            opower: power,
            power: power,
            oweight: weight,
            weight: weight,
            fueleco: fueleco,
            osell: gtfcar["cost"],
            sell: sell };
  }

  if (condition == "GARAGE") {
    var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })
    var condition = gtf_CONDITION.condition(gtfcar)

    power = ocar["power"];
    weight = ocar["weight"];
    aero = ocar["aerom"];
    drivetrain = ocar["drivetrain"];

    var value = gtf_CARS.costCalc(ocar)
    var sell = gtf_GTFAUTO.sellCalc(value,condition["health"]);
    if (sell <= 1000) {
      sell = 1000
    }
    var osell = sell.valueOf()

    /// PARTS
    var engine = gtf_PARTS.find({ name: gtfcar["perf"]["engine"]["current"], type: "engine" })[0];
    var transmission = gtf_PARTS.find({ name: gtfcar["perf"]["transmission"]["current"], type: "transmission" })[0];
    var suspension = gtf_PARTS.find({ name: gtfcar["perf"]["suspension"]["current"], type: "suspension" })[0];
    var weightred = gtf_PARTS.find({ name: gtfcar["perf"]["weightreduction"]["current"], type: "weight-reduction" })[0];
    var turbo = gtf_PARTS.find({ name: gtfcar["perf"]["turbo"]["current"], type: "turbo" })[0];
    var brakes = gtf_PARTS.find({ name: gtfcar["perf"]["brakes"]["current"], type: "brakes" })[0];
    var aeropart = gtf_PARTS.find({ name: gtfcar["perf"]["aerokits"]["current"], type: "aerokits" })[0];
    var carengine = gtf_PARTS.find({ name: gtfcar["perf"]["carengine"]["current"], type: "carengine" })[0];
    var ballast = undefined

    if (gtfcar["perf"]["items"].length != 0) {
    var ballast = gtf_PARTS.find({type: gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight")[0]["name"]})[0]
    }
    if (carengine !== undefined) {
      power = carengine["percent"]
      weight = weight + (weight * (carengine["weight"]))
      value += carengine["cost"]
      sell += gtf_GTFAUTO.sellCalc(carengine["cost"]);
    }
    if (engine !== undefined) {
      var enginep = (100 + engine["percent"]) / 100;
      power = power * enginep;
      value += engine["cost"]
      sell += gtf_GTFAUTO.sellCalc(engine["cost"]);
    }
    if (suspension !== undefined) {
      var suspp = suspension["percent"] / 100;
      aero = aero * suspp;
      value += suspension["cost"]
      sell += gtf_GTFAUTO.sellCalc(suspension["cost"]);
    }
    if (weightred !== undefined) {
      var weightredp = (100 - weightred["percent"]) / 100;
      if (carengine !== undefined) {
        weight = (weight * weightredp) + (weight*0.05)
      } else {
      weight = weight * weightredp;
      }
      value += weightred["cost"]
      sell += gtf_GTFAUTO.sellCalc(weightred["cost"]);
    }
    if (turbo !== undefined) {
      var turbop = (100 + turbo["percent"]) / 100;
      power = power * turbop;
      value += turbo["cost"]
      sell += gtf_GTFAUTO.sellCalc(turbo["cost"]);
    }
    if (brakes !== undefined) {
      var brakesp = brakes["percent"] / 100;
      aero = aero * brakesp;
      value += brakes["cost"]
      sell += gtf_GTFAUTO.sellCalc(brakes["cost"]);
    }
    if (aeropart !== undefined) {
      var aeropartp = (100 + aeropart["percent"]) / 100;
      if (aeropart["name"] != "Default") {
        if (gtfcar["perf"]["aerokits"]["tuning"][0] == 0 || gtfcar["perf"]["aerokits"]["tuning"][0] == -999) {
         aero = aero * aeropartp
        } else {
          aero = aero * (aeropartp + (0.1*(gtfcar["perf"]["aerokits"]["tuning"][0]-3)));
        }
      }
      value += aeropart["cost"]
      sell += gtf_GTFAUTO.sellCalc(aeropart["cost"]);
    }
    ///////
    if (ballast !== undefined) {
      if (typeof gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight")[0]["tuning"] !== "undefined") {
      weight = weight + ((20 * gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight")[0]["tuning"][0]) * 2.20462)
      }
    }
    ///////
    var oil = gtfcar["condition"]['oil']
    if (oil <= 60) {
      power = power - (power * (0.05 * ((60-oil)/60) ) )
    }
    var enginecond = gtfcar["condition"]['engine']
    if (enginecond <= 30) {
      power = power - (power * (0.10 * ((30-enginecond)/30) ) )
    }
    ///////

    var offset_dt = 1;
    if (drivetrain == "FF") {
      offset_dt = 0.95;
    }
    if (drivetrain == "MR") {
      offset_dt = 1.08;
    }
    if (drivetrain.includes("4WD")) {
      offset_dt = 1.05;
    }
    if (drivetrain == "RR") {
      offset_dt = 1.1;
    }

     var nnfpp1 = (aero - 1) 

    if (ocar["tires"].includes("Comfort")) {
         var tirechoices = {"Comfort: Hard": 0, "Comfort: Medium": 1, "Comfort: Soft": 2}
        var rank = tirechoices[ocar["tires"]]
        rank = rank - 2
        nnfpp1 = nnfpp1 + (0.4*rank)
      } 
       else if (ocar["tires"].includes("Sports")) { 
        var tirechoices = {"Sports: Hard": 0, "Sports: Medium": 1, "Sports: Soft": 2}
        var rank = tirechoices[ocar["tires"]]
        nnfpp1 = nnfpp1 + (0.5*rank) 
      } 
       else if (ocar["tires"].includes("Racing")) {
        var tirechoices = {"Racing: Hard": 0, "Racing: Medium": 1, "Racing: Soft": 2}
        var rank = tirechoices[ocar["tires"]]
        rank = rank - 2
        nnfpp1 = nnfpp1 + (0.5*rank) + 1.4
      }
        //0.5
        ///weight 35
      var powerratio = (power/weight) - 0.50
       var nnfpp2 = 22 * Math.pow(power, (0.5 + ((nnfpp1) * 0.008))) - 50
        var nnfpp3 = ( (3000 - weight)/15 ) + 100
        var nnfpp4 = (900 * offset_dt) + ((nnfpp1) * 5)
        var nnfpp = nnfpp2 + (nnfpp3 /1200) * nnfpp4

        nnfpp = (nnfpp * 1) + (20 * (powerratio)) + 25

    if (aero <= 2 && nnfpp >= 590) {
      nnfpp = nnfpp - (-nnfpp * (0.2*((nnfpp+348)/590)-1)) + (590-187.60)
    }
      //// 

    var fueleco = (-power/30) + 100
    if (ocar["type"].includes("Race Car") && ocar["type"] != "Race Car: Other") {
      fueleco = (-power/100) + 80
    }
    if (ocar["engine"] == "EV") {
      fueleco = 20
    }
    if (fueleco <= 5) {
      fueleco = 5
    }

    var classs = "F"

      if (nnfpp >= 309) {
        classs = "E"
      } 
      if (nnfpp >= 389) {
        classs = "D"
      } 
      if (nnfpp >= 469) {
        classs = "C"
      } 
      if (nnfpp >= 549) {
        classs = "B"
      } 
      if (nnfpp >= 619) {
        classs = "A"
      }
      if (ocar["type"].includes("Race Car") || ocar["type"].includes("Rally Car")) {
        classs = "R"
      }

    return { fpp: Math.round(nnfpp),
            class: classs,
            opower: ocar["power"],
            power: Math.round(power),
            oweight: ocar["weight"],
            weight: Math.round(weight),
            fueleco: fueleco,
            value: value,
            osell: Math.round(osell),
            sell: Math.round(sell) };
  }
};
module.exports.speedCalc = function(number, gtfcar) {
  var jstat = require("jstat");
  total = 0
  for (var i = 0; i < 5; i++) {
    total = total + jstat.normal.sample(number * 1.43, 8)
  }

  var topspeed = total / 5
  ///
  var finalgear = gtfcar["perf"]["transmission"]["tuning"][0];
  if (finalgear == -999) {
    finalgear = 0
  }
  ///
  var aero = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })["aerom"]
  if (aero > 1) {
    topspeed = topspeed - (8 * aero)
  }
  ///

  if (finalgear <= 0) {
    topspeed = topspeed * (1 - 0.04 * Math.abs(finalgear));
  } else {
    topspeed = topspeed * (1 + 0.01 * Math.abs(finalgear));
  }
  return [gtf_MATH.convertMiToKm(topspeed), Math.round(topspeed)];
};
module.exports.speedCalcConstant = function(number, gtfcar) {
  var jstat = require("jstat");

  var topspeed = number * 1.3
  ///
  var finalgear = gtfcar["perf"]["transmission"]["tuning"][0];
  if (finalgear == -999) {
    finalgear = 0
  }
  ///
  var aero = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })["aerom"]
  if (aero > 1) {
    topspeed = topspeed - (8 * aero)
  }
  ///

  if (finalgear <= 0) {
    topspeed = topspeed * (1 - 0.04 * Math.abs(finalgear));
  } else {
    topspeed = topspeed * (1 + 0.01 * Math.abs(finalgear));
  }
  return [gtf_MATH.convertMiToKm(topspeed), Math.round(topspeed)];
};
module.exports.tireWearCalc = function(racesettings, tire) {
  var tires = {
    "Comfort: Hard": 700, "Comfort: Medium": 660, "Comfort: Soft": 620,
    "Sports: Hard": 580, "Sports: Medium": 450, "Sports: Soft": 360,
    "Racing: Heavy Wets": 60, "Racing: Intermediate": 135, "Racing: Hard": 270, "Racing: Medium": 180, "Racing: Soft": 90, "Rally: Dirt": 1000, "Rally: Snow": 1000
  }
  var total = tires[tire]
  var length = racesettings["distance"]["km"] / 20
  // 10030
  var weathernum = racesettings["weather"]["wetsurface"]
  if (tire.includes("Rally")) {
    return 0
  }
  if (weathernum <= 33) {
    return 100 * (length / (total / racesettings["tireconsumption"]))
  } else {
    return 100 * ((length / (total / racesettings["tireconsumption"])) * (1 - ((weathernum - 33) / 70)))
  }
}
module.exports.fuelCalc = function(racesettings, fueleco) {
  if (racesettings["fuelconsumption"] == 0) {
    return 0
  }

  var length = racesettings["distance"]["km"] / 20

  //49 - 75 - x4 - 70% 
  //4.3% per lap | 7 
  // (length*0.35)


  return length * (((0.465) * racesettings["fuelconsumption"]) * (fueleco / 100))
}
module.exports.tires = function(fpp, car, weather, racesettings) {
  var tireclass = car["tires"].split(":")[0];
  var weathernum = weather["wetsurface"];

  if (tireclass == "Comfort") {
    var tirechoices = { "Comfort: Hard": 1, "Comfort: Medium": 2, "Comfort: Soft": 3 }
    var rank = tirechoices[car["tires"]]
    if (car["user"]) {
    }
    var increment = Math.round((fpp * 1.006) - fpp)
    while (rank > 0) {
      fpp = fpp + increment
      if (car["user"]) {
      }
      rank--
    }

  }
  else if (tireclass == "Sports") {
    var tirechoices = { "Sports: Hard": 1, "Sports: Medium": 2, "Sports: Soft": 3 }
    var rank = tirechoices[car["tires"]]
    if (car["user"]) {
    }
    var increment = Math.round((fpp * 1.02) - fpp)
    while (rank > 0) {
      fpp = fpp + increment
      if (car["user"]) {
      }
      rank--
    }
  }
  else if (tireclass == "Racing") {
    var tirechoices = { "Racing: Intermediate": -2, "Racing: Heavy Wet": -1, "Racing: Hard": 1, "Racing: Medium": 2, "Racing: Soft": 3 }
    var rank = tirechoices[car["tires"]]
    if (car["user"]) {
    }
    var increment = Math.round((fpp * 1.03) - fpp)
    while (rank > 0) {
      var multiplier = 1
      if (weathernum < 33) {
        fpp = fpp + ((increment) * multiplier)
      } else {
        if (car["user"]) {
          fpp = (fpp + increment) - (fpp) * ((1 / 6) * (weathernum / 100))
          break;
        }
      }

      if (rank >= 2) {
        multiplier = 0.5
      }
      rank--
    }

  }

  var tirewear = car["tirewear"]
  fpp = fpp - (30 * ((100 - car["tirewear"]) / 100))
  if (car["user"]) {
  }
  return Math.round(fpp)
}
