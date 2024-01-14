const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "home",
  title: "Menu",
  license: "N",
  level: 0,
  channels: ["testing"],

  availinmaint: false,
  requirecar: false,
  requireuserdata: true,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gte_TOOLS.setupCommands(
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
      return cmd.execute(msg, {}, userdata);
    }
    if (typeof query["select"] !== 'undefined') {
      var cmd = require(__dirname + "/" + query["select"]);
          if (!gte_EXP.checkLevel(cmd.level, embed, msg, userdata)) {
            return;
          }
      return cmd.execute(msg, {}, userdata);
    }
    
    var showcasenumber = 0;
    var message = gte_STATS.checkNotifications(userdata)
    embed.setTitle(gte_EMOTE.gtflogo + " __Menu__");
    embed.setDescription(message + results);

    var menulist = gte_GTF.commandlist.map(function(x, i) {
      x["name"] = x[1]
      x["emoji"] = x[2]
      x["extra"] = ""
      x["description"] = x[0]
      x["menu_id"] = i
      return x
    })

    var commandslist = gte_GTF.commandlist.map(x => x[0])
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
    var menu = gte_TOOLS.prepareMenu("Select", gmenulistselect, [], msg, userdata);

    ///emojilist
    var emojilist = [];
        emojilist.push({
            emoji: "📋",
            emoji_name: "📋",
            name: "News / Announcements",
            extra: "",
            button_id: 0
      });

    var buttons = gte_TOOLS.prepareButtons(emojilist, msg, userdata);
    ///
    buttons.unshift(menu);

    var car = gtf_CARS.random({}, 1)[0];
    results = results = "__**Fithusim Life**__" + "\n" + "__**Driving Revolution**__" + "\n" +
        "__**Generation Select**__";
    embed.setDescription(message + results);
    embed.setThumbnail("https://github.com/J24681357/gtfbotfithusim/raw/master/images/logo/fithusimlogo.png")
    embed.fields = [];

    //embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);

    gte_DISCORD.send(msg, { embeds: [embed], components: buttons }, homefunc);

    function homefunc(msg) {
      var functionlist = [];
      var indexn = 0
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
            var menu = gte_TOOLS.prepareMenu("Select A Mode", gmenulistselect, gemojilist, msg, userdata);
            msg.edit({ components: [menu] });
            return;
          }
          showcasenumber = -1;
          if (commandslist[int] == "generationselect") {
            var cmd = require(__dirname + "/" + "settings");
          } else {
          var cmd = require(__dirname + "/" + commandslist[int]);
          }
          if (msg.channel.type != 1) {
          if (cmd.channels.length >= 1) {
            if (!cmd.channels.some(name => msg.channel.name.includes(name))) {
              userdata = gte_GTF.defaultuserdata
              gte_EMBED.alert({ name: "❌ Incorrect Channel", description: "Commands are not allowed in this channel.", embed: "", seconds: 5 }, msg, userdata);
              return;
            }
          }
          }
          
          gte_STATS.checkMessages(cmd, execute, msg, userdata)
          function execute() {
            if (commandslist[int] == "generationselect") {
               cmd.execute(msg, {options:"generationselect"}, userdata);
            } else {
          cmd.execute(msg, {}, userdata);
            }
          }
        });
      }

      
