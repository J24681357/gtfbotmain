const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "manual",
  license: "N",
  level: 0,
  channels: ["gtf-fithusim-game","testing"],

  availinmaint: false,
  requirecar: false,
  requireuserdata: true,
  usedduringrace: true,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      listsec: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 1,
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

    /* Setup */
    embed.setTitle("📝 GTF Fithusim Game Manual");
    embed.setDescription("**❓ Click the link button below to access the manual.**")
    var emojilist = [
  { emoji: gtf_EMOTE.fithusimlogo,
  emoji_name: "fithusimlogo",
  name: 'Manual',
  extra: "https://j24681357.github.io/gtfbotmain/README_FITHUSIM",
  button_id: 0 }
]

  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

    gtf_DISCORD.send(msg, {embeds:[embed], components: buttons})
    return
    }
};
