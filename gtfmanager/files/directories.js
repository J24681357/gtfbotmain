///BOT
global.gtm_USERID = "709276654601633934";
global.gtm_SERVERID = "239493425131552778";
///
var home = (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/"

global.gtm_TOOLS = require(home + "functions/misc/f_tools");

module.exports.defaultsettings = {
  MODE: "Simulation",
  GARAGESORT: "Oldest Added",
  DEALERSORT: "Lowest Price",
  RACEDM: 0,
  UNITS: 0,
  TIMEOFFSET: 0,
  TIPS: 0,
  ICONS: { "select": "⬜", "bar": ["⬜", "⬛"] },
  COLOR: "#0151b0",
  COMPACTMODE: 0,
  HOMELAYOUT: 0,
  MENUSELECT: 0,
  GRIDNAME: 0
}

global.gtm_CARS = require(home + "data/gtfcarlist");
global.gtm_TRACKS = require(home + "data/gtftracklist");

global.gtm_LISTS = require(home + "index");
global.gtm_MAIN = require(home + "index");

global.gtm_SLASHCOMMANDS = require(home + "functions/misc/f_slashcommands");
global.gtm_EXTRA = require(home + "functions/misc/f_extras");

global.gtm_MAIN = require(home + "index");

global.gtm_TOOLS = require(home + "functions/misc/f_tools");

global.gtm_defaultsettings = {
  MODE: "Simulation",
  GARAGESORT: "Oldest Added",
  DEALERSORT: "Lowest Price",
  RACEDM: 0,
  UNITS: 0,
  TIMEOFFSET: 0,
  TIPS: 0,
  ICONS: { "select": "⬜", "bar": ["⬜", "⬛"] },
  COLOR: "#0151b0",
  COMPACTMODE: 0,
  HOMELAYOUT: 0,
  MENUSELECT: 0,
  GRIDNAME: 0
}

global.gtm_EMOTE = {
  "update": "<:update:419605168510992394>",
  "gtflogo": "<:gtfitness:912928750851752016>",
  "flag": "<:flag:646244286635180033>",
  "pdiflag": "<:pdiflag:1115883619106431036>",
  "transparent": "<:t_:666878765552369684>",


  "aero": "<:aerowing:917615553852620850>",
  "paint": "<:gtfpaint:934686343416643584>",
  "livery": "<:livery:1032388666082983946>",

  "redlightb": "<:shadedredlight:638944391112818718>",
  "yellowlightb": "<:shadedyellowlight:638944449971617822>",
  "greenlightb": "<:shadedgreenlight:638944423056506880>",
  "redlight": "<:redlight:638944403964035072>",
  "yellowlight": "<:yellowlight:638944464853008404>",
  "greenlight": "<:greenlight:638944437996617728>",

  "leftarrow": "<:leftarrow:973817070351417415>",
  "rightarrow": "<:rightarrow:973817070301118465>",
  "uparrow": "<:uparrow:973817070070427689>",
  "downarrow": "<:downarrow:973817070267539496>",
  "yes": "<:Yes:973817070418554881>",
  "exit": "<:exit:670134165806514206>",
  "google": "<:google:923485130490785802>",

  "upvote": "<:upvote:1011755439668613230>",
  "middlevote": "<:middlevote:1011753293455835277>",
  "downvote": "<:downvote:1011753294760251503>",


  "goldmedal": "<:gold:683881057589657650>",
  "silvermedal": "<:silver:672660378047741982>",
  "bronzemedal": "<:bronze:672715512937054208>",
  "platinummedal": "<:platinum:683880404855291918>",

  "driftflag": "<:driftflag:701499692877611139>",
  "loading": "<a:gtfloading:695112393021325392>",
  "bop": "<:bop:908564536989200417>",
  "weather": "<:dynamicweather:991956491479298092>",
  "tracklogo": "<:trackgtfitness:647254741990244372>",
  "cargrid": "<:gtfcargrid:906447596632014859>",

  "carexcellent": "<:car_condition_excellent:1048864552038699008>",
  "carnormal": "<:car_condition_normal:1048864550461648956>",
  "carworn": "<:car_condition_worn:1048864548997845002>",
  "carbad": "<:car_condition_bad:1048864547047481356>",
  "cardead": "<:car_condition_dead:1048864545826951208>",

  "gtauto": "<:gtauto:1050304598780428329>",

  "slowdown1": "<:slow_down_1:816068685717438485>",
  "slowdown2": "<:slow_down_2:816068685688209419>",


  "credits": "<:credits:1064742859519033465>",
  "exp": "<:experience:1064743342157598731>",
  "mileage": "<:mileage:1064742856624971776>",
  "fpp": "<:fpp:1030148104680382494>",
  "dailyworkout": "<:dailyworkout:895858086697390241>",
  "dailyworkoutman": "<a:dailyworkout_running:1048879274175774770>",
  "tire": "<:tire:805367277482409994>",

  "blicense": "<:blicense:1057907828184064081>",
  "alicense": "<:alicense:1057907826565054514>",
  "iclicense": "<:iclicense:1057907837696737282>",
  "iblicense": "<:iblicense:1057907835566035065>",
  "ialicense": "<:ialicense:1057907831191371836>",
  "slicense": "<:slicense:1057907840452399166>",

  "jimmyb": "<:jimmybroadbent:902648416490909767>",
  "igorf": "<:igorfraga:975236447709827092>",
  "lewish": "<:lewis_hamilton:1039971967660462150>",
  "hi": "<:hi:434455411408502784>",

  "gtlogowhite": "<:gtlogowhite:682139679919046667>",
  "gtlogoblue": "<a:gtflogoa:485339455339888640>",
  "lobby": "<:lobby:919657582149402684>",

  "brake": "<:brake:887861123158794281>",

  "gt6progressbar": "<:gt6loading:905512462542045235>",
  "gt6progressbarblack": "<:gt6loadingblack:905512462319775755>",
  "gt6tpe": "<:gt6tpe:1181767025140441208>",
  "gt7": "<:gt7:733154449715101776>",
  "gtsophy": "<:sophy:941456067420909568>"
}