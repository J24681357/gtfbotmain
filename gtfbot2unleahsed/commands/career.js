const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "career",
  title: "Career Mode",
  license: "N", 
  level: 0,
  channels: ["testing", "gtf-2u-game", "gtf-demo"],

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
      rows: 11,
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

    var mode = "CAREER";
    
    if (query["options"] == "c" || parseInt(query["options"]) == 1) {
      query["options"] = "C";
    } 
    else if (query["options"] == "b" || parseInt(query["options"]) == 2) {
      query["options"] = "B";
    } 
    else if (query["options"] == "a" || parseInt(query["options"]) == 3) {
      query["options"] = "A";
    }
    else if (query["options"] == "ic" || parseInt(query["options"]) == 4) {
      query["options"] = "IC";
    }
    else if (query["options"] == "ib" || parseInt(query["options"]) == 5) {
      query["options"] = "IB";
    }
    else if (query["options"] == "ia" || parseInt(query["options"]) == 6) {
      query["options"] = "IA";
    } else if (query["options"] == "s" || parseInt(query["options"]) == 7) {
      query["options"] = "S";
    }

    if (query["options"] == "kart" || parseInt(query["options"]) == 8) {
      query["options"] = "KART";
      if (!gtf_EXP.checkLevel(4, embed, msg, userdata)) {
        return;
      }
    }  
    if (query["options"] == "rally" || parseInt(query["options"]) == 9) {
      query["options"] = "RALLY";
      if (!gtf_STATS.checklicense("IC", embed, msg, userdata)) {
        return;
      }
    }
    
  if (query["options"] == "grandtour" || parseInt(query["options"]) == 10) {
      query["options"] = "GRANDTOUR";
      if (!gtf_EXP.checkLevel(23, embed, msg, userdata)) {
        return;
      }
  }
    
    if (query["options"] == "gtacademy" || parseInt(query["options"]) == 11) {
      query["options"] = "GTACADEMY";
      if (!gtf_EXP.checkLevel(30, embed, msg, userdata)) {
        return;
      }
    }

   if (query["options"] == "formula" || parseInt(query["options"]) == 12) {
      query["options"] = "FORMULA";
      if (!gtf_EXP.checkLevel(35, embed, msg, userdata)) {
        return;
      }
    }
  
    pageargs["image"].push( "https://github.com/J24681357/gtfbotmain/raw/master/gtfbot2unleahsed/images/career/" + query["options"].toUpperCase() + "_level.png")
    if (userdata["id"] == "237450759233339393") {
    }

    

    if (query["options"] == "list") {
      delete query["number"]
      delete query["track"]
       embed.setTitle("🏁" + " __Career Mode__");
      results =
        "__**C Level**__ " +
        "\n" +
        "__**B Level**__ " + gtf_EMOTE.blicense +
        "\n" +
        "__**A Level**__ " + gtf_EMOTE.alicense +
        "\n" +
        "__**IC Level**__ " + gtf_EMOTE.iclicense +
        "\n" +
        "__**IB Level**__ " + gtf_EMOTE.iblicense +
        "\n" +
        "__**IA Level**__ " + gtf_EMOTE.ialicense +
        "\n" +
        "__**S Level**__ " + gtf_EMOTE.slicense
        + "\n" +
        "__**Special Event: Kart**__ " +  gtf_EMOTE.exp + " `Lv.4`" + "\n" +
        "__**Special Event: Rally**__ " +  gtf_EMOTE.iclicense + "\n" +
        "__**Special Event: GTF Grand Tour**__ " + gtf_EMOTE.exp + " `Lv.23`" + "\n" +
        "__**Special Event: GT Academy**__ " + gtf_EMOTE.exp +
        " `Lv.30`" + "\n" +
        "__**Special Event: Formula**__ " + gtf_EMOTE.exp +
        " `Lv.35`"
        var list = results.split("\n")
      pageargs["list"] = list;
      pageargs["rows"] = 7
      pageargs["selector"] = "options"
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }
    if (query["options"] == "KART" || query["options"] == "RALLY" || query["options"] == "FORMULA" || query["options"] == "GTACADEMY" || query["options"] == "GRANDTOUR" || query["options"] == "TESTING") {
    } else {
  if (!gtf_STATS.checklicense(query["options"], embed, msg, userdata)) {
        return;
      }
    }
      var races = [...gtf_CAREERRACES.find({types: [query["options"]] })].filter(function(x) {
        if (x["require"].length == 0) {
          return true
        }
        var race = gtf_MAIN.gtfcareerraces [x["require"][0].toLowerCase().replace("-", "")]
        var progress = gtf_STATS.raceEventStatus(race, userdata)
        if (progress == "⬛") {
          return false
        }
        if (progress == "✅") {
          return true
        }
        progress = parseInt(progress.split("`")[1].split("%")[0])
        if (progress >= x["require"][1]) {
        return true
        } else {
          return false
        }
    })
    var ids = Object.keys(races);
    if (ids.length == 0) {
      gtf_EMBED.alert({ name: "❌ No Events", description: "There are no events in this level.", embed: "", seconds: 3 }, msg, userdata);
      return
    }

    //EVENTS LIST
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
      var totale = ids.length
      if (query["options"] == "KART") {
        totale = 2
      } else if (query["options"] == "RALLY") {
        totale = 3
      } else if (query["options"] == "FORMULA") {
        totale = 4
      } else if (query["options"] == "GTACADEMY") {
        totale = 8
      }
        embed.setTitle("🏁 __Career Mode - " + query["options"].toUpperCase() + " (" + ids.length + "/" + totale + " Events)" + "__");
        pageargs["list"] = results;
        pageargs["selector"] = "number"
        pageargs["query"] = query
      if (query['options'] == "KART") {
        pageargs["footer"] = gtf_EMOTE.igorf + " `" + gtf_ANNOUNCER.say({name1:"intro", name2: "igorf"}) + "`"
      }
      if (query['options'] == "FORMULA") {
        pageargs["footer"] = gtf_EMOTE.lewish + " `" + gtf_ANNOUNCER.say({name1:"intro", name2: "lewish"}) + "`"
      }
      if (query['options'] == "GRANDTOUR") {
        pageargs["footer"] = gtf_EMOTE.jamesp + " `" + gtf_ANNOUNCER.say({name1:"intro", name2: "jamesp"}) + "`"
      }
    if (query['options'] == "GTACADEMY") {
        pageargs["footer"] = gtf_EMOTE.jannm + " `" + gtf_ANNOUNCER.say({name1:"intro", name2: "jannm"}) + "`"
      }
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
    ///

    var number = parseInt(query["number"])
      if (!gtf_MATH.betweenInt(number, 1, Object.keys(races).length) && !isNaN(number)) {
          gtf_EMBED.alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
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
}
