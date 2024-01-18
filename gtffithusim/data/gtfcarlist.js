// REMOTE
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.addCarEnthu = function (car, arg, userdata) {
  var fullname = car["name"] + " " + car["year"];

  if (arg != "LOAN") {
    if (gte_STATS.garage(userdata).length == 0) {
      gte_STATS.setCurrentCar(1, undefined, userdata);
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

  var condition = {oil:car["condition"], clean:car["condition"], engine:car["condition"], transmission: car["condition"], suspension:car["condition"], body:car["condition"]}

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
    livery: { current: "Default"},
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
      nitrous: { current: "Default", tuning: [-999, -999, -999]},
      items: []
    },
    rims: { current: "Default", list: [], tuning: [-999, -999, -999] },
    condition: condition,
    totalmileage: 0
  };
  newcar["fpp"] = gte_PERF.perfEnthu(newcar, "GARAGE")["fpp"];


  if (arg == "ITEM" || arg == "LOAN") {
    return newcar;
  } else {
    userdata["garage"].push(newcar);
    if (arg == "SORT") {
      userdata["garage"] = gte_STATS.sortGarage(userdata);
    }
    gte_STATS.saveEnthu(userdata);
    return;
  }
};