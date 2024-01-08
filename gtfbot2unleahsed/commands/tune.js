const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "tune",
  title: "GTF Auto - Tuning Shop",
  license: "N",
  level: 0,
  channels: ["testing", "gtf-2u-game", "gtf-test-mode"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      listsec: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: false,
      buttons: true,
      carselectmessage: true,
      image: [],
      bimage: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    
    var select = "";
    var gtfcar = gtf_STATS.currentCar(userdata);
    var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]});

    if (typeof query["number"] !== 'undefined') {
      tune("")
      return
    }
    gtf_STATS.loadCarImage(gtfcar, embed, userdata, tune)

    function tune(attachment) {
    pageargs["image"].push(attachment)
    

    if (query["options"] == "engine" || query["options"] == "eng" || query["options"] == "e" || parseInt(query["options"]) == 1) {
      query["options"] = "engine";
      /*
      if (gtfcar["perf"]["carengine"]["current"] != "Default") {
        gtf_EMBED.alert({ name: "❌ Engine Parts Unavailable", description: "The car's engine must be from its original model in order to tune it.", embed: "", seconds: 5 }, msg, userdata);
        return
      }
      */
    }

    if (query["options"] == "transmission" || query["options"] == "trans" || query["options"] == "tr" || parseInt(query["options"]) == 2) {
      query["options"] = "transmission";
      if (gtfcar["perf"]["carengine"]["current"] != "Default") {
        gtf_EMBED.alert({ name: "❌ Transmission Parts Unavailable", description: "The car's engine must be from its original model in order to tune it.", embed: "", seconds: 5 }, msg, userdata);
      }
      
    }

    if (query["options"] == "suspension" || query["options"] == "susp" || query["options"] == "sus" || query["options"] == "su" || parseInt(query["options"]) == 3) {
      
      query["options"] = "suspension";
    }

    if (query["options"] == "tires" || query["options"] == "tire" || query["options"] == "ti" || parseInt(query["options"]) == 4) {
      
      query["options"] = "tires";
    }

    if (query["options"] == "weight-reduction" ||
        query["options"] == "Weight Reduction" || query["options"] == "weight" || 
        query["options"] == "we" || parseInt(query["options"]) == 5) {
      
      query["options"] = "weight-reduction";
    }

    if (query["options"] == "turbo" || query["options"] == "supercharger" || query["options"] == "tu" || parseInt(query["options"]) == 6) {
      
      query["options"] = "turbo";
    }
      
    if (query["options"] == "brakes" || query["options"] == "brake" || query["options"] == "br" || parseInt(query["options"]) == 7) {
      
      query["options"] = "brakes";
    }

    if (query["options"] == "aero-kits" || query["options"] == "aero-kit" || query["options"] == "aero" || parseInt(query["options"]) == 8) {
      query["options"] = "aero-kits";
      if (!gtf_STATS.checklicense("A", embed, msg, userdata)) {
          return;
    }
    }
      
    if (query["options"] == "maintenance" || parseInt(query["options"]) == 9) {
      query["options"] = "maintenance"
    }
      

    if (query["options"] == "other" || query["options"] == "Other" || parseInt(query["options"]) == 10) {
      query["options"] = "other";
      if (!gtf_STATS.checklicense("A",  embed, msg, userdata)) {
          return;
    }
    }
  
  if (query["options"] == "carengine" || parseInt(query["options"]) == 11) {
      query["options"] = "carengine";
      if (!gtf_STATS.checklicense("S", embed, msg, userdata)) {
          return;
    }
  }
    
      

    ///COMMANDS
    if (query["options"] == "list") {
      delete query["number"]
      embed.setTitle(gtf_EMOTE.gtauto + " __GTF Auto - Tuning Shop__");
      var partscount = {"Engine":0, "Transmission":0, "Suspension":0, "Tires":0, "Weight Reduction":0, "Turbo":0, 
                        "Brakes": 0, "Aero Kits":0, "Car Engine": 0}
      var keys = Object.keys(partscount)
      var perf = gtf_PERF.perf(ocar, "DEALERSHIP")
      for (var x = 0; x < keys.length; x++) {
        var type = keys[x]
        if (type == "Aero Kits") {
        var select = gtf_PARTS.find({ type: type, engine: ocar["engine"], cartype: ocar["type"].split(":")[0]}).slice(0, ocar["image"].length-1)
          
        } else {
        var select = gtf_PARTS.find({ type: type, 
                                     engine: ocar["engine"], 
                                     cartype: ocar["type"].split(":")[0], 
                                     model: ocar["name"], 
                                     upperfpp: perf["fpp"], 
                                     lowerweight: ocar["weight"],
                                    special: ocar["special"]
                                    });
        }
        for (var y = 0; y < select.length; y++) {
            partscount[type]++
      }
      }
      results =
        "__**Engine**__ " + "`🔧" + partscount["Engine"] + "`" +
        "\n" +
        "__**Transmission**__ " + "`🔧" + partscount["Transmission"] + "`" +
        "\n" +
        "__**Suspension**__ " + "`🔧" + partscount["Suspension"] + "`" +
        "\n" +
        "__**Tires**__ "  + "`🔧" + partscount["Tires"] + "`" +
        "\n" +
        "__**Weight Reduction**__ " + "`🔧" + partscount['Weight Reduction'] + "`" +
         "\n" +
        "__**Turbo Kits**__ " + "`🔧" + partscount['Turbo'] + "`" + "\n" +
        "__**Brakes**__ " + "`🔧" + partscount['Brakes'] + "`" + "\n" +
        "__**Aero Kits**__ " + gtf_EMOTE.alicense + " `🔧" + partscount['Aero Kits'] + "`" + "\n" +
        "__**Maintenance / Repair**__ " + "\n" +
         "__**Other Accessories**__ " + gtf_EMOTE.alicense + "\n" +
        "__**Car Engines**__ " + " `🔧" + partscount['Car Engine'] + "`" + " " + gtf_EMOTE.slicense
      var list = results.split("\n")
      pageargs["list"] = list;
      pageargs["rows"] = 9
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      pageargs["selector"] = "options"
      pageargs["query"] = query
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }
    if (query["options"] == "maintenance") {
      embed.setTitle("🔧 __GTF Auto - Maintenance Service__");
      var partscount = {"Car Wash":0, "Oil Change":0, "Engine Repair": 0, "Transmission Repair": 0, "Suspension Repair": 0, "Body Damage Repair": 0}
      var keys = Object.keys(partscount)
      var costs = []
      var perf = gtf_PERF.perf(ocar, "DEALERSHIP")
      for (var x = 0; x < keys.length; x++) {
        var type = keys[x]
        var part = gtf_PARTS.find({ type: type, engine: ocar["engine"], cartype: ocar["type"].split(":")[0], model: ocar["name"], upperfpp: perf["fpp"], lowerweight: ocar["weight"]})[0];
      
        costs.push(gtf_PARTS.costCalc(part, gtfcar, ocar))
      }
      
      if (typeof query["number"] === 'undefined') {
      var list = ["**" + gtf_MATH.numFormat(costs[0]) + gtf_EMOTE.credits + "** " + "__**Car Wash**__ " + "`💧" + gtfcar["condition"]["clean"] + "%`",
        "**" + gtf_MATH.numFormat(costs[1]) + gtf_EMOTE.credits + "** " + "__**Oil Change**__ " + "`" + gtfcar["condition"]["oil"] + "%`",
        "**" + gtf_MATH.numFormat(costs[2]) + gtf_EMOTE.credits + "** " + "__**Engine Repair**__ " + "`" + gtfcar["condition"]["engine"] + "%`" ,
        "**" + gtf_MATH.numFormat(costs[3]) + gtf_EMOTE.credits + "** " + "__**Transmission Repair**__ " + "`" + gtfcar["condition"]["transmission"] + "%`",
        "**" + gtf_MATH.numFormat(costs[4]) + gtf_EMOTE.credits + "** " + "__**Suspension Repair**__ " + "`" + gtfcar["condition"]["suspension"] + "%`", 
        "**" + gtf_MATH.numFormat(costs[5]) + gtf_EMOTE.credits + "** " + "__**Body Damage Repair**__ " + "`" + gtfcar["condition"]["body"] + "%`" + "/n", 
        "**" + gtf_MATH.numFormat(Math.round(gtf_MATH.sum(costs))) + gtf_EMOTE.credits + "** " + "__**Apply All**__"]
      pageargs["list"] = list;
        
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      pageargs["selector"] = "number"
      pageargs["query"] = query
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }
      var number = parseInt(query["number"])
      var cost = Math.round(costs[number-1])
      
      if (parseInt(query["number"]) == 1) {
        gtf_CONDITION.updateCondition(100, "clean", userdata)
        var successmessage = "Car Wash completed! " + "**-" + gtf_MATH.numFormat(cost) + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 2) {
          gtf_CONDITION.updateCondition(100, "oil", userdata)
        var successmessage = "Oil Change completed! " + "**-" + gtf_MATH.numFormat(cost) + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 3) {
          gtf_CONDITION.updateCondition(100, "engine", userdata)
        var successmessage = "Engine Repair completed! " + "**-" + gtf_MATH.numFormat(cost) + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 4) {
          gtf_CONDITION.updateCondition(100, "transmission", userdata)
        var successmessage = "Transmission Repair completed! " + "**-" + gtf_MATH.numFormat(cost) + gtf_EMOTE.credits + "**"
      }      
      if (parseInt(query["number"]) == 5) {
          gtf_CONDITION.updateCondition(100, "suspension", userdata)
        var successmessage = "Suspension Repair completed! " + "**-" + gtf_MATH.numFormat(cost) + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 6) {
          gtf_CONDITION.updateCondition(100, "body", userdata)
        var successmessage = "Body Damage Repair completed! " + "**-" + gtf_MATH.numFormat(cost) + gtf_EMOTE.credits + "**"
      }
      if (parseInt(query["number"]) == 7) {
          gtf_CONDITION.updateCondition(100, "all", userdata)
        cost = Math.round(gtf_MATH.sum(costs))
        var successmessage = "Car Repair completed! " + "**-" + gtf_MATH.numFormat(cost) + gtf_EMOTE.credits + "**"
      }
      gtf_STATS.addCredits(-cost, userdata);
      require(__filename.split(".")[0]).execute(msg, {options:"maintenance", extra:successmessage}, userdata);
      return
    }
    if (query["options"] == "other") {
      embed.setTitle("🔧 __GTF Auto - Other Accessories__");
      var partscount = {"Ballast Weight":0}
      var keys = Object.keys(partscount)
      var parts = []
      var perf = gtf_PERF.perf(ocar, "DEALERSHIP")
      for (var x = 0; x < keys.length; x++) {
        var type = keys[x]
        var part = gtf_PARTS.find({ type: type, engine: ocar["engine"], cartype: ocar["type"].split(":")[0], model: ocar["name"], upperfpp: perf["fpp"], lowerweight: ocar["weight"]})[0];
        parts.push(part)
      }
      
      
      if (typeof query["number"] === 'undefined') {
      var list = ["**" + gtf_MATH.numFormat(gtf_PARTS.costCalc(parts[0], gtfcar, ocar)) + gtf_EMOTE.credits + "** " + "Ballast Weight " + gtf_PARTS.checkParts(parts[0], gtfcar)[0]]
      pageargs["list"] = list;
        
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      pageargs["selector"] = "number"
      pageargs["query"] = query
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }
      var number = parseInt(query["number"])
      
      
      if (parseInt(query["number"]) == 1) {
        if (gtf_PARTS.checkParts(parts[0], gtfcar)[0] == "✅") {
          gtf_EMBED.alert({ name: "❌ Part Already Installed", description: "**" + part["type"] + " " + part["name"] + "** is already installed on **" + gtfcar["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
        var cost = gtf_PARTS.costCalc(parts[number-1], gtfcar, ocar)
        gtf_PARTS.installPart(part, userdata) 
        var successmessage = "Installed **Ballast Weight** on **" + gtfcar["name"] + "**. " + "**-" + gtf_MATH.numFormat(cost) + gtf_EMOTE.credits + "**"
      }
      gtf_STATS.addCredits(-cost, userdata);
      require(__filename.split(".")[0]).execute(msg, {options:"other", extra:successmessage}, userdata);
      return
    }
    if (query["options"] == "aero-kits") {
        var select = gtf_PARTS.find({ type: query["options"]}).slice(0, ocar["image"].length-1)
        } else {
            var select = gtf_PARTS.find({ type: query["options"], engine: ocar["engine"], cartype: ocar["type"].split(":")[0], model: ocar["name"], upperfpp: gtf_PERF.perf(ocar, "DEALERSHIP")["fpp"], lowerweight: ocar["weight"]});
        }
      
      if (select.length == 0) {
        gtf_EMBED.alert({ name: "❌ Type Unavailable", description: "There are no parts of this type for **" + gtfcar["name"] + "**." + "\n" + "You may select another option when this message disappears.", embed: "", seconds: 5 }, msg, userdata);
        return;
      }

    if (select.length != 0 && query["number"] === undefined) {
    delete query["number"]
    
    var nametype = select[0]["type"];
    embed.setTitle(gtf_EMOTE.gtauto + " __GTF Auto - " + nametype + " (" + select.length + " Items)" + "__");
    select = select.map(function (x) {
      x["cost"] = gtf_PARTS.costCalc(x, gtfcar, ocar)
      var cond = gtf_PARTS.checkParts(x, gtfcar);
      if (cond[0].includes("❌")) {
      return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + gtf_EMOTE.fpp;
      } 
      else if (cond[0].includes("📦")) {
        return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + gtf_EMOTE.fpp;
      } 
      else {
      if (cond[0].includes("✅")) {
      return cond[0] + " " + x["type"] + " " + x["name"] + " " + cond[1] + gtf_EMOTE.fpp;
      } else {
         return "**" + gtf_MATH.numFormat(x["cost"]) + "**" + gtf_EMOTE.credits + " " + x["type"] + " " + x["name"] + " " + cond[1] + gtf_EMOTE.fpp + cond[0];
      }
      }
    })
    if (query["options"] != "tires") {
      var defaultpartavail = gtf_PARTS.checkParts({ type: nametype, name: "Default", cost: 0, percent: 0,
      engines: [],
      types: [],
      prohibited: [],
      fpplimit: 9999,
      lowerweight: 0}, gtfcar);
    select.unshift("Default " + defaultpartavail[1] + gtf_EMOTE.fpp + " " + defaultpartavail[0]);
    }
    pageargs["list"] = select;
    pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
    pageargs["selector"] = "number"
    pageargs["query"] = query
    gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
    return;
    }
    

    
    var number = query["number"]
    var nametype = select[0]["type"];
    if (query["options"] != "tires") {
      select.unshift({ type: nametype, name: "Default", cost: 0,percent: 0,
      engines: [],
      types: [],
      prohibited: [],
      fpplimit: 9999,
      lowerweight: 0})
    }
    
    if (!gtf_MATH.betweenInt(number, 1, select.length)) {
            gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist.", embed: "", seconds: 5 }, msg, userdata);
            return
    }
    
    var part = select[number-1]

    var cond = gtf_PARTS.checkParts(part, gtfcar);
        if (cond[0] == "❌") {
          gtf_EMBED.alert({ name: "❌ Part Unavailable", description: "**" + part["type"] + " " + part["name"] + "** is unavailable for **" + gtfcar["name"] + "**.", embed: "", seconds: 5 }, msg, userdata);
          return;
        }
        if (cond[0] == "✅") {
          gtf_EMBED.alert({ name: "❌ Part Already Installed", description: "**" + part["type"] + " " + part["name"] + "** is already installed on **" + gtfcar["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 3 }, msg, userdata);
          return;
        }
      
      gtf_GTFAUTO.purchase(part, "PART", "", embed, query, msg, userdata);
      return;
  }
  }
};
