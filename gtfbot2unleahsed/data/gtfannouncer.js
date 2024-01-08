const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.emote = function(name) {
  if (name.match(/ kart /ig) !== null || name.match(/ karting /ig) !== null || name.match(/kart /ig) !== null || name.match(/karting /ig) !== null) {
    return gtf_EMOTE.igorf
  } else if (name.match(/ rally /ig) !== null || name.match(/rally /ig) !== null || name.match(/WRC /ig) !== null || name.match(/ WRC/ig) !== null) {
    return gtf_EMOTE.sebastienl
  } else if (name.match(/ formula /ig) !== null || name.match(/formula /ig) !== null || name.match(/F1 /ig) !== null) {
    return gtf_EMOTE.lewish
  } else if (name.match(/ gt academy /ig) !== null || name.match(/gt academy /ig) !== null || name.match(/ gt academy /ig) !== null) {
    return gtf_EMOTE.jannm
  } else if (name.includes("GTF Grand Tour") || name.match(/grand tour /ig) !== null || name.match(/donut /ig) !== null || name.match(/ grand tour /ig) !== null) {
    return gtf_EMOTE.jamesp
  }
  else {
    return gtf_EMOTE.jimmyb
  }

}

module.exports.say = function(args) {
  var announcer = require(__dirname.split("/").slice(0,4).join("/") + "/" + "index").announcer
  
  var start = [""]
  var end = [""]
  var punc = [".", "!"]
  var adjgood = randomword( ["exciting", "interesting", "fun", "joyful", "great", "fantastic"], true)
  var adjbad = randomword( ["bad", "terrible"], true)
  var sverbtobe = randomword( ["is", "looks to be", "seems to be", "appears to be"], false)
  var pverbtobe = randomword( ["are", "look to be", "seem to be", "appear to be"], false)
  punc = "!"
  var words = []
  if (args["name1"] == "intro") {
    if (args["name2"] == "igorf") {
      return announcer["special-event-kart"][0]
    }
    if (args["name2"] == "lewish") {
      return announcer["special-event-formula"][0]
    }
    if (args["name2"] == "jamesp") {
      return announcer["special-event-grandtour"][0]
    }
    if (args["name2"] == "jannm") {
      return announcer["special-event-gtacademy"][0]
    }
  }
  if (args["name1"] == "race-conditions") {
    var texts = announcer[args["name1"]][args["name2"]]
    var text = texts[Math.floor(Math.random() * texts.length)]
    start = ["For today's race, ", "Today, ", "In this track, "]
    end = [" on the track", " for this race", " for today's race"]
  }
  if (args["name1"] == "pre-race-comments") {
    var texts = announcer[args["name1"]]
    var text = texts[Math.floor(Math.random() * texts.length)]
  }
  if (args["name1"] == "race-start") {
    var texts = announcer[args["name1"]]
    var text = texts[Math.floor(Math.random() * texts.length)]
  }
  if (args["name1"] == "race-results-winner") {
    var texts = announcer[args["name1"]]["winner"]
    var text = texts[Math.floor(Math.random() * texts.length)]
    text = text.replace(/\(1\)/ig, args["name2"])
  }

  if (args["name1"] == "gtacademy") {
      return announcer["gtacademy"][parseInt(args["name2"]) - 1]
  }
  if (args["name1"] == "grandtour") {
      return announcer["grandtour"][parseInt(args["name2"]) - 1]
  }
  ////SPECIAL

  ////GROUP
  
  if (args["name1"].includes("race-overtake")) {
    var texts = announcer[args["name1"]]
    var text = texts[Math.floor(Math.random() * texts.length)]
    text = text.replace(/\(1\)/ig, args["name2"])
  }
  var mapObj = {
   "(adjgood)": adjgood,
   "(adjbad)": adjbad,
  "(sverbtobe)": sverbtobe,
  "(pverbtobe)": pverbtobe,
   };
text = text.replace(/\(adjgood\)|\(adjbad\)|\(sverbtobe\)|\(pverbtobe\)/gi, function(matched){
  return mapObj[matched];
});
    
  start = start[Math.floor(Math.random() * start.length)]
  end = end[Math.floor(Math.random() * end.length)]
  
  if (gtf_MATH.randomInt(1,2) == 1) {
    var final = start + text + punc
    return final.charAt(0).toUpperCase() + final.slice(1)
  } else {
  return text.charAt(0).toUpperCase() + text.slice(1) + end + punc
  }
  function randomword(words, article) {
    var word = words[Math.floor(Math.random() * words.length)]
    if (article) { 
    if (word[0].match(/[aeiou]/ig)) {
      word = "an " + word
    } else {
      word = "a " + word
    }
    }
    return word
  }
};