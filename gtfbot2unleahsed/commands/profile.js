const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "profile",
  title: "My Profile",
  license: "N", 
  level: 0,
  channels: ["testing", "gtf-2u-game", "gtf-demo"],

  availinmaint: false,
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
        rows: 4,
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

    var expbar = gtf_EXP.expBar(userdata)
    var nextlevel = (gtf_STATS.level(userdata) + 1) >= 50 ? 50 : (gtf_STATS.level(userdata) + 1)

  
    embed.setTitle("👤 " + "__My Profile__");
    results =
      "__**License:**__ " + gtf_TOOLS.toEmoji(userdata["license"]+"license") + "\n" +
      "__**Current Credits:**__ " +
      "**" +
gtf_MATH.numFormat(gtf_STATS.credits(userdata))+
      gtf_EMOTE.credits +
      "**" + "\n" +
      "__**Experience Points:**__ " +
      "**" +
      gtf_MATH.numFormat(gtf_STATS.exp(userdata)) +
      gtf_EMOTE.exp +
      "**\n" +
      "Lv." +
      gtf_STATS.level(userdata) +
      " " +
      expbar.join("") +
      " " +
      "Lv." + nextlevel +
      "\n" +
      "__**Total Distance Driven:**__ " +
      "**" + gtf_STATS.totalMileageUser(userdata) +
      " " + gtf_STATS.mileageUnits(userdata) + "** " + 
      gtf_EMOTE.mileage +
      "\n" +
     "**Total Play Time:** " + gtf_STATS.totalPlayTime(userdata) + "\n" +
      "**Total Drift Points:** " + "**" + gtf_MATH.numFormat(gtf_STATS.totalDriftPoints(userdata)) + " pts**"+ 
      "\n\n" +
      "**Total Races:** " + userdata["stats"]["numraces"] + "\n" + 
      "**Number of Wins:** " + userdata["stats"]["numwins"]
    

    embed.setDescription(results);    
    gtf_STATS.loadAvatarImage(embed, userdata, next)
    
    
  function next(image) {
    if (image.length == 0) {
      var attachment = []
embed.setThumbnail(msg.user.displayAvatarURL({format: 'jpg', size: 1024}));
    } else {
      var attachment = [image]
      embed.setThumbnail("attachment://image.png")
    }
     embed.setFields([{name:gtf_STATS.menuFooter(userdata), value: gtf_STATS.currentCarFooter(userdata)}]);
    var emojilist = [
  { emoji: "👤", 
  emoji_name: "👤", 
  name: 'Profile', 
  extra: "",
  button_id: 0 },
  { emoji: "🚘", 
  emoji_name: "🚘", 
  name: 'Garage', 
  extra: "",
  button_id: 1 },
      { emoji: "🏆", 
  emoji_name: "🏆", 
  name: 'Career Progress', 
  extra: "",
  button_id: 2 },
    { emoji: "💳", 
  emoji_name: "💳", 
  name: 'License Progress', 
  extra: "",
  button_id: 3 }
    ]
    if (userdata["id"] == "237450759233339393") {
      emojilist.push(
    { emoji: "😀", 
  emoji_name: "😀", 
  name: 'TEST', 
  extra: "",
  button_id: 4 }
      )
    }
  var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
    gtf_DISCORD.send(msg, {embeds:[embed], components: buttons, files: attachment}, profilefunc)
    
    function profilefunc(msg) {
      function profile() {
        embed.setTitle("👤 " + "__My Profile__");
        embed.setDescription(results);
        msg.edit({embeds:[embed], components: buttons})
      }
      function garageprofile() {
        embed.setTitle("👤 " + "__My Profile__");
        var favcar = userdata["garage"].sort((x, y) => parseFloat(y["totalmileage"]) - parseFloat(x["totalmileage"]))[0]
        var garagevalue = 0
        userdata["garage"].forEach(car => {
          var value = gtf_PERF.perf(car, "GARAGE")["value"]
    garagevalue += value;
})
        var numparts = userdata["stats"]["numwins"]
        var results = "**Garage Count:** " +
      gtf_STATS.garage(userdata).length +
      " Cars" + "\n" + 
      "**Favorite Car:** " + favcar["name"] + " " + "**" + gtf_STATS.carMileageUser(favcar, userdata) + gtf_STATS.mileageUnits(userdata) + "**" + gtf_EMOTE.mileage + "\n" + 
        "**Total Garage Value:** " + "**" + gtf_MATH.numFormat(garagevalue) + "**" + gtf_EMOTE.credits + "\n" + 
        "**Number of Parts Purchased:** " + gtf_MATH.numFormat(numparts)
        embed.setDescription(results);
        msg.edit({embeds:[embed], components: buttons})
      }
      function careerprofile() {
        var list1 = [
          ["__**B Level**__", gtf_LIST_CAREERRACES.find({types: ["b"] })],
          ["__**A Level**__", gtf_LIST_CAREERRACES.find({types: ["a"] })],
          ["__**IC Level**__", gtf_LIST_CAREERRACES.find({types: ["ic"] })],
          ["__**IB Level**__", gtf_LIST_CAREERRACES.find({types: ["ib"] })],
          ["__**IA Level**__",gtf_LIST_CAREERRACES.find({types: ["ia"] })],
          ["__**S Level**__", gtf_LIST_CAREERRACES.find({types: ["s"] })],
          ["__**Kart**__", gtf_LIST_CAREERRACES.find({types: ["kart"] })],
          ["__**Rally**__", gtf_LIST_CAREERRACES.find({types: ["rally"] })],
          ["__**Grand Tour**__", gtf_LIST_CAREERRACES.find({types: ["grandtour"] })],["__**GT Academy**__", gtf_LIST_CAREERRACES.find({types: ["gtacademy"] })],
          ["__**Formula**__", gtf_LIST_CAREERRACES.find({types: ["formula"] })]
        ];
        
        results2 = "";
        var total = 0
        var currentpoints = 0
        for (var level = 0; level < list1.length; level++) {
          var results2 = results2 + list1[level][0] + "\n";
          var certainraces = list1[level][1];
          var array = Object.keys(certainraces);
          for (var i = 0; i < array.length; i++) {
            
            total = total + 100
            var event = certainraces[array[i]]
            var per = gtf_STATS.raceEventStatus(certainraces[array[i]], userdata) 
            if (per == "⬛") {
              currentpoints = currentpoints + 0  
            } else if (per == "✅" || per == gtf_EMOTE.goldmedal)  {
              currentpoints = currentpoints + 100
            } else if (per == gtf_EMOTE.silvermedal)  {
              currentpoints = currentpoints + 66
            } else if (per == gtf_EMOTE.bronzemedal)  {
              currentpoints = currentpoints + 33
            } else {
              currentpoints = currentpoints + parseInt(per.split("`")[1].split("%")[0])
            }
            results2 = results2 + event["eventid"] + " " + per + " ";
          }
          results2 = results2 + "\n";
        }
        var completeper = Math.round(currentpoints/total * 100)
        embed.setTitle("🏆 __Career Progress__ " + completeper + "%");

        embed.setDescription(results2);
        msg.edit({embeds:[embed], components: buttons})
      }
      function licenseprofile() {
      
        var list1 = [
          ["__B License__", gtf_LIST_CAREERRACES.find({types: ["LICENSEB"] })],
          ["__A License__", gtf_LIST_CAREERRACES.find({types: ["LICENSEA"] })],
          ["__IC License__", gtf_LIST_CAREERRACES.find({types: ["LICENSEIC"] })],
          ["__IB License__", gtf_LIST_CAREERRACES.find({types: ["LICENSEIB"] })],
          ["__IA License__",gtf_LIST_CAREERRACES.find({types: ["LICENSEIA"] })],
          ["__S License__", gtf_LIST_CAREERRACES.find({types: ["LICENSES"] })]
        ];
        
        results2 = "";
        
        var total = 0  
        var currentpoints = 0
        for (var level = 0; level < list1.length; level++) {
          var results2 = results2 + list1[level][0] + "\n";
          var certainraces = list1[level][1];
          var array = Object.keys(certainraces);
          for (var i = 0; i < array.length; i++) {
            total = total + 100
            var per = gtf_STATS.raceEventStatus(certainraces[array[i]], userdata) 
            if (per == "⬛") {
              currentpoints = currentpoints + 0  
            } else if (per == "✅" || per == gtf_EMOTE.goldmedal)  {
              currentpoints = currentpoints + 100
            } else if (per == gtf_EMOTE.silvermedal)  {
              currentpoints = currentpoints + 66
            } else if (per == gtf_EMOTE.bronzemedal)  {
              currentpoints = currentpoints + 33
            } else {
              currentpoints = currentpoints + parseInt(per.split("`")[1].split("%")[0])
            }
            
            results2 = results2 + certainraces[array[i]]["eventid"].replace("LICENSE", "") + " " + per + " ";
          }
          results2 = results2 + "\n";
        }
        var completeper = Math.round(currentpoints/total * 100)
        embed.setTitle("💳 __License Progress__ " + completeper + "%");

        embed.setDescription(results2);
        msg.edit({embeds:[embed], components: buttons})
      }
      function image() {
        const ChartJSImage = require('chart.js-image');
        const line_chart = ChartJSImage().chart({
  "type": "line",
  "data": {
    "labels": [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July"
    ],
    "datasets": [
      {
        "label": "My First line",
        "borderColor": "rgb(255,+99,+132)",
        "backgroundColor": "rgba(255,+99,+132,+.5)",
        "data": [
          57,
          90,
          11,
          -15,
          37,
          -37,
          -27
        ]
      }
    ]
  },
  "options": {
    "title": {
      "display": true,
      "text": "Chart.js Line Chart"
    },
    "scales": {
      "xAxes": [
        {
          "scaleLabel": {
            "display": true,
            "labelString": "Month"
          }
        }
      ],
      "yAxes": [
        {
          "stacked": true,
          "scaleLabel": {
            "display": true,
            "labelString": "Value"
          }
        }
      ]
    }
  }
})
.backgroundColor('white')
.width(500)
.height(300);
        embed.setImage(line_chart.toURL())
        embed.setDescription(".")
        msg.edit({embeds:[embed]})
      }
      var functionlist = [profile, garageprofile, careerprofile, licenseprofile, image]
      
       gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
    }
    return;
  }
  }
  
};
