const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

/////////////////////VARIABLES/////////////////
module.exports.garagelimit = 300;
module.exports.favoritelimit = 100;
module.exports.courselimit = 10;
module.exports.eventlimit = 5;
module.exports.giftlimit = 20;
module.exports.creditslimit = 9999999;
module.exports.explimit = 1000000;
/////////////////////

//
module.exports.commandlist = [
  ['career', "Career Mode", "🏁"],
  ['license', "License Center", "💳"],
  ['seasonal', "Seasonal Events | IB", "🎉"],
['arcade', "Arcade Mode", "🎮"],
['customrace', "Custom Race | Lv.40", "♾"],
['car', "GTF Car Dealerships", "🏢"],
['tune', "GTF Auto: Tuning & Maintenance", "🔧"],
['paint', "GTF Auto: Paints | B", "🎨"],
['wheels', "GTF Auto: Wheels | B", "🛞"],
['driver', "GTF Auto: Driver Gear | B", "👤"],
['setup', "Car Setups | A", "🛠"],
['garage', "Garage", "🚘"],
["profile", "Profile", "💎"],
["gifts", "Gifts", "🎁"],
["daily", "Daily Workout | B", "🎽"],
["course", "Course Maker | IC", "🛣"],
["settings", "Settings", "⚙"],
["database", "GTF Database", "🗃"]]
module.exports.defaultsettings = {
            MODE: "Simulation",
            GARAGESORT: "Oldest Added",
            DEALERSORT: "Lowest Price",
            RACEDM: 0,
            UNITS: 0,
            TIMEOFFSET: 0,
            TIPS: 1,
            MESSAGES: 1,
            ICONS: {"select": "⬜", "bar": ["⬜", "⬛"]},
            COLOR: "#0151b0",
            COMPACTMODE: 0,
            HOMELAYOUT: 0,
            MENUSELECT: 0,
            GRIDNAME: 0
}
module.exports.invitationlist = ["Ascari", "Aston-Martin", "Bugatti", "Bvlgari", "Ferrari", "Koenigsegg", "Lamborghini", "McLaren", "Pagani", "Porsche", "Rimac"]

////////////////////////////
module.exports.defaultuserdata = function(id) {
  return { id: id,
          garage: [],
          settings: gtf_GTF.defaultsettings
         }
}
////////////////////////////

