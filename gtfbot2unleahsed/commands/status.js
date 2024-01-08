const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "status",
  title: "Session Status",
  cooldown: 0,
  license: "N",
  level: 0,
  channels: ["testing", "gtf-2u-game", "gtf-demo"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: false,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(embed, results, query, {
        text: "",
        list: "",
        listsec: "",
        query: query,
        selector: "",
        command: __filename.split("/").splice(-1)[0].split(".")[0],
        rows: 0,
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

      embed.setTitle("__Session Status__")
      if (!userdata["raceinprogress"]["active"]) {
        embed.setDescription("**❗ You are not in a session.**" + pageargs["footer"])
        gtf_DISCORD.send(msg, {embeds: [embed]})
        return;
      } 

      if (userdata["inlobby"]["active"]) {
        embed.setDescription("**❗ You cannot use this command while in a lobby.**" + pageargs["footer"])
        gtf_DISCORD.send(msg, {embeds: [embed]})
        return;
      }
      
      if (query["options"] == "exit" || query["options"] == "cancel") {
          exitnow(msg);
          return;
      }

      if (query["options"] == "status" || query["options"] == "view") {
        
        embed.setDescription("**❓ You can view the message link to your current session here. You can also cancel your current session here such as races, drift trials, speed runs, etc.**")
        embed.addFields([{name:"Session in Progress", value: "[Message Link](https://discord.com/channels/" + "239493425131552778" + "/" + userdata["raceinprogress"]["channelid"] + "/" + userdata["raceinprogress"]["messageid"] + ")", inline: true}, {name:"Time Remaining", value: (gtf_DATETIME.getFormattedTime(userdata["raceinprogress"]["expire"] - new Date().getTime())) + " minutes", inline: true}])
        results = pageargs["footer"] 
        //embed.setDescription(results);
 var emojilist = [
  { emoji: gtf_EMOTE.exit, 
  emoji_name: "gtfexit", 
  name: 'Cancel Session', 
  extra: "Once",
  button_id: 0 }]
  
  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
        gtf_DISCORD.send(msg, {embeds: [embed], components: buttons}, cancelfunc)
          
        function cancelfunc(msg) {
          var functionlist = [exitnow]

           gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
          return;
        }
      }
        

      function exitnow() {
        if (parseFloat(userdata["raceinprogress"]["expire"] - new Date().getTime()) <= 0 * 1000) {
          gtf_EMBED.alert({ name: "❌ Session Ending Soon", description: "You can not exit a session that has under 10 seconds remaining.", embed: "", seconds: 0 }, msg, userdata);
          return
        }
        
        userdata["raceinprogress"]["active"] = false
        gtf_EMBED.alert({ name: "✅ Success", description: "You have left the session.", embed: "", seconds: 0 }, msg, userdata);
    console.log(userdata["raceinprogress"]["messageid"])
        if (userdata["raceinprogress"]["messageid"].length != 0) {

        msg.channel.messages
          .fetch({message: userdata["raceinprogress"]["messageid"]}).then(message => {
             try {
                 console.log("OK")
            gtf_DISCORD.delete(message, {seconds:5})
               } catch (error) {
                console.log("Message already deleted.")
            }
          });
        }
          console.log("DD")
        
        gtf_STATS.removeRaceDetails(userdata);
        gtf_STATS.clearRaceInProgress(userdata);
        userdata["raceinprogress"]["expire"] = "EXIT"
        gtf_STATS.save(userdata)
        return;
      }
  }
};
