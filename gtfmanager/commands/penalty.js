const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "penalty",
  title: "Penalty",
  cooldown: 0,
  level: 0,
  channels: [""],

  delete: false,
  requirecar: false,
  availitoeveryone: true,
  availinmaint: true,
  requireuserdata: false,
  usedduringrace: false,
  usedinlobby: false,
  description: ["!penalty"],
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtm_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      listsec: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: false,
      buttons: false,
      carselectmessage: false,
      image: "",
      bimage: "",
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    /* Setup */
    var author = msg.channel.guild.members.cache.get(userdata["id"])
    if (gtm_MAIN.bot["penalty"] >= 1) {
      gtf_EMBED.alert({ name: "❌ One Penalty At A Time", description: "A penalty is already in progress.", embed: "", seconds: 0 }, msg, userdata);
      return
    }
    if (!author.roles.cache.find(r => r.name === "Moderators")) {
      gtf_EMBED.alert({ name: "❌ Penalty Invalid", description: "Only moderators can give out penalities.", embed: "", seconds: 0 }, msg, userdata);
      return
    }
    var user = msg.guild.members.cache.get(query["user"])
    var time = parseInt(query["seconds"])

    if (user.roles.cache.find(r => r.name === "Moderators")) {

      gtf_EMBED.alert({ name: "❌ Penalty Invalid", description: "Penalties can not be given to moderators.", embed: "", seconds: 0 }, msg, userdata);
      return
    }
    if (user.user.bot) {
      gtf_EMBED.alert({ name: "❌ Penalty Invalid", description: "Penalties can not be given to bots.", embed: "", seconds: 0 }, msg, userdata);
      return
    }
    embed.setColor(0xff0000);
    if (!gtf_MATH.betweenInt(time, 10, 300)) {
      gtf_EMBED.alert({ name: "❌ Penalty Invalid", description: "Penalties must be between 10 and 300 seconds.", embed: "", seconds: 0 }, msg, userdata);
      return
    }

    embed.setDescription(gtm_EMOTE.slowdown1 + gtm_EMOTE.slowdown2 + " **" + "<@" + user.id + "> " + "| Penalty +" + time + ".000" + "** " + gtm_EMOTE.slowdown1 + gtm_EMOTE.slowdown2)
    gtm_MAIN.bot["penalty"]++
    msg.channel.send({ content: "<@" + user.id + ">", embeds: [embed] })

    setTimeout(function() {
      user.timeout(time * 1000, "")

      setTimeout(function() {
        gtm_MAIN.bot["penalty"] = 0
      }, time * 1000)
    }, 1 * 1000)

  }
}