module.exports.checkRegulations = function (gtfcar, racesettings, func, embed, msg, userdata) {
  if (typeof racesettings["title"] !== 'undefined') {
    var title = racesettings["title"]
    var regulations = racesettings["regulations"]
    regulations["bop"] = racesettings["bop"]
  } else {
    var regulations = racesettings
    regulations["bop"] = true
    var title = "this event"
  }
  var car = gtf_CARS.get({ make: gtfcar["make"], fullname: gtfcar["name"]});


  var perf = gtf_PERF.perf(gtfcar, "GARAGE")

  var fpplimit = regulations["fpplimit"];
  var powerlimit = regulations["upperpower"];
  var weightlimit = regulations["upperweight"];
  var yearlimit = regulations["upperyear"];
  var minyearlimit = regulations["loweryear"];
  var minfpplimit = regulations["lowerfpp"];

  var makes = regulations["makes"];
  var models = regulations["models"];
  var types = regulations["types"];
  var countries = regulations["countries"];
  var drivetrains = regulations["drivetrains"];
  var engines = regulations["engines"];
  var specials = regulations["special"]
  var prohibiteds = regulations["prohibited"];

  var favorite = regulations["favorite"]

  if (typeof fpplimit === 'undefined') fpplimit = ""
  if (typeof powerlimit === 'undefined') powerlimit = ""
  if (typeof weightlimit === 'undefined') weightlimit = ""
  if (typeof yearlimit === 'undefined') yearlimit = ""
  if (typeof minyearlimit === 'undefined') minyearlimit = ""
  if (typeof minfpplimit === 'undefined' || !regulations["bop"]) minfpplimit = ""
  
  if (typeof makes === 'undefined') makes = []
  if (typeof models === 'undefined') models = []
  if (typeof types === 'undefined') types = []
  if (typeof countries === 'undefined') countries = []
  if (typeof drivetrains === 'undefined') drivetrains = []
  if (typeof engines === 'undefined') engines = []
  if (typeof specials === 'undefined') specials = []
  if (typeof prohibiteds === 'undefined') prohibiteds = []

  if (typeof favorite === 'undefined') favorite = false

  var fppexist = fpplimit != "";
  var powerexist = powerlimit != "";
  var weightexist = weightlimit != "";
  var yearexist = yearlimit != "";
  var minyearexist = minyearlimit != "";
  var minfppexist = minfpplimit != "";

  var makeexist = makes.length > 0;
  var modelexist = models.length > 0;
  var typeexist = types.length > 0;
  var countryexist = countries.length > 0;
  var dtexist = drivetrains.length > 0;
  var engineexist = engines.length > 0;
  var specialexist = specials.length > 0;
  var prohibitexist = prohibiteds.length > 0;

  var favoriteexist = favorite

  var errors = [];

  var fppsuccess = false;
  if (fppexist) {
    var fpp = gtfcar["fpp"];
    if (fpp <= fpplimit) {
      fppsuccess = true;
    }
    if (!fppsuccess) {
    errors.push("**FPP Limit:** " + "**" + fpp + "**" + gtf_EMOTE.fpp + " -> " + "**" + fpplimit + "**" + gtf_EMOTE.fpp);
  }
  }

  var powersuccess = false;
  if (powerexist) {
    var power = perf["power"];
    if (power <= powerlimit) {
      powersuccess = true;
    }
    if (!powersuccess) {
    errors.push("**Power Limit:** " + "**" + power + " HP**"+ " -> " + "**" + powerlimit + " HP**");
  }
  }

  var weightsuccess = false;
  if (weightexist) {
    var weight = perf["weight"];
    if (weight <= weightlimit) {
      weightsuccess = true;
    }
    if (!weightsuccess) {
    errors.push("**Weight Limit:** " + "**" + gtf_STATS.weightUser(weight, userdata) + "lbs" + "**"+ " -> " + "**" + weightlimit + "lbs" + "**");
  }
  }

  var yearsuccess = false;
  if (yearexist) {
    var year = car["year"];
    if (year <= yearlimit) {
      yearsuccess = true;
    }
    if (!yearsuccess) {
    errors.push("**Latest Model Year:** " + "**" + year + "**"+ " -> " + "**" + yearlimit + "**");
  }
  }

  var minyearsuccess = false;
  if (minyearexist) {
    var year = car["year"];
    if (year >= minyearlimit) {
      minyearsuccess = true;
    }
    if (!minyearsuccess) {
    errors.push("**Earliest Model Year:** " + "**" + year + "**"+ " -> " + "**" + minyearlimit + "**");
  }
  }

  var minfppsuccess = false
  if (minfppexist) {
    var fpp = gtfcar["fpp"];
    if (fpp >= minfpplimit) {
      minfppsuccess = true;
    }
    if (!minfppsuccess) {
    errors.push("**Minimum FPP:** " + "**" + fpp + "**" + gtf_EMOTE.fpp + " -> " + "**" + minfpplimit + "**" + gtf_EMOTE.fpp);
  }
  }

  var makesuccess = false;
  if (makeexist) {
    var index = 0;
    while (index < makes.length) {
      if ((makes[index].toLowerCase()).includes(car["make"].toLowerCase())) {
        makesuccess = true;
        break;
      }
      index++;
    }
    if (!makesuccess) {
      errors.push("**Makes:** " + car["make"] + " -> " + gtf_TOOLS.unique(makes).join(", "));
    }
  }

  var modelsuccess = false;
  if (modelexist) {
    var index = 0;
    while (index < models.length) {
      if ((car["name"].toLowerCase()).includes(models[index].toLowerCase())) {
        modelsuccess = true;
        break;
      }
      index++;
    }
    if (!modelsuccess) {
      errors.push("**Model:** " + car["name"] + " -> " + models.join(", "));
    }
  }

  var typesuccess = false;
  if (typeexist) {
    var index = 0;
    while (index < types.length) {
      if (car["type"].includes(types[index])) {
        typesuccess = true;
        break;
      }
      index++;
    }
    if (!typesuccess) {
      errors.push("**Type:** " + car["type"] + " -> " + types.join(", "));
    }
  }

  var countrysuccess = false;
  if (countryexist) {
    var index = 0;
    while (index < countries.length) {
      if (car["country"] == countries[index]) {
        countrysuccess = true;
        break;
      }
      index++;
    }
    if (!countrysuccess) {
      errors.push("**Country:** " + car["country"] + " -> " + countries.join(", "));
    }
  }

  var enginesuccess = false;
  if (engineexist) {
    var index = 0;
    while (index < engines.length) {
      if (car["engine"].includes(engines[index])) {
        enginesuccess = true;
        break;
      }
      index++;
    }
    if (!enginesuccess) {
      errors.push("**Engine Aspiration:** " + car["engine"] + " -> " + engines.join(", "));
    }
  }

  var dtsuccess = false;
  if (dtexist) {
    var index = 0;
    while (index < drivetrains.length) {
      if (car["drivetrain"].includes(drivetrains[index])) {
        dtsuccess = true;
        break;
      }
      index++;
    }
    if (!dtsuccess) {
      errors.push("**Drivetrain:** " + car["drivetrain"] + " -> " + drivetrains.join(", "));
    }
  }

  var specialsuccess = false;
  if (specialexist) {
    var index = 0;
    while (index < specials.length) {
      if (car["special"].includes(specials[index])) {
        specialsuccess = true;
        break;
      }
      index++;
    }
    if (!specialsuccess) {
      errors.push("**Special:** " + specials.join(", "));
    }
  }

  var prohibitsuccess = true;
  if (prohibitexist) {
    var index = 0;
    while (index < prohibiteds.length) {
      if (car["special"].includes(prohibiteds[index])) {
        prohibitsuccess = false;
        break;
      }
      index++;
    }
    if (!prohibitsuccess) {
      errors.push("**Prohibited:** " + prohibiteds.join(", "));
    }
  }


  var favoritesuccess = false;
  if (favoriteexist) {
      if (gtfcar["favorite"]) {
        favoritesuccess = true;
    }
    if (!favoritesuccess) {
      errors.push("**Favorite:** False");
    }
  }

  var conditionsuccess = false;
  if (gtf_CONDITION.condition(gtfcar)["health"] <= 20) {
        errors.push(gtf_EMOTE.cardead + " The car condition is **Bad** and must be repaired in GTF Auto.");
  }

  if (typeof func == "string") {
  if (errors.length == 0) {
    return [true, ""]
  } else {
    return [false, errors]
}
}

  if (errors.length == 0) {
    func()
    return true
  } else {

  var garagepage = 0;
  var hundredpage = 0

  var totallength = gtf_STATS.garage(userdata).length
  var gmenulist = []
  var gmenulistselect = []
  var gemojilist = [];
  var emojilist = []
  var namex = ""
  var menu = []
  var functionlist2 = []
  var buttons = []
  var args = {carselectmessage: false}


  //////
  var [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength] = gtf_GTF.garageMenu(regulations, func, args, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength], msg, embed, userdata)
  //////
if (gmenulist.length == 0) {
    
var emojilist = [
  { emoji: "🏢", 
  emoji_name: "🏢", 
  name: 'Recommended Cars', 
  extra: "",
  button_id: 0 }
]
  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
  embed.setColor(0x460000)
embed.setTitle("❌ Regulations Breached")
embed.setDescription("Your **" + gtfcar["name"] + "** does not meet the regulations for **" + title + "**." + "\n\n" + errors.join("\n") + "\n\n" + "**❗ None of your garage cars are eligible.**")
gtf_DISCORD.send(msg, {embeds:[embed], components: buttons}, func)
  function func(msg) {
    function gtfdealer() {
      require(gtf_TOOLS.homeDir() + "commands/car").execute(msg, {options: "select", 
manufacturer__custom: makes, 
                    type:types, 
                    drivetrain: drivetrains, 
                    engine: engines, 
                    special: specials, 
                    country: countries,
                    model: models, 
                    fpplimit: fpplimit,
                    powerlimit: powerlimit,
                    weightlimit:weightlimit,
                    title: title}, userdata);
      return
    }
  var functionlist = [gtfdealer]
  gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
  }
return
}
embed.setColor(0x460000)
embed.setTitle("❌ Regulations Breached")
embed.setDescription("Your **" + gtfcar["name"] + "** does not meet the regulations for **" + title + "**." + "\n\n" + errors.join("\n") + "\n\n" + "**❗ See the menu below for eligible cars in your garage.**")

 gtf_DISCORD.send(msg, { embeds:[embed], components: [menu]}, garagefunc)

 function garagefunc(msg) {
    [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength] = gtf_GTF.garageMenuFunctions(regulations, func, args, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength], msg, embed, userdata)
    gtf_TOOLS.createButtons(menu, emojilist, functionlist2, msg, userdata)
 }
    return false
}
}
module.exports.randomDriver = function() {
  var random_name = require('node-random-name');
var name = random_name({ random: Math.random, gender: "male" })
name = name.split(" ").map(function(x, index) {
  if (index == 0) {
    return x[0] + ". "
  } else {
    return x
  }
})
return name.join("")
}
module.exports.checkTireRegulations = function (gtfcar, regulations, func, embed, msg, userdata) {

  var tires = regulations["tires"]
  if (tires == "") {
    tires = "Racing: Soft"
  }

  var tireranking = {
    "Comfort: Hard": 1,
    "Comfort: Medium": 2,
    "Comfort: Soft": 3,
    "Sports: Hard": 4,
    "Sports: Medium": 5,
    "Sports: Soft": 6,
    "Racing: Hard": 7,
    "Racing: Intermediate": 7,
    "Racing: Heavy Wet": 7,
    "Racing: Medium": 8,
    "Racing: Soft": 9,
    "Rally: Snow": 10,
    "Rally: Dirt": 11
  }

 var uppertire = tireranking[tires]

var errors = [];

  var tiresuccess = false
  if (tires == "Rally: Dirt") {
        tiresuccess = gtfcar["perf"]["tires"]["current"].includes("Dirt")
    } else if (tires == "Rally: Snow") {
        tiresuccess = gtfcar["perf"]["tires"]["current"].includes("Snow")
    } else {
      tiresuccess = tireranking[gtfcar["perf"]["tires"]["current"]] <= uppertire
    }
    if (!tiresuccess) {
      errors.push("**Maximum Tire Grade:** " + gtfcar["perf"]["tires"]["current"] + " -> " + tires);
    }

if (typeof func === 'string') {
  if (errors.length == 0) {
    return [true, ""]
  } else {
    return [false, errors]
}
}
  if (errors.length == 0) {
    func()
    return true
  } else {
  var tireslist = gtfcar["perf"]["tires"]["list"].filter(function(tire) {
    return gtf_GTF.checkTireRegulations({
      perf: {
      tires: {current: tire}
      }
    }, regulations, "", embed, msg, userdata)[0]
  }).sort()
  var tmenulist = tireslist.map(function (tire, index) {
          return {
            emoji: "",
            name: tire,
            description: "",
            menu_id: (index)
            }
  })
  var temojilist = []
var menu = gtf_TOOLS.prepareMenu("Change Tires " + "(" + gtfcar["perf"]["tires"]["current"] + ")" , tmenulist, temojilist, msg, userdata);

if (tmenulist.length == 0) {
  
var emojilist = [
  { emoji: gtf_EMOTE.gtauto, 
  emoji_name: "gtauto", 
  name: 'GTF Auto - Tires', 
  extra: "",
  button_id: 0 }
]
  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
  
  embed.setColor(0x460000)
embed.setTitle("❌ Tires Prohibited")
embed.setDescription("Your **" + gtfcar["name"] + "** does not meet the regulations for this event." + "\n\n" + errors.join("\n") + "\n\n" + "**❗ There are no tires eligible.**")
gtf_DISCORD.send(msg, {embeds:[embed], components: buttons}, func)
  function func(msg) {
    function gtfautotires() {
      require(gtf_TOOLS.homeDir() +  "commands/tune").execute(msg, {options:"tires"}, userdata);
      return
    }
  var functionlist = [gtfautotires]
  gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
  }
return
}
embed.setColor(0x460000)
embed.setTitle("❌ Tires Prohibited")
embed.setDescription("Your **" + gtfcar["name"] + "** does not meet the regulations for this event." + "\n\n" + errors.join("\n") + "\n\n" + "**❗ See the menu below to change tires.**")

gtf_DISCORD.send(msg, {embeds:[embed], components: [menu]}, regfunc)

function regfunc(msg) {
    var functionlist = []
       for (var j = 0; j < tmenulist.length; j++) {
      functionlist.push(function(int) {
        gtfcar["perf"]["tires"]["current"] = tireslist[int]
        func()
        gtf_DISCORD.delete(msg, {seconds:2})
      })
      }
      gtf_TOOLS.createButtons(menu, temojilist, functionlist, msg, userdata)
 }
    return false;
  }
}
module.exports.loadingText = function (title, carname) {
  if (carname === undefined) {
    carname = "";
  } else if (carname != "") {
    carname = "\n\n🚘 " + "**" + carname + "**";
  }

  return title + "\n" + gtf_EMOTE.loading + " **Loading** " + gtf_EMOTE.loading + carname;
};
module.exports.garageMenu = function (regulations, func, args, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength], msg, embed, userdata) {
  var sorting = userdata["settings"]["GARAGESORT"]
  var filterlist = []
  filterlist = setfilter(filterlist, regulations, false)
  function setfilter(filterlist, regulations, favorite) {
    filterlist = []
    if (favorite) {
        filterlist.push(function (x) {return x["favorite"]})
    }
    if (typeof regulations !== 'string') {
      filterlist.push(function(x) {return gtf_GTF.checkRegulations(x, regulations, "", embed, msg, userdata)[0]})
    }
    return filterlist
  }
  var value = gtf_GTF.garageMenuCars(0, 100, regulations, filterlist, sorting, totallength, userdata)
  gmenulist = value[0]
  totallength = value[1]


  gmenulistselect = gmenulist.slice(22 * garagepage, 22 + 23 * garagepage);
  gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
    gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });
  gmenulistselect.push({
    emoji: "↪",
    name: "Next Page",
    description: "",
    menu_id: "NEXTPAGE",
  });
  namex = totallength + " Cars | " + "Car Select " + "(" + sorting + ")";
  if (args["carselectmessage"]) {
    namex = totallength + " Cars | " + "Car Select (Opens New Message)";
  }
  menu = gtf_TOOLS.prepareMenu(namex, gmenulistselect, gemojilist, msg, userdata);
  if (gmenulist.length != 0) {
    buttons.unshift(menu);
  }
  return [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength]
}
module.exports.garageMenuFunctions = function (regulations, func, args, [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength], msg, embed, userdata) {
  
    var sorting = userdata["settings"]["GARAGESORT"]
    var fav = false
    var filterlist = []

  filterlist = setfilter(filterlist, regulations, fav)
  function setfilter(filterlist, regulations, favorite) {
    filterlist = []
    if (favorite) {
        filterlist.push(function (x) {return x["favorite"]})
    }
    if (typeof regulations !== "string") {
     filterlist.push(function(x) {return gtf_GTF.checkRegulations(x, regulations, "", embed, msg, userdata)[0]})
    }
    return filterlist
  }


    for (var j = 0; j < gmenulist.length; j++) {
      functionlist2.push(function (int) {
        if (typeof args["nochange"] !== "undefined") {
          return
        }
        if (int == "FAVORITES") {
          if (!fav) {
            fav = true
          } else {
            fav = false
        }
          garagepage = 0
          hundredpage = 0
        filterlist = setfilter(filterlist, regulations, fav)

      var sig = gtf_GTF.garageMenuCars(100 * hundredpage, 100 * (hundredpage + 1), [], filterlist, sorting, totallength, userdata)
    gmenulist = sig[0]
    totallength = sig[1]

          if (gmenulist.length <= 0 + (23 * garagepage) - 1) {
            garagepage = 0;
          }


          gmenulistselect = gmenulist.slice((22 * garagepage), 22 + (23 * garagepage) - garagepage);
            gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
  gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });

          gmenulistselect.push({
            emoji: "↪",
            name: "Next Page",
            description: "",
            menu_id: "NEXTPAGE",
          });
          menu = gtf_TOOLS.prepareMenu(namex, gmenulistselect, gemojilist, msg, userdata);
          buttons[0] = menu;
          msg.edit({ components: buttons});
          return
        } else if (int == "NEXTPAGE") {
           garagepage++;
          filterlist = setfilter(filterlist, regulations, fav)
        if (22 * (garagepage) > totallength) {
          garagepage = 0
  }
          /*
          if (gmenulist.length <= (0 + (23 * garagepage) - 1)) {
            garagepage = 0;
          }
*/

          gmenulistselect = gmenulist.slice((22 * garagepage), 22 + (23 * garagepage) - garagepage);
            gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
            gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });
          gmenulistselect.push({
            emoji: "↪",
            name: "Next Page",
            description: "",
            menu_id: "NEXTPAGE",
          });
          menu = gtf_TOOLS.prepareMenu(namex, gmenulistselect, gemojilist, msg, userdata);
          buttons[0] = menu;
          msg.edit({ components: buttons});

          return;
        } else if (int == "PREVPAGE") {
          filterlist = setfilter(filterlist, regulations, fav)
          garagepage--;
          /*
gmenulist = []
while (gmenulist.length <= 0)
          */
          if (garagepage <= -1) {
            garagepage = Math.ceil(gmenulist.length / 22) - 1
          }


          gmenulistselect = gmenulist.slice((22 * garagepage), 22 + (23 * garagepage) - garagepage);
                      gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
            gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });
          gmenulistselect.push({
            emoji: "↪",
            name: "Next Page",
            description: "",
            menu_id: "NEXTPAGE",
          });
          var menu = gtf_TOOLS.prepareMenu(namex, gmenulistselect, gemojilist, msg, userdata);
          buttons[0] = menu;
          msg.edit({ components: buttons});
          return;
        }
        if (args["carselectmessage"]) {
          gmenulist = []
          var number = parseInt(int);

          filterlist = setfilter(filterlist, regulations, fav)
          gtf_STATS.setCurrentCar(
            number + 1 + (100 * hundredpage),filterlist,
            userdata
          );


          gtf_STATS.save(userdata);
          setTimeout(() => {
            require(gtf_TOOLS.homeDir() + "commands/" + args["command"]).execute(msg, args["oldquery"], userdata);
          }, 1000);
          return;
        } else {
          select = 0;
          index = 0;
          filterlist = setfilter(filterlist, regulations, fav)
          require(gtf_TOOLS.homeDir() + "commands/garage").execute(msg, { options: "select", number: int + 1 + (100 * hundredpage), filter: filterlist, extra: "silent" }, userdata);
          if (userdata["settings"]["GARAGESORT"] == "Recently Used") {
          gmenulist.some((item, index) => item["menu_id"] == (int) &&
  gmenulist.unshift(
    gmenulist.splice(index,1)[0]
  )
  )
  gmenulist = gmenulist.map(function(x, index) {
    x["description"] = "🚘" + (index + 1) + " " + x["description"].split(" ").slice(1).join(" ")
    x["menu_id"] = index
    return x
  })

  gmenulistselect = gmenulist.slice((22 * garagepage), 22 + (23 * garagepage) - garagepage)
    gmenulistselect.unshift({
    emoji: "↩",
    name: "Previous Page",
    description: "",
    menu_id: "PREVPAGE",
  });
              gmenulistselect.unshift({
    emoji: "⭐",
    name: "Toggle Favorite Cars",
    description: "",
    menu_id: "FAVORITES",
  });
  gmenulistselect.push({
            emoji: "↪",
            name: "Next Page",
            description: "",
            menu_id: "NEXTPAGE",
    });
          menu = gtf_TOOLS.prepareMenu(namex, gmenulistselect, gemojilist, msg, userdata);
          buttons[0] = menu;
        }
          embed.setFields([{name:gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }])
          msg.edit({embeds:[embed], components: buttons})
        }
        if (regulations.length == 0) {
        } else {
          func()
        }
      });
    }
    return [garagepage, gmenulist, gmenulistselect, gemojilist, namex, menu, functionlist2, buttons, hundredpage, totallength]
  }
