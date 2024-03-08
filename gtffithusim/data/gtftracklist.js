// REMOTE
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.findEnthu = function (args) {
  if (args === undefined) {
    return "";
  }
  var total = Object.keys(args).length;
  var enthulist = [
      'Alsace - Test Course',
      'Alsace - Test Course Reverse',
      'Alsace - Village',
      'Alsace - Village Reverse',
      'Apricot Hill Raceway',
      'Apricot Hill Raceway Reverse',
      'Autodrome Lago Maggiore - Center',
      'Autodrome Lago Maggiore - Center Reverse',
      'Autodrome Lago Maggiore - East',
      'Autodrome Lago Maggiore - East End',
      'Autodrome Lago Maggiore - East End Reverse',
      'Autodrome Lago Maggiore - East Reverse',
      'Autodrome Lago Maggiore - GP',
      'Autodrome Lago Maggiore - GP Reverse',
      'Autodrome Lago Maggiore - West',
      'Autodrome Lago Maggiore - West End',
      'Autodrome Lago Maggiore - West End Reverse',
      'Autodrome Lago Maggiore - West Reverse',
      'Autumn Ring',
      'Autumn Ring - Mini',
      'Autumn Ring - Mini Reverse',
      'Autumn Ring Reverse',
      'Blue Moon Bay Speedway',
      'Blue Moon Bay Speedway - Infield A',
      'Blue Moon Bay Speedway - Infield A Reverse',
      'Blue Moon Bay Speedway - Infield B',
      'Blue Moon Bay Speedway - Infield B Reverse',
      'Blue Moon Bay Speedway Reverse',
      'Cape Ring',
      'Cape Ring - Inside',
      'Cape Ring - North',
      'Cape Ring - Periphery',
      'Cape Ring - South',
      'Circuit de Sainte-Croix - A',
      'Circuit de Sainte-Croix - A Reverse',
      'Circuit de Sainte-Croix - B',
      'Circuit de Sainte-Croix - B Reverse',
      'Circuit de Sainte-Croix - C',
      'Circuit de Sainte-Croix - C Reverse',
      'Complex String',
      'Deep Forest Raceway',
      'Deep Forest Raceway Reverse',
      'Dragon Trail - Gardens',
      'Dragon Trail - Gardens Reverse',
      'Dragon Trail - Seaside',
      'Dragon Trail - Seaside Reverse',
      'Driving Park - Beginner Course',
      'Driving Park - Motorland',
      'Driving Park - Test Course',
      'Eiger Nordwand - Short Track',
      'Eiger Nordwand - Short Track Reverse',
      'El Capitan',
      'Gran Turismo Arena',
      'Gran Turismo Arena Reverse',
      'Grand Valley - East',
      'Grand Valley - East Reverse',
      'Grand Valley - Highway 1',
      'Grand Valley - Highway 1 Reverse',
      'Grand Valley - South',
      'Grand Valley - South Reverse',
      'Grand Valley - Speedway',
      'Grand Valley - Speedway Reverse',
      'Grindelwald',
      'High Speed Ring',
      'High Speed Ring Reverse',
      'Kyoto Driving Park - Full Course',
      'Kyoto Driving Park - Full Course Reverse',
      'Kyoto Driving Park - Miyabi',
      'Kyoto Driving Park - Yamagiwa',
      'Kyoto Driving Park - Yamagiwa Reverse',
      'Matterhorn - Dristelen',
      'Matterhorn - Riffelsee',
      'Matterhorn - Rotenboden',
      'Matterhorn - Short',
      'Mid-Field Raceway',
      'Mid-Field Raceway Reverse',
      'Red Rock Valley Speedway',
      'Sardegna - Road Track A',
      'Sardegna - Road Track A Reverse',
      'Sardegna - Road Track B',
      'Sardegna - Road Track B Reverse',
      'Sardegna - Road Track C',
      'Sardegna - Road Track C Reverse',
      'Special Stage Route 11',
      'Special Stage Route 7',
      'Super Speedway',
      'Tahiti Road',
      'Trial Mountain Circuit',
      'Trial Mountain Circuit Reverse',
      'Circuito de Madrid',
      'Circuito de Madrid - Mini',
      'Circuito de Madrid - Mini Reverse',
      'Circuito de Madrid Reverse',
      'Circuito di Roma',
      'Citta di Aria',
      'Costa di Amalfi',
      "Cote d'Azur",
      'George V Paris',
      'Hong Kong Circuit',
      'London Circuit',
      'London Circuit Reverse',
      'New York Circuit',
      'Opera Paris',
      'Rome Circuit',
      'Seattle - Long Circuit',
      'Seattle - Short Circuit',
      'Seoul Central',
      'Special Stage Route 5',
      'Special Stage Route 5 - Clubman',
      'Special Stage Route 5 - Clubman Reverse',
      'Special Stage Route 5 Reverse',
      'Tokyo Expressway - Central Clockwise',
      'Tokyo Expressway - Central Counterclockwise',
      'Tokyo Expressway - East Clockwise',
      'Tokyo Expressway - East Counterclockwise',
      'Tokyo Expressway - South Clockwise',
      'Tokyo Expressway - South Counterclockwise',
      'Tokyo R246',
      'Tokyo R246 Reverse',
      'Colorado Springs - Lake',
      'Colorado Springs - Lake Reverse',
      'Fishermans Ranch',
      'Fishermans Ranch Reverse',
      'Sardegna - Windmills',
      'Sardegna - Windmills Reverse',
      'Toscana',
      'Toscana Reverse',
      'Chamonix - East',
      'Chamonix - Main',
      'Chamonix - Mini',
      'Chamonix - West',
      'Chamonix (2000s)',
      'Lake Louise - Long Track',
      'Lake Louise - Long Track Reverse',
      'Lake Louise - Short Track',
      'Lake Louise - Short Track Reverse',
      'Tsukuba Circuit',
      'Suzuka Circuit',
      'Fuji International Speedway',
      'Indianapolis - Motor Speedway',
      'Nurburgring - Nordschleife',
    ]
  var gtftracks = Object.fromEntries(Object.entries(gtf_LIST_TRACKS).filter(x => enthulist.includes(x[1]["name"])))
  var final = [];
  var ids = Object.keys(gtftracks);

  for (var key = 0; key < ids.length; key++) {
    var track = gtftracks[ids[key]];

    var count = 0;

    if (args["id"] !== undefined) {
      if (args["id"].length == 0) {
        count++;
      } else {
        var numbers = args["id"];
        for (var inumber = 0; inumber < numbers.length; inumbers++) {
          if (parseInt(ids[key]) == parseInt(numbers[inumbers])) {
            count++;
            break;
          }
        }
      }
    }

    if (args["name"] !== undefined) {
      if (args["name"].length == 0) {
        count++;
      } else {
        var names = args["name"];
        for (var iname = 0; iname < names.length; iname++) {
          if (track["name"] == names[iname]) {
            count++;
            break;
          }
        }
      }
    }

    if (args["names"] !== undefined) {
      if (args["names"].length == 0) {
        count++;
      } else {
        var namess = args["names"];
        for (var inames = 0; inames < namess.length; inames++) {
          if (track["name"].includes(namess[inames])) {
            count++;
            break;
          }
        }
      }
    }

    if (args["upperlength"] !== undefined) {
        if (args["upperlength"].length == 0) {
          count++;
        } else {
          var upperlength = args["upperlength"];
          var x = track["length"]
          if (x <= upperlength) {
            count++;
          }
        }
      }
    if (args["lowerlength"] !== undefined) {
        if (args["lowerlength"].length == 0) {
          count++;
        } else {
          var lowerlength = args["lowerlength"];
          var x = track["length"]
          if (x >= lowerlength) {
            count++;
          }
        }
      }

    if (args["options"] !== undefined) {
      if (args["options"].length == 0) {
        count++;
      } else {
        var options = args["options"];
        for (var ioption = 0; ioption < options.length; ioption++) {
          if (track["options"].includes(options[ioption])) {
            count++;
            break;
          }
        }
      }
    }

    if (args["types"] !== undefined) {
      if (args["types"].length == 0) {
        count++;
      } else {
        var types = args["types"];
        for (var itype = 0; itype < types.length; itype++) {
          if (track["type"].includes(types[itype])) {
            count++;
            break;
          }
        }
      }
    }

    if (args["versions"] !== undefined) {
      if (args["versions"].length == 0) {
        count++;
      } else {
        var versions = args["versions"];
        for (var iversion = 0; iversion < versions.length; iversion++) {
          if (track["version"].includes(versions[iversion])) {
            count++;
            break;
          }
        }
      }
    }

    if (count == total) {
      final.unshift(track);
    }
  }
  if (final.length == 0) {
    return "";
  }
  var id = 1;
  final.map(function (x) {
    x["id"] = id;
    id++;
  });
  final.sort(function (a, b) {
    return a["name"].toString().localeCompare(b["name"]);
  });

  return JSON.parse(JSON.stringify(final));
};

module.exports.randomEnthu = function (args, num) {
  var seed = -1
  if (typeof args["seed"] !== "undefined") {
    seed = args["seed"]
    delete args["seed"]
  }
  var rlist = [];
  var list = gte_TRACKS.findEnthu(args);
  for (var i = 0; i < num; i++) {
    if (seed == -1) {
    rlist.push(list[Math.floor(Math.random() * list.length)]);
    } else {
      rlist.push(list[gtf_MATH.randomIntSeed(0, list.length-1, seed+i)])
    }
  }
  args["seed"] = seed
  return rlist;
};
