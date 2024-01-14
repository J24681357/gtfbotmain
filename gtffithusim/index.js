var fs = require("fs")
process.env["SECRET3"] = JSON.parse(fs.readFileSync(__dirname + "/" + ".keys.json", "utf8"))["SECRET3"];
process.env["MONGOURL"] = JSON.parse(fs.readFileSync(__dirname + "/" + ".keys.json", "utf8"))["MONGOURL"];

const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, ActivityType, SelectMenuBuilder } = require("discord.js");
const client = new Client({
  intents: 3276799,
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
var dir = "./";
////////////////////////////////////////////////////
var fs = require("fs");
var gtfbot = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/_botconfig.json", "utf8"));
/////
var checklogin = false;
var cooldowns = new Set();
var { MongoClient, ServerApiVersion } = require('mongodb');

var announcer = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/announcer.json", "utf8"));
var gtfmessages = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/gtfmessages.json", "utf8"));
var fithusimraces = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/fithusimraces.json", "utf8"));
var drraces = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/drraces.json", "utf8"));
var gtfparts = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/gtfpartlist.json", "utf8"));
var gtfpaints = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/gtfpaints.json", "utf8"));
var gtfwheels = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/gtfwheels.json", "utf8"));
var gtfexp = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/gtfexp.json", "utf8"));
var gtflicenses = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/gtflicenses.json", "utf8"));
var gtfrewards = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/gtfrewards.json", "utf8"));
var gtftime = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/gtftime.json", "utf8"));
var gtfseasonals = JSON.parse(fs.readFileSync(__dirname + "/" + "jsonfiles/gtfseasonalsextra.json", "utf8"));

module.exports.announcer = announcer;
module.exports.gtfmessages = gtfmessages;
module.exports.fithusimraces = fithusimraces;
module.exports.drraces = drraces;
module.exports.gtftime = gtftime;
module.exports.gtfseasonals = gtfseasonals
module.exports.gtfpartlist = gtfparts;
module.exports.gtfpaintlist = gtfpaints;
module.exports.gtfwheellist = gtfwheels;
module.exports.gtfexp = gtfexp;
module.exports.gtflicenses = gtflicenses
module.exports.gtfrewards = gtfrewards
module.exports.embedcounts = {};
module.exports.bot = gtfbot;

var listinmaint = [];
client.commands = {};
const commandFiles = fs.readdirSync(__dirname + "/" + "commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(__dirname + "/" + "commands/" + file);
  if (command.availinmaint) {
    listinmaint.push(command.name);
  }
  client.commands[command.name] = command;
}

var datebot = new Date().getTime();
var date = new Date();
var timeelapsed = 0;

console.log("Loading...");


setTimeout(function() {
  if (!checklogin) {
    restartbot()
  }
}, 25000);

client.on("ready", () => {

  require(__dirname + "/" + "files/directories");

  //gte_FITHUSIMRACES.audit()

  gte_SLASHCOMMANDS.createslashcommands();
  global.gte_SERVERGUILD = client.guilds.cache.get(gte_SERVERID)
 
  
  //gte_TOOLS.updateallsaves("FITHUSIMSAVES", {"fppupdate": true})
  timeelapsed = parseInt(new Date().getTime()) - parseInt(datebot);
  /*
  if (timeelapsed >= 7000) {
    restartbot()
    //console.log(keep);
  }
  */

gte_CONSOLELOG.reverse();
gte_CONSOLELOG.fill(0, 0, 255);

console.log("Time elapsed: " + timeelapsed + " " + "ms");
gte_CONSOLELOG.end();
  console.log("OK")
});

/*client.on('messageCreate', msg => {
   if (msg.channel.type == 'DM') {
      console.log('Dm recieved!')
    if(msg.attachments.size) {
      var fileurl = msg.attachments.first().url;

  var file = ""

      var download = function(url, dest, cb) {
        file = fs.createWriteStream(dest);
  var request = require("https").get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
   };
   download(fileurl, "./", function() {
      var userdata = file.extract("userdata.txt", {encoding: "utf8", password:process.env.USERDATAPASSWORD})
   })

}
   }
})*/

client.on("threadMembersUpdate", (addedMembers, removedMembers, thread) => {
  if (thread.parent.id != "1105413833197113375") {
    return
  }
  if (addedMembers.size == 1) {
    var member = addedMembers.entries().next().value
    var id = member[0]
    var user = member[1]
    var embed = new EmbedBuilder();
    results = "ℹ️ **" + "<@" + id + "> has joined the room.**"
    embed.setColor(0x808080);
    embed.setDescription(results);
    gte_DISCORD.send(thread, { embeds: [embed], type1: "CHANNEL" })

    gte_LOBBY.joinlobby(user, thread)
  }
  if (removedMembers.size == 1) {
    var member = removedMembers.entries().next().value
    var id = member[0]
    var user = member[1]
    var embed = new EmbedBuilder();
    results = "ℹ️ **" + "<@" + id + "> has left the room.**"
    embed.setColor(0x808080);
    embed.setDescription(results);
    gte_DISCORD.send(thread, { embeds: [embed], type1: "CHANNEL" })
    gte_LOBBY.leavelobby(user, thread)
  }

});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.type != 2) {
      return;
    }
    interaction.author = interaction.user;
    /*
      if (interaction.user.id != "237450759233339393") {
        return
      }
      */


    const args = interaction.options._hoistedOptions;
    const commandName = interaction.commandName;

    if (cooldowns.has(interaction.author.id)) {
      interaction.reply({ content: "**⏲ Cooldown! Please try again.**", ephemeral: true });
      return
    } else {
      cooldowns.add(interaction.author.id);
      setTimeout(() => {
        cooldowns.delete(interaction.author.id);
      }, 5000);
    }
    await interaction.deferReply({}).then(function(){}).catch(console.error)
    if (args.length == 0) {
      interaction.content = commandName;
    }
    else {
      interaction.content = args.map(function(x) {
        if (x["type"] == 11) {
          return x["name"] + "=" + x.attachment["url"];
        } else {
          return x["name"] + "=" + x["value"];
        }
      });
      interaction.content.unshift(commandName.toLowerCase());
      interaction.content = interaction.content.join("***");
    }
    var embed = new EmbedBuilder();
    embed.setColor(0x0151b0);

    var command = client.commands[commandName] || client.commands.filter(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    try {
      load_msg(interaction);

    } catch (error) {
      embed = new EmbedBuilder();
      gte_EMBED.alert({ name: "Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**" + "\n\n" + "Check the Known Issues in <#687872420933271577> to see if this is documented.", embed: "", seconds: 0 }, interaction, { id: interaction.author.id });
      console.error(error);
    }
    return;
    ////////////////////////////////////////////

    async function load_msg(msg) {
      ///////
      if (userdata === undefined) {
        userdata = gte_GTF.defaultuserdata(msg.author.id);
      }
      var next = function() {
        var args = msg.content.split(/\*\*\*+/);
        var commandName = args.shift().toLowerCase();

        var command = client.commands[commandName] || client.commands.filter(cmd => cmd.aliases && cmd.aliases.includes(commandName)[0]);

        if (!command) return;

        // Profile
        if (gtfbot["maintenance"]) {
          if (msg.author.id != "237450759233339393" && !command.availinmaint) {
            userdata = gte_GTF.defaultuserdata(msg.author.id);
            gte_EMBED.alert({ name: "⚠️ Maintenance", description: "This bot is currently in maintenance. Come back later!", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        if (command.channels.length >= 1) {
          if (msg.channel != null) {
          if (msg.channel.type == 11) {
            if (!command.channels.some(name => msg.channel.parent.name.includes(name))) {
              userdata = gte_GTF.defaultuserdata(msg.author.id);
              gte_EMBED.alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
          } 
          else {
            if (msg.channel.type != 1) {
              if (!command.channels.some(name => msg.channel.name.includes(name))) {
                userdata = gte_GTF.defaultuserdata(msg.author.id);
                gte_EMBED.alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 0 }, msg, userdata);
                return;
              }
            }
          }
          }
        }
        var check = require(__dirname + "/" + "functions/misc/f_start").introEnthu(userdata, command.name, msg);
        if (check == "COMMAND") {
          userdata = gte_GTF.defaultuserdata(msg.author.id);
          executecommand(command, args, msg, userdata);
          return;
        }
        if (check != "SUCCESS") {
          return;
        }

        if (userdata["credits"] == 0 && userdata["exp"] == 0 && userdata["garage"].length == 0) {
          gte_STATS.addCredits(15000, userdata);
        }

        // Updates

        if (command.name != "update") {
          if (userdata["version"] === undefined || userdata["version"] < gtfbot["version"]) {
            gte_EMBED.alert({ name: "❌ Version Incompatible", description: "Your save data needs to be updated in order to use current features. Use **/update** to update your save to the latest version.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }

        // Roles
        var roles = command.roles;

        //Checks if in a race
        if (!command.usedduringrace) {
          if (userdata["raceinprogress"]["expire"] < new Date()) {
            userdata["raceinprogress"] = { active: false, messageid: "", channelid: "", expire: undefined };
          }
          if (userdata["raceinprogress"]["active"]) {
            require(__dirname + "/" + "commands/status").execute(msg, { options: "view" }, userdata);
            return;
          }
        }

      


        if (!gte_EXP.checkLevel(command.level, embed, msg, userdata)) {
          return;
        }

        if (command.requirecar) {
          if (gte_STATS.garage(userdata).length == 0) {
            gte_EMBED.alert({ name: "❌ No Car", description: "You do not have a current car.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }

        if (command.requireuserdata) {
          if (Object.keys(userdata).length <= 5) {
            gte_EMBED.alert({ name: "❌ Userdata Required", description: "You do not have a save data.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        /*
        if (msg.channel.type != 11 && msg.channel.type != 1) {
          msg.channel.threads.fetchArchived({}).then(channels => {
            channels.threads.forEach(function(channel) {
              channel.delete();
            });
          });
        }
        */

        if (msg.author.displayName == "GTFITNESS") {
          gte_EMBED.alert({ name: "❌ Username Not Allowed", description: "Your username is not allowed from this bot. Please choose another username.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        try {
          gte_STATS.checkRewards("general", "", userdata);
        
          
          gte_STATS.checkMessages(command, execute, msg, userdata)
          function execute() {

            executecommand(command, args, msg, userdata);
          }
        } catch (error) {
          gte_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**" + "\n\n" + "Check the Known Issues in <#687872420933271577> to see if this is documented.", embed: "", seconds: 0 }, msg, userdata);
          console.error(error);
        }
      };

      var userdata;
      try {
        var db = await MongoClient.connect(process.env.MONGOURL,
        {
          serverApi: ServerApiVersion.v1 
        })
      } catch (err) {
        gte_EMBED.alert({ name: "❌ Save Data Failed", description: "Oops, save data has failed to load. Try again next time.\n" + "**" + err + "**", embed: "", seconds: 0 }, msg, userdata);
        restartbot()
        return
      }
      var dbo = db.db("GTFitness");
      dbo
        .collection("FITHUSIMSAVES")
        .find({ id: msg.author.id })
        .forEach(row => {
          if (typeof row["id"] === undefined) {
            return {};
          } else {
            userdata = row;
          }
        })
        .then(async () => {
          //gte_STATS.saveEnthu(userdata);
          db.close();

          next();
        });

    }

  }
  catch (error) {
    if (error) {
      //gte_EMBED.alert({ name: "Interaction Error", description: "An interaction error has occurred. Please try again.\n" + "**" + error + "**", embed: "", seconds: 0 }, interaction, { id: interaction.author.id });
      console.error(error);
    } else {
      console.error(error);
    }
  }
});

client.login(process.env.SECRET3).then(async function() {
  checklogin = true;
  var keys = [];

  var index1 = 0;
  client.rest.on("rateLimited", info => {
    gtfbot["msgtimeout"] = info["timeout"];

    /*
    if (info["path"].includes("messages")) {
      var channelid = info["path"].split("/channels/")[1].split("/")[0];
      var messageid = info["path"].split("/messages/")[1].split("/")[0];
    } 
    else {
      channelid = "";
      messageid = "";
    }
    if (typeof client.guilds.cache.get(gte_SERVERID).members.cache.get("237450759233339393") == "undefined") {
    } 
    else {
      client.guilds.cache
        .get(gte_SERVERID)
        .members.cache.get("237450759233339393")
        .send({ content: "**RATE LIMIT DETECTED**" + "\n\n" + "**Timeout:** " + gte_DATETIME.getFormattedTime(info["timeout"]) + "\n" + "**Message:** " + "https://discord.com/channels/" + gte_SERVERID + "/" + channelid + "/" + messageid + "\n\n" + JSON.stringify(info) });
    }
    */
  });
  setTimeout(function() {

    //gtf_CARS.audit()
    //gte_PARTS.audit()
    
//gte_SEASONAL.randomLimitedSeasonal()

    //gtf_TRACKS.audit()
    updatebotstatus();
    //gtf_CARS.changecardiscounts();
    /*
    gte_TOOLS.interval(
      function() {
        gte_STATS.resumeRace(keys[index1], client);
        index1++;
      },
      1000,
      keys.length
    );
    */

    //gtm_EXTRA.checkerrors(client)
  }, 10000);

  try {
    var db = await MongoClient.connect(process.env.MONGOURL,
      {
        serverApi: ServerApiVersion.v1 
      })
    console.log("DB good!")
  } catch (error) {
    console.log("Database error")
    restartbot()
  }
  /*
    if (err) {
      restartbot()
      console.log("Failed to load races.")
      return
    }
    */
  var dbo = db.db("GTFitness");
  dbo
    .collection("FITHUSIMSAVES")
    .find({})
    .forEach(row => {
      if (typeof row["id"] === undefined) {
        return;
      } else {

        if (row["racedetails"] === undefined) {
          return;
        }

        if (row["racedetails"].length == 0) {
          return;
        }

        if (!row["raceinprogress"]["active"] || row["raceinprogress"]["channelid"] === undefined || row["raceinprogress"]["messageid"] === undefined) {
          return;
        }
        keys.push(row);
      }


    });

});

var executecommand = function(command, args, msg, userdata) {
  try {
    var saved = userdata["id"] + ": " + args;
    args = gte_TOOLS.queryMap(args);
    command.execute(msg, args, userdata);
  } catch (error) {
    gte_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**" + "\n\n" + "Check the Known Issues in <#687872420933271577> to see if this is documented.", embed: "", seconds: 0 }, msg, userdata);
    console.error(error);
  }
};

///FUNCTIONS

function updatebotstatus() {
gte_CONSOLELOG.reverse();
gte_CONSOLELOG.fill(255, 255, 0);
console.log("Maintenance: " + gtfbot["maintenance"]);
gte_CONSOLELOG.end();

  /*
  if (gtfbot["maintenance"] && typeof gtfbot["maintenance"] === "boolean") {
    client.user.setPresence({ activities: [{ 
      type: ActivityType.Custom,
      name: "The bot is under maintenance.",
      state: "The bot is under maintenance."
    }], status: "dnd" });
    client.guilds.cache.get(gte_SERVERID).members.cache.get(gte_USERID).setNickname("🛠 In Maintenance 🛠");
  } else {
    client.user.setPresence({ activities: [{
      type: ActivityType.Custom,
      name: "The bot for the game, GT Fitness 2: Unleahsed.",
      state:  "The bot for the game, GT Fitness 2: Unleahsed."
    }], status: "purple" });
    client.guilds.cache.get(gte_SERVERID).members.cache.get(gte_USERID).setNickname("/ | GT Fitness");
  }
  */
}

function restartbot() {
  console.log("Restarting bot...");
  const { exec } = require("child_process");

  exec("kill 1", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

//client.on("debug", console.log).on("warn", console.log)