module.exports.garageMenuCars = function (min, max, regulations, filterlist, sorting, totallength, userdata) {

  var garage = userdata["garage"].filter(x => filterlist.map(f => f(x)).every(p => p === true))
  totallength = garage.length


  return [garage.map(function (car, index) {
    var ocar = gtf_PERF.perf(car, "GARAGE")
    var health = gtf_CONDITION.condition(car)["health"]
    var favorite = car["favorite"] ? " ⭐" : ""

    var desc = "🚘" + (index+min+1) + " | " + health + "% " + ocar["fpp"] + "FPP" + " " + gtf_MATH.numFormat(ocar["power"]) + "hp" + " " + gtf_MATH.numFormat(gtf_STATS.weightUser(ocar["weight"], userdata)) + gtf_STATS.weightUnits(userdata) + favorite
    if (sorting.includes("Power")) {
      desc = "🚘" + (index + min + 1) + " | " + gtf_MATH.numFormat(ocar["power"]) + "hp" + " " + ocar["fpp"] + "FPP" + " " + gtf_MATH.numFormat(gtf_STATS.weightUser(ocar["weight"], userdata)) + gtf_STATS.weightUnits(userdata) + favorite
    }
    return {
      emoji: "",
      name: car["name"],
      description: desc,
      menu_id: index,
    }

}), totallength]
}

