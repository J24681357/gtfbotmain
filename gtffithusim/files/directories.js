//REMOTE
///BOT
global.gte_USERID = "1119872679722352714";
global.gte_SERVERID = "919656943595974716";
///
var fs = require("fs");

var home =
  (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtffithusim")
    ? __dirname.split("/").slice(0, 4).join("/") + "/"
    : __dirname.split("/").slice(0, 5).join("/") + "/";

global.gte_FITHUSIMRACES = require(home + "data/gtfcareerlist");
global.gte_PARTS = require(home + "data/gtfpartlist");
global.gte_CARS = require(home + "data/gtfcarlist");

global.gte_PERF = require(home + "functions/gtfauto/f_perf");
global.gte_CONDITION = require(home + "functions/gtfauto/f_condition");

global.gte_RACE = require(home + "functions/races/f_races");

global.gte_RACES2 = require(home + "functions/races/f_races_2");
global.gte_RACEEX = require(home + "functions/races/f_races_2ex");
global.gte_GTF = require(home + "functions/f_gtf");

global.gte_LISTS = require(home + "index");
global.gte_LIST_BOT = JSON.parse(fs.readFileSync(home + "jsonfiles/_botconfig.json", "utf8"));
global.gte_LIST_PARTS = JSON.parse(fs.readFileSync(home + "jsonfiles/gtfpartlist.json", "utf8"));
global.gte_LIST_MESSAGES = JSON.parse(fs.readFileSync(home + "jsonfiles/gtfmessages.json", "utf8"));
global.gte_LIST_FITHUSIMRACES = JSON.parse(fs.readFileSync(home + "jsonfiles/fithusimraces.json", "utf8"));
global.gte_LIST_DRRACES = JSON.parse(fs.readFileSync(home + "jsonfiles/drraces.json", "utf8"));

global.gte_EMBED = require(home + "functions/misc/f_embeds");

global.gte_EXP = require(home + "data/gtfexp");
global.gte_DATETIME = require(home + "functions/misc/f_datetime");
global.gte_SLASHCOMMANDS = require(home + "functions/misc/f_slashcommands");

global.gte_SETTINGS = require(home + "functions/profile/f_settings");

global.gte_STATS = require(home + "functions/profile/f_stats");

global.gte_TOOLS = require(home + "functions/misc/f_tools");
