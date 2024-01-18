//REMOTE 12182023
const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.intro = function (userdata, command, msg) {
  if (["dw", "dw4", "rcar", "rtrack", "rcourse", "gtf", "sr"].indexOf(command) + 1) {
    return "COMMAND";
  }

  if (typeof userdata["tutorial"] !== undefined) {
    if (userdata["tutorial"] == "Complete") {
      return "SUCCESS";
    } else {
      return doit();
    }
  } else {
    return doit();
  }

  function doit() {
    var embed = new EmbedBuilder();
    var author = msg.author;
    var userid = msg.author.id;
    var user = msg.author.displayName;
    var avatar = msg.author.displayAvatarURL();

    embed.setColor(0x800080);
    embed.setAuthor({name: user, iconURL: avatar});

    embed.setTitle("⚠️ __**" + "Before You Start" + "**__ ⚠️");
    embed.setThumbnail("https://github.com/J24681357/gtfbot2unleahsed/raw/master/images/logo/gtfgamelogo.png");
    embed.setDescription("Welcome to the world of GT Fitness! This is the second release codenamed Unleahsed!\n\nYou may start on your career and find other cool features by using **/home** or looking through the slash commands for the GTF bot." + "\n\n" + 
    "You will be given your first car; you can check it out in your garage (**/garage**)! You can participate in many other events such as Career (**/career**) & Arcade (**/arcade**). You can unlock modes along the way as a GTF driver." + "\n\n" + 
    "There is a manual for the GTF game. Click the link button below to access it!" +
    "\n\n**❗ Click the " + gtf_EMOTE.fithusimlogo + " button to complete the setup.**");


     var emojilist = [{ emoji: gtf_EMOTE.fithusimlogo, 
  emoji_name: "fithusimlogo", 
  name: '', 
  extra: "Once",
  button_id: 0 },
  { emoji: gtf_EMOTE.gtlogoblue,
  emoji_name: "gtlogoblue",
  name: 'Manual',
  extra: "https://j24681357.github.io/gtfbot2unleahsed/",
  button_id: 1 }             
  ]
    var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);
  gtf_DISCORD.send(msg, {embeds:[embed], components: buttons}, startfunc)


    function startfunc(msg) {
      var i = 0;
      async function complete() {
        var types = ["n", "b", "a", "ic", "ib", "ia", "s"]
        var career = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 21; j++) {
            career[types[i] + "-" + j] = [0,0,0,0,0,0,0,0,0,0]
          }
        }

        var types = ["b", "a", "ic", "ib", "ia", "s"]
        var licenses = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 11; j++) {
            licenses[types[i] + "-" + j] = [0,0,0,0,0,0,0,0,0,0]
          }
        }

        userdata = {
          id: userid,
          credits: 10000,
          exp: 0,
          license: "N", 
          level: 1,
          mileage: 0,
          totalmileage: 0,
          totaldriftpoints: 0,
          totalplaytime: 0,
          garage: [],
          currentcar: 0,
          dailyworkout: {status:false, endurance:false},       
          racemulti: 1,

          count: 0,
          stats: {
            numcarpurchases: 0,
            numgifts: 0,
            numcourses: 0,
            numraces: 0,
            numarcaderaces: 0,
            numwins: 0,
            numparts: 0,
          },
          items: [],
          gifts: [],
          messages: {},
          lastonline: "START",
          seasonalcheck: "",
          driver: {
            helmettype: 0,
            helmetcolor: "White",
            visorcolor: "Black",
            helmetlogo1: "",
            helmetlogo2: "",
            helmetlogo3: ""
          },
          sponsor: {
            name: "None",
            license: "N", level: 0,
            exp: 0,
           },

          raceinprogress: {active:false, messageid: "",channelid: "", expire:0, gridhistory:[], msghistory:[]},
          racedetails: [],
          careerraces: career,
          licenses: licenses,
          inlobby: {active:false, host:"", channelid: ""},
          settings: gte_GTF.defaultsettings,

          commandhistory: [],
          tutorial: "N/A",
          version: 1,

          replays: [],
          courses: [],
          eventsettings: []
        };

        userdata["tutorial"] = "Complete";

        var car = gtf_CARS.random({lowerfpp: 300, upperfpp: 350}, 1)[0]
        gtf_CARS.addCar(car, "SORT", userdata);

        var { MongoClient, ServerApiVersion } = require('mongodb');

        var db = await MongoClient.connect(process.env.MONGOURL, {
          serverApi: ServerApiVersion.v1 
        })

          var dbo = db.db("GTFitness");
          var users = dbo.collection("GTF2SAVES");
          dbo.collection("GTF2SAVES").deleteOne({ id: userdata["id"] });


          users.insertOne(userdata, (err, result) => {});

        embed.setTitle("__**Setup Complete**__");
        embed.setColor(0x216c2a);
        embed.setImage("https://github.com/J24681357/gtfbot2unleahsed/raw/master/images/logo/gtfgamelogo.png")
        embed.setDescription("**✅ Join The Fitness Race!**");
        msg.edit({embeds:[embed]}).then(function(msg) { 
        gtf_DISCORD.delete(msg, {seconds:5})
        return
      })

    }
    var functionlist = [complete]
      gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
    return;
  }
};

}

