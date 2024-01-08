const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "garage",
  title: "My Garage",
  license: "N", 
  level: 0,
  channels: ["testing", "gtf-2u-game"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: true,
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
    
    ///LOBBY
    if (userdata["inlobby"]["active"] && query["extra"] != "silent") {
      if (msg.channel.type == 11) {
       require(__dirname + "/" + "/lobby").execute(msg, {options:"garage"}, userdata);
      } else {
          gtf_EMBED.alert({ name: "❌ Lobby In Session", description: "You are unable to use your garage outside of the lobby you are in.", embed: "", seconds: 5 }, msg, userdata); 
        }
      return
    }

    if (!isNaN(query["options"])) {
      query["number"] = parseInt(query["number"]);
    }
    
    var filterlist = []
    query["manufacturer"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes('manufacturer')))
    query["manufacturer"] = [Object.values(query["manufacturer"])[0]]
    
    if (typeof query["manufacturer"][0] === 'undefined') {
      query["manufacturer"] = undefined 
    } else {
      query["manufacturer"] = query["manufacturer"][0].replace(/,/g, "-")
    }
        
    if (typeof query["country1"] !== 'undefined') {
      filterlist.push(function(x) {return gtf_CARS.get({ make: x["make"], fullname: x["name"]})["country"].includes(query["country1"])})
    }
    
    if (typeof query["type1"] !== 'undefined') {
      filterlist.push(function(x) {return gtf_CARS.get({ make: x["make"], fullname: x["name"]})["type"].includes(query["type1"])})
    }
    if (typeof query["name"] !== 'undefined') {
      var re = new RegExp(query["name"], 'ig');
       filterlist.push(function(x) {return x["name"].match(re) != null})
    }
    if (typeof query["drivetrain1"] !== 'undefined') {
      filterlist.push(function(x) {return gtf_CARS.get({ make: x["make"], fullname: x["name"] })["drivetrain"].includes(query["drivetrain1"])})
    }
    if (typeof query["engine1"] !== 'undefined') {
      filterlist.push(function(x) {return gtf_CARS.get({ make: x["make"], fullname: x["name"]})["engine"].includes(query["engine1"])})
    }
    if (typeof query["special1"] !== 'undefined') {
      filterlist.push(function(x) {return gtf_CARS.get({ make: x["make"], fullname: x["name"] })["special"].includes(query["special1"])})
    }
    if (typeof query["fpplimit"] !== 'undefined') {
       filterlist.push(function(x) {return x["fpp"] <= query["fpplimit"]})
    }
    if (typeof query["powerlimit"] !== 'undefined') {
       filterlist.push(function(x) {return gtf_PERF.perf(x, "GARAGE")["power"] <= query["powerlimit"]})
    }
    if (typeof query["weightlimit"] !== 'undefined') {
       filterlist.push(function(x) {return gtf_PERF.perf(x, "GARAGE")["weight"] <= query["weightlimit"]})
    }
    if (typeof query["manufacturer"] !== 'undefined') {
       filterlist.push(function(x) {return x["make"].includes(query["manufacturer"])})
    }
    
    if (typeof query["filter"] === 'undefined') {
      query["filter"] = {"function":function(x) {return x}, "args": ""}
    }
    if (Array.isArray(query["filter"])) {
      filterlist = query["filter"]
    }
    
    if (query["options"] === "viewcurrent") {
        query["options"] = "view"
        query["number"] = gtf_STATS.currentCarNum(userdata);
    }
    
    var makee = (typeof query["manufacturer"] == 'undefined') ? "" : " (" + query["manufacturer"] + ")"
  var country = (typeof query["country1"] == 'undefined') ? "" : " (" + query["country1"] + ")"
    var type = (typeof query["type1"] == 'undefined') ? "" : " (" + query["type1"] + ")"
    var drivetrain = (typeof query["drivetrain1"] == 'undefined') ? "" : " (" + query["drivetrain1"] + ")"
    var engine = (typeof query["engine1"] == 'undefined') ? "" : " (" + query["engine1"] + ")"
    var special = (typeof query["special1"] == 'undefined') ? "" : " (" + query["special1"] + ")"
    var name = (typeof query["name"] == 'undefined') ? "" : " (" + query["name"] + ")"

    if (name.length >= 20) {
      name = name.substring(0,20) + "..."
    }

    if (query["favoritesonly"] == 'enable') {
       filterlist.push(function(x) {return x["favorite"]})
    }

    if (query["options"] == "list") {
       delete query["number"]
      embed.setTitle("🏠" + " __Garage: " + gtf_STATS.garage(userdata).length + "/" + gtf_GTF.garagelimit + " Cars (" + userdata["settings"]["GARAGESORT"] + ")" + makee + country + type + drivetrain + engine + special + name + "__");
        var cars = gtf_STATS.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))
        if (cars.length == 0) {
          gtf_EMBED.alert({ name: "❌ No Cars", description: "There are no cars with this type in your garage.", embed: "", seconds: 5 }, msg, userdata);
        return;
        }
        list = cars.map(function(i, index) {
          var favorite = i["favorite"] ? " ⭐" : ""
          var name = gtf_CARS.shortName(i["name"])
          carname = gtf_CONDITION.condition(i)["emote"] + " " + name + " **" + i["fpp"] + gtf_EMOTE.fpp + "**" + favorite
          if (gtf_STATS.currentCarNum(userdata) == index+1)  {
            carname = "**" + gtf_CONDITION.condition(i)["emote"] +
 name + " " + i["fpp"] + gtf_EMOTE.fpp + "**" + favorite 
          }
          if (type != "") {
            carname = gtf_CONDITION.condition(i)["emote"] + " " + 
 name + " **" + i["fpp"] + gtf_EMOTE.fpp + "**" + favorite
          }
          if (name != "") {
            carname = gtf_CONDITION.condition(i)["emote"] +  " " + name + " **" + i["fpp"] + gtf_EMOTE.fpp + "**" + favorite
          }
          return carname
        })
      pageargs["list"] = list;
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      pageargs["selector"] = "number"
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }

    if (query["options"] == "sell") {
      var number = query["number"];
      var number2 = query["number"];

      if (number <= 0 || isNaN(number) || number === undefined || number > gtf_STATS.garage(userdata).length) {
        gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your garage.", embed: "", seconds: 5 }, msg, userdata);
        return;
      }
      if (number == gtf_STATS.currentCarNum(userdata) || number2 == gtf_STATS.currentCarNum(userdata)) {
        gtf_EMBED.alert({ name: "❌ Invalid ID", description: "You cannot sell your current car.", embed: "", seconds: 5 }, msg, userdata);
        return;
      }
      if (number2 == number) {
        var gtfcar = gtf_STATS.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))[number - 1];
        query = {options: query["options"], number: query["number"]}
        gtf_GTFAUTO.sell(gtfcar, "CAR", "", embed, query, msg, userdata);
      } else {
        gtf_GTFAUTO.sell([number, number2], "CARS", embed, query, msg, userdata);
      }
      return
    }
    if (query["options"] == "view") {
      var number = query["number"];
      if (number <= 0 || isNaN(number) || number > gtf_STATS.garage(userdata).length) {
        gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your garage.", embed: "", seconds: 5 }, msg, userdata);
        return;
      }
      var gtfcar = gtf_STATS.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))[number - 1]
      var favorite = gtfcar["favorite"] ? "⭐" : ""
      embed.setTitle("🚘 __" + gtfcar["name"] + "__ " + favorite);
      results = gtf_STATS.viewCar(gtfcar, embed, userdata);
      gtf_STATS.loadCarImage(gtfcar, embed, userdata, then)
      

      function then(attachment) {
        
      embed.setThumbnail("attachment://image.png");
      gtf_STATS.addCount(userdata);
      var details = 0
      embed.setDescription(results + pageargs["footer"]);
      var condition = gtf_CONDITION.condition(gtfcar)
      var icon = condition["emote"]
      var sellcost = gtf_PERF.perf(gtfcar, "GARAGE")["sell"]
      
       var emojilist = [
  { emoji: "⭐", 
  emoji_name: "⭐", 
  name: '', 
  extra: "",
  button_id: 0 },
  { emoji: "🔑", 
  emoji_name: "🔑", 
  name: 'Change Car', 
  extra: "",
  button_id: 1 },
  { emoji: "📄", 
  emoji_name: "📄", 
  name: 'Tuning/Details', 
  extra: "",
  button_id: 2 },
       { emoji: icon, 
  emoji_name: icon.split(":")[1], 
  name: 'Condition', 
  extra: "",
  button_id: 3 },
    { emoji: gtf_EMOTE.credits, 
  emoji_name: "credits", 
  name: "", 
  extra: "",
  button_id: 4 }
]
   emojilist[4]["name"] = condition["health"] < 45 ? "Unable to Sell" : 'Sell ' + gtf_MATH.numFormat(sellcost) + " Cr (1 Click)"
        

        
var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
        
       gtf_DISCORD.send(msg, {embeds:[embed], components:buttons, files: [attachment]}, carfunc)
       
       function carfunc(msg) {
        function favoritecar() {
          if (gtfcar["favorite"]) {
            gtf_STATS.addFavoriteCar(number, false, filterlist, userdata)
            var title = embed.title.split(" ")
            title.pop()
            embed.setTitle(title.join(" "))
          } else {
            gtf_STATS.addFavoriteCar(number, true, filterlist, userdata)
            embed.setTitle("🚘 __" + gtfcar["name"] + "__ " + "⭐");
          }
          if (query["favoritesonly"] == "enable") {
            require(__filename.split(".")[0]).execute(msg, {options:"list", filter:query["filter"]}, userdata);
          } else {          
            msg.edit({embeds: [embed], components:buttons});
          }
          
          gtf_STATS.save(userdata)
          
            msg.edit({embeds: [embed], components:buttons});
        }
        function changecar() {
         require(__filename.split(".")[0]).execute(msg, {options:"select", number:parseInt(query["number"]), filter:filterlist}, userdata);
        }
        function view() {
          if (details == 0) {
            details = 1         
            var results2 = gtf_STATS.viewCarTuning(gtfcar, userdata);
          embed.setDescription(results2 + pageargs["footer"]);
          msg.edit({embeds: [embed], components:buttons});
          } else {
            details = 0
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({embeds: [embed], components:buttons});
          }
        }
        function carcondition() {
          var results2 = gtf_STATS.viewCarCondition(gtfcar, userdata);
          embed.setDescription(results2 + pageargs["footer"]);
          msg.edit({embeds: [embed], components:buttons});
        }
         
        function sellcar() {
      if (gtfcar["id"] == gtf_STATS.currentCar(userdata)["id"]) {
        gtf_EMBED.alert({ name: "❌ Cannot Sell Car", description: "You cannot sell your current car.", embed: "", seconds: 5 }, msg, userdata);
        return;
      }
            if (condition["health"] < 45) {
              return
            }
         gtf_GTFAUTO.sell(gtfcar, "CAR", "silent", embed, query, msg, userdata);
        }

        var functionlist = [favoritecar, changecar, view, carcondition, sellcar]
        gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
      }
      return;
    } 
    }
    
    if (query["options"] == "select") {
      var number = parseInt(query["number"]);
      var changecar = gtf_STATS.setCurrentCar(number, filterlist, userdata);
      if (changecar == "Invalid") {
        gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your garage.", embed: "", seconds: 0 }, msg, userdata);
        return;
      } else {
        if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
          number = 1
        }
        var gtfcar = gtf_STATS.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))[number - 1];
        if (userdata["inlobby"]["active"]) {
          gtf_LOBBY.updateUserCar(gtfcar, userdata);
        }
        if (query["extra"] == "silent") {
          //embed = msg.embeds[0]
          //embed = new EmbedBuilder(embed)
          
        } else {
          require(__filename.split(".")[0]).execute(msg, 
            {options:"list", 
             extra: "Selected the **" + gtfcar["name"] + " " + gtfcar["fpp"] + gtf_EMOTE.fpp + "**" + " `🚘ID:" + number + "`.",
             filter:query["filter"]}, 
            userdata);
        }
      }
      
      gtf_STATS.save(userdata)
      return;
    } 
  }
};