module.exports.lengthAlpha = function (fpp, weather, track) {
  var offroad = 1;
  if (track["type"].includes("Dirt") || track["type"].includes("Snow")) {
    offroad = 0.85;
  }
  if (typeof weather === "string") {
    weather = parseInt(weather.split(" ").pop());
    var weatherx = weather / 100;
  } else {
    var weatherx = parseFloat(weather["wetsurface"]);
    if (weatherx != 0) {
      weatherx = weatherx / 100;
    }
  }
//125
  var percentage = fpp / 1250;
  percentage = (100) * percentage + 90;
  return (percentage - weatherx * 40) * offroad;
};

module.exports.giftRoulette = function (title, results, prizes, special, embed, msg, userdata) {
  var count = prizes.length
  if (special == "silent") {
    index = Math.floor(Math.random() * count);
    if (prizes[index]["type"] == "CREDITS") {
      var item = prizes[index];

      return gtf_STATS.redeemGift("🎉 " + item["name"], item, embed, msg, userdata);
      } else if (prizes[index]["type"] == "CAR") {
      var item = prizes[index];

      return gtf_STATS.redeemGift("🎉 " + item["name"], item, embed, msg, userdata);
      } else if (prizes[index]["type"] == "RANDOMCAR") {
      var gift = prizes[index];
      gift = { id: -1, type: "CAR", name: gift["name"], item: gift["item"], author: "", inventory: false }
      
      return gtf_STATS.redeemGift("🎉 " + gift["name"], gift, embed, msg, userdata);
      }
  }
  var select = []
  embed.fields = [];
  embed.setTitle("__" + title + "__");

  embed.setDescription(results);
  gtf_DISCORD.send(msg, {embeds:[embed]}, giftsfunc)

  function giftsfunc(msg) {
    var index = 0;
    
    var results1 = function (index) {
      var list = []
      for (var j = 0; j < count; j++) {
       var emote = (j == index) ? gtf_EMOTE.rightarrow : gtf_EMOTE.transparent
      list.push(emote + " ||" + prizes[j]["name"] + "||") 
      }
      return list.join("\n")
    };

    gtf_TOOLS.interval(
      function () {
        index = Math.floor(Math.random() * count);
        var final = results1(index);
        embed.setDescription(final);
        msg.edit({embeds: [embed]});
      },
      2000,
      4
    );

    setTimeout(function () {
    if (prizes[index]["type"] == "CREDITS") {
      var item = prizes[index];

      gtf_STATS.redeemGift("🎉 " + item["name"], item, embed, msg, userdata);
      } else if (prizes[index]["type"] == "CAR") {
      var item = prizes[index];

      gtf_STATS.redeemGift("🎉 " + item["name"], item, embed, msg, userdata);
      } else if (prizes[index]["type"] == "RANDOMCAR") {
      var gift = prizes[index];
      gift = { id: -1, type: "CAR", name: gift["name"], item: gift["item"], author: "", inventory: false }
      gtf_STATS.redeemGift("🎉 " + gift["name"], gift, embed, msg, userdata);
      }
    }, 9000);
  }
};

