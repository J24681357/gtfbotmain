const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "home",
  title: "My GTF Home",
  license: "N",
  level: 0,
  channels: ["testing", "gtf-demo", "gtf-2u-game"],

  availinmaint: false,
  requirecar: false,
  requireuserdata: true,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(
      embed,
      results,
      query,
      {
        text: "",
        list: "",
        query: query,
        selector: "",
        command: __filename.split("/").splice(-1)[0].split(".")[0],
        rows: 10,
        page: 0,
        numbers: false,
        buttons: false,
        carselectmessage: false,
        image: [],
      bimage: [],
        footer: "",
        special: "",
        other: "",
      },
      msg,
      userdata
    );
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    ///SHORTCUTS
    if (typeof query["options"] !== 'undefined') {
      var cmd = require(__dirname + "/" + query["options"]);
          if (!gtf_STATS.checklicense(cmd.license, embed, msg, userdata)) {
          return;
        }
          if (!gtf_EXP.checkLevel(cmd.level, embed, msg, userdata)) {
            return;
          }
      return cmd.execute(msg, {}, userdata);
    }
    if (typeof query["select"] !== 'undefined') {
      var cmd = require(__dirname + "/" + query["select"]);
          if (!gtf_STATS.checklicense(cmd.license, embed, msg, userdata)) {
          return;
        }
          if (!gtf_EXP.checkLevel(cmd.level, embed, msg, userdata)) {
            return;
          }
      return cmd.execute(msg, {}, userdata);
    }
    
    var showcasenumber = 0;
    var message = gtf_STATS.checkNotifications(userdata)
    embed.setTitle(gtf_EMOTE.gtflogo + " __My Home__");
    embed.setDescription(message + results);

    var menulist = gtf_GTF.commandlist.map(function(x, i) {
      x["name"] = x[1]
      x["emoji"] = x[2]
      x["extra"] = ""
      x["description"] = x[0]
      x["menu_id"] = i
      return x
    })

    var commandslist = gtf_GTF.commandlist.map(x => x[0])
    var gmenulistselect = [];

    var menupage = 0;
    var gmenulistselect = menulist.slice(0 + 10 * menupage, 10 + 11 * menupage);
    gmenulistselect.push({
      emoji: "➡",
      name: "Next Page",
      description: "",
      menu_id: "NEXTPAGE",
    });
    
    var gemojilist = [];
    var menu = gtf_TOOLS.prepareMenu("Select A Mode", gmenulistselect, [], msg, userdata);

    ///emojilist
    var emojilist = [];
        emojilist.push({
            emoji: "📋",
            emoji_name: "📋",
            name: "News / Announcements",
            extra: "",
            button_id: 0
      });

    var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
    ///
    buttons.unshift(menu);

    var car = gtf_CARS.random({}, 1)[0];
    results = "**" + car["name"] + " " + car["year"] + " " + gtf_TOOLS.toEmoji(car["country"]) + "\n" + "🚘 Find this car using** __**/car Select [manufacturer/type] " + car["make"] + "**__**.**" + "\n\n" + gtf_EMOTE.gtlogoblue + " **Main Version Date: " + gtf_LIST_BOT["versiondate"] + "**";
    embed.setDescription(message + results);
    embed.setThumbnail(car["image"][0]);
    embed.fields = [];

    embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);

    gtf_DISCORD.send(msg, { embeds: [embed], components: buttons }, homefunc);

    function homefunc(msg) {
      var functionlist = [];
      var indexn = 0
      functionlist.push(function(){
        msg.removeAttachments();
        clearInterval(s);
    gtf_SERVERGUILD.channels.cache.get("687872420933271577").messages.fetch({limit:5}).then(msgnews => {
          var array = [...msgnews.entries()]
          var last = array[indexn][1]
          indexn++
          if (indexn > 4) {
            indexn = 0
          } 
          if (last.content.length == 0) {
            embed.setDescription("__** Date: <t:" + Math.floor(last.createdTimestamp/1000.0)
 + ":F>**__ \n" + last.embeds[0].description)
          } else {
          embed.setDescription("__** Date: <t:" + Math.floor(last.createdTimestamp/1000.0)
 + ":F>**__ \n" + last.content);
          }
          embed.setThumbnail(car["image"][0]);
          embed.setTitle("__News / Announcements__")
          embed.fields = [];
          embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);
          msg.edit({ embeds: [embed], files: [] });
        })
      })
      for (var j = 0; j < menulist.length; j++) {
        functionlist.push(function (int) {
          if (int == "NEXTPAGE") {
            menupage++;
            if (gmenulistselect.length <= 0 + (11 * menupage - 1)) {
              menupage = 0;
            }
            gmenulistselect = menulist.slice(10 * menupage, 10 + 11 * menupage);
            gmenulistselect.push({
              emoji: "➡",
              name: "Next Page",
              description: "",
              menu_id: "NEXTPAGE",
            });
            var menu = gtf_TOOLS.prepareMenu("Select A Mode", gmenulistselect, gemojilist, msg, userdata);
            msg.edit({ components: [menu] });
            return;
          }
          showcasenumber = -1;
          var cmd = require(__dirname + "/" + commandslist[int]);
          if (msg.channel.type != 1) {
          if (cmd.channels.length >= 1) {
            if (!cmd.channels.some(name => msg.channel.name.includes(name))) {
              userdata = gtf_GTF.defaultuserdata
              gtf_EMBED.alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 3 }, msg, userdata);
              return;
            }
          }
          }
          
        if (!gtf_STATS.checklicense(cmd.license, embed, msg, userdata)) {
          return;
        }
          if (!gtf_EXP.checkLevel(cmd.level, embed, msg, userdata)) {
            return;
          }
          gtf_STATS.checkMessages(cmd, execute, msg, userdata)
          function execute() {
          cmd.execute(msg, {}, userdata);
          }
        });
      }

      
