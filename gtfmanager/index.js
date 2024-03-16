var fs = require("fs")
process.env["SECRET2"] = JSON.parse(fs.readFileSync(gtf_TOOLS.homeDir() + ".keys.json", "utf8"))["SECRET2"];
//////////////////////

const {  Client, Events, GatewayIntentBits, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");

var client = new Client({
  intents: 3276799
})

////////////////////////////////////////////////////
var fs = require("fs");
/////
var cooldowns = new Set();
var listinmaint = [];

client.commands = {}
const commandFiles = fs.readdirSync(__dirname + "/" + "commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.availinmaint) {
    listinmaint.push(command.name);
  }
  client.commands[command.name] = command;
}

var datebot = new Date().getTime();
var timeelapsed = 0;

client.once(Events.ClientReady, c => {
  gtm_SLASHCOMMANDS.createslashcommands()
  
    setInterval(function() {
  gtm_EXTRA.gtfstats(c)
  gtm_EXTRA.caroftheday(c)
  gtm_EXTRA.locationoftheweek(c)
  gtm_EXTRA.checkgallery(c)
  }, 10 * 60 * 1000)

  //gtm_EXTRA.rainbowcolors(c)
  //gtm_EXTRA.gtcolors(c)
  
  //gtm_TOOLS.downloadGTFFiles(client)
  gtm_EXTRA.loadfeeds(c);
  
  timeelapsed = parseInt(new Date().getTime()) - parseInt(datebot);
  gtf_CONSOLELOG.reverse();
  gtf_CONSOLELOG.fill(100, 100, 255);

  console.log("GTM: Logged In (" + timeelapsed + " " + "ms)");
  gtf_CONSOLELOG.end();

});

client.on("messageCreate", msg => {
  function activate() {
    var emojis = []

   
    if (msg.guild === null) {
      return
    }
    gtm_EXTRA.hi(emojis, msg);
    gtm_EXTRA.checkmedals(emojis, client, msg);

    if (msg.content.includes("@someone") & msg.attachments.size == 0) {
      var usernames = []
      msg.guild.members.fetch().then(r => {
        r.forEach(r => {
          usernames.push(r.user.username)
        })

        gtf_DISCORD.send(msg, { content: msg.content.replace(/@someone/, "**" + usernames[Math.floor(Math.random() * usernames.length)] + "**") })
      })

    }

    //galleries
    gtm_EXTRA.galleryreacts(emojis, msg);
    
    if (emojis.length != 0) {
    gtm_TOOLS.limitReactions(emojis, msg)
    }

  }
 activate()

});

client.on("interactionCreate", async interaction => {
  interaction.author = interaction.user

    if (interaction.type != 2) {
      return;
    }
  const args = interaction.options._hoistedOptions
  const commandName = interaction.commandName
     
  if (cooldowns.has(interaction.author.id)) {
        await interaction.reply({ content: "**⏲ Cooldown! Please try again.**", ephemeral: true });
          return
    } else {
        cooldowns.add(interaction.author.id);
        setTimeout(() => {
          cooldowns.delete(interaction.author.id);
        }, 5000);
    }
  

    await interaction.deferReply({});

  if (args.length == 0) {
    interaction.content = commandName
  } else {
    interaction.content = args.map(x => x["name"] + "=" + x["value"]);
    interaction.content.unshift(commandName.toLowerCase());
    interaction.content = interaction.content.join("***")
  }
  var embed = new EmbedBuilder();
  embed.setColor(0x0151b0);

  var command = client.commands[commandName] || client.commands.filter(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  try {
    load_msg(interaction);
    return
  } catch (error) {
    embed = new EmbedBuilder();
    gtf_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**", embed: "", seconds: 0 }, interaction, { id: interaction.author.id, garage: [], settings: gtm_defaultsettings });
    console.error(error);
  }
  return;
  ////////////////////////////////////////////

  function load_msg(msg) {
      var userdata = { id: msg.author.id,
                      garage: [],
          settings: {
            MODE: "Simulation",
            GARAGESORT: "Oldest Added",
            DEALERSORT: "Lowest Price",
            RACEDM: 0,
            UNITS: 0,
            TIMEOFFSET: 0,
            TIPS: 0,
            ICONS: {"select": "⬜", "bar": ["⬜", "⬛"]},
            COLOR: "#0151b0",
            COMPACTMODE: 0,
            HOMELAYOUT: 0,
            MENUSELECT: 0,
            GRIDNAME: 0
}
         }
      var args = msg.content.split(/\*\*\*+/);
      var commandName = args.shift().toLowerCase();

      var command = client.commands[commandName] || client.commands.filter(cmd => cmd.aliases && cmd.aliases.includes(commandName)[0]);

      if (!command) return;
      if (command.channels.length >= 1) {
          if (msg.channel.type == 11) {
            if (!command.channels.some(name => msg.channel.parent.name.includes(name))) {
              
              gtf_EMBED.alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
          } else {
            if (!command.channels.some(name => msg.channel.name.includes(name))) {
              gtf_EMBED.alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
          }
      }
  try {
    
    args = gtf_TOOLS.queryMap(args)
    command.execute(msg, args, userdata);
  } catch (error) {
    if (error == "DONE") {
      return
    }
    var embed = new EmbedBuilder();
    gtf_EMBED.alert({ name: "❌ Unexpected Error", description: "Oops, an unexpected error has occurred.\n" + "**" + error + "**", embed: "", seconds: 0 }, msg, userdata);
    console.error(error);
  }
    }

})

//client.on("debug", console.log).on("warn", console.log)




///LOGIN
var login = function(client) {
  console.log("GTM: Loading...");
  client.login(process.env.SECRET2).then(function() {
//gtm_EXTRA.test(client.guilds.cache.get("239493425131552778"))

     setTimeout(function() {
    gtm_EXTRA.checkgallery(client)
    gtm_EXTRA.caroftheday(client)
    gtm_EXTRA.locationoftheweek(client)
    gtm_EXTRA.locationoftheweekstats(client)
    gtm_EXTRA.carofthedaystats(client)
   },10000)
  });
}

login(client)
var begin = setInterval(function() {
    if (!client.isReady()) {
      console.log("GTM: Restarting...")
      client.destroy().then(function() {login(client)})
    } else {
      clearInterval(begin)
    }
}, 20000)

/////FUNCTIONS 
  /*
  setTimeout(function() {
    //gtm_SERVER.savechannels(client)
    gtm_TOOLS.download()
  }, 8000)
  */

//manual update
  //gtm_EXTRA.updatemanual(client)
    
  /*
  setTimeout(function() {
    client.rest.on('rateLimited', (info) => {
  }, 15 * 1000)
  */

function updatebotstatus() {
}
