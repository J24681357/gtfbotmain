const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.startSession = function(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {

  embed.setTitle("__" + racesettings["title"] + "__")
  embed.setColor(userdata["settings"]["COLOR"])
  embed.image = ""
  var progressbarprim = userdata["settings"]["ICONS"]["bar"][0];
  var progressbarsec = userdata["settings"]["ICONS"]["bar"][1];

  var startracetime = 3000;
  var racetime = "";
  var raceweather = ""

  var message = "";
  var finalgrid;

  /*
    if (msg.embeds[0].thumbnail != null) {
     embed.setThumbnail(msg.embeds[0].thumbnail.url)
    }
  */

  //gtf_STATS.updateFPP(racesettings["driver"]["car"])

  var emojilist = [{
    emoji: gtf_EMOTE.exit,
    emoji_name: "gtfexit",
    name: "Exit",
    extra: "Once",
    button_id: 0
  }]

  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
  if (racesettings["tireconsumption"] == -1) {
    var tireslist = racesettings["driver"]["car"]["perf"]["tires"]["list"].filter(function(tire) {
      return gtf_GTF.checkTireRegulations(racesettings["driver"]["car"], { tires: tire }, "", embed, msg, userdata)[0]
    }).sort()
    var tmenulist = tireslist.map(function(tire, index) {
      return {
        emoji: "",
        name: tire,
        description: "",
        menu_id: (index)
      }
    })
    var temojilist = []
    var menu = gtf_TOOLS.prepareMenu("Pit Options (Next Lap)", tmenulist, temojilist, msg, userdata);
    buttons.unshift(menu)
  }

  var lights = [
    [gtf_EMOTE.redlightb, gtf_EMOTE.redlightb, gtf_EMOTE.redlightb, gtf_EMOTE.redlightb],
    [gtf_EMOTE.redlightb, gtf_EMOTE.redlightb, gtf_EMOTE.redlightb, gtf_EMOTE.redlightb],
    [gtf_EMOTE.greenlight, gtf_EMOTE.greenlight, gtf_EMOTE.greenlight, gtf_EMOTE.greenlight],
  ];
  var ready = ["**READY**\n", gtf_EMOTE.transparent + "**3,2,1...**" + gtf_EMOTE.transparent, gtf_EMOTE.transparent + "**START**" + gtf_EMOTE.transparent];
  var start = [progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, "🏁"];
  var results3 = start.join("");

  if (racesettings["championship"]) {
    if (userdata["raceinprogress"]["championshipnum"] >= 1) {
      setTimeout(function() { readysetgo() }, 10 * 1000)
    } else {
      readysetgo()
    }
  } else {
    readysetgo()
  }

  function readysetgo() {
    var currentcar = finalgrid.filter(x => x["user"] === true)[0]


    ///RACELENGTH/CURRENTCARINFO
    if (!checkpoint[0]) {
      userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(racesettings["weather"])))
      var weatheri = racesettings["weather"]
      for (var i = 0; i < 20; i++) {
        weatheri = gtf_WEATHER.advanceWeather(weatheri, racesettings["distance"]["km"])
        userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(weatheri)))
      }

      var racelength = gtf_RACEEX.raceLengthCalc(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
      if (racesettings["type"] == "DRIFT") {
        racesettings["sectors"] = racesettings["originalsectors"];
        racesettings["points"] = 0;
        //racelength = Math.round(racelength / 1.5);
      }
      if (racesettings["mode"] == "ONLINE") {
        var racelength = gtf_RACEEX.onlineracelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
      }

      if (racesettings["type"] == "TIME") {
        racelength = parseInt(racesettings["laps"].split("m")[0]) * (60 * 1000)
      }
    }

    var currentcarinfo = racesettings["driver"]["car"].length == 0 ? "" : "\n**🚘 " +
      racesettings["driver"]["car"]["name"] +
      " " +
      racesettings["driver"]["car"]["fpp"] +
      gtf_EMOTE.fpp + "**"

    if (racesettings["type"] == "TIMETRIAL") {
      var racelength = gtf_RACEEX.timetrialracelength(racesettings, racedetails, finalgrid, checkpoint, 50 - (racesettings["difficulty"] / 2), embed, msg, userdata);
    }

    /////////////

    ///RACEINPROGRESS    
    var index = 1
    var totaltime = new Date().getTime() + racelength + 2000;
    if (!checkpoint[0]) {
      var currenttime = new Date().getTime();
      if (racesettings["championship"] && userdata["raceinprogress"]["championshipnum"] >= 1) {
        userdata["raceinprogress"]["active"] = true
        userdata["raceinprogress"]["messageid"] = msg.id
        userdata["raceinprogress"]["channelid"] = msg.channel.id
        userdata["raceinprogress"]["expire"] = totaltime
      } else {
        userdata["raceinprogress"] = {
          active: true, channelid: msg.channel.id, messageid: msg.id, expire: totaltime, gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"],
          msghistory: [], championshipnum: 0
        };
      }
      if (racesettings["mode"] == "ONLINE") {
        gtf_LOBBY.updateusersraceinprogress(finalgrid, totaltime, msg)
      }
      userdata["raceinprogress"]["start"] = currenttime

      var timeinterval = racelength / 20
      if (timeinterval <= 2000) {
        timeinterval = 2000
      }

      if (timeinterval >= 1800000) {
        timeinterval = 1800000
      }

      gtf_STATS.createRaceHistory(racesettings, racedetails, finalgrid, checkpoint, timeinterval, message, embed, msg, userdata)

    }
    else {
      var totaltime = userdata["raceinprogress"]["expire"];
      var currenttime = userdata["raceinprogress"]["start"];
      startracetime = 0;
      index = 4
      if (racesettings["type"] == "TIMETRIAL") {
        userdata["raceinprogress"]["msghistory"] = []
      } else {
        racelength = totaltime - new Date().getTime() - 2000;
      }
    }

    gtf_STATS.addRaceDetails(racesettings, racedetails, finalgrid, userdata);


    ///Functions
    function flagstartrace() {
      if (userdata["raceinprogress"]["active"]) {
        require(gtf_TOOLS.homeDir() + "commands/status").execute(msg, { options: "exit" }, userdata);
        if (racesettings["type"] == "TIMETRIAL") {
          var results2 = gtf_RACEEX.timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
          embed.setDescription(results2)
          embed.setFields([{
            name: gtf_STATS.menuFooter(userdata),
            value: "🚘 " + gtf_CARS.shortName(racesettings["driver"]["car"]["name"]) +
              " " + "**" + racesettings["driver"]["car"]["fpp"] + gtf_EMOTE.fpp + "**"
          }]);
          ////exit from session with no results
          gtf_DISCORD.send(msg, { content: "<@" + userdata["id"] + "> **FINISH**", embeds: [embed] }, race2func)
          function race2func(msg) {
            gtf_RACEEX.createRaceButtons(racesettings, racedetails, finalgrid, checkpoint, results2, buttons, emojilist, embed, msg, userdata);

            if (racesettings["mode"] == "CAREER") {
              var complete = gtf_STATS.checkEvent(racesettings, "1st", userdata);
              if (complete) {
                gtf_STATS.completeEvent(racesettings, userdata);
                gtf_STATS.redeemGift(gtf_EMOTE.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, racesettings["prize"], embed, msg, userdata);
              }
            } else if (racesettings["mode"] == "LICENSE") {
              var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0]
              if (option == "b" || option == "a" || option == "ic" || option == "ib" || option == "ia" || option == "s") {
                gtf_RACEEX.licensecheck(racesettings, racedetails, finalgrid, embed, msg, userdata)
              }
            }
            if (racesettings["mode"] != "ONLINE") {
              gtf_STATS.save(userdata);
            }
          }
        }
      }
    }
    var functionlist = [flagstartrace]
    gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
    ///
    gtf_STATS.save(userdata);

    /// TIMER
    var results = function(index) {
      return lights[index][0] + lights[index][1] + lights[index][2] + lights[index][3] + ready[index] + lights[index][3] + lights[index][2] + lights[index][1] + lights[index][0]
    };

    if (!checkpoint[0]) {
      gtf_TOOLS.interval(
        function() {
          if (racesettings["mode"] == "CAREER" && (racesettings["type"] != "TIMETRIAL" && racesettings["type"] != "DRIFT")) {
            message = "\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "race-start" }) + "`"
          }
          var starttime = (index == 2) ? racesettings["type"] == "TIMETRIAL" ? "" : message + "\n" + userdata["raceinprogress"]["timehistory"][0]["hour"] + ":" + userdata["raceinprogress"]["timehistory"][0]["minutes"] + " " + racesettings["weather"]["emoji"] + "💧" + racesettings["weather"]["wetsurface"] + "%" + " | " + "⏳" + gtf_DATETIME.getFormattedTime(racelength) + " left |" + gtf_EMOTE.tire + "**" + currentcar["tires"].split(" ").map(function(x) {
            if (x.includes("Rally")) {
              return ""
            } else {
              return x[0]
            }
          }).join("") + "**" : ""
          embed.setDescription(results(index) + starttime);
          embed.spliceFields(0, 1);
          gtf_DISCORD.edit(msg, { content: "ㅤ", embeds: [embed], components: buttons })
          index++;
        },
        1500,
        2
      );
    }

    var timeleft = totaltime - currenttime;
    var timedivide = racelength / (start.length - 1);
    var timeinterval = racelength / 20
    if (timeinterval <= 2000) {
      timeinterval = 2000
    }

    if (timeinterval >= 1800000) {
      timeinterval = 1800000
    }

    setTimeout(function() {

      var progress = setInterval(function() {
        check();
        if (userdata["raceinprogress"]["expire"] <= new Date().getTime() || !userdata["raceinprogress"]["active"]) {
          console.log("ENND")
          clearInterval(progress);
          return
        }
        var indexv = Math.floor(((new Date().getTime() - userdata["raceinprogress"]["start"]) / (totaltime - userdata["raceinprogress"]["start"])) * userdata["raceinprogress"]["gridhistory"].length)

        if (racesettings["type"] != "TIMETRIAL") {
          message = userdata["raceinprogress"]["msghistory"][indexv]
          finalgrid = userdata["raceinprogress"]["gridhistory"][indexv]
          racetime = userdata["raceinprogress"]["timehistory"][indexv]
          raceweather = userdata["raceinprogress"]["weatherhistory"][indexv]
          currentcar = finalgrid.filter(x => x["user"] === true)[0]
          ///ERROR
          if (isNaN(racelength)) {
            gtf_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred. Race Aborted.", embed: "", seconds: 0 }, msg, userdata);
            console.log(userdata["id"] + ": Race Aborted ERROR");
            userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: '', gridhistory: [], timehistory: [], weatherhistory: [], msghistory: [], championshipnum: 0 };
            gtf_STATS.save(userdata);
            clearInterval(progress);
            return;
          }
          ///
          var currentlap = Math.ceil((indexv / 20) * racesettings["laps"])
          var currentlaptext = (racesettings["type"] == "LAPS" || racesettings["type"] == "DRIFT") ? "`Lap " + currentlap + "/" + racesettings["laps"] + "` " : ""

          embed.setDescription(results3 + "\n" + finalgrid.slice(0, 10).map(function(x) {
            var gap = "`" + "+" + x["gap"] + "`"
            if (x["gap"] == 0) {
              gap = ""
            }
            var name = [gtf_CARS.shortName(x["name"]), x["drivername"]][userdata["settings"]["GRIDNAME"]]
            var stops = x["pitstops"] >= 1 ? " " + gtf_EMOTE.pit + "`" + x["pitstops"] + "`" : ""

            if (racesettings["mode"] == "ONLINE") {
              name = gtf_CARS.shortName(x["name"]) + " `" + x["drivername"] + "`"
              return x["position"] + ". " + gap + name + stops
            }
            if (x["user"]) {
              return "**" + x["position"] + ".** " + gap + " **" + name + "**" + stops
            } else {
              return x["position"] + ". " + gap + " " + name + stops
            }
          }).join("\n") + message + "\n\n" +
            racetime["hour"] + ":" + racetime["minutes"] + " " + raceweather["emoji"] + "💧" + raceweather["wetsurface"] + "%" + " | " + "⏳" + gtf_DATETIME.getFormattedTime(totaltime - new Date().getTime()) + " left " + currentlaptext + currentcarinfo + gtf_EMOTE.tire + "**" + currentcar["tires"].split(" ").map(function(x) {
              if (x.includes("Rally")) {
                return ""
              } else {
                return x[0]
              }
            }).join("") + "**") //+ " `" + currentcar["tirewear"] + "%` " + "`" + currentcar["fuel"] + "%`")
        } else {
          finalgrid = userdata["raceinprogress"]["gridhistory"][0]
        }

        if (racesettings["type"] == "DRIFT") {
          let drift1 = gtf_RACEEX.driftsection(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, false);
          var icon = gtf_EMOTE.transparent;
          if (drift1[0] > 0) {
            icon = gtf_EMOTE.driftflag;
          }
          racesettings["points"] += drift1[0];
          embed.setDescription(results3 + "\n" + icon + " **" + gtf_MATH.numFormat(racesettings["points"]) + "pts**" + "\n\n" + + racetime["hour"] + ":" + racetime["minutes"] + " " + raceweather["emoji"] + "💧" + raceweather["wetsurface"] + "%" + " | " + "⏳" + gtf_DATETIME.getFormattedTime(totaltime - new Date().getTime()) + " left" + currentcarinfo + gtf_EMOTE.tire + "**" + currentcar["tires"].split(" ").map(function(x) {
            if (x.includes("Rally")) {
              return ""
            } else {
              return x[0]
            }
          }).join("") + "**");
        }
        if (racesettings["type"] == "TIMETRIAL" && userdata["raceinprogress"]["expire"] != "EXIT") {
          var lap = ""
          var bestlap = ""
          if (finalgrid[0]["laps"].length >= 1) {

            if (finalgrid[0]["laps"].filter(function(x) { return x["best"] == true && x["medal"] != "FAIL" }).length >= 1) {
              var bestlapobject = finalgrid[0]["laps"].filter(function(x) { return x["best"] == true && x["medal"] != "FAIL" })[0]
              bestlap = gtf_EMOTE.tracklogo + "__**Best:**__ " + bestlapobject["medalemote"] + " " + gtf_DATETIME.getFormattedLapTime(bestlapobject["time"]) + " `Lap " + bestlapobject["lapnum"] + "`"
              var laps = finalgrid[0]["laps"].map(function(x, index) {
                /*
                if (x["medal"] == "FAIL") {
                  return "__**Lap " + (index + 1) + ":**__ " + x["medalemote"]
                }
                */
                if (x["best"] && x["medal"] != "FAIL") {
                  return "__**Lap " + (index + 1) + ":**__ " + x["medalemote"] + " " + gtf_DATETIME.getFormattedLapTime(x["time"]) + " ⭐"
                }
                return "__**Lap " + (index + 1) + ":**__ " + x["medalemote"] + " " + gtf_DATETIME.getFormattedLapTime(x["time"]).replace("01:00:00.000", "")
              }).reverse().slice(0, 5).join("\n")
            } else {
              var laps = "__**Lap 1:**__ "
            }
          } else {
            var laps = "__**Lap 1:**__ "
          }
          var timeprizes = ["**" + gtf_EMOTE.goldmedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][0]["time"] * 1000), gtf_EMOTE.silvermedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][1]["time"] * 1000) + " ",
          gtf_EMOTE.bronzemedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][2]["time"] * 1000) + "**"]
          embed.setDescription(results3 + "\n" + timeprizes.join(" ") + "\n" + bestlap + "\n\n" + laps + "\n" + currentcarinfo + gtf_EMOTE.tire + "**" + currentcar["tires"].split(" ").map(function(x) {
            if (x.includes("Rally")) {
              return ""
            } else {
              return x[0]
            }
          }).join("") + "**");
        }
        gtf_STATS.save(userdata);
        msg.edit({ embeds: [embed], components: buttons }).catch(function() {
          clearInterval(progress);
          console.log(userdata["id"] + ": Session has ended. (Message is not there.)");
          userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: '', gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum: 0 }

          if (racesettings["type"] == "TIMETRIAL") {
            results2 = gtf_RACEEX.timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
            embed.setDescription(results2)
            gtf_DISCORD.send(msg, { content: "<@" + userdata["id"] + ">" + " **FINISH**", embeds: [embed] })
          }
          gtf_STATS.save(userdata);
          return;
        });
        if (racesettings["mode"] == "CAREER" || racesettings["mode"] == "ONLINE") {

          if (typeof message === 'undefined') {
            message = ""
          } else if (message.length != 0) {
            message = ""
          }
        }

      }, timeinterval);

      ///////////////////////////////////////
      function check() {
        timeleft = totaltime - userdata["raceinprogress"]["start"];

        if (userdata["raceinprogress"]["expire"] <= new Date().getTime()) {
          clearInterval(progress);
          if (userdata["raceinprogress"]["expire"] !== null) {
            gtf_STATS.addPlayTime(userdata["raceinprogress"]["expire"] - userdata["raceinprogress"]["start"], userdata);
          }
          if (racesettings["type"] == "TIMETRIAL") {
            let tt2 = gtf_RACEEX.timetriallap(racesettings, racedetails, finalgrid, checkpoint, racelength, embed, msg, userdata);
            var newlap = tt2[0];
            currenttime = new Date().getTime()
            if (finalgrid[0]["laps"].length % 5 != 0) {
              if (newlap["medal"] != "GOLD") {
                return gtf_DISCORD.send(msg, { content: "<@" + userdata["id"] + "> **" + newlap["medal"] + " " + gtf_DATETIME.getFormattedLapTime(newlap["time"]) + " | " + "LAP " + finalgrid[0]["laps"].length + "**", embeds: [embed] }, repeat)
              }
            }
            userdata["raceinprogress"]["expire"] = "EXIT"

            function repeat(msg) {

              var racelength = gtf_RACEEX.timetrialracelength(racesettings, racedetails, finalgrid, checkpoint, 50 - (racesettings["difficulty"] / 2), embed, msg, userdata);

              setTimeout(function() {
                userdata["raceinprogress"] = { active: true, messageid: msg.id, channelid: msg.channel.id, start: currenttime, expire: (currenttime + racelength), gridhistory: userdata["raceinprogress"]["gridhistory"], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum: 0 }
                gtf_RACES2.startSession(racesettings, racedetails, finalgrid, [true], embed, msg, userdata);
              }, 2000)
            }

          }

          //////ending race
          if (!racesettings["championship"]) {
            userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: 0, gridhistory: [], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum: 0 }
          }
          /////
          var thumbnail = msg.embeds[0].thumbnail == null ? "" : msg.embeds[0].thumbnail.url

          gtf_DISCORD.delete(msg, { seconds: 5 })

          if (racesettings["mode"] == "SSRX") {
            let ssrx2 = gtf_RACEEX.speedtestresults(racelength, racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
            var results2 = ssrx2;
          } else if (racesettings["type"] == "DRIFT") {
            let drift2 = gtf_RACEEX.driftresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, racesettings["points"]);
            var results2 = drift2;
          } else if (racesettings["mode"] == "ONLINE") {
            var results2 = gtf_RACE.startOnline(racesettings, racedetails, finalgrid, user, userdata);
          } else if (racesettings["type"] == "TIMETRIAL") {
            var results2 = gtf_RACEEX.timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata)
            //var results2 = "Test"
            embed.setDescription(results2)
            //gtf_DISCORD.send(msg, {embeds: [embed]})
            //gtf_STATS.save(userdata);
            //return
          } else {
            var results2 = gtf_RACE.start(racesettings, racedetails, finalgrid, userdata);
          }
          if (thumbnail != "") {
            embed.setThumbnail(thumbnail)
          }

          if ((racesettings["mode"] == "CAREER" || racesettings["mode"] == "LICENSE" || racesettings["mode"] == "ONLINE")) {
            if (racesettings["type"] != "TIMETRIAL" && racesettings["type"] != "DRIFT") {
              embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0] + "\n\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({
                name1: "race-results-winner", name2: [finalgrid.slice().sort((x, y) => y["score"] - x["score"])[0]["name"].split(" ").slice(0, -1).join(" "),
                finalgrid.slice().sort((x, y) => y["score"] - x["score"])[0]["drivername"]][userdata["settings"]["GRIDNAME"]], "racesettings": racesettings
              }) + "`");
            } else {
              embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0]);
            }
          } else {
            embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0]);
          }

          var field2 = (racesettings["driver"]["car"] == "") ? gtf_EMOTE.transparent : gtf_CARS.shortName(racesettings["driver"]["car"]["name"]) +
            " " + "**" + racesettings["driver"]["car"]["fpp"] + gtf_EMOTE.fpp + "**"
          var ping = "<@" + userdata["id"] + ">";
          var user = msg.user
          if (racesettings["mode"] == "ONLINE") {
            ping = "@everyone";
          } else {
            embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: field2 }]);
          }

          if (racesettings["mode"] == "CAREER") {
            if (racesettings["championship"]) {
              var emojilist = [{
                emoji: "⏭",
                emoji_name: "⏭",
                name: "Continue",
                extra: "Once"
              }, {
                emoji: gtf_EMOTE.tracklogo,
                emoji_name: "trackgtfitness",
                name: 'Grid Results/Session',
                extra: "",
              }]
            }
            else {
              var emojilist = [{
                emoji: "🔁",
                emoji_name: "🔁",
                name: "Restart",
                extra: "Once"
              }, {
                emoji: gtf_EMOTE.tracklogo,
                emoji_name: "trackgtfitness",
                name: 'Grid Results/Session',
                extra: "",
              }, {
                emoji: gtf_EMOTE.exit,
                emoji_name: "gtfexit",
                name: "Exit",
                extra: "Once"
              }]
              if (racesettings["damage"] && racesettings["car"] == "GARAGE" && gtf_CONDITION.condition(gtf_STATS.currentCar(userdata))["health"] <= 20) {
                emojilist[0] = {
                  emoji: "❌",
                  emoji_name: "❌",
                  name: "Poor Car Condition",
                  extra: ""
                }
              }
            }
          }
          else if (racesettings["mode"] == "LICENSE") {
            if (racesettings["title"].includes("Invitation")) {
              var emojilist = [{
                emoji: gtf_EMOTE.tracklogo,
                emoji_name: "trackgtfitness",
                name: 'Grid Results/Session',
                extra: "",
              }, {
                emoji: gtf_EMOTE.exit,
                emoji_name: "gtfexit",
                name: "Exit",
                extra: "Once"
              }]
            }
            else {
              var emojilist = [{
                emoji: "🔁",
                emoji_name: "🔁",
                name: "Restart",
                extra: "Once"
              }, {
                emoji: "⏭",
                emoji_name: "⏭",
                name: "Next",
                extra: "Once"
              }, {
                emoji: gtf_EMOTE.tracklogo,
                emoji_name: "trackgtfitness",
                name: 'Grid Results/Session',
                extra: "",
              }, {
                emoji: gtf_EMOTE.exit,
                emoji_name: "gtfexit",
                name: "Exit",
                extra: "Once"
              }]
            }
          }
          else if (racesettings["mode"] == "ONLINE") {
            var emojilist = [{
              emoji: gtf_EMOTE.tracklogo,
              emoji_name: "trackgtfitness",
              name: 'Grid Results/Session',
              extra: "",
            }]
          }
          else {
            var emojilist = [{
              emoji: "🔁",
              emoji_name: "🔁",
              name: "Restart",
              extra: "Once"
            }, {
              emoji: gtf_EMOTE.tracklogo,
              emoji_name: "trackgtfitness",
              name: 'Grid Results/Session',
              extra: "",
            }, {
              emoji: gtf_EMOTE.exit,
              emoji_name: "gtfexit",
              name: "Exit",
              extra: "Once"
            }]
          }

          emojilist = emojilist.map(function(x, index) {
            x["button_id"] = index
            return x
          })


          buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

          gtf_DISCORD.send(msg, { content: ping + " **FINISH**", embeds: [embed], components: buttons }, race2func, true)
          function race2func(msg) {
            gtf_RACEEX.createRaceButtons(racesettings, racedetails, finalgrid, checkpoint, results2, buttons, emojilist, embed, msg, userdata);

            if (racesettings["mode"] == "CAREER") {
              var complete = gtf_STATS.checkEvent(racesettings, "1st", userdata);
              if (complete) {
                gtf_STATS.completeEvent(racesettings, userdata);
                gtf_STATS.redeemGift(gtf_EMOTE.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, racesettings["prize"], embed, msg, userdata);
              }
            }
            else if (racesettings["mode"] == "LICENSE") {
              var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0]
              if (option == "b" || option == "a" || option == "ic" || option == "ib" || option == "ia" || option == "s") {
                gtf_RACEEX.licensecheck(racesettings, racedetails, finalgrid, embed, msg, userdata)
              }
            }
            if (racesettings["mode"] != "ONLINE") {
              gtf_STATS.save(userdata);
            }
          }

          return;
        } else {
          var maxprogress = Math.floor(((new Date().getTime() - userdata["raceinprogress"]["start"]) / (totaltime - userdata["raceinprogress"]["start"])) * start.length)
          for (var t = 0; t < start.length; t++) {
            start[t] = progressbarsec;
            if (t < maxprogress) {
              start[t] = progressbarprim;
            }
          }
          results3 = start.join("");
        }
      };

    }, startracetime);
  }
};

