const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
module.exports = {
  name: "fithusimlife",
  title: "Fithusim Life",
  license: "N",
  level: 0,
  channels: ["gtf-fithusim-game", "testing"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gte_TOOLS.setupCommands(
      embed,
      results,
      query,
      {
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
      },
      msg,
      userdata
    );
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
    /*
  var racecheck = Object.keys(userdata["races"]).filter(function(key){
    if (userdata["races"][key] == 3) {
    return true
    } else {
    return false
    }
  })
    
  if (racecheck.length >= 1) {
    userdata["races"][racecheck[0]] = 4
    var finalgrid = gtf_CARS.random({types: ["Rally Car", "Race Car"], upperyear: [1989, 2005, 9999][userdata["settings"]["GMODE"]],
                                      loweryear: [1960, 1990, 2006][userdata["settings"]["GMODE"]]}, 6).map(function(x) {
      return {
        "name": x["name"] + " " + x["year"]}
    })
    var racesettings = {title: "⭐"}
    
gte_GTF.giftRouletteEnthu(finalgrid, racesettings, embed, msg, userdata)
    return
    }
    */


    ////CHECK NEW GAME
    if (gte_STATS.garage(userdata) == 0 || userdata["week"] == 0) {
      query["options"] = "new_game" 
    }
    
    if (query["number"] == 1 && gte_STATS.garage(userdata) != 0 && userdata["week"] != 0) {
      query = {options:"races"}
    }

    ////CHANGE CAR//
    if (query["number"] == 2 && gte_STATS.garage(userdata) != 0 && userdata["week"] != 0) {
      query = {options:"changecar"}
    }

    if (query["number"] == 3 && gte_STATS.garage(userdata) != 0 && userdata["week"] != 0) {
      query = {options:"rest"}
    }

    if (query["number"] == 4 && gte_STATS.garage(userdata) != 0 && userdata["week"] != 0) {
      query = {options:"garage"}
    }
    
    if (query["number"] == 5 && gte_STATS.garage(userdata) != 0 && userdata["week"] != 0) {
          query = {options:"records"}
    }
    
    var gtfcar = gte_STATS.currentCar(userdata);


    if (query["options"] == "new_game") {
       embed.setTitle("__New Game - Select Your First Car__");
       var list = gtf_CARS.find({ 
         upperyear: [1989, 2005, 9999][userdata["settings"]["GMODE"]], loweryear: [1960, 1990, 2006][userdata["settings"]["GMODE"]], special: ["xstarter"] });
       var carlist = [];
       var listsec = []
        for (var i = 0; i < list.length; i++) {
          var classs = gte_PERF.perfEnthu(list[i], "DEALERSHIP")["class"];
         
          var name = list[i]["name"];
          var image = list[i]["image"][0];
          
          carlist.push(gtf_CARS.shortName(name) + " ` " + classs + " `");
          listsec.push(list[i]["year"] + " | " + gtf_MATH.numFormat(list[i]["power"]) + " hp" + " | " + gtf_MATH.numFormat(gte_STATS.weightUser(list[i]["weight"], userdata)) + " " + gte_STATS.weightUnits(userdata) + " | " + list[i]["special"].join(", "))
          pageargs["image"].push(image);
        }
      if (query["number"] !== undefined) {
          if (!gtf_MATH.betweenInt(query["number"], 1, list.length)) {
            gte_EMBED.alert({ name: "❌ Invalid Number", description: "This number does not exist.", embed: "", seconds: 5 }, msg, userdata);
            return;
          } else {
            var number = parseInt(query["number"]) - 1;
            var car = list[number];
            userdata["week"] = 1
            gte_CARS.addCarEnthu(car, "SORT", userdata);
            require(__filename.split(".")[0]).execute(msg, {options:"list", extra: "New car!"}, userdata)
            return
          }
      }
        pageargs["selector"] = "number";
        pageargs["query"] = query;
        pageargs["list"] = carlist;
        pageargs["listsec"] = listsec

        pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
        gte_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }

    if (query["options"] == "list") {
      //gte_STATS.checkRanking(userdata)
      embed.setTitle("__**Fithusim Life**__" + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + gte_DATETIME.getFormattedWeekEnthu(userdata["week"]) + " WEEK")
      var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] });
      pageargs["image"].push(ocar["image"][0])
      gte_STATS.loadAvatarImage2(embed, userdata, then2)
      
      function then2(attachment) {
      pageargs["bimage"].push(attachment)
      var list = ["[__ Go Race __]", "[__ Change Car __]", "[__ Rest __]", "[__ Garage __]", "[__ Records __]"]
      var listsec = ""
      pageargs["selector"] = "number";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["listsec"] = listsec

      pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
      gte_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }
    }

    if (query["options"] == "races" || query["options"] == 1) {
      if (!gte_STATS.checkEnthuPoints(embed, msg, userdata)) {
        return;
      }
      var allraces = []
      var list = []
      var images = []
      var indexes = []
      if (typeof query["type"] === "undefined") {
        gte_STATS.loadAvatarImage2(embed, userdata, then2)
        function then2(attachment) {
          pageargs["bimage"].push(attachment)
         embed.setTitle("__**Leagues**__" + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + gte_DATETIME.getFormattedWeekEnthu(userdata["week"]) + " WEEK")///DEMO , "RII `Rank 500`", "RI `Rank 300`", "RS `Rank 50`"
        pageargs["selector"] = "type";
        pageargs["query"] = query;
        pageargs["list"] = ["RN", "RIV `Rank 990`", "RIII `Rank 800`"];
        pageargs["listsec"] = []
        pageargs["image"] = images

        pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
        gte_TOOLS.formPages(pageargs, embed, msg, userdata);
        return
        }
        return
      }
      var league = ["RN", "RIV", "RIII", "RII", "RI", "RS"][query["type"]-1]
      
      if (!gte_STATS.checkLeague(league, embed, msg, userdata)) {
        return;
      }
      var races = gte_FITHUSIMRACES.find({types: [league.toLowerCase()]}).filter(function(event) {
        if (event["regulations"]["upperyear"] == 9999) {

          event["regulations"]["upperyear"] = [1989, 2005, 9999][userdata["settings"]["GMODE"]]
          event["regulations"]["loweryear"] = [1960, 1990, 2006][userdata["settings"]["GMODE"]]
        }

      return gte_GTF.checkRegulationsEnthu(gtfcar, event, "", embed, msg, userdata)[0] && event["era"].indexOf(userdata["settings"]["GMODE"]+1) >= 0
        
      })
       embed.setTitle("__**" + league + "**__" + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + gte_DATETIME.getFormattedWeekEnthu(userdata["week"]) + " WEEK")
      var total = 7
      if (league == "RN") {
        total = 5
      } else if (league == "RS") {
        total = 2
      }
      for (var i = 1; i < total; i++) {
        var event = gte_TOOLS.randomItem(races, gte_STATS.week(userdata) + i)
        event["eventid"] = event["eventid"].split("-")[0] + "-" + (i)
        
      event["tracks"][0]["seed"] = gte_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])
          
      event["driver"] = {car: gtfcar}

      if (event["title"].includes("One-Make")) {
        var car = gtf_CARS.find({fullnames: [gtfcar["name"]]})[0]
        event["regulations"] = {
          "tires": "Racing: Soft",
          "fpplimit": 9999,
          "upperfpp": 9999,
          "lowerfpp": 0,
          "upperpower": 9999,
          "lowerpower": 0,
          "upperweight": 9999,
          "lowerweight": 0,
          "upperyear": 9999,
          "loweryear": 0,
          "countries": [],
          "makes": [car["make"]],
          "models": [car["name"]],
          "engines": [],
          "drivetrains": [],
          "types": [],
          "special": [],
          "prohibited": []
      }
      }
      var finalgrid = gte_RACE.createGridEnthu(event,"", 0)
      var average = gtf_MATH.average(finalgrid.map(function(x) {
          var fpp = x["fpp"]
          if (x["user"]) {
            fpp = gte_PERF.perfEnthu(gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]}), "DEALERSHIP")["fpp"]
          }
          return fpp
        }))
        finalgrid = finalgrid.map(function(x) {
          var fpp = x["fpp"]
          if (x["user"]) {
            fpp = gte_PERF.perfEnthu(gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]}), "DEALERSHIP")["fpp"]
            
          }
          var num = fpp - average

          x["odds"] = gtf_MATH.round((-2*(-Math.exp(-0.012 * num))) + 1, 1)
          x["odds"] = !x["odds"].toString().includes(".") ? x["odds"] + ".0" : x["odds"]
          return x
        }).sort(function(x,y) {return parseFloat(y["odds"]) - parseFloat(x["odds"])}).map(function(x,i){
          x["place"] = i+1
          x["position"] = i+1
          return x
        })
        event["userodds"] = finalgrid.filter(x => x["user"] == true)[0]["odds"]
        var points = gte_RACE.creditsCalcEnthu(event).map(x => "**" + x["place"] + "**  " + Math.round(x["points"] * userodds) + " pts")
        var results = "**" + event["title"] + "**" + "\n" + points.slice(0,4).join("\n") + "\n\n" + finalgrid.map(function(x) {
          if (x["user"]) {
            return "**" + x["name"] + " `" + x["odds"] + "`" + "**"
          } else {

          return x["name"] + " `" + x["odds"] + "`"
          }

        })

        allraces.push(event)

      }
    allraces = [...allraces.sort(function(x,y) {return y["userodds"] - x["userodds"]})]
      
      list = allraces.map(function(event) {
        var rtrack = gtf_TRACKS.random(event["tracks"][0], 1)[0]

        event["tracks"][0]["seed"] = gte_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])
        var laps = gte_RACE.lapCalc(rtrack['length'], {"RN": 6, "RIV": 6, "RIII": 9, "RII": 10, "RI": 13, "RS": 28}[league])[0]

        images.push(rtrack["image"])
        
      return "__**" + event["title"] + "**__" + " " + rtrack["name"].replace(" Reverse", " 🔄") +
          "/n" + "`" + event["userodds"] + "` " + rtrack["length"] + " km. \\ " + event["grid"][0] + " CARS \\ " + laps + " LAPS"
    })
        
      if (typeof query["racenumber"] !== "undefined") {
        var number = query["racenumber"]-1
        var id = allraces[number]["eventid"]
        
        var event = allraces.filter(x=> x["eventid"] == id)[0]
////
 
        //event["eventid"] = event["eventid"].split("-")[0] + "-" + (number)
        event["driver"] = {car: gte_STATS.currentCar(userdata)}
        var points = gte_RACE.creditsCalcEnthu(event).map(x => "**" + x["place"] + "**  " + x["points"] + " pts")
        console.log(event["tracks"][0]["seed"])
        event["tracks"][0]["seed"] = gte_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])
        console.log(event["tracks"][0]["seed"])
         var rtrack = gtf_TRACKS.random(event["tracks"][0], 1)[0]
        event["tracks"][0]["seed"] = gte_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])

        event["regulations"]["upperyear"] = [1989, 2005, 9999][userdata["settings"]["GMODE"]]
        event["regulations"]["loweryear"] = [1960, 1990, 2006][userdata["settings"]["GMODE"]]
        
        var finalgrid = gte_RACE.createGridEnthu(event, "", 0)

        var average = gtf_MATH.average(finalgrid.map(function(x) {
          var fpp = x["fpp"]
          if (x["user"]) {
            fpp = gte_PERF.perfEnthu(gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]}), "DEALERSHIP")["fpp"]
          }
          return fpp
        }))
  
        finalgrid = finalgrid.map(function(x){
          var fpp = x["fpp"]
          if (x["user"]) {
            fpp = gte_PERF.perfEnthu(gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]}), "DEALERSHIP")["fpp"]
          }
          var num = fpp - average
          
          x["odds"] = gtf_MATH.round((-2*(-Math.exp(-0.012 * num))) + 1, 1)
          x["odds"] = !x["odds"].toString().includes(".") ? x["odds"] + ".0" : x["odds"]
          return x
        }).sort(function(x,y) {return parseFloat(y["odds"]) - parseFloat(x["odds"])}).map(function(x,i){
          x["place"] = i+1
          x["position"] = i+1
          return x
        })
        var userodds = finalgrid.filter(x => x["user"] == true)[0]["odds"]
        var points = gte_RACE.creditsCalcEnthu(event).map(x => "**" + x["place"] + "**  " + Math.round(x["points"] * userodds) + " pts")
        var results = "**" + event["title"] + "**" + "\n" + points.slice(0,4).join("\n") + "\n\n" + finalgrid.map(function(x) {
          if (x["user"]) {
            return "**" + x["name"] + " `" + x["odds"] + "`" + "**"
          } else {
          
          return x["name"] + " `" + x["odds"] + "`"
          }
        
        }).join("\n")
        event["tracks"] = [
          [1, rtrack["name"],2]
        ]
    
        var emojilist = [
  { emoji: gtf_EMOTE.fithusimlogo, 
  emoji_name: "fithusimlogo", 
  name: 'Join', 
  extra: "",
  button_id: 0 }
] 
          embed.setTitle("__**" + rtrack["name"] + "**__" + " " + gte_DATETIME.getFormattedWeekEnthu(userdata["week"]) + " WEEK")
        embed.setDescription(results);
        embed.setThumbnail(rtrack["image"])
