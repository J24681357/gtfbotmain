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
          description: "Select a color for embeds.",
          menu_id: 0
  },
    {
          name: "GTF Dealership Sort",
          emoji: "⚙",
          extra: "",
          description: "Select a global setting for sorting car lists in dealership menus.",
          menu_id: 1
          },

          {
            name: "GTF Garage Sort",
            emoji: "⚙",
            extra: "",
            description: "Select a global setting for sorting your garage in the GTF garage.",
            menu_id: 2
            },

          {
            name: "Metric Units",
            emoji: "⚙",
            extra: "",
            description: "Select metric units.",
            menu_id: 3
            },
          {
            name: "Grid Display Names",
            emoji: "⚙",
            extra: "",
            description: "Select the type of names to display for AI opponents.",
            menu_id: 4
            },
          {
            name: "Menu Icons",
            emoji: "⚙",
            extra: "",
            description: "Select theme icons that as a menu selector and progress bars.",
            menu_id: 5
            },
          {
            name: "Navigation Menu Type",
            emoji: "⚙",
            extra: "",
            description: "Select a button method to navigate through most menus.",
            menu_id: 6
            },
          {
            name: "Set Time Zone",
            emoji: "⚙",
            extra: "",
            description: "Select a time zone corresponding to your current time (Military).",
            menu_id: 7
            },
          {
            name: "Career/Info Messages",
            emoji: "⚙",
            extra: "",
            description: "Enable or disable messages from commands & main characters.",
            menu_id: 8
            },
          {
            name: "Reset To Default Settings",
            emoji: "🔄",
            extra: "",
            description: "Reset all settings to default.",
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
        var gmenulistselect = [];

        var menupage = 0;

        var menu = gtf_TOOLS.prepareMenu("Settings", settingslist, [], msg, userdata);

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
              currsetting = ["color", "dealersort", "garagesort", "displaygrid", "icons", "menuselect", "units", "time", "messages", "reset", "deletesavedata"][num]
              var [menulist, func] = gtf_SETTINGS.settingsMenub(currsetting, embed, msg, userdata)
              if (num == 10) {
                return
              }
            var menu = gtf_TOOLS.prepareMenu(settingslist[num]["name"], menulist, [], msg, userdata);
              buttons = [menu]

              embed.fields = [];
              embed.setFields([{ name: gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata) }]);
              gtf_DISCORD.edit(msg, { embeds: [embed], components: buttons }, homefunc)
            } else {
              var [menulist, func] = gtf_SETTINGS.settingsMenub(currsetting, embed, msg, userdata)
              var message = func(num)
              var menu = gtf_TOOLS.prepareMenu("Settings", settingslist, [], msg, userdata);
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
