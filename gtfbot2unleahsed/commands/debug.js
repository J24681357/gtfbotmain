const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
var fs = require("fs");

module.exports = {
  name: "debug",
  title: "DEBUG",
  license: "N",
  level: 0,
  channels: ["testing"],

  availinmaint: false,
  requireuserdata: false,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: true,
  description: ["!debug - (ADMIN ONLY) This command is only used for testing purposes."],
  async execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: false,
      buttons: false,
      carselectmessage: false,
      image: [],
      bimage: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    if (userdata["id"] != "237450759233339393") {
      gtf_EMBED.alert({ name: "❌ Error", description: "This command is for adminstrators only.", embed: embed, seconds: 0 }, msg, userdata);
      return
    }
    var deletee = false;

    var keys = [];

    var { MongoClient, ServerApiVersion } = require('mongodb');

    MongoClient = new MongoClient(process.env.MONGOURL, {  serverApi: ServerApiVersion.v1 });
    var db = await MongoClient.connect()
    var dbo = db.db("GTFitness");
    dbo
      .collection("GTF2SAVES")
      .find({})
      .forEach(row => {
        if (typeof row["id"] === undefined) {
          return;
        } else {
          keys.push(row);
        }
      }).then(() => {
        userdata = keys.filter(x => x["id"] == query["user"])[0]
        if (userdata == undefined) {

          return
        }
        g(userdata);
        db.close();
      })

    function g(userdata) {
      if (typeof query["options"] !== 'undefined') {
        query["args"] = query["options"]
      }
      var extra = "";

      var success = false;
      var id = userdata["id"];
      
      var debugcommandslist = {
        "updateallsaves": ["", function (query) {
         gtf_TOOLS.updateallsaves("GTF2SAVES", {})
        }],
        "importuserdata": "",
        "announcenewcars": ["", function (query) {
           var cars = JSON.parse(fs.readFileSync(gtf_TOOLS.homedir() + "jsonfiles/newcars.json", "utf8"))

        var newcars = cars.filter(x => !x.includes(" - 1") && !x.includes(" - 2") && !x.includes(" - 3"))
        var newcarsxx = cars.filter(x => x.includes(" - 1") || x.includes(" - 2") || x.includes(" - 3"))

        var message = ""
        if (newcars.length != 0) {
          message = message + "The following cars have been added to the GTF Dealerships (**/car**):" + "\n\n" + newcars.join("\n")
        }
        if (newcarsxx.length != 0) {
          newcarsxx = gtf_TOOLS.unique(newcarsxx.map(x => x.replace(" - 1", "").replace(" - 2", "").replace(" - 3", "")))
          message = message + "\n\nThe following cars have new aero parts or liveries added:" + "\n\n" + newcarsxx.join("\n")
        }

        if (message == "") {
          console.log("No new cars, aeros, or liveries.")
          return
        }

        setTimeout(function() {
          var string = query["string"]
          var embed = new EmbedBuilder()
          var channel = msg.guild.channels.cache.find(channel => channel.id === "687872420933271577");
          embed.setTitle("🚘 __New Cars__")
          embed.setColor(0x0151b0)
          embed.setDescription(message)
          gtf_DISCORD.send(channel, { type1: "CHANNEL", embeds: [embed] })
        }, 2000)
        }], 
        "announceseasonal": ["", function (query) {
          var event = gtf_LIST_MESSAGES
        var car = gtf_CARS.get({make: event["prize"]["item"]["makes"][0], fullname: event["prize"]["item"]["fullnames"][0]})
        var message = "In Seasonal Events (**/seasonal**), complete all races in the limited time event in the upcoming rotation to earn the " + "**" + car["name"] + " " + car["year"] + "**" + " in your garage!" 

        setTimeout(function() {
          var string = query["string"]
          var embed = new EmbedBuilder()
          var channel = msg.guild.channels.cache.find(channel => channel.id === "687872420933271577");
          embed.setTitle("🎉 __New Limited Time Event__")
          embed.setColor(0x0151b0)
          embed.setDescription(message)
          embed.setImage(car["image"][0])
          gtf_DISCORD.send(channel, { type1: "CHANNEL", embeds: [embed] })
        }, 2000)
        }],
        "announceupdate": ["string", function (query){
           setTimeout(function() {
          var string = query["string"]
          var embed = new EmbedBuilder()
          var channel = msg.guild.channels.cache.find(channel => channel.id === "687872420933271577");
          embed.setTitle("⚠️ __Maintenance Notice__")
          embed.setColor(0xffff00)
          embed.setDescription("The GT Fitness game has a scheduled maintenance: **" + query["string"] + "**. During this time, all commands for the game will be unavailable. The discount page in **/car**, may immediately change after this maintenance." + "\n\n" + "If you are in a championship, please exit the race before the maintenance starts to prevent your championship progress to be lost." + "\n\n" + "**Additional Information:** " + query["string2"])
          gtf_DISCORD.send(channel, { type1: "CHANNEL", embeds: [embed] })
        }, 2000)
        }],
        "auditcars": ["", function (query) {
          gtf_CARS.audit()
        }],
        "auditparts": ["", function (query) {
          gtf_PARTS.audit()
        }],
        "audittracks": ["", function (query) {
          gtf_TRACKS.audit()
        }],
        "addcredits": ["number", function (query) {
           gtf_STATS.addCredits(parseInt(query["number"]), userdata)
        }],
        "addexp": ["number", function (query) {
            gtf_STATS.addExp(parseInt(query["number"]), userdata);
        }],
        "addmileage": ["number", function (query) {
            gtf_STATS.addMileage(query["number"], userdata)
        }],
        "addtotalmileage": ["number", function (query) {
            gtf_STATS.addTotalMileage(query["number"], userdata)
        }],
        "addrandomcars": ["number", function (query) {
           var cars = gtf_CARS.random({}, parseInt(query["number"]));
        for (var i = 0; i < cars.length; i++) {
          gtf_CARS.addCar(cars[i], "SORT", userdata);
        }
        }],
        "exitrace": ["", function (query) {
            gtf_STATS.clearRaceInProgress(userdata)
        }],
        "exitlobby": ["", function (query) {
            userdata["inlobby"] = [false, ""];
        }],
        "cleargifts": ["", function (query) {
            userdata["gifts"] = [];
        }],
        "clearitems": ["", function (query) {
            userdata["items"] = [];
        }],
        "cleargarage": ["", function (query) {
            userdata["garage"] = [];
            userdata["currentcarnum"] = 0
        }],
        "clearmessages": ["", function (query) {
          userdata["messages"] = []
        }],
        "createseasonallimited": ["", function (query) {
gtf_SEASONAL.randomLimitedSeasonal()
        }],
        "completecareer": ["", function (query) {
            var types = ["c", "b", "a", "ic", "ib", "ia", "s"]
        var races = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 11; j++) {
            races[types[i] + "-" + j] = ["1st", "1st", "1st", "1st", "1st", "1st", "1st", "1st", "1st", "1st"]
          }
        }
        userdata["careerraces"] = races
        }],
        "completelicenses": ["", function (query) {
        var types = ["b", "a", "ic", "ib", "ia", "s"]
        var licenses = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 11; j++) {
            licenses[types[i] + "-" + j] = ["1st", "1st", "1st", "1st", "1st", "1st", "1st", "1st", "1st", "1st"]
          }
        }
        userdata["licenses"] = licenses
        }],
        "giftcredits": ["number", function (query) {
          var gift = {
          "name": "DEBUG " + query["number"],
          "type": "CREDITS",
          "item": query["number"],
          "author": "GTF",
          "inventory": true
        }
        gtf_STATS.addGift(gift, userdata);
        }],
        "giftexp": ["number", function (query) {
            var gift = {
              "name": "DEBUG",
              "type": "EXP",
              "item": query["number"],
              "author": "GTF",
              "inventory": true
            }
          gtf_STATS.addGift(gift, userdata);
        }],
        "giftrandomcar": ["", function (query) {
            var car = gtf_CARS.random({}, 1)[0];
            var gift = {
              "name": "DEBUG",
              "type": "CAR",
              "item": car,
              "author": "GTF",
              "inventory": true
            }
            gtf_STATS.addGift(gift, userdata);
        }],
        "setcredits": ["number", function (query) {
        userdata["credits"] = parseInt(query["number"]);
      }],
        "setexp": ["number", function (query) {
        userdata["exp"] = query["number"];
      }],
        "setlevel": ["number", function (query) {
          userdata["level"] = parseInt(query["number"]);
        }],
        "setmileage": ["number", function (query) {
            userdata["mileage"] = query["number"];
        }],
        "setracemulti": ["number", function (query) {
           userdata["racemulti"] = parseFloat(query["number"])
        }],
        "settotalmileage": ["number", function (query) {
            userdata["totalmileage"] = query["number"];
        }],
        "setlicense": ["string", function (query) {
          userdata["license"] = query["string"]
        }],
        "setplaytime": ["number", function (query) {
          userdata["totalplaytime"] = parseFloat(query["number"]);
        }],
        "resetcareer": ["", function (query){
          var types = ["n", "b", "a", "ic", "ib", "ia", "s", "kart", "rally", "gtacademy"]
        var career = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 21; j++) {
            career[types[i] + "-" + j] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
        userdata["careerraces"] = career
        }],
        "resetexp": ["", function (query) {
          userdata["exp"] = 0;
          userdata["level"] = 0;
        }],
        "resetlicences": ["", function (query) {
        var types = ["b", "a", "ic", "ib", "ia", "s"]
        var licenses = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 11; j++) {
            licenses[types[i] + "-" + j] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
        userdata["licenses"] = licenses
        }],
        "resetuserdata": ["DELETE", function (query) {
          gtf_STATS.save(userdata, "DELETE");
        }],
        "resetseasonals": ["", function (query) {
        var careeraceskeys = Object.keys(userdata["careerraces"])
        for (var i = 0; i < careeraceskeys.length; i++) {
          if (Object.keys(careeraceskeys)[i].match(/seasonal/ig)) {
            userdata["careerraces"][careeraceskeys[i]] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          }
        }
        }],
        "restartbot": ["", function (query) {
          process.exit(1);
        }],
        "toggledailyworkout": ["", function (query) {
          if (userdata["dailyworkout"]) {
            userdata["dailyworkout"] = false;
          } else {
             userdata["dailyworkout"] = true;
          }
        }],
        "updateparts": [],
        "updatefpp": []
        }

      if (typeof debugcommandslist[query["args"]] !== "undefined") { 
        var command = debugcommandslist[query["args"]]
        if (command[0] == "DELETE") {
          return
        }
        if (command[0].length != 0) {
          if (typeof query[command[0]] === "undefined") {
            gtf_EMBED.alert({ name: "❌ Error", description: "Missing arguments", embed: "", seconds: 0 }, msg, userdata);
            return
          }
        }
        command[1](query)
        gtf_STATS.save(userdata);
        results = "`" + query["args"] + "` successful!\n" + "**User:** " + msg.guild.members.cache.get(userdata["id"]).user.displayName + "." + extra
        gtf_EMBED.alert({ name: "✅ Success", description: results, embed: "", seconds: 0 }, msg, userdata);
        return
      }

      gtf_EMBED.alert({ name: "❌ Invalid", description: "Invalid command.", embed: "", seconds: 0 }, msg, userdata);

      
      /*
      if (query["args"] == "importuserdata") {
        success = true
      
        var text = Buffer.from(JSON.stringify(userdata), 'utf8')
        var mz = new Minizip();
        mz.append("userdata.txt", text, {password: process.env.USERDATAPASSWORD});
        const attachment = new AttachmentBuilder( new Buffer(mz.zip()), {name: "GTFITNESSGAME-USERDATA.zip"});
        gtf_DISCORD.send(msg, {files:[attachment]})
        
        return;
      }
      if (query["args"] == "parts_update") {

      for (var i = 0; i < userdata["garage"].length; i++) {
        
        var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]})
        var perf = gtf_PERF.perf(ocar, "DEALERSHIP")
        var parts = ["engine","weightreduction","turbo"]
        for (var j = 0; j < parts.length; j++) {
          var type = parts[j]
          var select = gtf_PARTS.find({ type: type, cartype: ocar["type"].split(":")[0], model: ocar["name"], upperfpp: perf["fpp"], lowerweight: ocar["weight"]}).map(x=>x["name"])
          //select.pop()
          var currentpart = gtfcar["perf"][type]["current"]
          var list = gtfcar["perf"][type]["list"]
          if (currentpart != "Default" && !select.includes(currentpart)) {
            var newpart = select.pop()
            gtfcar["perf"][type]["current"] = newpart
            gtfcar["perf"][type]["list"].push(newpart)
            console.log(gtfcar["perf"][type])
          }
        }
        
      }
        
      }
      if (query["args"] == "careergift") {
        success = true;
        if (!query[1].includes("-")) {
          return;
        }
        if (query[1].split("-")[0].match(/b/g)) {
          var races = require(gtf_TOOLS.homedir() + "data/career/races").beginner();
        }
        if (query[1].split("-")[0].match(/a/g)) {
          var races = require(gtf_TOOLS.homedir() + "data/career/races").amateur();
        }
        if (query[1].split("-")[0].match(/ic/g)) {
          var races = require(gtf_TOOLS.homedir() + "data/career/races").icleague();
        }
        if (query[1].split("-")[0].match(/ib/g)) {
          var races = require(gtf_TOOLS.homedir() + "data/career/races").ibleague();
        }
        if (query[1].split("-")[0].match(/ia/g)) {
          var races = require(gtf_TOOLS.homedir() + "data/career/races").ialeague();
        }
        if (query[1].split("-")[0].match(/s/g)) {
          var races = require(gtf_TOOLS.homedir() + "data/career/races").sleague();
        }

        var event = races[Object.keys(races)[query[1].split("-")[1] - 1]];
        var tracks = event["tracks"];
        var track = gtf_TRACKS.find({ name: tracks[1] })[0];
        var racesettings = gtf_RACE.setcareerrace(event, track, gtf_STATS.currentCar(userdata), 0);
        gtf_STATS.redeemGift(racesettings["prize"], userdata)
          ;
      }
      */
      return


  
    }
  },
};