module.exports.driftresults2 = function(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {

  var current = "4th"
  var place = "4th"
  var places = ["3rd", "2nd", "1st"]
  var prize = 0
  var racemultibonus = ""

  if (racesettings["mode"] == "CAREER") {
    if (typeof userdata["careerraces"][eventid] !== 'undefined') {
      var current = userdata["careerraces"][eventid][0];
    }

    if (current == "✅") {
      current = "1st"
    }
  }

  var medal = "";
  let final = require(gtf_TOOLS.homeDir() + "functions/races/f_races_2ex").driftsection(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, true);
  racesettings["points"] += final[0];
  if (racesettings["points"] >= final[3]) {
    medal = gtf_EMOTE.bronzemedal + " BRONZE";
    place = "3rd"
    var prize = racesettings["positions"][2]["credits"]
  } else if (racesettings["points"] >= final[2]) {
    medal = gtf_EMOTE.silvermedal + " SILVER";
    place = "2nd"
    var prize = racesettings["positions"][1]["credits"]
  } else if (racesettings["points"] >= final[1]) {
    medal = gtf_EMOTE.goldmedal + " GOLD";
    place = "1st"
    var prize = racesettings["positions"][0]["credits"]
  } else {
    medal = "COMPLETE";
  }

  prize = Math.round(parseFloat(prize * (racesettings["distance"]["km"] / 10)));

  for (var i = 0; i < places.length; i++) {
    if (parseInt(places[i].split(/[A-Z]/gi)[0]) < parseInt(current.split(/[A-Z]/gi)[0]) && place != "4th") {
      prize = prize + racesettings["positions"][(places.length - 1) - i]["credits"]
    }
    if (places[i] == place) {
      break;
    }
  }
  /*
    if (gtf_STATS.raceMulti(userdata) > 1) {
      prize = Math.round(prize * gtf_STATS.raceMulti(userdata))
      racemultibonus = " `x" + gtf_STATS.raceMulti(userdata).toString() + "`"
    }
    */

  if (prize == 0) {
    racemultibonus = ""
  }
  var exp = Math.round(prize / 80);

  gtf_STATS.addCredits(prize, userdata);
  gtf_STATS.addMileage(racesettings["distance"]["km"], userdata);
  gtf_STATS.addTotalMileage(racesettings["distance"]["km"], userdata);
  //gtf_STATS.addExp(exp, userdata);

  if (racesettings["mode"] == "CAREER") {
    if (place == "1st" || place == "2nd" || place == "3rd") {
      if (racesettings["eventid"].includes("gtacademy")) {
        gtf_STATS.updateEvent(racesettings, place, userdata)
      } else {
        setTimeout(function() {
          gtf_STATS.redeemGift("🎉 Completed " + racesettings["title"] + " 🎉", racesettings["prize"], embed, msg, userdata);
        }, 2000)
      }
    }
  }

  var results2 = "**" + medal + "**" + " " + "**+" + prize + gtf_EMOTE.credits + racemultibonus + "**" + "\n" + "**Points:** " + racesettings["points"] + " pts";

  return results2;
}