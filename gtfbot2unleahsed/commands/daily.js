const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "daily",
  title: "GTF Daily Workout",
  license: "B",
  level: 0,
  channels: ["testing", "gtf-2u-game"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: true,
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
      buttons: false,
      carselectmessage: false,
      image: [],
      bimage: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    embed.setTitle("__GTF Daily Workout - Prize__");
  
    if (gtf_STATS.dailyWorkout(userdata)["done"]) {
      gtf_EMBED.alert({ name: "❌ Invalid", description: "You have already earned your daily workout for the day.", embed: "", seconds: 5 }, msg, userdata);
      return;
    }
    

    if (gtf_STATS.garageFull(embed, msg, userdata)) {
      return;
    }
    
    if (gtf_STATS.mileage(userdata) < 42.10) {
      var mile = ["42.1 km", "26.2 mi"]
      var m = "**Mileage: " + gtf_STATS.mileageUser(userdata) + " " + gtf_STATS.mileageUnits(userdata) + gtf_EMOTE.mileage + " -> " + mile[userdata["settings"]["UNITS"]] + gtf_EMOTE.mileage + "**"
      gtf_EMBED.alert({ name: "❌ Insufficient Mileage", description: "You are unable to earn your daily workout car because you have not drove " + mile[userdata["settings"]["UNITS"]] + "." + "\n" + m, embed: "", seconds: 0 }, msg, userdata);
      return;
    }
    

    gtf_STATS.setDailyWorkout(true, userdata)

    results = "🎉 " + "__** Daily Workout - " + gtf_STATS.lastOnline(userdata) + "**__" + " 🎉";
    
    ///GIFTS
    var prizes = [];
    var car = gtf_CARS.random({lowerfpp:500}, 1)[0];
    prizes.push({
      id: -1, type:"CAR", name: car["name"] + " " + car["year"], item: car, author: "DAILY WORKOUT", inventory: false });
    var credits0 = 1000 * gtf_MATH.randomInt(1, 10)
    var credits1 = 1000 * gtf_MATH.randomInt(10, 25)
    var credits2 = 1000 * gtf_MATH.randomInt(25, 50)
    
    prizes.push({
      id: -1, type: "CREDITS", name: gtf_MATH.numFormat(credits0) + gtf_EMOTE.credits, item: credits0, author: "DAILY WORKOUT", inventory: false });
    prizes.push({
      id: -1, type: "CREDITS", name: gtf_MATH.numFormat(credits1) + gtf_EMOTE.credits, item: credits1, author: "DAILY WORKOUT", inventory: false });
    prizes.push({
      id: -1, type: "CREDITS", name: gtf_MATH.numFormat(credits2) + gtf_EMOTE.credits, item: credits2, author: "DAILY WORKOUT", inventory: false });
    prizes = gtf_TOOLS.shuffle(prizes)

    gtf_GTF.giftRoulette("GTF Daily Workout", results, prizes, "", embed, msg, userdata);
  }
};
