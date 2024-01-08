const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "customrace",
  title: "GTF Custom Race",
  license: "N",
  level: 40,
  channels: ["gtf-2u-game", "testing"],

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
      rows: 9,
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
    var setups = userdata["eventsettings"]
    var gtfcar = gtf_STATS.currentCar(userdata)

    if (typeof userdata["customracetemp"] === 'undefined' || query["options"] == "random"|| query["options"] == "random_free") {

      var gtfcar = gtf_STATS.currentCar(userdata)
        query["options"] = "list"
        var list = [];
          var raceprep = {
          mode: "CUSTOM",
          modearg: query["options"],
          car: "GARAGE",
          trackselect: "RANDOM",
          track: { types: ["Tarmac"] },
          racesettings: {},
          other: []
        };


      var racesettings = gtf_RACE.setRaceSettings(raceprep, gtfcar, embed, msg, userdata)

      var finalgrid = gtf_RACE.createGrid(racesettings,"");
      userdata["customracetemp"] = {racesettings: {...racesettings}}
      userdata["customracetemp"]["finalgrid"] = finalgrid
      userdata["customracetemp"]["eventid"] = setups.length + 1
      userdata["customracetemp"]["racesettings"]["title"] = "Custom Race #" + (setups.length + 1)
      userdata["customracetemp"]["racesettings"]["positions"] = gtf_RACE.customRaceCreditsCalc(racesettings, raceprep, finalgrid)

   }
    else {
      if (query["options"] == "load" && typeof query["number"] !== 'undefined') {
      userdata["customracetemp"] = setups[parseInt(query["number"])-1]
      query = {options:"list"}
    }
    }

    ///USER IN CUSTOMRACE SETTINGS
    var userthere = false
     userdata["customracetemp"]["finalgrid"] = userdata["customracetemp"]["finalgrid"].map(function(x, i) {
       x["place"] = (i + 1)
       x["position"] = (i + 1)
       if (x["user"]) {
         userthere = true
       var car = gtf_STATS.currentCar(userdata)
      var temp = gtf_PERF.perf(car, "GARAGE")
      fpp = temp["fpp"]
      var fueleco = temp["fueleco"]
      var user = {
        place: i + 1,
        position: i + 1,
        drivername: userdata["customracetemp"]["racesettings"]["driver"]["name"],
        name: car["name"],
        user: true,
        fpp: fpp,
        damage: 0,
        tires: car["perf"]["tires"]["current"],
        otires: car["perf"]["tires"]["current"],
        tirewear: 100,
        fuel: 100,
        fueleco: fueleco,
        pitstops: 0,
        oscore: x["score"],
        score: x["score"],
        points: 0,
        laps: []
      };
         userdata["customracetemp"]["racesettings"]["driver"]["car"] = car
         return user
       } else {
         return x
       }
     })
    ///
  var finalgrid = userdata["customracetemp"]["finalgrid"]
    
    if (!userthere) {
      var user = gtf_RACE.createGrid(userdata["customracetemp"]["racesettings"], gtfcar, 1)[0]
       user["place"] = userdata["customracetemp"]["finalgrid"].length
       user["position"] = userdata["customracetemp"]["finalgrid"].length
       userdata["customracetemp"]["finalgrid"][userdata["customracetemp"]["finalgrid"].length - 1] = user
   }

    if (query["options"] == "load") {
      if (setups.length == 0) {
        gtf_EMBED.alert({ name: "❌ No Events", description: "There are no events saved.", embed: "", seconds: 0 }, msg, userdata);
        return;
      }

      delete query["number"]

      embed.setTitle("__**Custom Race: Setups (" + setups.length + "/" + gtf_GTF.eventlimit + ")**__");

      var list = setups.map(function (event) {
          return "`ID:"+ (event["eventid"]) + "` " + event["racesettings"]["title"] + " `" + event["date"] + "`";
        });
        pageargs["list"] = list;
        pageargs["selector"] = "number"
        pageargs["query"] = query
        pageargs["numbers"] = false
        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
        return;
      }
    if (query["options"] == "delete") {
      var number = query["number"];
        if (!gtf_MATH.betweenInt(number, 1, setups.length + 1)) {
          gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your event setups.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var name = setups[number-1]["racesettings"]["title"]
        embed.setDescription("⚠️ Delete " + "`ID:" + number + "` " + "**" + name + "**?");
          var emojilist = [
  { emoji: gtf_EMOTE.yes,
  emoji_name: 'Yes',
  name: 'Confirm',
  extra: "Once",
  button_id: 0 }]
    var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

        gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, delete1)
      function delete1(msg) {
          function deletesetup() {
            gtf_STATS.deleteEventSettings(number-1, userdata)
            gtf_STATS.save(userdata)
             setTimeout(function() {require(__filename.split(".")[0]).execute(msg, {options:"load", extra:"Deleted " + "`ID:" + number + "` " + "**" + name + "**."}, userdata);
            }, 1000)
          }
          var functionlist = [deletesetup]
          gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
        }

        return;
      }

    
    ///COMMANDS
     if (query["options"] == "start" || query["settings"] == 1) {
        var raceprep = {
          mode: "ARCADE",
          modearg: "custom_" + userdata["customracetemp"]["racesettings"]["difficulty"],
          car: "GARAGE",
          track: userdata["customracetemp"]["racesettings"]["track"]["name"],
          racesettings: userdata["customracetemp"]["racesettings"],
          players: userdata["customracetemp"]["finalgrid"],
          other: []
        };
       userdata["customracetemp"]["racesettings"]["positions"] = gtf_RACE.customRaceCreditsCalc(userdata["customracetemp"]["racesettings"],  {mode: "CUSTOM", modearg:"custom"}, userdata["customracetemp"]["finalgrid"])
       
      gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);

       return
     }


    
      if (query["options"] == "list") {
        pageargs["list"] = createmenu()
        if (!pageargs["list"]) {
          return
        }
        if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
            delete query["extra"]
        }
        
        pageargs["selector"] = "settings"
        pageargs["query"] = query

        pageargs["numbers"] = false
        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
        return;
      }

      if (query["options"] == "grid") {
       query["options"] = "set"
       query["settings"] = 10
     }
      if (query["options"] == "regulations") {
       query["options"] = "set"
       query["settings"] = 11
      }

    if (query["options"] == "set" || query["options"] == "settings"  || query["options"] == "regulations") {
      pageargs["carselectmessage"] = false

        var changes = [];
        var settings = ["track", "lap", "endurance", "time", "weather", "wet",  "gridcount", "difficulty", viewgrid, viewregulations, clearregulations, saveevent]

        var setting = query["settings"]
        if (query["settings"] == 11) {
          if (typeof query["number"] !== 'undefined') {
            if (query["number"] == 1) {
              require(__filename.split(".")[0]).execute(msg, {options: "list"}, userdata);
              return
            }
          }
        }
        if (setting == 1) {
            require(__filename.split(".")[0]).execute(msg, {options: "list"}, userdata);
            return
        }
          if (setting == 11) {
            if (typeof query["number"] !== 'undefined') {
              query["regulations"] = ["FPP", "tires", "makes", "countries", "types", "drivetrains", "engines"][query["number"]-1]
              delete query["number"]
              delete query["settings"]
            }
        }
        if (!isNaN(setting)) {
           setting = settings[parseInt(setting)-2]
        }

        if (typeof query["regulations"] !== 'undefined') {
          var setting = query["regulations"]
        }
        if (typeof setting !== "string") {
          return setting()
        } else {
        gtf_LOBBY.lobbyConfig(setting, changes, userdata["customracetemp"], pageargs, embed, msg, userdata);

        racesettings = userdata["customracetemp"]["racesettings"]

        if (changes[0] == "ERROR" || changes[0] == "LIST") {
          pageargs["rows"] = 10
          return;
        }
        if (changes[0] == "SUCCESS") {
          pageargs["rows"] = 9
        }
        pageargs["rows"] = 9
        if (changes.length == 0) {
          gtf_EMBED.alert({ name: "❌ Error", description: "Invalid arguments.", embed: "", seconds: 0 }, msg, userdata);
          return;
        } else {
          delete query["number"]
          query["settings"] = 11

          if (typeof query["regulations"] !== 'undefined') {
          delete query["regulations"]
            query = {options: "set", settings:11, extra: changes.join(",")}
            viewregulations()
            return
          }
        query = {options: "list", extra: changes.join(",")}
        pageargs["list"] = createmenu()
          if (!pageargs["list"]) {
          return
        }
          
        if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
            delete query["extra"]
        }
        pageargs["selector"] = "settings"
        pageargs["query"] = query
        pageargs["numbers"] = false
        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
          return;
        }
      }
      }

      function createmenu() {
    userdata["customracetemp"]["finalgrid"] = userdata["customracetemp"]["finalgrid"].map(function(x, i) {
       x["place"] = (i + 1)
       x["position"] = (i + 1)
       if (x["user"]) {
       var car = gtf_STATS.currentCar(userdata)
      var temp = gtf_PERF.perf(car, "GARAGE")
      fpp = temp["fpp"]
      var fueleco = temp["fueleco"]
      var user = {
        place: i + 1,
        position: i + 1,
        drivername: userdata["customracetemp"]["racesettings"]["driver"]["name"],
        name: car["name"],
        user: true,
        fpp: fpp,
        damage: 0,
        tires: car["perf"]["tires"]["current"],
        otires: car["perf"]["tires"]["current"],
        tirewear: 100,
        fuel: 100,
        fueleco: fueleco,
        pitstops: 0,
        oscore: x["score"],
        score: x["score"],
        points: 0,
        laps: []
      };
         return user;
       } else {
         return x
       }
     })
      gtf_STATS.save(userdata)
    racesettings = userdata["customracetemp"]["racesettings"]
    var finalgrid = userdata["customracetemp"]["finalgrid"]
    
    var gtfcar = gtf_STATS.currentCar(userdata)

    function checktires() {
       if (!gtf_GTF.checkTireRegulations(gtfcar, racesettings["regulations"], "", embed, msg, userdata)) {
        pageargs["footer"] = ""
        return false
      } else {
         return cont()
      }
    }

    if (!gtf_GTF.checkRegulations(gtfcar, racesettings, "", embed, msg, userdata)) {
      pageargs["footer"] = ""
      return false
    } else {
      return checktires()
    }
        function cont() {
        embed.setTitle("__**Custom Race Menu:** " + racesettings["title"] + "__");
      var difficulty = {90:"Beginner", 70:"Amateur", 50: "Professional", 30: "Expert", 10:"Extreme"}[racesettings["difficulty"]]
      var laps = typeof racesettings["laps"] === "string" ? "N/A" : racesettings["laps"]
      var time = typeof racesettings["laps"] !== "string" ? "N/A" : racesettings["laps"]
      var credits = gtf_MATH.numFormat(gtf_RACE.customRaceCreditsCalc(racesettings, {mode:"CUSTOM"}, userdata["customracetemp"]["finalgrid"])[0]["credits"])
      return ["__**🏁 Go Race**__",
           "__**Track:**__ " + "`" + racesettings["track"]["name"] + "`",
        "__**Laps:**__ " + "`" + laps + "`",
        "__**Time Limit:**__ " + "`" + time + "`",
         "__**Time:**__ " + "`" + racesettings["time"]["emoji"] + " " + racesettings["time"]["hour"].toString() + ":" + racesettings["time"]["minutes"] + "`",
         "__**Weather:**__ " + "`" + racesettings["weather"]["emoji"] + " " + racesettings["weather"]["name"] + "`",
         "__**Wet Surface %:**__ " + "`" + "💧" + racesettings["weather"]["wetsurface"] + "%" + "`",
          "__**Number of Cars:**__ " + "`" + racesettings["grid"] + " Cars" + "`",
      "__**Difficulty:**__ " + "`" + difficulty + "`",
              gtf_EMOTE.cargrid + " __**Edit Grid**__ ",
             "📜 __**Edit Regulations**__","🆓 __**Clear Regulations**__","💾 __ **Save Event**__\n**Highest Reward:** " + "**" + credits + gtf_EMOTE.credits + "**"]
    }
      }

      function viewgrid() {
        embed.setTitle("__**Custom Race: Grid**__")
        finalgrid = userdata["customracetemp"]["finalgrid"]
        var list = finalgrid.slice().map(function (x) {
                  if (x["user"]) {
                    return + x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  }
            })
        list.unshift("↩ __**Go Back & Save**__")

      var select = 0;
      var selected = -1
      var selectmove = true
      var reset = true;
      var index = 0;

      embed.setFields([{name:gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata)}]);

      gtf_STATS.addCount(userdata);
      var emojilist = [
        { emoji: gtf_EMOTE.yes, emoji_name: "Yes", name: "", extra: "", button_id: 0 },
        {
          emoji: gtf_EMOTE.uparrow,
          emoji_name: "uparrow",
          name: "",
          extra: "",
          button_id: 1,
        },
        {
          emoji: gtf_EMOTE.downarrow,
          emoji_name: "downarrow",
          name: "",
          extra: "",
          button_id: 2,
        },
        {
          emoji: "🤖",
          emoji_name: "🤖",
          name: "Add AI Driver",
          extra: "",
          button_id: 3,
        },
        {
          emoji: "🤖",
          emoji_name: "🤖",
          name: "Remove AI Driver",
          extra: "",
          button_id: 4,
        }
      ];
      var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

      list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")


      embed.setDescription(results + pageargs["footer"]);

      gtf_DISCORD.send(msg, {embeds: [embed], components: buttons }, tuningf)

      function tuningf(msg) {
        function selectoption() {
          if (select == 0) {
            userdata["customracetemp"]["finalgrid"] = finalgrid.map(function(x,i) {
              x["position"] = (i + 1)
              x["place"] = (i + 1)
              return x
            })
            userdata["customracetemp"]["racesettings"]["grid"] = finalgrid.length
            gtf_STATS.save(userdata)
            require(__filename.split(".")[0]).execute(msg, {options: "list"}, userdata);
            return
        }
        if (selected == -1) {
            selected = select
            list[select] = "**" + list[select] + "**";

            results = list.join("\n").replace(/\/n/ig, "\n");
            embed.setDescription(results + pageargs["footer"]);

            msg.edit({ embeds: [embed], components: buttons });
            return
        } else {
          [finalgrid[selected-1], finalgrid[select-1]] = [finalgrid[select-1], finalgrid[selected-1]]
          list = finalgrid.slice().map(function (x, i) {
                  x["position"] = (i + 1)
                  x["place"] = (i + 1)
                  if (x["user"]) {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  }
          })

      list.unshift("↩ __**Go Back & Save**__")
      select = 0
      selected = -1
      selectmove = true
      list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")
      embed.setDescription(results + pageargs["footer"]);
      msg.edit({ embeds: [embed], components: buttons });
            return

        }

        }

        function addai() {

          if (finalgrid.length >= 16) {
            return
          }

        var obj = userdata["customracetemp"]["racesettings"]
        var copy = Object.assign({}, obj);
        copy["condition"] = "AIONLY"
          var car = gtf_RACE.createGrid(copy, gtf_STATS.currentCar(userdata), 2)[1]
          finalgrid.splice(select+1, 0, car);
          select++
          list = finalgrid.slice().map(function (x, i) {
                  x["position"] = (i + 1)
                  x["place"] = (i + 1)
                  if (x["user"]) {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  }
          })
       list.unshift("↩ __**Go Back & Save**__")
      selected = -1
      selectmove = true
      list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")
      embed.setDescription(results + pageargs["footer"]);
      msg.edit({ embeds: [embed], components: buttons });
            return

        }


        function removeai() {
          if (finalgrid[select-1]["user"]) {
            return
          }
          finalgrid.splice(select-1, 1);
          select--
          list = finalgrid.slice().map(function (x, i) {
                  x["position"] = (i + 1)
                  x["place"] = (i + 1)
                  if (x["user"]) {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  } else {
                    return x["position"] + ". " + x["name"] + " `" + x["drivername"] + "`";
                  }
          })
        list.unshift("↩ __**Go Back & Save**__")
      selected = -1
      selectmove = true
      list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select];
      results = list.join("\n").replace(/\/n/ig, "\n")
      embed.setDescription(results + pageargs["footer"]);
      msg.edit({ embeds: [embed], components: buttons });
            return
        }

        function up() {
          list[select] = list[select].split(" ").slice(1).join(" ")
          select--;
          if (select <= -1) {
            select = list.length - 1;
          }

          list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select];
           if (selected > -1 && selectmove) {
          list[selected] = "**" + list[selected].split(" ").slice(0).join(" ")
          selectmove = false
          }
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function down() {
          list[select] = list[select].split(" ").slice(1).join(" ")
          var index = 0;
          select++;
          if (select >= list.length) {
            select = 0;
          }

          list[select] = userdata["settings"]["ICONS"]["bar"][0] + " " + list[select];
           if (selected > -1 && selectmove) {
          list[selected] = "**" + list[selected].split(" ").slice(0).join(" ")
          selectmove = false
          }
          results = list.join("\n").replace(/\/n/ig, "\n");
          embed.setDescription(results + pageargs["footer"]);
          msg.edit({ embeds: [embed], components: buttons });
        }

        function changeai() {

          var args = { makes: userdata["customracetemp"]["racesettings"]["makes"],
                       types: userdata["customracetemp"]["racesettings"]["types"], drivetrains: userdata["customracetemp"]["racesettings"]["drivetrains"], engines: userdata["customracetemp"]["racesettings"]["engines"], countries: userdata["customracetemp"]["racesettings"]["countries"]}

          pageargs["list"] = gtf_CARS.find(args).map(i => {
          var fpp = gtf_PERF.perf(i, "DEALERSHIP")["fpp"];
      var cost = gtf_CARS.costCalc(i, fpp);
      var name = i["name"];
      var year = i["year"];
      var numbercost = (i["carcostm"] == 0) ? "❌" : gtf_MATH.numFormat(cost)
      return name + " " + year + " **" + fpp + gtf_EMOTE.fpp + "**"
          })
        pageargs["selector"] = "number"
        pageargs["query"] = query
        pageargs["numbers"] = true
        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
        }

        var functionlist = [selectoption, up, down, addai, removeai];
        gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata);
      };

        return
      }

      function viewregulations() {
        embed.setTitle("__**Custom Race: Regulations**__")

        var racesettings =  userdata["customracetemp"]["racesettings"]
         var makes = racesettings["regulations"]["makes"].length == 0 ? "Open" : racesettings["regulations"]["makes"].join(", ")
         var countries = racesettings["regulations"]["countries"].length == 0 ? "Open" : racesettings["regulations"]["countries"].join(", ")
        var types = racesettings["regulations"]["types"].length == 0 ? "Open" : racesettings["regulations"]["types"].join(", ")
        var drivetrains = racesettings["regulations"]["drivetrains"].length == 0 ? "Open" : racesettings["regulations"]["drivetrains"].join(", ")
        var engines = racesettings["regulations"]["engines"].length == 0 ? "Open" : racesettings["regulations"]["engines"].join(", ")

        pageargs["list"] = ["↩ __**Go Back & Save**__" + "\n**Limit: " + racesettings["regulations"]["fpplimit"].toString().replace("9999", "---") + gtf_EMOTE.fpp + " | " + racesettings["regulations"]["upperpower"].toString().replace("9999", "---") + " HP" + " | " + racesettings["regulations"]["upperweight"].toString().replace("9999", "---") + " Ibs" + "**"+"\n**AI Minimum FPP:** " + "**" + racesettings["regulations"]["lowerfpp"].toString().replace("9999", "---") + gtf_EMOTE.fpp + "**",
        "**Maximum Tire Grade:** " + racesettings["regulations"]["tires"],
        "**Makes:** " + makes,
        "**Countries:** " + countries,
        "**Types:** " + types,
        "**Drivetrains:** " + drivetrains,          "**Engine Aspirations:** " + drivetrains]
        if (typeof query["extra"] !== 'undefined') {
          try {
          var finalgrid = gtf_RACE.createGrid(racesettings, gtf_STATS.currentCar(userdata), racesettings["grid"]);
        userdata["customracetemp"]["finalgrid"] = finalgrid
        gtf_STATS.save(userdata)
        var extra = "/n/n" + "✅ " + query["extra"] + "/n" + "⚠️ The grid has been reset to random opponents meeting these regulations."
          } catch (error) {
            gtf_EMBED.alert({ name: "❌ Invalid Regulations", description: "This regulation can not be applied as there are no AI cars are eligible.", embed: "", seconds: 0 }, msg, userdata);
            return
          }

          pageargs["list"][pageargs["list"].length-1] = pageargs["list"][pageargs["list"].length-1] + extra
          delete query["extra"]
          delete query["regulations"]
        }

        pageargs["selector"] = "regulations"
        pageargs["query"] = query

        pageargs["numbers"] = false
        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
        return;
      }

      function saveevent() {
      if (setups.length == gtf_GTF.eventlimit) {
        gtf_EMBED.alert({ name: "❌ Event Settings Limit", description: "You have reached the maximum amount of event settings.", embed: "", seconds: 0 }, msg, userdata);
        return;
      }
 gtf_STATS.addEventSettings(userdata["customracetemp"], userdata)
        gtf_STATS.save(userdata)
        require(__filename.split(".")[0]).execute(msg, {options:"list", extra:"Event settings saved."}, userdata)
        return
      }
    
      function clearregulations() {
        racesettings["regulations"] = {
          models: [],
    makes: [],
    types: [],
    countries: [],
    tires: "Racing",
    drivetrains: [],
    engines: [],
    fpplimit: 9999,
    upperfpp: 9999,
    lowerfpp: 0,
    upperpower: 9999,
    lowerpower: 0,
    upperweight: 9999,
    lowerweight: 0,
    special: [],
    prohibited: []
    }

      userdata["customracetemp"]["racesettings"] = racesettings
        query = {options: "list"}
        pageargs["query"] = {options: "list"}
        pageargs["list"] = createmenu()
          if (!pageargs["list"]) {
          return
        }
          if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
            delete query["extra"]
        }
        pageargs["selector"] = "settings"
        pageargs["query"] = query
        pageargs["numbers"] = false
        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);

        return;
      }
  
}
}