function createlist() {
        var showcase0 = function() {
          msg.removeAttachments();
          embed.setTitle(gte_EMOTE.gtflogo + " __My Home__");
          embed.image = "";
          var t = gte_COURSEMAKER.createCourse({
            min: 40,
            max: 80,
            minSegmentLength: 2,
            maxSegmentLength: 10,
            curviness: 0.3,
            maxAngle: 120,
            location: ["Grass", "Desert", "Mountain", "Snow", "Blank"][Math.floor(Math.random() * 5)],
            type: "Circuit",
          });
          var track = gte_COURSEMAKER.displayCourse(t, callback);

          function callback(track) {
            
            track["options"] = ["Drift"];
            track["author"] = "ARCADE";
            results = "**🖼 " + track["name"] + "**\n" + "**Generate your own courses using __/course__ or in the Course Maker selection." + "**\n\n" + gte_EMOTE.gtlogoblue + "**Main Version Date: " + gte_MAIN.bot["versiondate"] + "**";
            embed.setDescription(message + results);
            const attachment = new AttachmentBuilder(track["image"], { name: "course.png" });
            embed.setThumbnail("attachment://course.png");
            embed.fields = [];
            embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);
            msg.edit({ embeds: [embed], files: [attachment] });
          
        }
        }
        var showcase1 = function() {
          msg.removeAttachments();
          embed.setTitle(gte_EMOTE.gtflogo + " __Menu__");
          embed.image = "";
          
          results = "__**Fithusim Life**__" + "\n" +
            "__**Driving Revolution**__";
          embed.setDescription(message + results);
          //embed.setThumbnail(car["image"][0]);
          embed.fields = [];
          //embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);
          msg.edit({ embeds: [embed], files: [] });
        }
        var showcase2 = function() {
          msg.removeAttachments();
          embed.setTitle(gte_EMOTE.gtflogo + " __My Home__");
          embed.image = "";
          var track = gtf_TRACKS.random({}, 1)[0];
          results =
            "**" +
            track["name"] +
            "** `" +
            track["version"] +
            "`\n" +
            "**Length:** " +
            [track["length"] + " km", gtf_MATH.round( (track["length"] * 0.62137119), 2) + " mi"].join(" | ") +
            "\n" +
            gte_EMOTE.tracklogo +
            " **Drive over many tracks from the Gran Turismo series in GT Fitness!**" +
            "\n\n" +
            gte_EMOTE.gtlogoblue + "**Main Version Date: " + gte_MAIN.bot["versiondate"] + "**";
          embed.setDescription(message + results);
          embed.setThumbnail(track["image"]);
          embed.fields = [];
        
          embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);
          msg.edit({ embeds: [embed], files: [] });
        }
        var showcase3 = function() {
          msg.removeAttachments();
          embed.setTitle(gte_EMOTE.gtflogo + " __My Home__");
          var attachment = [];

          embed.fields = [];
          var car = gte_STATS.currentCar(userdata);
          results = gte_STATS.viewCar(car, embed, userdata);
          gte_STATS.loadCarImage(car, embed, userdata, then);

          function then(attachment) {
            embed.setThumbnail("attachment://image.png");
            embed.setDescription(message + results);
            embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);
            msg.edit({ embeds: [embed], files: [attachment] });
          }
        }
        var showcase4 = function() {
          msg.removeAttachments();
          embed.setTitle(gte_EMOTE.gtflogo + " __My Home__");

          embed.fields = [];
          var car = gte_STATS.currentCar(userdata);
          results = ""
      embed.setThumbnail("https://techraptor.net/sites/default/files/styles/image_header/public/2023-05/Gran%20Turismo%20Movie.jpg?itok=ChJwIPxd");
            embed.setDescription("**Watch the Gran Turismo Movie - Exclusively In Movie Theaters** " + "\n" + "https://www.granturismo.movie/" + results);
            //embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);
            msg.edit({ embeds: [embed]});
        }
        return [showcase0, showcase1, showcase2, showcase3, showcase4]
}
      var showcaselist = createlist()
      var count = gte_STATS.count(userdata) + 1
      var times = 0
      /*var s = setInterval(function () {
        if (showcasenumber == -1 || gte_STATS.count(userdata) != count || times == 0) {
          clearInterval(s);
          return;
        }
        times++
  
        showcasenumber = gtf_MATH.randomInt(0, showcaselist.length-1);
        showcaselist[showcasenumber]()
      }, 15 * 1000); */
      gte_TOOLS.createButtons(menu, emojilist, functionlist, msg, userdata);
    }
    return;
  }
};

