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

    var keys = [];

    var { MongoClient, ServerApiVersion } = require('mongodb');

    MongoClient = new MongoClient(process.env.MONGOURL, {  serverApi: ServerApiVersion.v1 });
    var db = await MongoClient.connect()
    var dbo = db.db("GTFitness");
    dbo
      .collection("FITHUSIMSAVES")
      .find({})
      .forEach(row => {
        if (typeof row["id"] === "undefined") {
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

      var debugcommandslist = {
        "updateallsaves": ["", function (query) {
         gtf_TOOLS.updateallsaves("FITHUSIMSAVES", {})
        }],
        "importuserdata": "",
        "auditfithusimraces": ["", function (query) {
          gte_FITHUSIMRACES.audit()
        }],
        "addexp": ["number", function (query) {
            gte_STATS.addExp(parseInt(query["number"]), userdata);
        }],
        "addmileage": ["number", function (query) {
            gte_STATS.addMileage(query["number"], userdata)
        }],
        "addtotalmileage": ["number", function (query) {
            gte_STATS.addTotalMileage(query["number"], userdata)
        }],
        "addrandomcars": ["number", function (query) {
           var cars = gte_CARS.randomEnthu({}, parseInt(query["number"]));
        for (var i = 0; i < cars.length; i++) {
          gtf_CARS.addCarEnthu(cars[i], "SORT", userdata);
        }
        }],
        "exitrace": ["", function (query) {
            gte_STATS.clearRaceInProgress(userdata)
        }],
        "clearitems": ["", function (query) {
            userdata["items"] = [];
        }],
        "cleargarage": ["", function (query) {
            userdata["garage"] = [];
            userdata["currentcarnum"] = 0
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
          gte_STATS.saveEnthu(userdata, "DELETE");
        }],
        "restartbot": ["", function (query) {
          process.exit(1);
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
        gte_STATS.saveEnthu(userdata);
        results = "`" + query["args"] + "` successful!\n" + "**User:** " + msg.guild.members.cache.get(userdata["id"]).user.displayName + "." + extra
        gtf_EMBED.alert({ name: "✅ Success", description: results, embed: "", seconds: 0 }, msg, userdata);
        return
      }

      gtf_EMBED.alert({ name: "❌ Invalid", description: "Invalid command.", embed: "", seconds: 0 }, msg, userdata);
      return



    }
  },
};