module.exports.giftRouletteEnthu = function (finalgrid, racesettings, embed, msg, userdata) {
  //finalgrid = finalgrid.sort()
  var indexes = []
  for (var i = 0; i < finalgrid.length; i++) {
  if (gtf_CARS.checkCar(finalgrid[i]["name"], userdata) != " ✅") {
    indexes.push(i)
  }
  }

  var select = []
  var embed = new EmbedBuilder();
  var results1 = function (index) {
    var list = []
    for (var j = 0; j < finalgrid.length; j++) {
      if (j == index) {
        list.push("⬜" + " __" + finalgrid[j]["name"] + "__") 
      } else {
        if (indexes.includes(j)) {
      list.push(gtf_EMOTE.transparent + " " + finalgrid[j]["name"]) 
        } else {
          list.push(" ||" + gtf_EMOTE.transparent + " " + finalgrid[j]["name"] + "||") 
        }
      }


    }
    return list.join("\n")
  };

  index = gtf_TOOLS.randomItem(indexes)
  var final = results1(index);
  embed.setDescription(final);
  embed.setTitle("__Rival Car Raffle__")
  gtf_DISCORD.send(msg, {embeds:[embed]}, giftsfunc)

  function giftsfunc(msg) {
    var index = 0;
    var reveal = 0

    gtf_TOOLS.interval(
      function () {
        reveal++
        index = gtf_TOOLS.randomItem(indexes)
        if (gtf_MATH.randomInt(1, indexes) == 1) {
          index = -1
        } 
        var final = results1(index);
        embed.setDescription(final);
        msg.edit({embeds: [embed]});
      },
      2000,
      5
    );

    setTimeout(function () {
      if (index == -1) {
         embed.setTitle("__NO CARS UNLOCKED...__");

           var emojilist = [
        { emoji: "⭐", 
        emoji_name: "⭐", 
        name: 'OK', 
        extra: "",
        button_id: 0 }
        ]

        var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
              gtf_STATS.saveEnthu(userdata);
           gtf_DISCORD.edit(msg, {embeds:[embed], components:buttons}, func)

           function func(msg) {
            function ok() {
              gtf_GTF.resultsSummaryEnthu(racesettings, finalgrid, embed, msg, userdata)
            }

            var functionlist = [ok]
            gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
          }
        return
      }
      var item = finalgrid[index];
      var car = gtf_CARS.find({fullnames: [item["name"]]})[0]
      gte_CARS.addCarEnthu(car, "SORT", userdata);
      embed.setDescription("You can now select a new car!" + "\n" + "**" + item["name"] + "**")
      embed.setImage(car["image"][0]);
      embed.setTitle("__CAR UNLOCKED!__");

       var emojilist = [
  { emoji: "⭐", 
  emoji_name: "⭐", 
  name: 'OK', 
  extra: "",
  button_id: 0 }
]

var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
          gtf_STATS.saveEnthu(userdata);
       gtf_DISCORD.edit(msg, {embeds:[embed], components:buttons}, func)

       function func(msg) {
        function ok() {
          gtf_GTF.resultsSummaryEnthu(racesettings, finalgrid, embed, msg, userdata)
        }

        var functionlist = [ok]
        gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
      }
    }, 11000);
  }
};

