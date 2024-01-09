//REMOTE
///BOT
global.gtf_USERID = "1048417017083994142";
global.gtf_SERVERID = "239493425131552778";
///

var home = (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/"
global.gtf_CONSOLELOG = require(home + "files/colors")

global.gtf_WEATHER = require(home + "data/gtfweather");
global.gtf_TIME = require(home + "data/gtftime");
global.gtf_CAREERRACES = require(home + "data/gtfcareerlist");
global.gtf_FITHUSIMRACES = require(home + "data/gtfcareerlist");
global.gtf_CARS = require(home + "data/gtfcarlist");
global.gtf_TRACKS = require(home + "data/gtftracklist");
global.gtf_PARTS = require(home + "data/gtfpartlist");
global.gtf_PAINTS = require(home + "data/gtfpaintlist");
global.gtf_WHEELS = require(home + "data/gtfwheellist");
global.gtf_ANNOUNCER = require(home + "data/gtfannouncer");

global.gtf_GTFAUTO = require(home + "functions/gtfauto/f_gtfauto");
global.gtf_PERF = require(home + "functions/gtfauto/f_perf");
global.gtf_CONDITION = require(home + "functions/gtfauto/f_condition");

global.gtf_RACE = require(home + "functions/races/f_races");
global.gtf_RACES2 = require(home + "functions/races/f_races_2");
global.gtf_RACEEX = require(home + "functions/races/f_races_2ex");
global.gtf_SEASONAL = require(home + "functions/races/f_seasonals");
global.gtf_GTF = require(home + "functions/f_gtf");
///GTF2U
global.gtf_LOBBY = require(home + "functions/lobbies/f_lobby");
global.gtf_COURSEMAKER = require(home + "functions/coursemaker/f_course");
///

global.gtf_LISTS = require(home + "index");
global.gtf_MAIN = require(home + "index");
global.gtf_EMBED = require(home + "functions/misc/f_embeds");

global.gtf_EXP = require(home + "data/gtfexp");
global.gtf_DATETIME = require(home + "functions/misc/f_datetime");
global.gtf_MATH = require(home + "functions/misc/f_math");
global.gtf_DISCORD = require(home + "functions/misc/f_discord");
global.gtf_SLASHCOMMANDS = require(home + "functions/misc/f_slashcommands");

global.gtf_SETTINGS = require(home + "functions/profile/f_settings");
global.gtf_STATS = require(home + "functions/profile/f_stats");
global.gtf_TOOLS = require(home + "functions/misc/f_tools");


global.gtf_EMOTE = {
  "update": "<:update:419605168510992394>",
  "gtflogo": "<:gtfitness:912928750851752016>",
  "flag": "<:flag:646244286635180033>",
  "pdiflag": "<:pdiflag:1115883619106431036>",
  "transparent": "<:t_:666878765552369684>",

  "engine": "<:engine:1124591624203280434>",
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
  "dailyworkoutman":"<a:dailyworkout_running:1048879274175774770>",
  "tire": "<:tire:805367277482409994>",
  "pit": "<:pit:1136465788006563890>",

  "blicense": "<:blicense:1057907828184064081>",
  "alicense": "<:alicense:1057907826565054514>",
  "iclicense": "<:iclicense:1057907837696737282>",
  "iblicense": "<:iblicense:1057907835566035065>",
  "ialicense": "<:ialicense:1057907831191371836>",
  "slicense": "<:slicense:1057907840452399166>",

  "jimmyb": "<:jimmybroadbent:902648416490909767>",
  "igorf": "<:igorfraga:975236447709827092>",
  "sebastienl": "<:sebastienloeb:1149596208088760401>",
  "lewish": "<:lewis_hamilton:1039971967660462150>",
  "jamesp": "<:jamespumphrey:1156738646519599124>",
  "jannm": "<:jannmardenborough:1132135599629946961>",

  "gtlogowhite": "<:gtlogowhite:682139679919046667>",
  "gtlogoblue":"<a:gtflogoa:485339455339888640>",
  "lobby": "<:lobby:919657582149402684>",
  "gt6progressbar": "<:gt6loading:905512462542045235>",
  "gt6progressbarblack": "<:gt6loadingblack:905512462319775755>",
  "gt6tpe": "<:gt6tpe:1181767025140441208>",
  "gt7": "<:gt7:733154449715101776>",
"gtsophy": "<:sophy:941456067420909568>",
  "fithusimlogo": "<:fithusimlogo:1181390401769328681>",
  "enthudrgreenmarker": "<:drgreenmarker:1174590945845592094>",
  "enthudrorangemarker": "<:drorangemarker:1174590947804328006>",
    "enthuoffcourse": "<:offcourse:1171656980415385641>",
    "enthucollisionwall": "<:collisionwall:1171656978884468806>",
    "enthucollisioncar": "<:collisioncar:1171656976221081701>"
}