function createlist() {
        var showcase0 = function() {
          msg.removeAttachments();
          embed.setTitle(gtf_EMOTE.gtflogo + " __My Home__");
          embed.image = "";
          var t = gtf_COURSEMAKER.createCourse({
            min: 40,
            max: 80,
            minSegmentLength: 2,
            maxSegmentLength: 10,
            curviness: 0.3,
            maxAngle: 120,
            location: ["Grass", "Desert", "Mountain", "Snow", "Blank"][Math.floor(Math.random() * 5)],
            type: "Circuit",
          });
          var track = gtf_COURSEMAKER.displayCourse(t, callback);

          function callback(track) {
            
            track["options"] = ["Drift"];
            track["author"] = "ARCADE";
            results = "**🖼 " + track["name"] + "**\n" + "**Generate your own courses using __/course__ or in the Course Maker selection." + "**\n\n" + gtf_EMOTE.gtlogoblue + "**Main Version Date: " + gtf_LIST_BOT["versiondate"] + "**";
            embed.setDescription(message + results);
            const attachment = new AttachmentBuilder(track["image"], { name: "course.png" });
            embed.setThumbnail("attachment://course.png");
            embed.fields = [];
            embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);
            msg.edit({ embeds: [embed], files: [attachment] });
          
        }
        }
        var showcase1 = function() {
          msg.removeAttachments();
          embed.setTitle(gtf_EMOTE.gtflogo + " __My Home__");
          embed.image = "";
          var car = gtf_CARS.random({}, 1)[0];
          results = "**" + car["name"] + " " + car["year"] + " " + gtf_TOOLS.toEmoji(car["country"]) + "\n" + "🚘 Find this car using** __**/car Select [manufacturer/type] " + car["make"] + "**__**.**" + "\n\n" + gtf_EMOTE.gtlogoblue + "**Main Version Date: " + gtf_LIST_BOT["versiondate"] + "**";
          embed.setDescription(message + results);
          embed.setThumbnail(car["image"][0]);
          embed.fields = [];
          embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);
          msg.edit({ embeds: [embed], files: [] });
        }
        var showcase2 = function() {
          msg.removeAttachments();
          embed.setTitle(gtf_EMOTE.gtflogo + " __My Home__");
          embed.image = "";
          var track = gtf_TRACKS.random({versions: ["Gran Turismo"]}, 1)[0];
          results =
            "**" +
            track["name"] +
            "** `" +
            track["version"] +
            "`\n" +
            "**Length:** " +
            
            [track["length"] + " km", gtf_MATH.convertKmToMi(track["length"]) + " mi"].join(" | ") +
            "\n" +
            gtf_EMOTE.tracklogo +
            " **Drive over many tracks from the Gran Turismo series in GT Fitness!**" +
            "\n\n" +
            gtf_EMOTE.gtlogoblue + "**Main Version Date: " + gtf_LIST_BOT["versiondate"] + "**";
          embed.setDescription(message + results);
          embed.setThumbnail(track["image"]);
          embed.fields = [];
        
          embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);
          msg.edit({ embeds: [embed], files: [] });
        }
        var showcase3 = function() {
          msg.removeAttachments();
          embed.setTitle(gtf_EMOTE.gtflogo + " __My Home__");
          var attachment = [];

          embed.fields = [];
          var car = gtf_STATS.currentCar(userdata);
          results = gtf_STATS.viewCar(car, embed, userdata);
          gtf_STATS.loadCarImage(car, embed, userdata, then);

          function then(attachment) {
            embed.setThumbnail("attachment://image.png");
            embed.setDescription(message + results);
            embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);
            msg.edit({ embeds: [embed], files: [attachment] });
          }
        }
        var showcase4 = function() {
          msg.removeAttachments();
          embed.setTitle(gtf_EMOTE.gtflogo + " __My Home__");

          embed.fields = [];
          var car = gtf_STATS.currentCar(userdata);
          results = ""
          embed.setThumbnail("https://github.com/J24681357/gtfbotfithusim/raw/master/images/logo/fithusimlogo.png")
            embed.setDescription("**GTF: Fithusim, Coming Soon**" + "\n" + "Check the announcement in https://discord.com/channels/239493425131552778/687872420933271577/1178778365289824396." + results);
            //embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);
            msg.edit({ embeds: [embed]});
        }
        return [showcase0, showcase1, showcase2, showcase3, showcase4]
}
      var showcaselist = createlist()
      var count = gtf_STATS.count(userdata) + 1
      var times = 0
      var s = setInterval(function () {
        if (showcasenumber == -1 || gtf_STATS.count(userdata) != count || times == 10) {
          clearInterval(s);
          return;
        }
        times++
  
        showcasenumber = gtf_MATH.randomInt(0, showcaselist.length-1);
        showcaselist[showcasenumber]()
      }, 15 * 1000);
      gtf_TOOLS.createButtons(menu, emojilist, functionlist, msg, userdata);
    }
    return;
  }
};