module.exports.resultsSummaryEnthu = function (finalgrid, racesettings, embed, msg, userdata) {
  var embed = new EmbedBuilder();
  var history = gtf_STATS.rankingHistory(userdata)
  var latestrace = history[0]
  var enthupointso = parseInt(userdata["enthupoints"])

  var carlevelup = gtf_STATS.checkTuningLevel(userdata)
  gtf_STATS.checkRanking(userdata)
  //recoveryrate
  var recoverypoints = 60 + (3 * (userdata["level"]-1))
  gtf_STATS.addEnthuPoints(recoverypoints, userdata)

  if (carlevelup[0]) {
    var carstats = "**Car:** Tuning Lv Up! " + "`Lv." + carlevelup[1] + "` -> `Lv." + carlevelup[2] + "`\n" +
    carlevelup[3].join("\n")
  } else {
    var carstats = "**Car:** " + carlevelup[4] + " pts"
  }

  var list = history.map(x => "Week " + x["week"] + " ---------- " + x["points"] + "pts").slice(1).slice(-12)
  embed.setDescription(list.join("\n") + "\n\n" + 
  "**Total:** " + latestrace["skillpoints"] + "pts" + "\n" + 
 carstats + "\n" + 
"**Enthu Points:** " + "Recovered **" + recoverypoints + " Enthu Points.**" 

  );

   var emojilist = [
  { emoji: "⭐", 
  emoji_name: "⭐", 
  name: 'OK', 
  extra: "",
  button_id: 0 }
]

var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
   gtf_STATS.saveEnthu(userdata);
  gtf_STATS.loadAvatarImage2(embed, userdata, then2)
  function then2(attachment)
  {
    var files = [attachment];
    embed.setImage("attachment://bimage.png");

  gtf_DISCORD.send(msg, {embeds:[embed], components: buttons, files: files}, func)
  }

  function func(msg) {
        function ok() {
          require(gtf_TOOLS.homeDir() + "commands/enthusialife").execute(msg, {options:"list"}, userdata)
        }

        var functionlist = [ok]
        gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
      }
}
