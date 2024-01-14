const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "license",
  title: "License Center",
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
    if (query["options"] == "b" || parseInt(query["options"]) == 1) {
      query["options"] = "B";
    }
    if (query["options"] == "a" || parseInt(query["options"]) == 2) {
      query["options"] = "A";
      if (!gtf_STATS.checklicense("B", embed, msg, userdata)) {
        return
      }
    }
    if (query["options"] == "ic" || parseInt(query["options"]) == 3) {
      query["options"] = "IC";
      if (!gtf_STATS.checklicense("A", embed, msg, userdata)) {
        return
      }
    }
    if (query["options"] == "ib" || parseInt(query["options"]) == 4) {
      query["options"] = "IB";
      if (!gtf_STATS.checklicense("IC", embed, msg, userdata)) {
        return
      }
    }
    if (query["options"] == "ia" || parseInt(query["options"]) == 5) {
      query["options"] = "IA";
      if (!gtf_STATS.checklicense("IB", embed, msg, userdata)) {
        return
      }
    }
    if (query["options"] == "s" || parseInt(query["options"]) == 6) {
      query["options"] = "S";
      if (!gtf_STATS.checklicense("IA", embed, msg, userdata)) {
        return
      }
    }
    
    pageargs["image"].push( "https://github.com/J24681357/gtfbotmain/raw/master/gtfbot2unleahsed/images/career/" + query["options"].toUpperCase() + "_level.png")
    
    var licenses = [...gtf_LIST_CAREERRACES.find({types: [ "LICENSE" + query["options"]] })]

    ///COMMANDS
    if (query["options"] == "list") {
      delete query["number"]
       embed.setTitle("💳" + " __License Center__");
      results =
        "__**B License**__ " + gtf_EMOTE.blicense + (gtf_STATS.checklicense("B", "", msg, userdata) ? " 💳" : "") +
        "\n" +
        "__**A License**__ " + gtf_EMOTE.alicense + (gtf_STATS.checklicense("A", "", msg, userdata) ? " 💳" : "") +
        "\n" +
        "__**IC License**__ " + gtf_EMOTE.iclicense + (gtf_STATS.checklicense("IC", "", msg, userdata) ? " 💳" : "") +
        "\n" +
        "__**IB License**__ " + gtf_EMOTE.iblicense + (gtf_STATS.checklicense("IB", "", msg, userdata) ? " 💳" : "") +
        "\n" +
        "__**IA License**__ " + gtf_EMOTE.ialicense + (gtf_STATS.checklicense("IA", "", msg, userdata) ? " 💳" : "") +
        "\n" +
        "__**S License**__ " + gtf_EMOTE.slicense + (gtf_STATS.checklicense("S", "", msg, userdata) ? " 💳" : "") + "/n/n" + 
        "**Current License:** " + gtf_TOOLS.toEmoji(userdata["license"]+"license")
        var list = results.split("\n")
      pageargs["list"] = list;
      if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ Select a license from the list above using the numbers associated with the buttons.\nEach license has a different difficulty. Increasing your experience level will help you complete tests more efficiently.**";
      }
      pageargs["selector"] = "options"
      pageargs["query"] = query
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return
    }
    var ids = Object.keys(licenses);
    if (ids.length == 0) {
      gtf_EMBED.alert({ name: "❌ Invaild", description: "There are no license here.", embed: "", seconds: 3 }, msg, userdata);
      return
    }

    if (typeof query["number"] === 'undefined') {
      results = []
        for (var t = 0; t < ids.length; t++) {
          var licenseevent = licenses[ids[t]];
          
          if (licenseevent["type"] == "TIMETRIAL") {
            results.push(
            "⌛" +
            "__**" +
            licenseevent["title"] + "**__" + " " +
            gtf_STATS.raceEventStatus(licenseevent, userdata) +
            "/n" +
            "**Track:** " + licenseevent["tracks"][0][1] +
              "/n" +
            "**Loaner Car:** " + licenseevent["car"]
          )
          }
        }
        embed.setTitle("💳 __License Center - " + query["options"].toUpperCase() + " (" + ids.length + " Tests)" + "__");
        pageargs["list"] = results;
        pageargs["selector"] = "number"
        pageargs["query"] = query
        if (userdata["settings"]["TIPS"] == 0) {
        pageargs["footer"] = "**❓ In each license test, you must achieve the target time in a loaner car. Multiple attempts will be made for each session. The session ends after 5 tries or an earned Gold medal.**";
      }
        pageargs["rows"] = 3
        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      setTimeout(function() {
        var option = query["options"].toLowerCase()
          var total = 6
            if (option.includes("ic")) {
              total = 4
          }
         var bronzecomplete = gtf_STATS.checkLicenseTests(query["options"], "3rd", userdata);
         var goldcomplete = gtf_STATS.checkLicenseTests(query["options"], "1st", userdata);
        
        if (bronzecomplete && !gtf_STATS.checklicense(query["options"], "", msg, userdata)) {
         setTimeout(function() {gtf_STATS.setLicense(query["options"].toUpperCase(), userdata)}, 5000) 
          var prize = licenses[ids[total-1]]["prize"]
          gtf_STATS.redeemGift("🎉 License " + query["options"].toUpperCase() + " Achieved 🎉", prize, embed, msg, userdata);
        }
        
        if (goldcomplete && gtf_STATS.raceEventStatus(licenses[0], userdata) != "✅") {
          gtf_STATS.setLicense(query["options"].toUpperCase(), userdata);
          var args = licenses[ids[total]]["prize"]["item"]
          var car = gtf_CARS.random(args, 1)[0];
          gtf_STATS.addGift({
      id: -1, type:"CAR", name: "License " + option.toUpperCase() + ": All Gold Reward", item: car, author: "GT FITNESS", inventory: true }, userdata)
        }
      },2000)
        return;
    }
    //

    var number = parseInt(query["number"])
      if (!gtf_MATH.betweenInt(number, 1, Object.keys(licenses).length) && !isNaN(number)) {
          gtf_EMBED.alert({ name: "❌ Invaild ID", description: "This event ID does not exist.", embed: "", seconds: 3 }, msg, userdata);
          return
      }
     // embed.setFields([{name:gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata)}]);
var event = {...licenses[number-1]}
      var raceprep = {
          mode: "LICENSE",
          modearg: "",
          track: event["tracks"][0][1],
          car: event["car"],
          racesettings: event,
          players: [],
          other: {}
      }
    raceprep["racesettings"]["laps"] = event["tracks"][0][2]
    raceprep["racesettings"]["mode"] = "LICENSE"
      var gtfcar = gtf_STATS.currentCar(userdata)
        gtf_RACE.prepRace(raceprep, gtfcar, embed, msg, userdata);
      }
}
