const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "garage",
  title: "My Garage",
  license: "N", 
  level: 0,
  channels: ["gtf-fithusim-game", "testing"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gte_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      listsec: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 6,
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
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      /l/      //      //
    
    var listsec = []

    if (!isNaN(query["options"])) {
      query["number"] = parseInt(query["number"]);
    }
    if (typeof query["number"] !== 'undefined') {
      query["options"] = "select"
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
    if (typeof query["lowerfpp"] !== 'undefined') {
       filterlist.push(function(x) {return x["fpp"] >= query["lowerfpp"]})
    }
    if (typeof query["powerlimit"] !== 'undefined') {
       filterlist.push(function(x) {return gte_PERF.perfEnthu(x, "GARAGE")["power"] <= query["powerlimit"]})
    }
    if (typeof query["weightlimit"] !== 'undefined') {
       filterlist.push(function(x) {return gte_PERF.perfEnthu(x, "GARAGE")["weight"] <= query["weightlimit"]})
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

    ///year

    filterlist.push(function(x) {
      var year = gtf_CARS.get({ make: x["make"], fullname: x["name"]})["year"]
      var upperyear = [1989, 2005, 9999][userdata["settings"]["GMODE"]]
      var loweryear = [1960, 1990, 2006][userdata["settings"]["GMODE"]]
      return (loweryear <= year && upperyear >= year)
  })
    
    if (query["options"] === "viewcurrent") {
        query["options"] = "view"
        query["number"] = gte_STATS.currentCarNum(userdata);
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

    if (query["options"] == "changecar") {

       delete query["number"]
        var cars = gte_STATS.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))
        if (cars.length == 0) {
          gte_EMBED.alert({ name: "❌ No Cars", description: "There are no cars with this type in your garage.", embed: "", seconds: 5 }, msg, userdata);
        return;
        }
      embed.setTitle("__Change Car__ " + cars.length + "/" + gte_GTF.garagelimit + " Cars (" + userdata["settings"]["GARAGESORT"] + ")" + makee + country + type + drivetrain + engine + special + name);
      pageargs["image"] = []
        list = cars.map(function(i, index) {
          var favorite = i["favorite"] ? " ⭐" : ""
          
          var ocar = gtf_CARS.find({fullnames: [i["name"]]})[0]
          var image = ocar["image"][0]
         pageargs["image"].push(image)
          
          var name = gtf_CARS.shortName(i["name"]).split(" ").slice(0, -1).join(" ")
           var level = i["perf"]["level"]
          carname = name + " `Lv." + level + "` ` " + gte_PERF.perfEnthu(i, "GARAGE")["class"] + " `" + favorite
          if (gte_STATS.currentCarNum(userdata) == index+1)  {
            carname = "**" + name + "**" + " `Lv." + level + "` ` " + gte_PERF.perfEnthu(i, "GARAGE")["class"] + " `" + favorite
          }
           listsec.push(ocar["year"] + " | " + gtf_MATH.numFormat(ocar["power"]) + " hp" + " | " + gtf_MATH.numFormat(gte_STATS.weightUser(ocar["weight"], userdata)) + " " + gte_STATS.weightUnits(userdata) + " | " + ocar["special"].join(", ").replace("xstarter", ""))
          return carname
      })
      pageargs["list"] = list;
      pageargs["listsec"] = listsec;
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      pageargs["selector"] = "number"
      pageargs["query"] = query
      pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
      gte_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }

    if (query["options"] == "list") {
       delete query["number"]
        var cars = gte_STATS.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))
        if (cars.length == 0) {
          gte_EMBED.alert({ name: "❌ No Cars", description: "There are no cars with this type in your garage.", embed: "", seconds: 5 }, msg, userdata);
        return;
        }
      embed.setTitle("__Garage__ " + cars.length + " Cars (" + userdata["settings"]["GARAGESORT"] + ")" + makee + country + type + drivetrain + engine + special + name);
      pageargs["image"] = []
        list = cars.map(function(i, index) {
          var favorite = i["favorite"] ? " ⭐" : ""

          var ocar = gtf_CARS.find({fullnames: [i["name"]]})[0]
          var image = ocar["image"][0]
         pageargs["image"].push(image)

          var name = gtf_CARS.shortName(i["name"]).split(" ").slice(0, -1).join(" ")
           var level = i["perf"]["level"]
          carname = name + " `Lv." + level + "` ` " + gte_PERF.perfEnthu(i, "GARAGE")["class"] + " `" + favorite
          if (gte_STATS.currentCarNum(userdata) == index+1)  {
            carname = "**" + name + "**" + " `Lv." + level + "` ` " + gte_PERF.perfEnthu(i, "GARAGE")["class"] + " `" + favorite
          }
          listsec.push(ocar["year"] + " | " + gtf_MATH.numFormat(ocar["power"]) + " hp" + " | " + gtf_MATH.numFormat(gte_STATS.weightUser(ocar["weight"], userdata)) + " " + gte_STATS.weightUnits(userdata) + " | " + ocar["special"].join(", ").replace("xstarter", ""))
          return carname
        })
      pageargs["list"] = list;
      pageargs["listsec"] = listsec;
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        delete query["extra"]
      }
      pageargs["selector"] = ""
      pageargs["query"] = query
      pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
      gte_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }

    if (query["options"] == "view") {
      var number = query["number"];
      if (number <= 0 || isNaN(number) || number > cars.length) {
        gte_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your garage.", embed: "", seconds: 5 }, msg, userdata);
        return;
      }
      var gtfcar = gte_STATS.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))[number - 1]
      var favorite = gtfcar["favorite"] ? "⭐" : ""
      embed.setTitle("🚘 __" + gtfcar["name"] + "__ " + favorite);
      results = gte_STATS.viewCar(gtfcar, embed, userdata);
      gte_STATS.loadCarImage(gtfcar, embed, userdata, then)
      

      function then(attachment) {
        
      embed.setThumbnail("attachment://image.png");
      gte_STATS.addCount(userdata);
      var details = 0
      embed.setDescription(results + pageargs["footer"]);
      var condition = gte_CONDITION.condition(gtfcar)
      var icon = condition["emote"]
      var sellcost = gte_PERF.perfEnthu(gtfcar, "GARAGE")["sell"]
      
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
        

        
var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);
        
       gtf_DISCORD.send(msg, {embeds:[embed], components:buttons, files: [attachment]}, carfunc)
       
       function carfunc(msg) {
        function favoritecar() {
          if (gtfcar["favorite"]) {
            gte_STATS.addFavoriteCar(number, false, filterlist, userdata)
            var title = embed.title.split(" ")
            title.pop()
            embed.setTitle(title.join(" "))
          } else {
            gte_STATS.addFavoriteCar(number, true, filterlist, userdata)
            embed.setTitle("🚘 __" + gtfcar["name"] + "__ " + "⭐");
          }
          if (query["favoritesonly"] == "enable") {
            require(__filename.split(".")[0]).execute(msg, {options:"list", filter:query["filter"]}, userdata);
          } else {          
            msg.edit({embeds: [embed], components:buttons});
          }
          
          gte_STATS.saveEnthu(userdata)
          
            msg.edit({embeds: [embed], components:buttons});
        }
        function changecar() {
         require(__filename.split(".")[0]).execute(msg, {options:"select", number:parseInt(query["number"]), filter:filterlist}, userdata);
        }
        function view() {
          if (details == 0) {
            details = 1         
            var results2 = gte_STATS.viewCarTuning(gtfcar, userdata);
          embed.setDescription(results2 + pageargs["footer"]);
          msg.edit({embeds: [embed], components:buttons});
          } else {
            details = 0
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({embeds: [embed], components:buttons});
          }
        }
        function carcondition() {
          var results2 = gte_STATS.viewCarCondition(gtfcar, userdata);
          embed.setDescription(results2 + pageargs["footer"]);
          msg.edit({embeds: [embed], components:buttons});
        }
         
   

        var functionlist = [favoritecar, changecar, view, carcondition]
        gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
      }
      return;
    } 
    }
    
    if (query["options"] == "select") {
      var number = parseInt(query["number"]);
      if (gte_STATS.currentCarNum(userdata) == number) {
        gte_EMBED.alert({ name: "❌ Invalid", description: "You are already in this car. Please choose another car.", embed: "", seconds: 5 }, msg, userdata);
        return
      }
  
      var changecar = gte_STATS.setCurrentCar(number, filterlist, userdata);
      if (changecar == "Invalid") {
        gte_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your garage.", embed: "", seconds: 0 }, msg, userdata);
        return;
      } else {
        if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
          number = 1
        }
        var gtfcar = gte_STATS.garage(userdata).filter(x => filterlist.map(filter => filter(x)).every(p => p === true))[number - 1];

        if (query["extra"] == "silent") {
          //embed = msg.embeds[0]
          //embed = new EmbedBuilder(embed)
          
        } else {
          var racesettings = {title:"CHANGECAR"}
          userdata["rankinghistory"].push({
                title:racesettings["title"], 
                league: "NONE",
                      week:userdata["week"], 
                      place: "1st",                                                            points: 0, 
            damage: 0,
                            skillpoints:0
                     })
                        userdata["week"]++
                      gte_GTF.resultsSummaryEnthu(racesettings, "", embed, msg, userdata)
        }
      }
      
      gte_STATS.saveEnthu(userdata)
      return;
    } 
  }
};
