//REMOTE
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
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
    var condition = gte_CONDITION.condition(gtfcar)

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
    var engine = gte_PARTS.find({ name: gtfcar["perf"]["engine"]["current"], type: "engine" })[0];
    var transmission = gte_PARTS.find({ name: gtfcar["perf"]["transmission"]["current"], type: "transmission" })[0];
    var suspension = gte_PARTS.find({ name: gtfcar["perf"]["suspension"]["current"], type: "suspension" })[0];
    var weightred = gte_PARTS.find({ name: gtfcar["perf"]["weightreduction"]["current"], type: "weight-reduction" })[0];
    var turbo = gte_PARTS.find({ name: gtfcar["perf"]["turbo"]["current"], type: "turbo" })[0];
    var brakes = gte_PARTS.find({ name: gtfcar["perf"]["brakes"]["current"], type: "brakes" })[0];
    var aeropart = gte_PARTS.find({ name: gtfcar["perf"]["aerokits"]["current"], type: "aerokits" })[0];
    var carengine = gte_PARTS.find({ name: gtfcar["perf"]["carengine"]["current"], type: "carengine" })[0];
    var ballast = undefined

    if (gtfcar["perf"]["items"].length != 0) {
    var ballast = gte_PARTS.find({type: gtfcar["perf"]["items"].filter(x => x["name"] == "Ballast Weight")[0]["name"]})[0]
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
      aero = aero + suspp;
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
    console.log(classs)
    console.log(Math.round(nnfpp))

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