var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);
        
       gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, next)

        function next(msg) {
       function startrace() {
         event["tracks"][0]["seed"] = gte_STATS.week(userdata) + parseInt(event["eventid"].split("-")[1])
         event["laps"] = event["tracks"][0][2]
           var raceprep = {
          mode: "CAREER",
          modearg: "",
          car: "GARAGE",
          track: event["tracks"][0][1],
          racesettings: event,
          players: finalgrid,
          other: []
        };
        raceprep["racesettings"]["positions"] = gte_RACE.creditsCalcEnthu(raceprep["racesettings"], raceprep)
       
      gte_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
  
          }
          var functionlist = [startrace]
          gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
        }
        
        return
      }
      pageargs["selector"] = "racenumber";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["listsec"] = [];
      pageargs["image"] = images

      pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
      gte_TOOLS.formPages(pageargs, embed, msg, userdata);
      
    }

    if (query["options"] == "changecar" || query["options"] == 2) {
      if (!gte_STATS.checkEnthuPoints(embed, msg, userdata)) {
        return;
      }
      require(gte_TOOLS.homedir() + "commands/garage").execute(msg, {options:"changecar"}, userdata)
      return
    }

    if (query["options"] == "rest" || query["options"] == 3) {
      embed.setTitle("__**Rest**__" + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + gte_DATETIME.getFormattedWeekEnthu(userdata["week"]) + " WEEK");
      embed.setDescription("Would you like to rest and gain Enthu points? One week will advance.")

         var emojilist = [
      { emoji: gtf_EMOTE.fithusimlogo, 
      emoji_name: "fithusimlogo",  
      name: 'YES', 
      extra: "",
      button_id: 0 }
      ]

      var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);
            gte_STATS.saveEnthu(userdata);
         gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, func)

         function func(msg) {
          function ok() {
            var racesettings = {title:"REST"}
    userdata["rankinghistory"].push({
      title:racesettings["title"], 
      league: "NONE",
            week:userdata["week"], 
            place: "1st",                                   points: 0, 
      damage:0,
          skillpoints:0
           })
              userdata["week"]++
            gte_GTF.resultsSummaryEnthu(racesettings, {}, embed, msg, userdata)
          }

          var functionlist = [ok]
          gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
        }
      return
    }

    if (query["options"] == "garage" || query["options"] == 4) {
      embed.setTitle("__Choose Class__");
       var list = ["F Class", "E Class", "D Class", "C Class", "B Class", "A Class", "R Class"]
      if (query["classnumber"] !== undefined) {
          if (!gtf_MATH.betweenInt(query["classnumber"], 1, list.length)) {
            gte_EMBED.alert({ name: "❌ Invalid Number", description: "This class does not exist.", embed: "", seconds: 5 }, msg, userdata);
            return;
          } else {
            var number = parseInt(query["classnumber"]) - 1;
            var types = []
            if (number == 7) {
            var fpplimit = 9999
            var lowerfpp = 0
              var types = ["Rally Car", "Race Car"]
            }
            fpplimit = [308, 388, 468, 548, 618, 9999][number]
            lowerfpp = [0,   319, 389, 469, 549, 619][number]
            require(gte_TOOLS.homedir() + "commands/garage").execute(msg, {options:"list", fpplimit: fpplimit, lowerfpp:lowerfpp, types: types}, userdata)
            return
          }
      }
        pageargs["selector"] = "classnumber";
        pageargs["query"] = query;
        pageargs["list"] = list;
        pageargs["listsec"] = listsec

        pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
        gte_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }
    
    if (query["options"] == "records" || query["options"] == 5) {
      embed.setTitle("__**Records**__" + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + " " + gtf_EMOTE.transparent + gte_DATETIME.getFormattedWeekEnthu(userdata["week"]) + " WEEK")
      var list = gte_STATS.rankingHistory(userdata).reverse().map(x => 
        x["week"] + " WEEK **" + x["points"] + " pts**" + " `" + x["place"] + "`\n" + 
        x["title"] + " " + x["league"] + "\n" +
        x["car"])

      pageargs["selector"] = "";
      pageargs["query"] = query;
      pageargs["rows"] = 5;
      pageargs["list"] = list;
      pageargs["listsec"] = [];

      pageargs["text"] = gte_TOOLS.formPage(pageargs, userdata);
      gte_TOOLS.formPages(pageargs, embed, msg, userdata);
    }
    }
};
