const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.startSession = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  embed.setTitle("__" + racesettings["title"] + "__");
  embed.setColor(userdata["settings"]["COLOR"]);
  embed.image = "";
  var progressbarprim = userdata["settings"]["ICONS"]["bar"][0];
  var progressbarsec = userdata["settings"]["ICONS"]["bar"][1];

  var startracetime = 3000;
  var racetime = "";
  var raceweather = "";

  var message = "";
  var finalgrid;

  /*
  if (msg.embeds[0].thumbnail != null) {
   embed.setThumbnail(msg.embeds[0].thumbnail.url)
  }
*/

  //gte_STATS.updateFPP(racesettings["driver"]["car"])
  var emojilist = [
    {
      emoji: gtf_EMOTE.fithusimlogo,
      emoji_name: "fithusimlogo",
      name: "Exit",
      extra: "Once",
      button_id: 0,
    },
  ];

  var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);

  var lights = [
    [gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent],
    [gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent],
    [gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent],
  ];
  var ready = ["**READY**\n", gtf_EMOTE.transparent + "**3,2,1...**" + gtf_EMOTE.transparent, gtf_EMOTE.transparent + "**GO**" + gtf_EMOTE.transparent];
  var start = [progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, "🏁"];
  var results3 = start.join("");

  readysetgo();

  function readysetgo() {
    var currentcar = finalgrid.filter(x => x["user"] === true)[0];

    ///RACELENGTH/CURRENTCARINFO
    if (!checkpoint[0]) {
      userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(racesettings["weather"])));
      var weatheri = racesettings["weather"];
      for (var i = 0; i < 20; i++) {
        weatheri = gtf_WEATHER.advanceWeather(weatheri, racesettings["distance"]["km"]);
        userdata["raceinprogress"]["weatherhistory"].push(JSON.parse(JSON.stringify(weatheri)));
      }
      
      var racelength = gte_RACEEX.raceLengthCalc(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
      var racelength = 10000;
      if (racesettings["type"] == "DRIFT") {
        racesettings["sectors"] = racesettings["originalsectors"];
        racesettings["points"] = 0;
        //racelength = Math.round(racelength / 1.5);
      }
      if (racesettings["mode"] == "ONLINE") {
        var racelength = gte_RACEEX.onlineracelength(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
      }

      if (racesettings["type"] == "TIME") {
        racelength = parseInt(racesettings["laps"].split("m")[0]) * (60 * 1000);
      }
    }

    var currentcarinfo = racesettings["driver"]["car"].length == 0 ? "" : "\n**🚘 " + racesettings["driver"]["car"]["name"] + " " + racesettings["driver"]["car"]["fpp"] + gtf_EMOTE.fpp + "**";

    if (racesettings["type"] == "TIMETRIAL") {
      var racelength = gte_RACEEX.timetrialracelength(racesettings, racedetails, finalgrid, checkpoint, 50 - racesettings["difficulty"] / 2, embed, msg, userdata);
    }

    /////////////

    ///RACEINPROGRESS
    var index = 1;
    var totaltime = new Date().getTime() + racelength + 2000;
    if (!checkpoint[0]) {
      var currenttime = new Date().getTime();
      if (racesettings["championship"] && userdata["raceinprogress"]["championshipnum"] >= 1) {
        userdata["raceinprogress"]["active"] = true;
        userdata["raceinprogress"]["messageid"] = msg.id;
        userdata["raceinprogress"]["channelid"] = msg.channel.id;
        userdata["raceinprogress"]["expire"] = totaltime;
      } else {
        userdata["raceinprogress"] = { active: true, channelid: msg.channel.id, messageid: msg.id, expire: totaltime, gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum: 0 };
      }
      if (racesettings["mode"] == "ONLINE") {
        gte_LOBBY.updateusersraceinprogress(finalgrid, totaltime, msg);
      }
      userdata["raceinprogress"]["start"] = currenttime;

      var timeinterval = racelength / 20;
      if (timeinterval <= 2000) {
        timeinterval = 2000;
      }

      if (timeinterval >= 1800000) {
        timeinterval = 1800000;
      }

      gte_STATS.createRaceHistory(racesettings, racedetails, finalgrid, checkpoint, timeinterval, message, embed, msg, userdata);
    } else {
      var totaltime = userdata["raceinprogress"]["expire"];
      var currenttime = userdata["raceinprogress"]["start"];
      startracetime = 0;
      index = 4;
      if (racesettings["type"] == "TIMETRIAL") {
        userdata["raceinprogress"]["msghistory"] = [];
      } else {
        racelength = totaltime - new Date().getTime() - 2000;
      }
    }

    gte_STATS.addRaceDetails(racesettings, racedetails, finalgrid, userdata);

    ///Functions
    function flagstartrace() {
      if (userdata["raceinprogress"]["active"]) {
        require(__dirname.split("/").slice(0, 4).join("/") + "/" + "commands/status").execute(msg, { options: "exit" }, userdata);
        if (racesettings["type"] == "TIMETRIAL") {
          var results2 = gte_RACEEX.timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
          embed.setDescription(results2);

          ////exit from session with no results
          gtf_DISCORD.send(msg, { content: "<@" + userdata["id"] + "> **FINISH**", embeds: [embed] }, race2func);
          function race2func(msg) {
            gte_RACEEX.createRaceButtons(racesettings, racedetails, finalgrid, checkpoint, results2, buttons, emojilist, embed, msg, userdata);

            if (racesettings["mode"] == "CAREER") {
              var complete = gte_STATS.checkEvent(racesettings, "1st", userdata);
              if (complete) {
                gte_STATS.completeEvent(racesettings, userdata);
                gte_STATS.redeemGift(gtf_EMOTE.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, racesettings["prize"], embed, msg, userdata);
              }
            } else if (racesettings["mode"] == "LICENSE") {
              var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0];
              if (option == "b" || option == "a" || option == "ic" || option == "ib" || option == "ia" || option == "s") {
                gte_RACEEX.licensecheck(racesettings, racedetails, finalgrid, embed, msg, userdata);
              }
            }
            if (racesettings["mode"] != "ONLINE") {
              //gte_STATS.saveEnthu(userdata);
            }
          }
        }
      }
    }
    var functionlist = [flagstartrace];
    gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata);
    ///
    //gte_STATS.saveEnthu(userdata);

    /// TIMER
    var results = function (index) {
      return lights[index][0] + lights[index][1] + lights[index][2] + lights[index][3] + ready[index] + lights[index][3] + lights[index][2] + lights[index][1] + lights[index][0];
    };

    if (!checkpoint[0]) {
      gtf_TOOLS.interval(
        function () {
          /*
          if (racesettings["mode"] == "CAREER") {
            message = "\n" + gtf_ANNOUNCER.emote(racesettings["title"]) + " `" + gtf_ANNOUNCER.say({ name1: "race-start" }) + "`";
          }
        */
          var starttime =
            index == 2
              ? racesettings["type"] == "TIMETRIAL"
                ? ""
                : message +
                  "\n" +
                  userdata["raceinprogress"]["timehistory"][0]["hour"] +
                  ":" +
                  userdata["raceinprogress"]["timehistory"][0]["minutes"] +
                  " " +
                  racesettings["weather"]["emoji"] +
                  "💧" +
                  racesettings["weather"]["wetsurface"] +
                  "%" +
                  " | " +
                  "⏳" +
                  gtf_DATETIME.getFormattedTime(racelength) +
                  " left |" +
                  gtf_EMOTE.tire +
                  "**" +
                  currentcar["tires"]
                    .split(" ")
                    .map(x => x[0])
                    .join("") +
                  "**"
              : "";
          embed.setDescription(results(index) + starttime);
          embed.spliceFields(0, 1);
          gtf_DISCORD.edit(msg, { content: "ㅤ", embeds: [embed], components: buttons });
          index++;
        },
        1500,
        2
      );
    }

    var timeleft = totaltime - currenttime;
    var timedivide = racelength / (start.length - 1);
    var timeinterval = racelength / 20;
    if (timeinterval <= 2000) {
      timeinterval = 2000;
    }

    if (timeinterval >= 1800000) {
      timeinterval = 1800000;
    }

    setTimeout(function () {
      var progress = setInterval(function () {
        check();
        if (userdata["raceinprogress"]["expire"] <= new Date().getTime() || !userdata["raceinprogress"]["active"]) {
          clearInterval(progress);
          return;
        }
        var indexv = Math.floor(((new Date().getTime() - userdata["raceinprogress"]["start"]) / (totaltime - userdata["raceinprogress"]["start"])) * userdata["raceinprogress"]["gridhistory"].length);

        if (racesettings["type"] != "TIMETRIAL") {
          message = userdata["raceinprogress"]["msghistory"][indexv];
          finalgrid = userdata["raceinprogress"]["gridhistory"][indexv];
          racetime = userdata["raceinprogress"]["timehistory"][indexv];
          raceweather = userdata["raceinprogress"]["weatherhistory"][indexv];
          currentcar = finalgrid.filter(x => x["user"] === true)[0];
          ///ERROR
          if (isNaN(racelength)) {
            gte_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred. Race Aborted.", embed: "", seconds: 0 }, msg, userdata);
            console.log(userdata["id"] + ": Race Aborted ERROR");
            userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "", gridhistory: [], timehistory: [], weatherhistory: [], msghistory: [], championshipnum: 0 };
            gte_STATS.saveEnthu(userdata);
            clearInterval(progress);
            return;
          }
          ///
          var currentlap = Math.ceil((indexv / 20) * racesettings["laps"]);
          var currentlaptext = "`Lap " + currentlap + "/" + racesettings["laps"] + "` ";

          embed.setDescription(
            results3 +
              "\n" +
              raceweather["emoji"] +
              " | " +
              "⏳" +
              gtf_DATETIME.getFormattedTime(totaltime - new Date().getTime()) +
              " left | " +
              currentlaptext +
              "\n\n" +
              finalgrid
                .slice(0, 10)
                .map(function (x) {
                  var gap = "`" + "+" + x["gap"] + "`";
                  if (x["gap"] == 0) {
                    gap = "";
                  }
                  var name = [gtf_CARS.shortName(x["name"]), x["drivername"]][userdata["settings"]["GRIDNAME"]];
                  var stops = x["pitstops"] >= 1 ? " " + gtf_EMOTE.pit + "`" + x["pitstops"] + "`" : "";

                  if (x["user"]) {
                    return "**" + x["position"] + ".** " + gap + " **" + name + "**" + stops;
                  } else {
                    return x["position"] + ". " + gap + " " + name + stops;
                  }
                })
                .join("\n") +
              message
          );
        } else {
          finalgrid = userdata["raceinprogress"]["gridhistory"][0];
        }

        if (racesettings["type"] == "DRIFT") {
          let drift1 = gte_RACEEX.driftsection(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, false);
          var icon = gtf_EMOTE.transparent;
          if (drift1[0] > 0) {
            icon = gtf_EMOTE.driftflag;
          }
          racesettings["points"] += drift1[0];
          embed.setDescription(
            results3 +
              "\n" +
              icon +
              " **" +
              gtf_MATH.numFormat(racesettings["points"]) +
              "pts**" +
              "\n\n" +
              +racetime["hour"] +
              ":" +
              racetime["minutes"] +
              " " +
              raceweather["emoji"] +
              "💧" +
              raceweather["wetsurface"] +
              "%" +
              " | " +
              "⏳" +
              gtf_DATETIME.getFormattedTime(totaltime - new Date().getTime()) +
              " left" +
              currentcarinfo +
              gtf_EMOTE.tire +
              "**" +
              currentcar["tires"]
                .split(" ")
                .map(x => x[0])
                .join("") +
              "**"
          );
        }
        if (racesettings["type"] == "TIMETRIAL" && userdata["raceinprogress"]["expire"] != "EXIT") {
          var lap = "";
          var bestlap = "";
          if (finalgrid[0]["laps"].length >= 1) {
            if (
              finalgrid[0]["laps"].filter(function (x) {
                return x["best"] == true && x["medal"] != "FAIL";
              }).length >= 1
            ) {
              var bestlapobject = finalgrid[0]["laps"].filter(function (x) {
                return x["best"] == true && x["medal"] != "FAIL";
              })[0];
              bestlap = gtf_EMOTE.tracklogo + "__**Best:**__ " + bestlapobject["medalemote"] + " " + gtf_DATETIME.getFormattedLapTime(bestlapobject["time"]) + " `Lap " + bestlapobject["lapnum"] + "`";
              var laps = finalgrid[0]["laps"]
                .map(function (x, index) {
                  /*
          if (x["medal"] == "FAIL") {
            return "__**Lap " + (index + 1) + ":**__ " + x["medalemote"]
          }
          */
                  if (x["best"] && x["medal"] != "FAIL") {
                    return "__**Lap " + (index + 1) + ":**__ " + x["medalemote"] + " " + gtf_DATETIME.getFormattedLapTime(x["time"]) + " ⭐";
                  }
                  return "__**Lap " + (index + 1) + ":**__ " + x["medalemote"] + " " + gtf_DATETIME.getFormattedLapTime(x["time"]).replace("01:00:00.000", "");
                })
                .reverse()
                .slice(0, 5)
                .join("\n");
            } else {
              var laps = "__**Lap 1:**__ ";
            }
          } else {
            var laps = "__**Lap 1:**__ ";
          }
          var timeprizes = [
            "**" + gtf_EMOTE.goldmedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][0]["time"] * 1000),
            gtf_EMOTE.silvermedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][1]["time"] * 1000) + " ",
            gtf_EMOTE.bronzemedal + " " + gtf_DATETIME.getFormattedLapTime(racesettings["positions"][2]["time"] * 1000) + "**",
          ];
          embed.setDescription(
            results3 +
              "\n" +
              timeprizes.join(" ") +
              "\n" +
              bestlap +
              "\n\n" +
              laps +
              "\n" +
              currentcarinfo +
              gtf_EMOTE.tire +
              "**" +
              currentcar["tires"]
                .split(" ")
                .map(x => x[0])
                .join("") +
              "**"
          );
        }
        gte_STATS.saveEnthu(userdata);//edit
        msg.edit({ embeds: [embed], components: buttons }).catch(function () {
          clearInterval(progress);
          console.log(userdata["id"] + ": Session has ended. (Message is not there.)");
          userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "", gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum: 0 };

          if (racesettings["type"] == "TIMETRIAL") {
            results2 = gte_RACEEX.timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
            embed.setDescription(results2);
            gtf_DISCORD.send(msg, { content: "<@" + userdata["id"] + ">" + " **FINISH**", embeds: [embed] });
          }
          gte_STATS.saveEnthu(userdata);//error
          return;
        });
        if (racesettings["mode"] == "CAREER" || racesettings["mode"] == "ONLINE") {
          if (typeof message === "undefined") {
            message = "";
          } else if (message.length != 0) {
            message = "";
          }
        }
      }, timeinterval);

      ///////////////////////////////////////
      function check() {
        timeleft = totaltime - userdata["raceinprogress"]["start"];

        if (userdata["raceinprogress"]["expire"] <= new Date().getTime()) {
          clearInterval(progress);
          if (userdata["raceinprogress"]["expire"] !== null) {
            gte_STATS.addPlayTime(userdata["raceinprogress"]["expire"] - userdata["raceinprogress"]["start"], userdata);
          }
          if (racesettings["type"] == "TIMETRIAL") {
            let tt2 = gte_RACEEX.timetriallap(racesettings, racedetails, finalgrid, checkpoint, racelength, embed, msg, userdata);
            var newlap = tt2[0];
            currenttime = new Date().getTime();
            if (finalgrid[0]["laps"].length % 5 != 0) {
              if (newlap["medal"] != "GOLD") {
                return gtf_DISCORD.send(msg, { content: "<@" + userdata["id"] + "> **" + newlap["medal"] + " " + gtf_DATETIME.getFormattedLapTime(newlap["time"]) + " | " + "LAP " + finalgrid[0]["laps"].length + "**", embeds: [embed] }, repeat);
              }
            }
            userdata["raceinprogress"]["expire"] = "EXIT";

            function repeat(msg) {
              var racelength = gte_RACEEX.timetrialracelength(racesettings, racedetails, finalgrid, checkpoint, 50 - racesettings["difficulty"] / 2, embed, msg, userdata);

              setTimeout(function () {
                userdata["raceinprogress"] = {
                  active: true,
                  messageid: msg.id,
                  channelid: msg.channel.id,
                  start: currenttime,
                  expire: currenttime + racelength,
                  gridhistory: userdata["raceinprogress"]["gridhistory"],
                  timehistory: userdata["raceinprogress"]["timehistory"],
                  weatherhistory: userdata["raceinprogress"]["weatherhistory"],
                  msghistory: [],
                  championshipnum: 0,
                };
                gte_RACES2.startSession(racesettings, racedetails, finalgrid, [true], embed, msg, userdata);
              }, 2000);
            }
          }

          //////ending race
          if (!racesettings["championship"]) {
            /*
            userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: 0, gridhistory: [], timehistory: userdata["raceinprogress"]["timehistory"], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum: 0 };
            */
          }
          /////
          var thumbnail = msg.embeds[0].thumbnail == null ? "" : msg.embeds[0].thumbnail.url;

          gtf_DISCORD.delete(msg, { seconds: 5 });

          if (racesettings["mode"] == "SSRX") {
            let ssrx2 = gte_RACEEX.speedtestresults(racelength, racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
            var results2 = ssrx2;
          } else if (racesettings["type"] == "DRIFT") {
            let drift2 = gte_RACEEX.driftresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata, racesettings["points"]);
            var results2 = drift2;
          } else if (racesettings["mode"] == "ONLINE") {
            var results2 = gte_RACE.startOnline(racesettings, racedetails, finalgrid, user, userdata);
          } else if (racesettings["type"] == "TIMETRIAL") {
            var results2 = gte_RACEEX.timetrialresults(racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata);
            //var results2 = "Test"
            embed.setDescription(results2);
            //gtf_DISCORD.send(msg, {embeds: [embed]})
            //gte_STATS.saveEnthu(userdata);
            //return
          } else {
            var results2 = gte_RACE.start(racesettings, racedetails, finalgrid, userdata);
          }
          if (thumbnail != "") {
            embed.setThumbnail(thumbnail);
          }

          racedetails = finalgrid
            .map(function (x) {
              var gap = x["position"] == 1 ? "" : "`+" + x["gap"] + "`";
              if (x["user"]) {
                return "**" + x["position"] + ". " + gtf_CARS.shortName(x["name"]) + "**" + " " + gap;
              } else {
                return x["position"] + ". " + gtf_CARS.shortName(x["name"]) + " " + gap;
              }
            })
            .join("\n");

          if (racesettings["mode"] == "CAREER" || racesettings["mode"] == "LICENSE" || racesettings["mode"] == "ONLINE") {
            if (racesettings["type"] != "TIMETRIAL" && racesettings["type"] != "DRIFT") {
              embed.setDescription(
                results2 +
                  "\n\n" +
                  racedetails.split("\n\n")[0] +
                  "\n\n" +
                  gtf_ANNOUNCER.emote(racesettings["title"]) +
                  " `" +
                  gtf_ANNOUNCER.say({
                    name1: "race-results-winner",
                    name2: [
                      finalgrid
                        .slice()
                        .sort((x, y) => y["score"] - x["score"])[0]
                        ["name"].split(" ")
                        .slice(0, -1)
                        .join(" "),
                      finalgrid.slice().sort((x, y) => y["score"] - x["score"])[0]["drivername"],
                    ][userdata["settings"]["GRIDNAME"]],
                    racesettings: racesettings,
                  }) +
                  "`"
              );
            } else {
              embed.setDescription(results2 + "\n\n" + racedetails.split("\n\n")[0]);
            }
          } else {
            embed.setDescription(results2 + "\n\n" + racedetails);
          }

          var ping = "<@" + userdata["id"] + ">";
          var user = msg.user;
          if (racesettings["mode"] == "ONLINE") {
            ping = "@everyone";
          } else {
          }

          if (racesettings["mode"] == "CAREER") {
            if (racesettings["championship"]) {
              var emojilist = [
                {
                  emoji: gtf_EMOTE.tracklogo,
                  emoji_name: "trackgtfitness",
                  name: "Grid Results/Session",
                  extra: "",
                },
              ];
            } else {
              var emojilist = [
                {
                  emoji: gtf_EMOTE.tracklogo,
                  emoji_name: "trackgtfitness",
                  name: "Grid Results/Session",
                  extra: "",
                },
                {
                  emoji: "🔙",
                  emoji_name: "🔙",
                  name: "Exit",
                  extra: "Once",
                },
              ];
              if (racesettings["damage"] && racesettings["car"] == "GARAGE" && gte_CONDITION.condition(gte_STATS.currentCar(userdata))["health"] <= 20) {
                emojilist[0] = {
                  emoji: "❌",
                  emoji_name: "❌",
                  name: "Poor Car Condition",
                  extra: "",
                };
              }
            }
          } else if (racesettings["mode"] == "LICENSE") {
            if (racesettings["title"].includes("Invitation")) {
              var emojilist = [
                {
                  emoji: "🎥",
                  emoji_name: "🎥",
                  name: "Save Replay",
                  extra: "",
                },
                {
                  emoji: gtf_EMOTE.tracklogo,
                  emoji_name: "trackgtfitness",
                  name: "Grid Results/Session",
                  extra: "",
                },
                {
                  emoji: gtf_EMOTE.fithusimlogo,
                  emoji_name: "fithusimlogo",
                  name: "Exit",
                  extra: "Once",
                },
              ];
            } else {
              var emojilist = [
                {
                  emoji: "⏭",
                  emoji_name: "⏭",
                  name: "Next",
                  extra: "Once",
                },
                {
                  emoji: "🎥",
                  emoji_name: "🎥",
                  name: "Save Replay",
                  extra: "",
                },
                {
                  emoji: gtf_EMOTE.tracklogo,
                  emoji_name: "trackgtfitness",
                  name: "Grid Results/Session",
                  extra: "",
                },
                {
                  emoji: gtf_EMOTE.fithusimlogo,
                  emoji_name: "fithusimlogo",
                  name: "Exit",
                  extra: "Once",
                },
              ];
            }
          } else if (racesettings["mode"] == "ONLINE") {
            var emojilist = [
              {
                emoji: "🎥",
                emoji_name: "🎥",
                name: "Save Replay",
                extra: "",
              },
              {
                emoji: gtf_EMOTE.tracklogo,
                emoji_name: "trackgtfitness",
                name: "Grid Results/Session",
                extra: "",
              },
            ];
          } else {
            var emojilist = [
              {
                emoji: gtf_EMOTE.tracklogo,
                emoji_name: "trackgtfitness",
                name: "Grid Results/Session",
                extra: "",
              },
              {
                emoji: gtf_EMOTE.fithusimlogo,
                emoji_name: "fithusimlogo",
                name: "Exit",
                extra: "Once",
              },
            ];
          }

          emojilist = emojilist.map(function (x, index) {
            if (x["name"] == "Save Replay") {
              if (userdata["stats"]["numreplays"] >= gte_GTF.replaylimit) {
                x = {
                  emoji: "❌",
                  emoji_name: "❌",
                  name: "Replays Full",
                  extra: "",
                };
              }
            }
            x["button_id"] = index;
            return x;
          });

          buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);

          gtf_DISCORD.send(msg, { content: ping + " **FINISH**", embeds: [embed], components: buttons }, race2func, true);
          function race2func(msg) {
            gte_RACEEX.createRaceButtons(racesettings, racedetails, finalgrid, checkpoint, results2, buttons, emojilist, embed, msg, userdata);

            if (racesettings["mode"] == "CAREER") {
              var complete = gte_STATS.checkEvent(racesettings, "1st", userdata);
              if (complete) {
                gte_STATS.completeEvent(racesettings, userdata);
                gte_STATS.redeemGift(gtf_EMOTE.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, racesettings["prize"], embed, msg, userdata);
              }
            } else if (racesettings["mode"] == "LICENSE") {
              var option = racesettings["eventid"].replace("LICENSE", "").toLowerCase().split("-")[0];
              if (option == "b" || option == "a" || option == "ic" || option == "ib" || option == "ia" || option == "s") {
                gte_RACEEX.licensecheck(racesettings, racedetails, finalgrid, embed, msg, userdata);
              }
            }
            if (racesettings["mode"] != "ONLINE") {
              //gte_STATS.saveEnthu(userdata);
            }
          }

          return;
        } else {
          var maxprogress = Math.floor(((new Date().getTime() - userdata["raceinprogress"]["start"]) / (totaltime - userdata["raceinprogress"]["start"])) * start.length);
          for (var t = 0; t < start.length; t++) {
            start[t] = progressbarsec;
            if (t < maxprogress) {
              start[t] = progressbarprim;
            }
          }
          results3 = start.join("");
        }
      }
    }, startracetime);
  }
};

