const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
var Canvas = require("@napi-rs/canvas");

module.exports.purchase = function (item, type, special, embed, query , msg, userdata) {
  var dir = gte_TOOLS.homedir()

  var image = ""
  var info = ""
  var oldpartmessage = "";
  var successmessage = "";
  var fpp = "";
  var replacement = "";

  var part_inv = false;

  if (type == "CAR") {
    if (gte_STATS.garageFull(embed, msg, userdata)) {
      return;
    }
    var name = item["name"] + " " + item["year"];
    var fpp = gte_PERF.perfEnthu(item, "DEALERSHIP")["fpp"];
    var mcost = gtf_CARS.costCalc(item, fpp);
    var image = item["image"][0];

    var aeronum = (item["type"].includes("Race Car")) ? 0 : (item["image"].length - 1)

    var make = item["make"];

    info = "\n**" + fpp + "**" + gte_EMOTE.fpp + "**" + " | " + gtf_MATH.numFormat(item["power"]) + " hp" + " | " + gtf_MATH.numFormat(gte_STATS.weightUser(item["weight"], userdata)) + " " + gte_STATS.weightUnits(userdata) + "** | **" + item["drivetrain"] + "** | **" + item["engine"] + "**" + "\n**" + aeronum + " " + gte_EMOTE.aero + " Aero Kits" + " | " + item["livery"].length + " " + gte_EMOTE.livery + " Liveries" + "**";
var emojilist = [
  { emoji: gte_EMOTE.yes,
  emoji_name: "Yes",
  name: 'Purchase',
  extra: "Once",
  button_id: 0,
  },
  { emoji: "🚘",
  emoji_name: "🚘",
  name: 'Purchase & Change Car',
  extra: "Once",
  button_id: 1 },
  { emoji: gte_EMOTE.google,
  emoji_name: "google",
  name: 'Car Info',
  extra: "https://www.google.com/search?q=" + name.replace(/ /ig, "+"),
  button_id: 2 }, 
  {
      emoji: gte_EMOTE.exit,
  emoji_name: "gtfexit",
  name: 'Back',
  extra: "Once",
  button_id: 3
  }
]
      var results = "**" + name + "**" + " | **" + gtf_MATH.numFormat(mcost) + "**" + gte_EMOTE.credits + " " + info;

  }
  if (type == "ROLE") {
        var emojilist = [
  { emoji: gte_EMOTE.yes,
  emoji_name: "Yes",
  name: '',
  extra: " ",
  button_id: 0 }
]
    var name = item[0];
    var cost = item[1];
    var mcost = cost;
  }
  if (type == "PART") {

    var gtfcar = gte_STATS.currentCar(userdata);
    var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]});

    var type1 = item["type"];
    var name = item["type"] + " " + item["name"];

    var cost = gte_PARTS.costCalc(item, gtfcar, ocar)
    var mcost = cost

    if (type1 != "Car Wash") {

    if (type1 == "Aero Kits") {

      embed.setImage(ocar["image"][parseInt(item["name"].split(" ")[1])])
    }

    if (gtfcar["perf"][type1.toLowerCase().replace(/ /g, "")]["current"] == "Default") {
      var oldpart = { type: type1, name: "Default", cost: 0, percent: 0,
      engine: [],
      eligible: [],
      prohibited: [],
      fpplimit: 9999,
      lowerweight: 0}
    } else {
      var oldpart = gte_PARTS.find({ name: gtfcar["perf"][type1.toLowerCase().replace(/ /g, "")]["current"], type: type1 })[0];
    }

    oldpartmessage = "\nReplaced **" + gtfcar["perf"][type1.toLowerCase().replace(/ /g, "")]["current"] + "**.";

    if (gtfcar["perf"][type1.toLowerCase().replace(/ /g, "")]["list"].includes(item["name"])) {
      cost = 0;
      mcost = 0;
      part_inv = true;
    }

    var perf1 = gte_PERF.perfEnthu(gtfcar, "GARAGE");
    var perf2 = gte_PARTS.previewPart(item, gtfcar, "GARAGE");

    var powerdesc = "";
    var weightdesc = "";
    if (perf1["power"] != perf2["power"]) {
      powerdesc = "\n" + "**Power: " + perf1["power"] + "hp -> " + perf2["power"] + "hp**";
    }
    if (perf1["weight"] != perf2["weight"]) {
      var label = gte_STATS.weightUnits(userdata)
      weightdesc = "\n" + "**Weight: " + gtf_MATH.numFormat(gte_STATS.weightUser(perf1["weight"], userdata)) + label + " -> " + gtf_MATH.numFormat(gte_STATS.weightUser(perf2["weight"], userdata)) + label + "**";
    }

    info = "\n**FPP: " + perf1["fpp"] + gte_EMOTE.fpp + " -> " + perf2["fpp"] + "**" + gte_EMOTE.fpp + powerdesc + weightdesc;
    }

    /*
    if (gtfcar["livery"]["current"] != "Default") {
    var results = "Paint **" + gtfcar["livery"]["current"] + "** to **Default**? " + info + fpp;
    } else {
    var results = "Paint **" + gtfcar[type1.toLowerCase().replace(/ /g, "")]["current"] + "** to **Default**? " + info + fpp;
    }
    */

    var info = "\n**" + type1 + " " + gtfcar["perf"][type1.toLowerCase().replace(/ /g, "")]["current"] + " -> " + name + "**\n" + "⚠️ Any tuning adjustments from **/setup** will be reset." + "\n" + info;

  if (part_inv) {
    var results = "Reinstall **" + name + "** for **Free**? " + info;
  } else if (item["name"] == "Default") {
    var results = "Revert to **Default**? " + info;
  } else {
  var results = "**" + name + "**" + " | **" + gtf_MATH.numFormat(mcost) + "**" + gte_EMOTE.credits + " " + info;
  }

    var emojilist = [{
      emoji: gte_EMOTE.yes,
  emoji_name: "Yes",
  name: 'Purchase',
  extra: "Once",
  button_id: 0 },
        {
  emoji: gte_EMOTE.exit,
  emoji_name: "gtfexit",
  name: 'Back',
  extra: "Once",
  button_id: 1 }
    ]

  }
  if (type == "PAINT") {

    if (gte_STATS.currentCarFooter(userdata) == "No car.") {
      gte_EMBED.alert({ name: "❌ No Car", description: "You do not have a current car.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }
    var gtfcar = gte_STATS.currentCar(userdata);

    var type1 = "color";
    if (item["name"] == "Default") {
      var name = item["name"]
    } else {
    var name = item["type"] + " " + item["name"];
    }
    var cost = item["cost"];
    var mcost = cost;

    info = "\n**Paint: " + gtfcar[type1]["current"] + " -> " + name + "**\n";

    var results = "**" + name + "**" + " | **" + gtf_MATH.numFormat(mcost) + "**" + gte_EMOTE.credits + " " + info;

      var oldpart = gte_PAINTS.find({ name: gtfcar["color"]["current"], type: type1 })[0];
    oldpartmessage = "\nRepainted from **" + gtfcar["color"]["current"] + "**.";

    var emojilist = [
  { emoji: gte_EMOTE.yes,
  emoji_name: "Yes",
  name: 'Purchase',
  extra: "Once",
  button_id: 0 }
]
  }
  if (type == "WHEEL") {

    if (gte_STATS.currentCarFooter(userdata) == "No car.") {
      gte_EMBED.alert({ name: "❌ No Car", description: "You do not have a current car.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }
    var gtfcar = gte_STATS.currentCar(userdata);

    var type1 = "rims";
    if (item["name"] == "Default") {
      var name = item["name"]
    } else {
    var name = item["make"] + " " + item["name"];
    }
    var cost = item["cost"];
    var mcost = cost;

    info = "\n**Rims: " + gtfcar[type1]["current"] + " -> " + name + "**\n";

    var results = "**" + name + "**" + " | **" + gtf_MATH.numFormat(mcost) + "**" + gte_EMOTE.credits + " " + info;

      var oldpart = gte_PAINTS.find({ name: gtfcar[type1]["current"], type: type1 })[0];
    oldpartmessage = "\nApplied from **" + gtfcar[type1]["current"] + "**.";

    var emojilist = [
  { emoji: gte_EMOTE.yes,
  emoji_name: "Yes",
  name: 'Purchase',
  extra: "Once",
  button_id: 0 },
   {
      emoji: gte_EMOTE.exit,
  emoji_name: "gtfexit",
  name: 'Back',
  extra: "Once",
  button_id: 1 }
]
  }
  if (type == "DRIVER") {
    var emojilist = [
  { emoji: gte_EMOTE.yes,
  emoji_name: "Yes",
  name: 'Purchase',
  extra: "Once",
  button_id: 0 }
]

    var type1 = "driver";
    var name = item["name"];
    var cost = item["cost"];
    var mcost = cost;

    replacement = "\n**" + item["type"] + " Paint: " + userdata[type1][item["type"].toLowerCase() + "color"] + " -> " + name + "**\n";
    oldpartmessage = ""
    return purchasefunc(msg)
  }

  if (image.length != 0) {
    embed.setImage(image);
  }

  if (gte_STATS.credits(userdata) - mcost < 0) {
    gte_EMBED.alert(
      {
        name: "❌ Insufficient Credits",
        description: "You have insufficient credits to purchase the **" + name + "**.\n\n" + "**Credits: " + gtf_MATH.numFormat(gte_STATS.credits(userdata)) + gte_EMOTE.credits + "** -> **" + gtf_MATH.numFormat(mcost) + gte_EMOTE.credits + "**",
        embed: "",
        seconds: 3,
      },
      msg,
      userdata
    );
    return
  }


    if (special == "silent") {
      purchasefunc(msg)
      return
    }
  embed.setDescription(results);
  embed.setFields([{name:gte_STATS.menuFooter(userdata), value: gte_STATS.currentCarFooter(userdata)}]);

  var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);
   gte_DISCORD.send(msg, {embeds:[embed], components:buttons}, purchasefunc)

   function purchasefunc(msg) {
    function purchase() {
      if (type == "CAR") {
        gte_STATS.addCredits(-mcost, userdata);
        gtf_CARS.addCar(item, "SORT", userdata);
        successmessage = "Purchased " + "**" + name + "**." + " **-" + gtf_MATH.numFormat(mcost) + "**" + gte_EMOTE.credits;
        results = "Purchased " + "**" + name + "**." + " **-" + gtf_MATH.numFormat(mcost) + "**" + gte_EMOTE.credits;
        cost = mcost;
        gte_STATS.checkRewards("gtfcar", item, userdata);
      }
      if (type == "ROLE") {
        gte_STATS.addCredits(-cost, userdata);
        let role = msg.guild.roles.find(r => r.name === item[0]);
        user.roles.add(role).catch(console.error);
        successmessage = "\n" + "Purchased " + "**" + item[0] + "**." + " **-" + gtf_MATH.numFormat(cost) + "**" + gte_EMOTE.credits;
      }
      if (type == "PART") {

          gte_PARTS.installPart(item, userdata);

        if (part_inv) {
          successmessage = "Reinstalled " + name + " on **" + gtfcar["name"] + "**.";
        } else {
          if (cost > 0) {
          userdata["stats"]["numparts"]++
            gte_STATS.checkRewards("gtfauto", item, userdata);
        }
          gte_STATS.addCredits(-cost, userdata);
          successmessage = "Installed **" + name + "** on **" + gtfcar["name"] + "**." + " **-" + gtf_MATH.numFormat(cost) + "**" + gte_EMOTE.credits;
        }
        require(dir + "commands/tune").execute(msg, {options:"list", extra:successmessage}, userdata);
         gte_STATS.save(userdata);
        return
      }
      if (type == "PAINT") {

          gte_STATS.addCredits(-cost, userdata);
          gte_PAINTS.applyPaint(item, userdata);
          successmessage = "Painted **" + name + "** on **" + gtfcar["name"] + "**.";
        require(dir + "commands/paint").execute(msg, {options:"list", extra:successmessage}, userdata);

        gte_STATS.save(userdata);
        return
      }
      if (type == "WHEEL") {
        if (item["name"] == "Default") {
          gtf_WHEELS.applyWheels(item, userdata);
          successmessage = "Reinstalled " + name + " on **" + gtfcar["name"] + "**.";
        } else {
          gte_STATS.addCredits(-cost, userdata);
          gtf_WHEELS.applyWheels(item, userdata);
          successmessage = "Installed **" + name + "** on **" + gtfcar["name"] + "**." + " **-" + gtf_MATH.numFormat(cost) + "**" + gte_EMOTE.credits;
        }
        require(dir + "commands/wheels").execute(msg, {options:"list", extra:successmessage}, userdata);

        gte_STATS.save(userdata);
        return
      }
      if (type == "DRIVER") {
          userdata[type1][item["type"].toLowerCase() + "color"] = name

          successmessage = "Painted **" + name + "** on **" + item["type"] + "**.";
        require(dir + "commands/driver").execute(msg, {options:"list", extra:successmessage}, userdata);

        gte_STATS.save(userdata);
        return
      }

      /*
      if (part_tostock) {
        results = "Reinstalled " + name + " on **" + gtfcar["name"] + "**.";
      } else {
        results = successmessage;
      }
      */

      gte_EMBED.alert({ name: "✅ Success", description: results, embed: embed, seconds: 5 }, msg, userdata);

    }
    function purchasecarchange() {
        gte_STATS.addCredits(-mcost, userdata);
        gtf_CARS.addCar(item, undefined, userdata);
        var changecar = gte_STATS.setCurrentCar(gte_STATS.garage(userdata).length, {function:function(x) {return x}}, userdata);
        userdata["garage"] = gte_STATS.sortGarage(userdata)
        successmessage = "Purchased " + "**" + name + "**." + " **-" + gtf_MATH.numFormat(mcost) + "**" + gte_EMOTE.credits + "\n" + "Selected the **" + name + "**.";
        cost = mcost;
            gte_STATS.checkRewards("gtfcar", item, userdata);
        results = successmessage;
        gte_EMBED.alert({ name: "✅ Success", description: results, embed: embed, seconds: 5 }, msg, userdata);
    }
    function back() {

      query["number"] = undefined
      if (type == "CAR") {
        if (typeof query["name"] !== 'undefined') {
          query["options"] = "search"
        }
        require(dir + "commands/car").execute(msg, query, userdata);
        return
      }
      if (type == "ROLE") {
      }
      if (type == "PART") {
      require(dir + "commands/tune").execute(msg, query, userdata);
        return
      }
      if (type == "PAINT") {

      require(dir + "commands/paint").execute(msg, query, userdata);

        return
      }
      if (type == "WHEEL") {
      require(dir + "commands/wheels").execute(msg, query, userdata);
        return
      }
      if (type == "DRIVER") {
        return
      }
    }

    var functionlist = [purchase];
    if (special == "silent") {
      purchase()
      return
    }
    if (type == "CAR") {
      functionlist.push(purchasecarchange)
      functionlist.push(function() {})
    }
     functionlist.push(back)
    gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
  }
};
module.exports.sell = function (item, type, special, embed, query, msg, userdata) {
  var dir = gte_TOOLS.homedir()
  var results = "";
  if (type == "CAR") {
    var id = item["ID"];
    var name = item["name"];

    var sell = gte_PERF.perfEnthu(item, "GARAGE")["sell"];

    if (gte_CONDITION.condition(item)["health"] < 45) {
        gte_EMBED.alert({ name: "❌ Inadequate Condition", description: "You cannot sell a car in **Worn** condition." + "\n\n" + "❗ Choose another option when this message disappears", embed: "", seconds: 5 }, msg, userdata);
        return;
    }

      if (gte_STATS.currentCar(userdata)["id"] == id) {
        gte_EMBED.alert({ name: "❌ Current Car", description: "You cannot sell a car you are currently in." + "\n\n" + "❗ Choose another option when this message disappears", embed: "", seconds: 5 }, msg, userdata);
        return;
    }
    results = "⚠️ Sell **" + name + "** for **" + gtf_MATH.numFormat(sell) + "**" + gte_EMOTE.credits + "?";
  }
  if (type == "CARS") {
    var first = item[0];
    var last = item[1];
    var name = "**" + (last - first + 1) + "** cars";
    results = "⚠️ Sell **" + name + "** from your garage (IDs: " + first + "-" + last + ") ?";
  }

  embed.fields = [];
  embed.setDescription(results);
  embed.setFields([{name:gte_STATS.menuFooter(userdata), value: gte_STATS.currentCarFooter(userdata)}]);
var emojilist = [
  { emoji: gte_EMOTE.yes,
  emoji_name: "Yes",
  name: '',
  extra: "Once",
  button_id: 0 }, {
  emoji: gte_EMOTE.exit,
  emoji_name: "gtfexit",
  name: 'Back',
  extra: "Once",
  button_id: 1 }
]
  if (special == "silent") {
    return sellfunc(msg)
  }
  var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);

   gte_DISCORD.send(msg, {embeds:[embed], components:buttons}, sellfunc)

   function sellfunc(msg) {
    function sell1() {
      if (type == "CAR") {
        gte_STATS.removeCar(item, sell, userdata);
        results = "Sold **" + name + "**." + " **+" + gtf_MATH.numFormat(sell) + "**" + gte_EMOTE.credits;

        require(dir + "commands/garage").execute(msg, {options:"list", extra: results}, userdata);
        gte_STATS.save(userdata)
        return
      }
      if (type == "CARS") {
        var money = gte_STATS.removeCars(first, last, userdata);
        results = "Sold **" + name + "**. " + "**+" + money + "**" + gte_EMOTE.credits;
        require(dir + "commands/garage").execute(msg, {options:"list", extra: results}, userdata);
        gte_STATS.save(userdata)
        return
      }
      gte_EMBED.alert({ name: "✅ Success", description: results, embed: embed, seconds: 5 }, msg, userdata);

      return;
    }
      function back() {

      query["number"] = undefined
      if (type == "CAR") {
        require(dir + "commands/garage").execute(msg, {}, userdata);
        return
      }
      if (type == "CARS") {
        require(dir + "commands/garage").execute(msg, {}, userdata);
        return
      }
      if (type == "ROLE") {
      }
      if (type == "PART") {
      require(dir + "commands/tune").execute(msg, query, userdata);
        return
      }
      if (type == "PAINT") {

      require(dir + "commands/paint").execute(msg, query, userdata);

        return
      }
      if (type == "WHEEL") {
      require(dir + "commands/wheels").execute(msg, query, userdata);
        return
      }
      if (type == "DRIVER") {
        //require(dir + "commands/driver").execute(msg, query, userdata);
        return
      }
    }
     var functionlist = [sell1, back]
     if (special == "silent") {
      if (type == "CAR") {
      sell1()
      return
    }
     }


         gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
  }
};
module.exports.sellCalc = function (cost) {
  return -Math.ceil((-cost * 0.3 + 1) / 100) * 100;
};
