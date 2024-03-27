const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "settings",
  title: "GTF Settings",
  license: "N",
  level: 0,
  channels: ["gtf-fithusim-game", "testing"],

  availinmaint: false,
  requireuserdata: false,
  requirecar: false,
  usedduringrace: false,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gte_TOOLS.setupCommands(embed, results, query, {
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

    if (query["options"] == "generationselect") {
      var results = gte_SETTINGS.settingsMenu("generationselect", embed, msg, userdata)

        if (results == "✅") {
          return;
        } else {
      gte_EMBED.alert({ name: "❌ Error", description: "Invalid arguments.", embed: embed, seconds: 0 }, msg, userdata);
      }
    }
    embed.setTitle("⚙ __GTF Fithusim Settings__");
      embed.setDescription("**❓ Select an option in the drop down menu.**")

          var settingslist = [
            {
            name: "Race Summary Sort",
            emoji: "⚙",
            extra: "",
            description: "Sorts the race history in the race results screen in Fithusim Life.",
            menu_id: 0
    },
            {
              name: "Delete Save Data",
              emoji: "🔴",
              extra: "",
              description: "⚠ Delete your save data for GTF Fithusim. Note that this is permanent.",
              menu_id: 1
              }
          ]

          var menu = gte_TOOLS.prepareMenu("Choose A Setting", settingslist, [], msg, userdata);

          var emojilist = [];

          buttons = [menu]
          embed.fields = [];

          embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);

          gtf_DISCORD.send(msg, { embeds: [embed], components: buttons }, homefunc);
          var currsetting = ""

          function homefunc(msg) {
            var functionlist = [];
            for (var i = 0; i <= 2; i++) {
            functionlist.push(function(num) {
              if (num == 10) {
                currsetting = "reset"
              }

              if (currsetting.length == 0) {
                currsetting = ["summarysort", "deletesavedata"][num]
                var [menulist, func] = gte_SETTINGS.settingsMenu(currsetting, embed, msg, userdata)
                if (num == 1) {
                  return
                }
              var menu = gte_TOOLS.prepareMenu(settingslist[num]["name"], menulist, [], msg, userdata);
                buttons = [menu]

                embed.fields = [];
                embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);
                gtf_DISCORD.edit(msg, { embeds: [embed], components: buttons }, homefunc)
              } else {
                var [menulist, func] = gte_SETTINGS.settingsMenu(currsetting, embed, msg, userdata)
                var message = func(num)
                var menu = gte_TOOLS.prepareMenu("Choose A Setting", settingslist, [], msg, userdata);
                  buttons = [menu]
                currsetting = ""
                  embed.setDescription(message + "\n" + "**❗ Recent changes will be applied after the next slash command.**");
                  embed.fields = [];
                  embed.setFields([{ name: gte_STATS.menuFooterEnthu(userdata), value: gte_STATS.currentCarFooterEnthu(userdata) }]);
                gte_STATS.saveEnthu(userdata)
                  gtf_DISCORD.edit(msg, { embeds: [embed], components: buttons }, homefunc)
              }
            })
            }
            gte_TOOLS.createButtons(menu, emojilist, functionlist, msg, userdata);
          }

  }
};
