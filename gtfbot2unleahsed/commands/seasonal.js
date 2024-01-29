const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "seasonal",
  title: "Seasonal Events",
  license: "A", 
  level: 0,
  channels: ["testing", "gtf-2u-game"],

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
      carselectmessage: false,
      image: [],
      bimage: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    if (userdata["id"] == "237450759233339393") {
       gtf_EMBED.alert({ name: "❌ Seasonal Events Unavailable", description: "Seasonal events are currently unavailable in this update.", embed: "", seconds: 0 }, msg, userdata);
    }
    
    var date = new Date()
    var mod = gtf_DATETIME.getCurrentDay() % 3
    if (mod == 0) {
        if (typeof gtf_LIST_BOT["seasonaldate"] === 'undefined' || Math.abs((gtf_DATETIME.getCurrentDay() - parseInt( gtf_LIST_BOT["seasonaldate"].slice(0,-4)))) >= 3) {
          gtf_EMBED.alert({ name: "⚠️ Seasonal Events Unavailable", description: "Seasonal events are currently in a grace period. Please try again in a few moments.", embed: "", seconds: 0 }, msg, userdata);
          return
          /*
      gtf_LIST_BOT["seasonaldate"] = gtf_DATETIME.getCurrentDay().toString() + date.getFullYear().toString()
    require("fs").writeFile("./jsonfiles/_botconfig.json", require("json-format")(gtf_LIST_BOT), function (err) {
    if (err) {
      console.log(err);
    }
  });
       */ 
          return
  }
    }

    

  if (gtf_LIST_BOT["seasonaldate"] != userdata["seasonalcheck"]) {
      userdata["seasonalcheck"] = gtf_LIST_BOT["seasonaldate"]
      var careeraceskeys = Object.keys(userdata["careerraces"])
        for (var i = 0; i < careeraceskeys.length; i++) {
      if (careeraceskeys[i].toLowerCase().includes("seasonal")) {
      userdata["careerraces"][careeraceskeys[i]] = [0,0,0,0,0,0,0,0,0,0]
    }
}
  }

    
    var seed = parseInt(gtf_MATH.randomIntSeed(0, 1000000, gtf_LIST_BOT["seasonaldate"]))

    ///QUERIES
    if (query["options"] == "a" || query["options"] == "A" || parseInt(query["options"]) == 1) {
      query["options"] = "A"; 
      if (!gtf_STATS.checklicense("A", embed, msg, userdata)) {
        return;
      }
      var charcode = 1
      var numevents = 1
    }
    if (query["options"] == "ib" || query["options"] == "IB" || parseInt(query["options"]) == 2) {
      query["options"] = "IB";
      if (!gtf_STATS.checklicense("IB", embed, msg, userdata)) {
        return;
      }
      var charcode = 10
      var numevents = 1
    }
    if (query["options"] == "ia" || query["options"] == "IA" || parseInt(query["options"]) == 3) {
      query["options"] = "IA";
    if (!gtf_STATS.checklicense("IA", embed, msg, userdata)) {
        return;
      }
      var charcode = 20
      var numevents = 1
    }
  
    if (query["options"] == "s" || query["options"] == "S" || parseInt(query["options"]) == 4) {
      query["options"] = "S";
      if (!gtf_STATS.checklicense("S", embed, msg, userdata)) {
        return;
      }
      var charcode = 30
      var numevents = 1
    }
    if (query["options"] == "limited" || query["options"] == "LIMITED" || parseInt(query["options"]) == 5) {
      query["options"] = "LIMITED";
      var charcode = 40
      var numevents = 1
    }
    ///
    
       var now = Math.round(Date.now() / 1000)
       mod = 3 - mod
       var timeleft = ((((24) - 1) - (date.getUTCHours())) * 3600) + ((60 - date.getUTCMinutes()) * 60) + (86400 * (mod))
       var hoursleft = "<t:" + parseInt(now + timeleft) + ":F>" + " (" + "<t:" + parseInt(now + timeleft) + ":R>" + ")"

    ///QUERIES
    if (query["options"] == "list") {
      delete query["number"]
      delete query["track"]
       embed.setTitle("🎉" + " __Seasonal Events__");
       var available = (Object.keys(gtf_LIST_SEASONALEX).length >= 1 && gtf_LIST_SEASONALEX["start"] == gtf_LIST_BOT['seasonaldate']) ? " `1 Event Available`" : ""
      results =
        "__**A Level**__ " + gtf_EMOTE.alicense + "\n" + 
        "__**IB Level**__ " + gtf_EMOTE.iblicense + "\n" +
        "__**IA Level**__ " + gtf_EMOTE.ialicense + "\n" +
        "__**S Level**__ " + gtf_EMOTE.slicense + "\n" +
        "__**Limited Time Events**__ " + "⭐" + available
        var list = results.split("\n")
      pageargs["list"] = list;
         
        pageargs["footer"] = "**⌛ Next Cycle:** " + hoursleft
      pageargs["selector"] = "options"
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }
    
      var races = []

    //COMMANDS
    if (query["options"] == "LIMITED") {
      if (Object.keys(gtf_LIST_SEASONALEX).length == 0 || gtf_LIST_SEASONALEX["start"] != gtf_LIST_BOT['seasonaldate']) {
        gtf_EMBED.alert({ name: "❌ No Limited Time Events", description: "There are currently no limited time events at the moment.", embed: "", seconds: 0 }, msg, userdata);
           return
    }
      var races = [gtf_LIST_SEASONALEX]
  races[0]["mode"] = "CAREER"
  races[0]["positions"] = gtf_RACE.creditsCalc(races[0])
    } 
    else {
    for (var i = 0; i < numevents; i++) {
      races.push(gtf_SEASONAL.randomSeasonal({}, query["options"], i+1, (seed+i) * charcode))
    }
    }
    
    var ids = Object.keys(races);
    if (typeof query["number"] === 'undefined') {
      results = []
        for (var t = 0; t < ids.length; t++) {
          var raceevent = races[ids[t]];
          raceevent["eventlength"] = raceevent["tracks"].length
          var regulations = raceevent["regulations"]

          var rmake = regulations["makes"].length != 0 ? regulations["makes"].join(", ") + " | ": ""
          var rcountry = regulations["countries"].length != 0 ? regulations["countries"].join(", ") + " | " : ""
          var rmodel =  regulations["models"].length != 0 ?  regulations["models"].join(", ") + " | ": ""
          var drivetrain =  regulations["drivetrains"].length != 0 ?  regulations["drivetrains"].join(", ") + " | " : ""
          var engine = regulations["engines"].length != 0 ? regulations["engines"].join(", ") : ""
          var bop = raceevent["bop"] ? (" " + gtf_EMOTE.bop) : ""
          var weather = (raceevent["weatherchange"] >= 1) ? (" " + gtf_EMOTE.weather) : ""
          var championship = raceevent["championship"] ? ("🏆 ") : ""
          var types = regulations["types"].length != 0 ? regulations["types"].join(", ") : ""

          var any = [rcountry,rmake,rmodel,drivetrain,engine,bop].join("").length != 0 ? "" : "None"
          var tires = regulations["tires"]


          if (raceevent["type"] == "TIMETRIAL") {
            results.push(
            "⌛" +
            "__**" +
            raceevent["title"] + "**__" + " " +
            gtf_STATS.raceEventStatus(raceevent, userdata) +
            "/n" +
            "**Track:** " + raceevent["tracks"][0][1] +
              "/n" +
            "**Loaner Car:** " + raceevent["car"]
          )
          } else if (raceevent["type"] == "DRIFT") {
            results.push(
            gtf_EMOTE.driftflag +
            "__**" +
            raceevent["title"] + "**__" + " " +
            gtf_STATS.raceEventStatus(raceevent, userdata) +
            "/n" +
            "**Track:** " + raceevent["tracks"][0][1] +
              "/n" +
            "**Loaner Car:** " + raceevent["car"]
          )
          } else {
            var weight = regulations["upperweight"] == 9999 ? "---" :gtf_MATH.numFormat(gtf_STATS.weightUser(regulations["upperweight"], userdata))
        var fppreg = !raceevent["bop"] 
 ? regulations["fpplimit"].toString().replace("9999", "---") + gtf_EMOTE.fpp : (regulations["lowerfpp"] == 0 ? "---": regulations["lowerfpp"]) + gtf_EMOTE.fpp + " - " + regulations["fpplimit"].toString().replace("9999", "---") + gtf_EMOTE.fpp
          results.push(
            championship +
            "__**" +
            raceevent["title"] +
            " - " +
            raceevent["tracks"].length +
            " Races**__ " +
            gtf_STATS.raceEventStatus(raceevent, userdata) +
            "/n" +
            "**" +
            fppreg + " | " +
            regulations["upperpower"].toString().replace("9999", "---") + " hp" + " " + weight + " " + gtf_STATS.weightUnits(userdata) + " " +
            gtf_EMOTE.tire  + tires + weather +
            "**/n" +
            (raceevent["car"] != "GARAGE" ?
            "**Loaner Car:** " + raceevent["car"] : "**Regulations:** " +
           rcountry + rmake +
            rmodel + drivetrain + engine + bop + any +
            "/n" + "**Types:** " + types)
          )
        }
      }
        embed.setTitle("🏁 __Seasonal Events - " + query["options"].toUpperCase() + " (" + ids.length + " Events)" + "__");
        pageargs["image"].push( 
"https://github.com/J24681357/gtfbotmain/raw/master/gtfbot2unleahsed/images/career/" + query["options"].toUpperCase() + "_level.png")
        pageargs["list"] = results;
        pageargs["selector"] = "number"
        pageargs["query"] = query
        pageargs["footer"] = "**⌛ Next Cycle:** " + hoursleft
        pageargs["rows"] = 3
        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      /*
        setTimeout(function() {
          var t = 0
            for (t; t < ids.length; t++) {
          raceevent = races[ids[t]];
          var achieve = gtf_STATS.isracescomplete(query["options"].toLowerCase() + "-" + (t + 1), raceevent["tracks"].length, 1, userdata);
          if (achieve) {
            gtf_STATS.eventcomplete(query["options"].toLowerCase() + "-" + (t + 1), userdata);
            gtf_STATS.gift(gtf_EMOTE.goldmedal + " Congrats! Completed " + raceevent["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, raceevent["prize"], embed, msg, userdata);
          }
            }
          }, 2000)
      */
        return;
    }
      
    var number = parseInt(query["number"])
      if (!gtf_MATH.betweenInt(number, 1, Object.keys(races).length) && !isNaN(number)) {
          gtf_EMBED.alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 5}, msg, userdata);
          return
      }
      embed.setFields([{name:gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata)}]);


    var event = {...races[Object.keys(races)[number - 1]]}
      gtf_RACE.careerRaceselect(event, query, gorace, embed, msg, userdata);

      function gorace(event) {
        var raceprep = {
          mode: "CAREER",
          modearg: "",
          track: event["track"],
          car: event["car"],
          racesettings: event,
          players: [],
          other: {},
        };
      var gtfcar = gtf_STATS.currentCar(userdata)
         gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
      }
      }
};
