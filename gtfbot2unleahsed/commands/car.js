const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
module.exports = {
  name: "car",
  title: "GTF Car Dealerships",
  license: "N",
  level: 0,
  channels: ["testing", "gtf-2u-game", "gtf-demo"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: false,
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

    var searchname = "";
    if (query["options"] == "search") {
      query["options"] = "select";
      if (typeof query["name"] !== "undefined") {
        searchname = query["name"].slice();
      }
     if (searchname.length != 0) {
      query["name"] = searchname;
    }
    }

    ///terms
    var term = {}
    if (typeof query["manufacturer"] === "undefined") {
      query["manufacturer"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("manufacturer")));
      query["manufacturer"] = Object.values(query["manufacturer"]).flat();
      if (query["manufacturer"][0] === undefined) {
        query["manufacturer"] = [];
      } else {
        query["manufacturer"] = query["manufacturer"].map(x => x.replace(/,/g, "-"))
      }
    }
    if (typeof query["model"] === "undefined") {
      query["model"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("model")));
      query["model"] = Object.values(query["model"]).flat();
      if (query["model"][0] === undefined) {
        query["model"] = [];
      }
    }
    if (typeof query["name"] === "undefined") {
      query["name"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes(name)));
      query["name"] = Object.values(query["name"]).flat();
      if (query["name"][0] === undefined) {
        query["name"] = [];
      }
    }
    if (typeof query["country"] === "undefined") {
      query["country"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("country")));
      query["country"] = Object.values(query["country"]).flat();
      if (query["country"][0] === undefined) {
        query["country"] = [];
      }
    }
    if (typeof query["type"] === "undefined") {
      query["type"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("type")));
      query["type"] = Object.values(query["type"]).flat();
      if (query["type"][0] === undefined) {
        query["type"] = [];
      }
    }
    if (typeof query["drivetrain"] === "undefined") {
      query["drivetrain"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("drivetrain")));
      query["drivetrain"] = Object.values(query["drivetrain"]).flat();
      if (query["drivetrain"][0] === undefined) {
        query["drivetrain"] = [];
      }
    }
    if (typeof query["engine"] === "undefined") {
      query["engine"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("engine")));
      query["engine"] = Object.values(query["engine"]).flat();
      if (query["engine"][0] === undefined) {
        query["engine"] = [];
      }
    }
    if (typeof query["special"] === "undefined") {
      query["special"] = Object.fromEntries(Object.entries(query).filter(([key]) => key.includes("special")));
      query["special"] = Object.values(query["special"]).flat();
      if (query["special"][0] === undefined) {
        query["special"] = [];
      }
    }

    if (query["fpplimit"] === undefined) {
      query["fpplimit"] = 9999
    }
    if (query["powerlimit"] === undefined) {
      query["powerlimit"] = 9999
    }
    if (query["weightlimit"] === undefined) {
      query["weightlimit"] = 9999
    }


    delete query["manufacturer1"];
    delete query["manufacturer2"];
    delete query["manufacturer3"];
    delete query["name1"];
    delete query["type1"];
    delete query["drivetrain1"];
    delete query["engine1"];
    delete query["special1"];

    var sort = userdata["settings"]["DEALERSORT"];

    ///DISCOUNTS
    var usedcars = gtf_CARS.find({uppercostm: 30, upperyear: 2012, sort: sort})
    var day = gtf_DATETIME.getCurrentDay()
    var discountindexes = []

  for (var num = 0; num < 30; num++) {
     var rint = parseInt(gtf_MATH.randomIntSeed(0, usedcars.length, (num+100) + day))
    var car = usedcars[rint]
    discountindexes.push(
      car["_id"]
    )
  }
    ///

    var makelist = gtf_CARS.list("makes");
    var number = 0;
    var itempurchase = false;

    var list = [];
    var listsec = []

    ///COMMANDS
    if (query["options"] == "info") {
      delete query["number"];
      embed.setTitle("🏢 __GTF Car Dealerships - Info__");
      gtf_CARS.stats(embed);
      gtf_DISCORD.send(msg, { embeds: [embed] });
      return;
    }

    if (query["options"] == "list") {
      delete query["number"];
      delete query["manufacturer"];
      delete query["manufacturer1"];
      delete query["manufacturer2"];
      delete query["manufacturer3"];
      delete query["model"];
      delete query["country"];
      delete query["country1"];
      delete query["type"];
      delete query["type1"];
      delete query["drivetrain"];
      delete query["drivetrain1"];
      delete query["engine"];
      delete query["engine1"];
      delete query["special"];
      delete query["special1"];
      delete query["name"]
      delete query["fpplimit"]
      delete query["powerlimit"]
      delete query["weightlimit"]
      for (var makei = 0; makei < makelist.length; makei++) {
        var m = makelist[makei].replace(/,/, " ");
        var cars = gtf_CARS.find({ makes: [m] });
        var count = cars.length;
        if (count != 0) {
          var country = gtf_TOOLS.toEmoji(cars[0]["country"]);
        if (gtf_GTF.invitationlist.includes(m) && !gtf_STATS.checkItem(m + " Invitation", userdata)) {
          list.push(country + " " + m + " " + "`🚘" + count + "` ✉");
        } else {
        list.push(country + " " + m + " " + "`🚘" + count + "`");
        }
        } else {
          list.push(m + " " + "`🚘" + count + "`");
        }

      }
      embed.setTitle("🏢 __GTF Car Dealerships (" + list.length + " Makes)" + "__");
      pageargs["selector"] = "manufacturer";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["listextra"] = ""
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }

    if (query["options"] == "select" || query["options"] == "selectused") {

      if (typeof query["manufacturer"] !== "undefined" || typeof query["name"] !== "undefined" || typeof query["country"] !== "undefined" || typeof query["type"] !== "undefined" || typeof query["drivetrain"] !== "undefined" || typeof query["engine"] !== "undefined" || typeof query["special"] !== "undefined") {
        var term = { makes: query["manufacturer"],
                    names: query["model"],
                    countries: query["country"],
                    types: query["type"],
                    drivetrains: query["drivetrain"],
                    engines: query["engine"],
                    special: query["special"],
                    upperfpp: query["fpplimit"],
                    upperpower: query["powerlimit"],
                    upperweight: query["weightlimit"],
                    sort: sort 
                   };

        if (searchname.length != 0) {
          term["fullnames"] = [searchname];
        }

        if (query["options"] == "selectused") {
          var list = usedcars.filter(x => discountindexes.indexOf(x["_id"]) > -1)

        } else if (query["options"] == "selectrecommended") {

        } else {
          var list = gtf_CARS.find(term);
        }

        var total = list.length;
        if (total == 0) {
          if (searchname.length != 0) {
            gtf_EMBED.alert({ name: "❌ No Cars Found", description: "Cars of your search query does not exist in the GTF dealerships. Try again with another query.", embed: "", seconds: 5 }, msg, userdata);
            return;
          } else {
            gtf_EMBED.alert({ name: "❌ No Cars Found", description: "Cars of this manufacturer and/or type does not exist in the GTF dealerships. Try again with another query.", embed: "", seconds: 5 }, msg, userdata);
            return;
          }
        }

        var make = query["manufacturer"].length == 0 ? "" : query["manufacturer"][0];
        var carname = query["name"].length == 0 ? "" : query["name"][0];
        var country = query["country"].length == 0 ? "" : query["country"][0];
        var type = query["type"].length == 0 ? "" : query["type"][0];
        var drivetrain = query["drivetrain"].length == 0 ? "" : query["drivetrain"][0];
        var engine = query["engine"].length == 0 ? "" : query["engine"][0];
        var special = query["special"].length == 0 ? "" : query["special"][0];

        if (gtf_GTF.invitationlist.includes(make.replace("-", " "))) {
          if (!gtf_STATS.checklicense("IC", embed, msg, userdata)) {
            return
          } else {
            if (!gtf_STATS.checkItem(make.replace("-", " ") + " Invitation", userdata)) {
              require(__dirname + "/" + "license").execute(msg, {options: make.toLowerCase().replace(/-/g, ""), number: 1}, userdata);
              return
            }
          }
        }

        var carlist = [];
        for (var i = 0; i < list.length; i++) {
          if (discountindexes.indexOf(list[i]["_id"]) > -1) {
          list[i]["discount"] = [5,5,10,20,25,30][gtf_MATH.randomIntSeed(0,5, day + list[i]["_id"])]
        }
          var fpp = gtf_PERF.perf(list[i], "DEALERSHIP")["fpp"];
          var cost = gtf_CARS.costCalc(list[i], fpp);
          var name = list[i]["name"];
          var year = list[i]["year"];
          var image = list[i]["image"][0];
          var numbercost = list[i]["carcostm"] == 0 ? "❌ " : gtf_MATH.numFormat(cost) + gtf_EMOTE.credits + " ";
          numbercost = (gtf_GTF.invitationlist.includes(list[i]["make"].replace("-", " ")) && !gtf_STATS.checkItem(list[i]["make"].replace("-", " ") + " Invitation", userdata)) ? "✉ " : numbercost
          var discount = list[i]["discount"] == 0 ? "" : "`⬇ " + list[i]["discount"] + "%" + "` ";
          carlist.push(discount + "**" + numbercost + "**" + gtf_CARS.shortName(name + " " + year) + " **" + fpp + gtf_EMOTE.fpp + "**" + gtf_CARS.checkCar(name + " " + year, userdata));
          var hashtags = list[i]["special"].filter(x => x[0] != "x").map(x => "#"+x).join(" ")
        listsec.push(list[i]["type"] + " | " + gtf_MATH.numFormat(list[i]["power"]) + " hp" + " | " + gtf_MATH.numFormat(gtf_STATS.weightUser(list[i]["weight"], userdata)) + " " + gtf_STATS.weightUnits(userdata) + " | " + list[i]["drivetrain"] + " " + hashtags)
          pageargs["image"].push(image);
        }
        if (query["number"] !== undefined) {
          if (!gtf_MATH.betweenInt(query["number"], 1, total)) {
            gtf_EMBED.alert({ name: "❌ Invalid Number", description: "This number does not exist in the " + make + " dealership.", embed: "", seconds: 5 }, msg, userdata);
            return;
          } else {
            itempurchase = true;
            var number = parseInt(query["number"]) - 1;
            var item = list[number];
          }
          if (itempurchase) {
            embed.fields = [];
            if (item["carcostm"] == 0) {
              gtf_EMBED.alert({ name: "❌ Car Unavailable", description: "You cannot purchase this car.", embed: "", seconds: 3 }, msg, userdata);
              return;
            }

        if (gtf_GTF.invitationlist.includes(item["make"].replace("-", " "))) {
          if (!gtf_STATS.checklicense("IC", embed, msg, userdata)) {
            return
          } else {
            if (!gtf_STATS.checkItem(item["make"].replace(/,/, " ").replace("-", " ") + " Invitation", userdata)) {

              require(__dirname + "/" + "license").execute(msg, {options: item["make"].toLowerCase().replace(/-/g, ""), number: 1}, userdata);
              return
            }
          }
        }
            gtf_GTFAUTO.purchase(item, "CAR", "", embed, query, msg, userdata);
            return;
          }
        }
        if (make.length == 0 && carname.length != 0 && type.length != 0 && drivetrain.length != 0 && engine.length != 0) {
          embed.setTitle("__All (" + carlist.length + " Cars) (" + userdata["settings"]["DEALERSORT"] + ")__");
        } else if (query["options"] == "selectused") {
          embed.setTitle("__GTF Dealership: Discounts" + make + type + drivetrain + engine + special + searchname + " (" + userdata["settings"]["DEALERSORT"] + ")__");
        } else if (typeof query["title"] !== 'undefined') {
          embed.setTitle("__" + query["title"] + "__")
        } else {
          var emot = gtf_TOOLS.toEmoji(list[0]["country"]) + " ";
          if (type.length == 0 || drivetrain.length == 0 || engine.length == 0 || special.length == 0 || searchname.length == 0) {
            emot = "";
          } 
          if (country.length != 0 || make.length != 0) {
           emot = gtf_TOOLS.toEmoji(list[0]["country"]) + " ";
          }
          embed.setTitle(emot + "__" + make + country + type + drivetrain + engine + special + searchname + " (" + carlist.length + " Cars) (" + userdata["settings"]["DEALERSORT"] + ")__");
        }

        pageargs["selector"] = "number";
        pageargs["query"] = query;
        pageargs["list"] = carlist;
        pageargs["listsec"] = listsec

        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
        return;
      }

      var list = [];
      for (var makei = 0; makei < makelist.length; makei++) {
        var m = makelist[makei].replace(/,/g, "-");
        var count = gtf_CARS.find({ makes: [m] }).length;
        list.push(m + " `🚘" + count + "`");
      }
      embed.setTitle("🏢 __GTF Car Dealerships (" + list.length + " Makes)" + "__");
      pageargs["selector"] = "manufacturer";
      pageargs["query"] = query;
      pageargs["list"] = list;
      pageargs["special"] = "Manufacturer";
      pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
      gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
      return;
    }
  },
};
