const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "arcade",
  title: "Arcade Mode",
  license: "N",
  level: 0,
  channels: ["testing", "gtf-2u-game", "bot-mode"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(
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

    var name = "";

    if (parseInt(query["options"]) == 1 || query["options"] == "ARCADE") {
      query["options"] = "ARCADE";
      if (typeof query['singlerace_league'] !== 'undefined') {
        query["league"] = parseInt(query['singlerace_league'])
        delete query['singlerace_league']
      }
      name = "Single Race";
      singleracemodeselect(msg);
      return;
    }
    else if (parseInt(query["options"]) == 2 || query["options"] == "DRIFT") {
      query["options"] = "DRIFT";
      if (typeof query['drifttrial_league'] !== 'undefined') {
        query["league"] = parseInt(query['drifttrial_league'])
        delete query['drifttrial_league']
      }
      name = "Drift Trial";
      driftmodeselect(msg);
      return;
    }
    else if (parseInt(query["options"]) == 3 || query["options"] == "SSRX") {
      query["options"] = "SSRX";
      if (typeof query['speedtest_length'] !== 'undefined') {
        query["length"] = parseInt(query['speedtest_length'])
        delete query['speedtest_length']
      }
      name = "Speed Test";
      speedtestmodeselect(msg);
    }
    else {
      delete query["options"];
      embed.setTitle("__Arcade Mode - Mode Selection__");
      results = "__**Single Race**__" + "\n" +
        "__**Drift Trial**__" + " " + gtf_EMOTE.alicense + "\n" +
        "__**Speed Test**__" + " " + gtf_EMOTE.alicense;
      embed.setDescription(results);
      var list = results.split("\n");
      pageargs["selector"] = "options";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }

    ///MODES
    function arcadefunc(msg) {
      var gtfcar = gtf_STATS.currentCar(userdata);
      /// REGULATIONS

      ///
      if (query["trackselect"] == 1) {
        return selectgaragemode();
      }
      if (query["trackselect"] == 2) {
        return selectgaragemodedirt();
      }
      if (query["trackselect"] == 3) {
        return selectgaragemodesnow();
      }
      if (query["trackselect"] == 4) {
        return selectgaragemodecoursemakerrandom();
      }
      if (query["trackselect"] == 5) {
        return selectgaragemodecoursemaker();
      }

      function selectgaragemode() {
        embed.fields = [];
        var raceprep = {
          mode: "ARCADE",
          modearg: query["league"],
          car: "GARAGE",
          track: { types: ["Tarmac"] },
          racesettings: {},
          players: [],
          other: []
        };
        var x = function() {
          return gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
        };
        var tiress = function() {
          gtf_GTF.checkTireRegulations(gtfcar, { tires: "" }, x, embed, msg, userdata);
        }
        if (raceprep["modearg"].includes("drift")) {
          raceprep["track"]["options"] = ["Drift"];
          return gtf_GTF.checkRegulations(gtfcar, { drivetrains: ["FR", "4WD", "4WD-MR", "MR"] }, tiress, embed, msg, userdata);
        } else {
          return tiress()
        }
      }
      function selectgaragemodedirt() {
        embed.fields = [];
        var raceprep = {
          mode: "ARCADE",
          modearg: query["league"],
          car: "GARAGE",
          track: { types: ["Dirt"] },
          racesettings: {},
          players: [],
          other: [],
        };
        if (raceprep["modearg"].includes("drift")) {
          raceprep["track"]["options"] = ["Drift"];
        }
        var x = function() {
          return gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
        };
        gtf_GTF.checkTireRegulations(gtfcar, { tires: "Rally: Dirt" }, x, embed, msg, userdata);
      }
      function selectgaragemodesnow() {
        embed.fields = [];
        var raceprep = {
          mode: "ARCADE",
          modearg: query["league"],
          car: "GARAGE",
          track: { types: ["Snow"] },
          racesettings: {},
          players: [],
          other: [],
        };
        if (raceprep["modearg"].includes("drift")) {
          raceprep["track"]["options"] = ["Drift"];
        }
        var x = function() {
          return gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
        };
        gtf_GTF.checkTireRegulations(gtfcar, { tires: "Rally: Snow" }, x, embed, msg, userdata);
      }
      function selectgaragemodecoursemaker() {
        embed.fields = [];
        selecttrack();
      }
      function selectgaragemodecoursemakerrandom() {
        embed.fields = [];
        var x = function() {
          return selectrandomtrack();
        };
        gtf_GTF.checkTireRegulations(gtfcar, { tires: "" }, x, embed, msg, userdata);
      }

      embed.setTitle("__" + name + " - Course Selection__");
      delete query["trackselect"];
      var list = ["__**GT Tarmac Course (Random)**__",
        "__**GT Dirt Course (Random)**__",
        "__**GT Snow Course (Random)**__/n",
        "__**Course Maker (Random)**__",
        "__**Select From My Courses**__"]
      embed.setDescription(list.join("\n"));

      pageargs["selector"] = "trackselect";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }
    function ssrxfunc(msg) {
      var gtfcar = gtf_STATS.currentCar(userdata);
      var ocar = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"] });
      if (ocar["type"] == "Concept" || ocar["type"] == "Vision Gran Turismo" || ocar["type"] == "Redbull X" || ocar["type"] == "Kart") {
        gtf_EMBED.alert({ name: "❌ Car Prohibited", description: "This car is not allowed in the Speed Test.", embed: "", seconds: 5 }, msg, userdata);
        return;
      }

      var continuee = function() {
        var raceprep = {
          mode: "SSRX",
          modearg: query["length"],
          car: "GARAGE",
          track: "Special Stage Route X",
          racesettings: {},
          players: [],
          other: [],
        };
        return gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
      };
      gtf_GTF.checkTireRegulations(gtfcar, { tires: "" }, continuee, embed, msg, userdata);
    }
    function driftmodeselect(msg) {
      if (!gtf_STATS.checklicense("A", embed, msg, userdata)) {
        return;
      }

      if (parseInt(query["league"]) == 1) {
        query["league"] = "driftbeginner";
      }
      if (parseInt(query["league"]) == 2) {
        query["league"] = "driftprofessional";
      }

      if (query["league"] == "driftbeginner") {
        if (!gtf_STATS.checklicense("A", embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      } else if (query["league"] == "driftprofessional") {
        if (!gtf_STATS.checklicense("IC", embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      }

      delete query["number"];
      embed.setTitle(gtf_EMOTE.gtlogowhite + " __Drift Trial__");
      results = "__**Beginner**__ " + gtf_EMOTE.alicense + "\n" + "__**Professional**__ " + gtf_EMOTE.iclicense;
      var list = results.split("\n");
      pageargs["list"] = list;
      pageargs["selector"] = "league";
      pageargs["query"] = query;
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }
    function singleracemodeselect(msg) {
      if (parseInt(query["league"]) == 1) {
        query["league"] = "beginner";
      }
      if (parseInt(query["league"]) == 2) {
        query["league"] = "amateur";
      }
      if (parseInt(query["league"]) == 3) {
        query["league"] = "pro";
      }
      if (parseInt(query["league"]) == 4) {
        query["league"] = "endurance";
      }
      if (query["league"] == "beginner") {
        arcadefunc(msg);
        return;
      }
      if (query["league"] == "amateur" || query["league"] == "a") {
        if (!gtf_EXP.checkLevel(10, embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      } else if (query["league"] == "professional" || query["league"] == "pro") {
        if (!gtf_EXP.checkLevel(20, embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      } else if (query["league"] == "endurance" || query["league"] == "endur") {
        if (!gtf_EXP.checkLevel(30, embed, msg, userdata)) {
          return;
        }
        arcadefunc(msg);
        return;
      }
      delete query["number"];
      embed.setTitle(gtf_EMOTE.gtlogowhite + " __Single Race__");
      results = "__**Beginner**__ " + "\n" + "__**Amateur**__ " + gtf_EMOTE.exp + " `Lv.10`" + "\n" + "__**Professional**__ " + gtf_EMOTE.exp + " `Lv.20`" + "\n" + "__**Endurance**__ " + gtf_EMOTE.exp + " `Lv.30`";
      embed.setDescription(results);
      var list = results.split("\n");
      pageargs["selector"] = "league";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }
    function speedtestmodeselect(msg) {
      if (!gtf_STATS.checklicense("A", embed, msg, userdata)) {
        return;
      }
      if (parseInt(query["length"]) == 1) {
        query["length"] = 400;

        ssrxfunc(msg);
        return;
      }
      if (parseInt(query["length"]) == 2) {
        query["length"] = 1000;
        ssrxfunc(msg);
        return;
      }
      if (parseInt(query["length"]) == 3) {
        query["length"] = 10000;
        ssrxfunc(msg);
        return;
      }

      delete query["number"];
      embed.setTitle("🛣️ __Special Stage Route X - Speed Test__");
      results = "__**400m**__ " + "\n" + "__**1,000m**__ " + "\n" + "__**10,000m**__ ";
      embed.setDescription(results);
      var list = results.split("\n");
      pageargs["selector"] = "length";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }

    ///TRACKS
    function selecttrack() {
      var coursestats = userdata["courses"]
      var gtfcar = gtf_STATS.currentCar(userdata);
      if (coursestats.length == 0) {
        gtf_EMBED.alert({ name: "❌ No Courses", description: "You have no courses saved." + "\n" + "Select another option when this message disappears.", embed: "", seconds: 5 }, msg, userdata);
        return;
      }
      info = "";
      embed.setTitle("__Arcade Mode - My Courses (" + coursestats.length + " Courses)" + "__");

      var emojilist = [];
      var functionlist = [];
      var numberlist = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
      results = coursestats.map(function(x, i) {
        emojilist.push({
          emoji: numberlist[i],
          emoji_name: numberlist[i],
          name: "",
          extra: "Once",
          button_id: i,
        });
        functionlist.push(function func2(index) {
          var track = coursestats[index];
          if (track["layout"] == "sprint" && query["league"] == "endurance") {
            gtf_EMBED.alert({ name: "❌ Invalid", description: "Endurances are unavailable for sprint courses.", embed: "", seconds: 3 }, msg, userdata);
            return;
          }
          var raceprep = {
            mode: "ARCADE",
            modearg: query["league"],
            car: "GARAGE",
            track: track,
            racesettings: {},
            players: [],
            other: [],
          };

          function x1() {
            return gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
          }
          if (track["type"].includes("Dirt")) {
            var tires = "Rally: Dirt";
          } else if (track["type"].includes("Snow")) {
            var tires = "Rally: Snow";
          } else {
            var tires = "";
          }
          gtf_GTF.checkTireRegulations(gtfcar, { tires: tires }, x1, embed, msg, userdata);
        });
        return numberlist[i] + " " + x["name"] + " `" + x["layout"] + "`" + " `" + x["type"].split(" - ")[1] + "`";
      });

      results = results.join("\n") + pageargs["footer"];
      embed.setDescription(results);
      var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
      gtf_DISCORD.send(msg, { embeds: [embed], components: buttons }, arcadecoursefunc);

      function arcadecoursefunc(msg) {
        gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata);
      }

    }
    function selectrandomtrack() {
      var t = gtf_COURSEMAKER.createCourse({
        min: 40,
        max: 80,
        minSegmentLength: 2,
        maxSegmentLength: 10,
        curviness: 0.3,
        maxAngle: 120,
        location: "Blank",
        surface: "Tarmac",
        layout: "Circuit"
      });
      var track = gtf_COURSEMAKER.displayCourse(t, callback);

      function callback(track) {
        var gtfcar = gtf_STATS.currentCar(userdata);
        track["options"] = ["Drift"];
        track["author"] = "GTFITNESS";
        var raceprep = {
          mode: "ARCADE",
          modearg: query["league"],
          car: "GARAGE",
          track: track,
          racesettings: {},
          players: [],
          other: [],
        };
        return gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
      }
    }
  },
};