module.exports.startDRevolution = function (racesettings, racedetails, finalgrid, checkpoint, embed, msg, userdata) {
  embed.setTitle("__" + racesettings["title"] + "__");
  embed.setColor(userdata["settings"]["COLOR"]);
  embed.image = "";
  var progressbarprim = userdata["settings"]["ICONS"]["bar"][0];
  var progressbarsec = userdata["settings"]["ICONS"]["bar"][1];

  var startracetime = 4000;
  var racetime = "";
  var raceweather = "";

  var message = "";
  var finalgrid;

  var emojilist = [
    {
      emoji: "⬅",
      emoji_name: "⬅",
      name: "",
      extra: "",
      button_id: 0,
    },
    {
      emoji: "↖",
      emoji_name: "↖",
      name: "",
      extra: "",
      button_id: 1,
    },
    {
      emoji: "⬆",
      emoji_name: "⬆",
      name: "",
      extra: "",
      button_id: 2,
    },
    {
      emoji: "↗",
      emoji_name: "↗",
      name: "",
      extra: "",
      button_id: 3,
    },
    {
      emoji: "➡",
      emoji_name: "➡",
      name: "",
      extra: "",
      button_id: 4,
    },
    {
      emoji: "⬜",
      emoji_name: "⬜",
      name: "Accelerate",
      extra: "",
      button_id: 5,
    },
    {
      emoji: "🟥",
      emoji_name: "🟥",
      name: "Brake",
      extra: "",
      button_id: 6,
    },
  ];

  var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);

  var lights = [
    [gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent],
    [gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent],
    [gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent, gtf_EMOTE.transparent],
  ];
  var ready = ["**READY**\n", gtf_EMOTE.transparent + "**3,2,1...**" + gtf_EMOTE.transparent, gtf_EMOTE.transparent + "**START**" + gtf_EMOTE.transparent];
  var start = [progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, progressbarsec, "🏁"];
  var results3 = start.join("");

  var index = 1;

  var results = function (index) {
    return lights[index][0] + lights[index][1] + lights[index][2] + lights[index][3] + ready[index] + lights[index][3] + lights[index][2] + lights[index][1] + lights[index][0];
  };
  //////START///
  var userarrow = racesettings["gridstart"]["position"][0];
  var useraccel = racesettings["gridstart"]["position"][1];
  //////

  gtf_TOOLS.interval(
    function () {
      embed.setDescription(results(index) + "\n" + emojilist[userarrow]["emoji"] + " " + (useraccel ? "`Accelerating...`" : "`Braking...`"));
      embed.spliceFields(0, 1);
      embed.setFields([{ name: "Car", value: racesettings["car"] }]);
      gtf_DISCORD.edit(msg, { content: "ㅤ", embeds: [embed], components: buttons });
      index++;
    },
    1000,
    2
  );

  readysetgo();

  function readysetgo() {
    /////////////

    ///RACEINPROGRESS

    //gte_STATS.addRaceDetails(racesettings, racedetails, finalgrid, userdata);

    var time = new Date().getTime();
    var difference = -1;

    ///Functions
    function left() {
      userarrow = 0;
      difference = new Date().getTime() - time;
    }
    function topleft() {
      userarrow = 1;
      difference = new Date().getTime() - time;
    }
    function top() {
      userarrow = 2;
      difference = new Date().getTime() - time;
    }
    function topright() {
      userarrow = 3;
      difference = new Date().getTime() - time;
    }
    function right() {
      userarrow = 4;
      difference = new Date().getTime() - time;
    }
    function accelerate() {
      useraccel = true;
    }
    function brake() {
      useraccel = false;
    }
    var functionlist = [left, topleft, top, topright, right, accelerate, brake];
    gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata);
    ///
    //gte_STATS.saveEnthu(userdata);

    /// TIMER
    var settings = {
      column: 9,
      row: 7,
      start: racesettings["gridstart"]["start"],
    };
    var pattern = racesettings["tracks"][0]["pattern"];
    var drive = [];
    var currpiece = {};
    var dir = {
      0: function (m, n) {
        return m == 0 || m == 6;
      },
      1: function (m, n) {
        return m - 2 == n || m + 3 == n;
      },
      2: function (m, n) {
        return n == 1 || n == 7;
      },
      3: function (m, n) {
        return n + m == 10 || n + m == 5;
      },
      4: function (m, n) {
        return m == 0 || m == 6;
      },
    };
    var arrowdir = { 0: 3, 1: 3, 2: 4, 3: 5, 4: 5 };
    var markerdir = { 0: [3, 2], 1: [2, 2], 2: [2, 4], 3: [2, 6], 4: [3, 6] };
    var scorecheck = false;
    var layout = [];
    var timeinterval = 5000;
    var timeset = 5;
    var timeindex = 1;

    for (var x = 0; x < settings["row"]; x++) {
      var layoutx = [];

      for (var y = 0; y < settings["column"]; y++) {
        ///START
        if (settings["start"][0] - 1 == x && settings["start"][1] - 1 == y) {
          layoutx.push("🔴");
        } else {
          if (dir["0"](x, y)) {
            layoutx.push(gtf_TOOLS.randomItem(racesettings["track"]["pattern"]));
          } else {
            layoutx.push("⬛");
          }
        }
      }
      //START
      layout.push(layoutx);
    }

    function updatelayout(layout, embed) {
      var final = "";
      var extra = ""

      //// layout

      if (Object.keys(currpiece).length != 0 && scorepiece) {
        extra = "**" + currpiece["score"] + "**"+ "\n\n";
        scorepiece = false;
      }
      scorepiece = true;
      if (timeindex >= pattern.length) {
        timeindex = pattern.length;
      }
      currpiece = pattern[timeindex - 1];
      final = final + "\n";
      timeindex++;

      for (var x = 0; x < settings["row"]; x++) {
        var layoutx = [];

        for (var y = 0; y < settings["column"]; y++) {
          ///START
          if (Object.keys(currpiece).length != 0) {
            if (x == 3 && y == arrowdir[currpiece["arrow"]]) {
              layoutx[y] = gtf_TOOLS.toEmoji(["left", "topleft", "top", "topright", "right"][parseInt(currpiece["arrow"])]);
              continue;
            }

            if (y == markerdir[currpiece["arrow"]][1] && x == markerdir[currpiece["arrow"]][0]) {
              if (currpiece["brake"]) {
                layoutx[y] = gtf_EMOTE.enthudrorangemarker;
                continue;
              } else {
                layoutx[y] = gtf_EMOTE.enthudrgreenmarker;
                continue;
              }
            }
          }

          if (dir[currpiece["arrow"]](x, y)) {
            layoutx[y] = gtf_TOOLS.randomItem(racesettings["track"]["pattern"]);
          } else {
            layoutx[y] = "⬛";
          }
          //START
        }
        layout[x] = layoutx;
      }

      var final = final + layout.map(x => x.join(" ")).join("\n") + "\n" + extra + emojilist[userarrow]["emoji"] + " " + (useraccel ? "`Accelerating...`" : "`Braking...`");

      embed.setDescription(final);
    }
    setTimeout(function () {
      var progress = setInterval(function () {
        //check();
        if (Object.keys(currpiece).length != 0) {
          if (currpiece["arrow"] == userarrow && currpiece["brake"] != useraccel) {
            if (difference == -1) {
              currpiece["score"] = "PERFECT";
              drive.push(currpiece);
            } else {
              if (difference >= 3500) {
                currpiece["score"] = "GOOD";
                drive.push(currpiece);
              } else if (difference >= 2500) {
                currpiece["score"] = "GREAT";
                drive.push(currpiece);
              } else {
                currpiece["score"] = "PERFECT";
                drive.push(currpiece);
              }
            }
          } else {
            if (currpiece["arrow"] != userarrow) {
              currpiece["score"] = "MISS";
              drive.push(currpiece);
            } else if (currpiece["brake"] == useraccel) {
              currpiece["score"] = "BAD";
              drive.push(currpiece);
            }
          }
        }
        updatelayout(layout, embed);
        time = new Date().getTime();
        difference = -1;

        if (drive.length == pattern.length) {
          clearInterval(progress);
          if (userdata["raceinprogress"]["expire"] !== null) {
            //gte_STATS.addPlayTime(userdata["raceinprogress"]["expire"] - userdata["raceinprogress"]["start"], userdata);
          }
          //////ending race
          var thumbnail = msg.embeds[0].thumbnail == null ? "" : msg.embeds[0].thumbnail.url;

          gtf_DISCORD.delete(msg, { seconds: 5 });

          var results2 = gte_RACE.startDR(racesettings, racedetails, finalgrid, userdata);

          if (thumbnail != "") {
            embed.setThumbnail(thumbnail);
          }

          var scores = { PERFECT: 0, GREAT: 0, GOOD: 0, BAD: 0, MISS: 0 };
          drive.map(function (x) {
            scores[x["score"]]++;
          });
          racedetails = Object.keys(scores)
            .map(function (x) {
              return x + " " + scores[x] + " (" + Math.round((scores[x] / drive.length) * 100) + "%)";
            })
            .join("\n");
          var rank = gte_RACE.scoreCalcEnthu(scores, drive);
          var place = { S: "1st", A: "2nd", B: "3rd", C: "4th", D: "5th" }[rank];
          gte_STATS.updateEventEnthu(racesettings, place, userdata);
          gte_STATS.saveEnthu(userdata);

          embed.setDescription("__**FINISH**__ " + "`Rank: " + rank + " `\n\n" + racedetails);
          embed.setFields([{ name: "Car", value: racesettings["car"] }]);
          embed.setThumbnail(racesettings["track"]["image"]);

          var ping = "<@" + userdata["id"] + ">";

          var emojilist = [
            {
              emoji: "🔙",
              emoji_name: "🔙",
              name: "Exit",
              extra: "Once",
            }
          ];

          emojilist = emojilist.map(function (x, index) {
            x["button_id"] = index;
            return x;
          });

          buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);

          gtf_DISCORD.send(msg, { content: ping + " **FINISH**", embeds: [embed], components: buttons }, race2func, true);

          function race2func(msg) {
            gte_RACEEX.createRaceButtons(racesettings, racedetails, finalgrid, checkpoint, results2, buttons, emojilist, embed, msg, userdata);

            //var complete = gte_STATS.checkEvent(racesettings, "1st", userdata);
            /*
                if (complete) {
                gte_STATS.completeEvent(racesettings, userdata);
                //gte_STATS.redeemGift(gtf_EMOTE.goldmedal + " Congrats! Completed " + racesettings["title"].split(" - ")[0] + " " + gtf_EMOTE.goldmedal, racesettings["prize"], embed, msg, userdata);
                }
              gte_STATS.saveEnthu(userdata);
            }
            */

            return;
          }
          return;
        }

        msg.edit({ embeds: [embed], components: buttons }).catch(function () {
          clearInterval(progress);
          console.log(userdata["id"] + ": Session has ended. (Message is not there.)");
          userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: "", gridhistory: [], timehistory: [], weatherhistory: userdata["raceinprogress"]["weatherhistory"], msghistory: [], championshipnum: 0 };
          gte_STATS.saveEnthu(userdata);
          return;
        });
      }, timeinterval);

      ///////////////////////////////////////
    }, startracetime);
  }
};
