///BOT
global.gtm_USERID = "709276654601633934";
global.gtm_SERVERID = "239493425131552778";
///
var fs = require("fs")

var home = (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtffithusim") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/"

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
///LISTS
global.gtm_LIST_BOT = JSON.parse(fs.readFileSync( home + "jsonfiles/_botconfig.json", "utf8"));
global.gtm_LIST_COTD = JSON.parse(fs.readFileSync( home + "jsonfiles/carofthedaylist.json", "utf8"));
global.gtm_LIST_LOTW = JSON.parse(fs.readFileSync( home + "jsonfiles/locationoftheweeklist.json", "utf8"));

global.gtm_SLASHCOMMANDS = require(home + "functions/misc/f_slashcommands");
global.gtm_EXTRA = require(home + "functions/misc/f_extras");
global.gtm_TOOLS = require(home + "functions/misc/f_tools");

var locations = gtf_TOOLS.unique(gtf_TRACKS.find({}).map(function(x) {
  x = x["name"].split(" - ")[0].split(" (")[0].replace(" Reverse", "")
  return x
}))

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