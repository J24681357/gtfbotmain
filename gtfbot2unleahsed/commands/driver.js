const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "driver",
  title: "🎨 GTF Auto - Driving Gear",
  license: "B", 
  level: 0,
  channels: ["testing", "gtf-2u-game"],

  availinmaint: false,
  requirecar: false,
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
      numbers: true,
      buttons: true,
      carselectmessage: true,
      image: [],
      bimage: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    var results2 = "";
    var select = gtf_PAINTS.find({ type: "Gloss" });

    if (typeof query["number"] !== 'undefined') {
      driverpaint("")
      return
    }
    gtf_STATS.loadAvatarImage(embed, userdata, driverpaint)
    
    function driverpaint(attachment) {
    pageargs["image"].push(attachment)

     if (query["options"] == "visor" || parseInt(query["options"]) == 1) {
      var type = "Visor";
    }
    if (query["options"] == "helmet" || parseInt(query["options"]) == 2) {
      var type = "Helmet";
    }
      

    if (query["options"] == "list") {
      delete query["number"]
      
      embed.setTitle("🎨 __GTF Auto - Driving Gear__")
      var logo1 = (userdata["driver"]["helmetlogo1"].length == 0 ? "None" : userdata["driver"]["helmetlogo1"].length)
      var list = ["__**Visor Paint**__", 
      "__**Helmet Paint**__" + "/n/n" +
       `**Middle Logo URL:** ${userdata["driver"]["helmetlogo2"]}`]
      /*
      "**Top Logo URL:** " + logo1 + "/n" + 
      `**Bottom Logo URL:** ${userdata["driver"]["helmetlogo3"]}`
      */

      pageargs["list"] = list;
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

    if (query["options"] == "top_logo_url") {
      userdata["driver"]["helmetlogo1"] = query["link"]
      require(__filename.split(".")[0]).execute(msg, {options:"list", extra:"Added helmet image. If the image does not appear, please try another image."}, userdata);
      return
    }
    if (query["options"] == "top_logo") {
      userdata["driver"]["helmetlogo1"] = query["image"]
      require(__filename.split(".")[0]).execute(msg, {options:"list", extra:"Added helmet image. If the image does not appear, please try another image."}, userdata);
      return
    }
    if (query["options"] == "middle_logo_url") {
      userdata["driver"]["helmetlogo2"] = query["link"]
      require(__filename.split(".")[0]).execute(msg, {options:"list", extra:"Added helmet middle decal. If the image does not appear, please try another image."}, userdata);
      return
    }
    if (query["options"] == "middle_logo") {
      userdata["driver"]["helmetlogo2"] = query["image"]
      require(__filename.split(".")[0]).execute(msg, {options:"list", extra:"Added helmet middle decal. If the image does not appear, please try another image. An image with a small resolution is highly recommended."}, userdata);
      return
    }

    if (query["options"] == "clearimages") {
    userdata["driver"]["helmetlogo1"] = ""
    userdata["driver"]["helmetlogo2"] = ""
    }
    if (query["options"] == "resetdriver") {
      
    }
      
    if (select.length != 0 && query["number"] === undefined) {
       delete query["number"]

     var select2 = select.map(function (x, i) {
       if (type == "Visor") {
         var cond = userdata["driver"]["visorcolor"] == x["name"] ? "✅" : ""
       } else if (type == 'Helmet') {
         var cond = userdata["driver"]["helmetcolor"] == x["name"] ? "✅" : ""
       } 
      return x["name"] + " " + cond;
    });
    embed.setTitle("🎨 " + "__" + type + " Paints (" + select2.length + " Items)__");
        
    pageargs["list"] = select2;
    pageargs["selector"] = "number"
    pageargs["query"] = query
    pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
    gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
    return;
    }
    var paint = select[query["number"] - 1];
    paint["type"] = type
    paint["cost"] = 0
    
    var cond = userdata["driver"][type.toLowerCase()+ "color"] == paint["name"] ? "✅" : ""
      
     if (cond.includes("✅")) {
          gtf_EMBED.alert({ name: "❌ Same Paint", description: "**" + paint["type"] + " " + paint["name"] + "** is already applied." + "\n\n" + "**❗ Choose another option when this message disappears.**", embed: "", seconds: 5 }, msg, userdata);
          return;
     }
        
       gtf_GTFAUTO.purchase(paint, "DRIVER", "silent", embed, query, msg, userdata);
      return;
      }
  }
}
