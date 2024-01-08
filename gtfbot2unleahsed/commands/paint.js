const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "paint",
  title: "🎨 GTF Auto - Paints",
  license: "B",
  level: 0,
  channels: ["testing", "gtf-2u-game", "gtf-demo"],

  availinmaint: false,
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
    var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] })

    if (typeof query["number"] !== 'undefined') {
      paint("")
      return
    }
    gtf_STATS.loadCarImage(gtfcar, embed, userdata, paint)
    function paint(attachment) {
    pageargs["image"].push(attachment)

     if (query["options"] == "gloss" || query["options"] == "g" || query["options"] == "Gloss" || parseInt(query["options"]) == 1) {
      var type = "gloss";
    }
    if (query["options"] == "metallic" || query["options"] == "m" || query["options"] == "Metallic" || parseInt(query["options"]) == 2) {
      var type = "metallic";
    }
    if (query["options"] == "pearl" || query["options"] == "p" || query["options"] == "Pearl" || parseInt(query["options"]) == 3) {
      var type = "pearl";
    }
    if (query["options"] == "matte" || query["options"] == "ma" || query["options"] == "mt" || query["options"] == "Matte" || parseInt(query["options"]) == 4) {
      var type = "matte";
    }
    if (query["options"] == "chrome" || query["options"] == "Chrome" || parseInt(query["options"]) == 5) {
      var type = "chrome";
    }
    if (query["options"] == "special" || query["options"] == "Special" || parseInt(query["options"]) == 6) {
      var type = "special";
      if (!gtf_EXP.checkLevel(8, embed, msg, userdata)) {
        return;
      }
    }
    if (query["options"] == "liveries" || query["options"] == "Liveries" || parseInt(query["options"]) == 7 || query["options"] == "livery") {
      var type = "livery";
      if (!gtf_EXP.checkLevel(16, embed, msg, userdata)) {
        return;
      }
      if (!ocar["type"].includes("Race Car") && !ocar["type"].includes("Rally Car")) {
        gtf_EMBED.alert({ name: "❌ No Liveries Available", description: "Liveries can only be applied to certain cars.", embed: "", seconds: 5 }, msg, userdata);
        return
      }
      if (ocar["livery"].length <= 1) {
        gtf_EMBED.alert({ name: "❌ No Liveries Available", description: "The livery cannot be changed for the **" + gtfcar["name"] + "** .", embed: "", seconds: 5 }, msg, userdata);
      return;
      }
      
    }
      
    ///COMMANDS
    if (query["options"] == "list") {
      delete query["number"]
      
      embed.setTitle("🎨 __GTF Auto - Paints__")
      var list = ["__**Gloss Paints**__", 
      "__**Metallic Paints**__",
       "__**Pearl Paints**__",
        "__**Matte Paints**__",
        "__**Chrome Paints**__",
      "__**Special Paints**__ " + gtf_EMOTE.exp + " `" + "Lv.8`" + "/n",
      "__**Liveries**__" + " `🎨" + ocar["livery"].length + " ` " + gtf_EMOTE.exp + " `" + "Lv.16`"
            ]

      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
      pageargs["footer"] = "❓ **Choose a type of paint from the list above with the buttons.**"
      }
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
      pageargs["selector"] = "options"
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }

      if ((ocar["type"].includes("Race Car") || ocar["type"].includes("Rally Car")) && type != "livery") {
      gtf_EMBED.alert({ name: "❌ Paint Unavailable", description: "There are no paint chips for the **" + gtfcar["name"] + " **.", embed: "", seconds: 5 }, msg, userdata);
      return;
      }
    select = gtf_PAINTS.find({ type: type });

    var type = select[0]["type"];
    if (select.length != 0 && query["number"] === undefined) {
       delete query["number"]
    if (type == "Livery") {
      
      pageargs["image"] = []
      
    select.unshift({ name: "Default", type: "Livery", cost: 0 })

    select = select.map(function (x, i) {
      if (i == 0) {
      pageargs["image"].push(ocar["image"][0])
        var cond = gtf_PAINTS.checkPaints({ name: "Default", type: "", cost: 0 }, gtfcar); 
        var name = ocar["livery"][i]
      } else {
      pageargs["image"].push(ocar["image"][i])
      var cond = gtf_PAINTS.checkPaints(x, gtfcar);
      var name = typeof ocar["livery"][i] === 'undefined' ? x["type"] + " " + x["name"] : ocar["livery"][i]
      }
      return name + " " + cond;
    });
    //pageargs["image"].unshift(ocar["image"][gtf_STATS.carImage(gtfcar)])
    } else {
      if (ocar["type"].includes("Race Car") || ocar["type"].includes("Rally Car")) {
        gtf_EMBED.alert({ name: "❌ Paint Unavailable", description: "There are no paint chips for the **" + gtfcar["name"] + " **.", embed: "", seconds: 5 }, msg, userdata);
        return
      }
      
      select.unshift({ name: "Default", type: "", cost: 0 });
      var select = select.map(function (x, i) {
      var cond = gtf_PAINTS.checkPaints(x, gtfcar);
      var name = x["type"] + " " + x["name"] 
      if (cond == "✅") {
        return cond + " " + name
      } else {
        return "**" + gtf_MATH.numFormat(Math.round(x["cost"])) + "**" + gtf_EMOTE.credits + " " + name;
             }
    });
    }
    embed.setTitle("🎨 " + "__" + type + " Paints (" + select.length + " Items)__");
        
    pageargs["list"] = select;
    pageargs["selector"] = "number"
    pageargs["query"] = query
    pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
    gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
    return;
    }

    var number = query["number"];

   if (!gtf_MATH.betweenInt(number, 1, select.length + 1)) {
            gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist.", embed: "", seconds: 5 }, msg, userdata);
            return
      }
  if (number == 1) {
    var paint = { name: "Default", type: select[0]["type"], cost: 0 }
  } else {
    if (type == "Livery") {
      var paint = select[number - 2];
    } else {
    var paint = select[number - 2];
    }
  }
    var cond = gtf_PAINTS.checkPaints(paint, gtfcar);
      
    if (cond.includes("❌")) {
          gtf_EMBED.alert({ name: "❌ Paint Unavailable", description: "**" + paint["type"] + " " + paint["name"] + "** is unavailable for **" + gtfcar["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 5 }, msg, userdata);
          return;
        }
    if (cond.includes("✅")) {
          gtf_EMBED.alert({ name: "❌ Same Paint", description: "**" + paint["type"] + " " + paint["name"] + "** is already applied for **" + gtfcar["name"] + "**." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 5 }, msg, userdata);
          return;
        }
      
      gtf_GTFAUTO.purchase(paint, "PAINT", "silent", embed, query, msg, userdata);
      return;
      }
  }
}