module.exports.introEnthu = function (userdata, command, msg) {

  if (typeof userdata["tutorial"] !== undefined) {
    if (userdata["tutorial"] == "Complete") {
      return "SUCCESS";
    } else {
      return doit();
    }
  } else {
    return doit();
  }

  function doit() {
    var embed = new EmbedBuilder();
    var author = msg.author;
    var userid = msg.author.id;
    var user = msg.author.displayName;
    var avatar = msg.author.displayAvatarURL();

    embed.setColor(0xEE2236);
    embed.setAuthor({name: user, iconURL: avatar});

    embed.setTitle("⚠ __**" + "Before You Start" + "**__ ⚠");
    embed.setThumbnail("https://github.com/J24681357/gtfbotmain/raw/master/gtffithusim/images/logo/fithusimlogo.png");
    embed.setDescription("Welcome to Fithusim! This game is heavily inspired by the 2005 video game, Enthusia Professional Racing. Those who are familiar with Enthusia would find the gameplay of GTF: Fithusim more comfortable." + "\n**❗ This is the DEMO version of GTF: Fithusim. Demo saves will not be transferable in the full version.**" +
    "\n\n**❗ Click the " + gtf_EMOTE.fithusimlogo + " button to create your save.**");

     var emojilist = [{ emoji: gtf_EMOTE.fithusimlogo, 
  emoji_name: "fithusimlogo", 
  name: '', 
  extra: "Once",
  button_id: 0 },
  { emoji: gtf_EMOTE.fithusimlogo,
  emoji_name: "fithusimlogo",
  name: 'Manual',
  extra: "https://j24681357.github.io/gtfbotfithusim/",
  button_id: 1 }             
  ]
    var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);
  gtf_DISCORD.send(msg, {embeds:[embed], components: buttons}, startfunc)


    function startfunc(msg) {
      var i = 0;
      async function complete() {
        var types = ["dr"]
        var career = {}
        for (var i = 0; i < types.length; i++) {
          for (var j = 1; j < 200; j++) {
            career[types[i] + "-" + j] = [0,0,0,0,0]
          }
        }

        userdata = {
          id: userid,
          enthupoints: 300,
          totalenthupoints: 300,
          ranking: 1000,
          rankinghistory: [],
          rankingpoints: 0,
          exp: 0,
          level: 1,
          skillpoints: 0,
          week: 1,
          weekseed: gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString() + gtf_MATH.randomInt(0,9).toString(), 
          mileage: 0,
          totalmileage: 0,
          totalplaytime: 0,
          garage: [],
          currentcar: 0,    

          count: 0,
          stats: {
            numcarpurchases: 0,
            numgifts: 0,
            numcourses: 0,
            numraces: 0,
            numarcaderaces: 0,
            numwins: 0,
            numparts: 0,
          },
          items: [],
          gifts: [],
          messages: {},
          lastonline: "START",
          driver: {
            helmettype: 0,
            helmetcolor: "White",
            visorcolor: "Black",
            helmetlogo1: "",
            helmetlogo2: "",
            helmetlogo3: ""
          },
          raceinprogress: {active:false, messageid: "",channelid: "", expire:0, gridhistory:[], msghistory:[]},
          racedetails: [],
          drprogression: career,
          races: {},
          settings: gte_GTF.defaultsettings,

          commandhistory: [],
          tutorial: "N/A",
          version: 1,

          replays: [],
          eventsettings: []
        };

        userdata["tutorial"] = "Complete";


        var { MongoClient, ServerApiVersion } = require('mongodb');

        var db = await MongoClient.connect(process.env.MONGOURL,
        {
          serverApi: ServerApiVersion.v1 
        })

          var dbo = db.db("GTFitness");
          var users = dbo.collection("FITHUSIMSAVES");
          dbo.collection("FITHUSIMSAVES").deleteOne({ id: userdata["id"] });


        users.insertOne(userdata, (err, result) => {});

        gtf_DISCORD.delete(msg, {seconds:0})
        var dir = gte_TOOLS.homedir()
        var cmd = require(dir + "commands/home");
        cmd.execute(msg, {}, userdata);


    }
    var functionlist = [complete]
      gte_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
    return;
  }
};

}
