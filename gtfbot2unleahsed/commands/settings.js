const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "settings",
  title: "GTF Settings",
  license: "N",
  level: 0,
  channels: ["testing", "gtf-2u-game", "gtf-demo"],

  availinmaint: false,
  requireuserdata: false,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      listsec: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: false,
      buttons: true,
      carselectmessage: false,
      image: [],
      bimage: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    embed.setTitle("⚙ __GTF Settings__");

        var settingslist = [
          {
          name: "Embed Color",
          emoji: "⚙",
          extra: "",
          description: "Selects a color for embeds.",
          menu_id: 0
  },

          {
            name: "Menu Icons",
            emoji: "⚙",
            extra: "",
            description: "Selects theme icons that as a menu selector and progress bars.",
            menu_id: 1
            },
    {
          name: "GTF Dealership Sort",
          emoji: "⚙",
          extra: "",
          description: "Selects a sorting type for car lists in Dealerships.",
          menu_id: 2
          },

          {
            name: "GTF Garage Sort",
            emoji: "⚙",
            extra: "",
            description: "Selects a sorting type for your GTF garage.",
            menu_id: 3
            },

          {
            name: "Metric Units",
            emoji: "⚙",
            extra: "",
            description: "Selects metric units (Metric/Imperial).",
            menu_id: 4
            },
          {
            name: "Grid Display Names",
            emoji: "⚙",
            extra: "",
            description: "Toggles the type of names to display for AI opponents.",
            menu_id: 5
            },
          {
            name: "Navigation Menu Type",
            emoji: "⚙",
            extra: "",
            description: "Selects a button method to navigate through most menus.",
            menu_id: 6
            },
          {
            name: "Set Time Zone (Daily Workouts)",
            emoji: "⚙",
            extra: "",
            description: "Selects a time zone corresponding to your current time (Military).",
            menu_id: 7
            },
          {
            name: "Career/Info Messages",
            emoji: "⚙",
            extra: "",
            description: "Toggles messages from commands & main characters.",
            menu_id: 8
            },
          {
            name: "Reset To Default Settings",
            emoji: "🔄",
            extra: "",
            description: "Reset all settings to Default. (One Time Click)",
            menu_id: 9
            },
          {
            name: "Delete Save Data",
            emoji: "🔴",
            extra: "",
            description: "⚠ Delete your save data. Note that this is permanent.",
            menu_id: 10
            }
        ]
    
        var menu = gtf_TOOLS.prepareMenu("Choose A Setting", settingslist, [], msg, userdata);

        ///emojilist
        var emojilist = [];

        //var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
        ///
        buttons = [menu]
        embed.fields = [];

        embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);

        gtf_DISCORD.send(msg, { embeds: [embed], components: buttons }, homefunc);
        var currsetting = ""

        function homefunc(msg) {
          var functionlist = [];
          for (var i = 0; i <= 10; i++) {
          functionlist.push(function(num) {
            if (num == 9) {
              currsetting = "reset"
            }
            
            if (currsetting.length == 0) {
              currsetting = ["color",
                    "icons",
              "dealersort", 
              "garagesort", 
              "units", 
              "displaygrid", "menuselect","time", "messages", "reset", "deletesavedata"][num]
              var [menulist, func] = gtf_SETTINGS.settingsMenu(currsetting, embed, msg, userdata)
              if (num == 10) {
                return
              }
            var menu = gtf_TOOLS.prepareMenu(settingslist[num]["name"], menulist, [], msg, userdata);
              buttons = [menu]

              embed.fields = [];
              embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);
              gtf_DISCORD.edit(msg, { embeds: [embed], components: buttons }, homefunc)
            } else {
              var [menulist, func] = gtf_SETTINGS.settingsMenu(currsetting, embed, msg, userdata)
              var message = func(num)
              var menu = gtf_TOOLS.prepareMenu("Choose A Setting", settingslist, [], msg, userdata);
                buttons = [menu]
              currsetting = ""
                embed.setDescription(message + "\n" + "**❗ Recent changes will be applied after the next slash command.**");
                embed.fields = [];
                embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);
              gtf_STATS.save(userdata)
                gtf_DISCORD.edit(msg, { embeds: [embed], components: buttons }, homefunc)
            }
          })
          }
          gtf_TOOLS.createButtons(menu, emojilist, functionlist, msg, userdata);
        }
  }
};
