///BOT
global.gtm_USERID = "709276654601633934";
global.gtm_SERVERID = "239493425131552778";
///
var home = (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/"

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
