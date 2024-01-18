const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "home",
  title: "Menu",
  license: "N",
  level: 0,
  channels: ["gtf-fithusim-game", "testing"],

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
    
    var message = "**It's Not What You Drive, It's How You Drive**" + "\n\n"
    embed.setTitle(gtf_EMOTE.fithusimlogo + " __Main Menu__");
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
    ///DEMO
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
///DEMO + "\n" + "__**Generation Select**__" + "\n" + "__**Settings**__";
    var car = gtf_CARS.random({}, 1)[0];
    results = "__**Fithusim Life**__" + "\n" + "__**Driving Revolution**__"
    embed.setDescription(message + results);
    embed.setThumbnail("https://github.com/J24681357/gtfbotfithusim/raw/master/images/logo/fithusimlogo.png")
    embed.fields = [];

    //embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);

    gtf_DISCORD.send(msg, { embeds: [embed], components: buttons }, homefunc);

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

