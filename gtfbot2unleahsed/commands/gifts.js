const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "gifts",
  license: "N",
  level: 0,
  channels: ["testing", "gtf-2u-game","gtf-demo"],

  availinmaint: false,
  requirecar: true,
  requireuserdata: true,
  usedduringrace: false,
  usedinlobby: true,
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtf_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      listsec: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 5,
      page: 0,
      numbers: true,
      buttons: true,
      carselectmessage: false,
      image: [],
      bimage: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    if (gtf_STATS.gifts(userdata).length == 0) {
      gtf_EMBED.alert({ name: "❌ No Gifts", description: "You do not have any gifts available.", embed: "", seconds: 3 }, msg, userdata);
      return;
    }

    if (!isNaN(parseInt(query["number"]))) {
      query["options"] = "redeem"
      query["number"] = parseInt(query["number"]);
    }
 
    if (query["options"] == "latest") {
      query = {options: "redeem", number: 1}
    }

    ///COMMANDS
    if (query["options"] == "list") {
      delete query["number"]
    embed.setTitle("🎁 __Gifts " + gtf_STATS.gifts(userdata).length + " / " + gtf_GTF.giftlimit + " Gifts__");
      var list = gtf_STATS.gifts(userdata).map(function (item) {
        var emoji = {
          CAR: "🚘",
          RANDOMCAR: "🎲🚘",
          CREDITS: gtf_EMOTE.credits,
          EXP:  gtf_EMOTE.exp
        }[item["type"]]
        return "__**" + item["author"] + "**__" + "/n" + item["name"] + " " + emoji
      });
    pageargs["list"] = list;
    if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
    }
    pageargs["selector"] = "number"
    pageargs["query"] = query
    pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
    gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
    }
    
    if (query["options"] == "accept" || query["options"] == "redeem") {
      var number = query["number"];
      if (!gtf_MATH.betweenInt(query["number"], 1, gtf_STATS.gifts(userdata).length)) {
        gtf_EMBED.alert({ name: "❌ Invalid Number", description: "This number does not exist in your inventory.", embed: "", seconds: 3 }, msg, userdata);
      return
      }
      
      var gift = gtf_STATS.gifts(userdata)[number - 1];
      if (gift["type"] == "CAR") {
          if (gtf_STATS.garageFull(embed, msg, userdata)) {
      return;
        }
      }
      results = "🎁 Do you want to redeem **" + gift["name"] + "**?";
      embed.setDescription(results);
      embed.setFields([{name:gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata)}]);
              var emojilist = [
  { emoji: gtf_EMOTE.yes, 
  emoji_name: "Yes", 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }
]
  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
   gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, itemsfunc)
   
   function itemsfunc(msg) {
        function accept() {
          gtf_STATS.redeemGift("✅ " + gift["name"] + " redeemed!", gift, embed, msg, userdata);
          return;
        }

    var functionlist = [accept];
    gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
      }
      return;
    }

       if (query["options"] == "acceptten" || query["options"] == "redeemten") {
      results = "⚠️ Do you want to redeem the last 10 gifts?\nNote that if you've reached the garage limit, any gifts containing cars will not be redeemed.";
      embed.setDescription(results);
      embed.setFields([{name:gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata)}]);
        var emojilist = [
  { emoji: gtf_EMOTE.yes, 
  emoji_name: "Yes", 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }
]
  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
   gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, itemsfunc)
   
   function itemsfunc(msg) {
        function accept() {
          var i = 0
          var results = []
          while (i < 10) {
            var gift = gtf_STATS.gifts(userdata)[0]
            if (typeof gift == "undefined") {
              i++
              continue;
          }
        if (gift["type"] == "CAR" || gift["type"] == "RANDOMCAR") {
          if (gtf_STATS.garageFull(embed, msg, userdata)) {
        i++
      continue;
        }
      }
          results.push(gtf_STATS.redeemGift("", gift, "", msg, userdata));
            i++
          }
          embed.setDescription("✅ The following items have been redeemed: " + "\n\n" + results.join("\n- "));
          gtf_DISCORD.edit(msg, {embeds: [embed], components: []});
          return;
        }

    var functionlist = [accept];
    gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
      }
      return;
    }

    if (query["options"] == "delete" || query["options"] == "remove") {
      var number = query["number"];
      if (!gtf_MATH.betweenInt(query["number"], 1, gtf_STATS.gifts(userdata).length)) {
        gtf_EMBED.alert({ name: "❌ Invalid Number", description: "This number does not exist in your inventory.", embed: "", seconds: 3 }, msg, userdata);
      return
      }
      
      var gift = gtf_STATS.gifts(userdata)[number - 1];
      results = "⚠️ Do you want to remove **" + gift["name"] + "** from your inventory? This is permanent.";
      embed.setDescription(results);
      embed.setFields([{name:gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata)}]);
              var emojilist = [
  { emoji: gtf_EMOTE.yes, 
  emoji_name: "Yes", 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }
]
  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
   gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, itemsfunc)
   
   function itemsfunc(msg) {
        function deleted() {
          gtf_STATS.removegift(number, userdata)
          gtf_EMBED.alert({ name: "✅ Success", description: gift["name"] + " removed!", embed: embed, seconds: 3 }, msg, userdata);
          return;
        }
         var functionlist = [deleted];
    gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
   }    
      return;
    }

    if (query["options"] == "clear") {
      results = "⚠️ Do you want to clear all gifts? This is permanent and you will not redeem any rewards.";
      embed.setDescription(results);
      embed.setFields([{name:gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata)}]);
  var emojilist = [
  { emoji: gtf_EMOTE.yes, 
  emoji_name: "Yes", 
  name: 'Confirm', 
  extra: "Once",
  button_id: 0 }
]
  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
   gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, itemsfunc2)
   
   function itemsfunc2(msg) {
        function clear() {   
          gtf_STATS.clearGifts(userdata)
          gtf_EMBED.alert({ name: "✅ Success", description: "All gifts removed.", embed: embed, seconds: 3 }, msg, userdata);
          return;
        }
  var functionlist = [clear];
    gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
   }
    
      return;
    }

    }
};
