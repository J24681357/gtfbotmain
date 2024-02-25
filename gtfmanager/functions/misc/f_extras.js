const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

var fs = require('fs')
module.exports.caremotes = function(client) {
  startcaremotes()
  setInterval(function() {
    startcaremotes()
  }, 3600000 * 2)

  function startcaremotes() {
   m.get("https://www.kudosprime.com/gt7/carlist.php?range=5000").then((response) => {
      var list = response["data"].split(/<div class=\"car\" data-carid=\"[0-9]+\">/).slice(1).map(function(x) {
        car = x.split(" alt=\"")[1].split("\"/>")[0]
        image = x.split("<img src=\"")[1].split("\"")[0]
        return [car.replace(/\s+/g, "_"), "https://www.kudosprime.com/gt7/" + image.replace("side", "big")]})     
      complete(list)
    })

    function complete(list) {
      var select = list[Math.floor(Math.random() * list.length)]
      var image = select[1]
      var server = client.guilds.cache.get("239493425131552778");
      var gt7car = server.stickers.cache.find(s => s.name === "Gran Turismo 7 Car");
      if (gt7car == null) {
      } else {
        server.stickers.resolve(gt7car.id).delete()
      }
      setTimeout(function() {
        server.stickers.create(image, "Gran Turismo 7 Car", "🚘").then(function() {
          var gt7car = client.stickers.cache.find(s => s.name === "Gran Turismo 7 Car");
          if (gt7car == null) {
            console.log("GTM: Emoji not found")
            return
          } else {
            console.log("GTM: GT7 Sticker Emote has been changed to " + select[0]);
          }
        })
      }, 5000);
    };
  }
}

module.exports.updatemanual = function(client) {
  var manual = JSON.parse(fs.readFileSync(gtm_TOOLS.homeDir() + 'jsonfiles/manual.json', 'utf8'))['manual'];
  var size = manual.length;
  var index = 0;
  if (index >= size) {
    console.log("GTM: Manual Updated")
  }
  gtf_TOOLS.interval(
    function() {
      gtf_DISCORD.autoMessage(client, manual[index]['title'], manual[index]['description'].join('\n\n'), manual[index]['color'], manual[index]['image'], '704114222690336800', [], index + 1);
      index++;
    },
    2000,
    size
  );
  console.log('GTM: Manual Updating....');
};

module.exports.colorpickerjlicenseemotes = function(client) {
  var title = '🎨 __**GT Fitness - Color Picker**__';
 var emojilist = [
  {
    emoji: '0️⃣',
    emoji_name: '0️⃣',
    name: '',
    extra: '',
    value: 'Red',
    button_id: 0
  },
  {
    emoji: '1️⃣',
    emoji_name: '1️⃣',
    name: '',
    extra: '',
    value: 'Orange',
    button_id: 1
  },
  {
    emoji: '2️⃣',
    emoji_name: '2️⃣',
    name: '',
    extra: '',
    value: 'Yellow',
    button_id: 2
  },
  {
    emoji: '3️⃣',
    emoji_name: '3️⃣',
    name: '',
    extra: '',
    value: 'Green',
    button_id: 3
  },
  {
    emoji: '4️⃣',
    emoji_name: '4️⃣',
    name: '',
    extra: '',
    value: 'Aqua',
    button_id: 4
  },
  {
    emoji: '5️⃣',
    emoji_name: '5️⃣',
    name: '',
    extra: '',
    value: 'Blue',
    button_id: 5
  },
  {
    emoji: '6️⃣',
    emoji_name: '6️⃣',
    name: '',
    extra: '',
    value: 'Purple',
    button_id: 6
  },
  {
    emoji: '7️⃣',
    emoji_name: '7️⃣',
    name: '',
    extra: '',
    value: 'Magenta',
    button_id: 7
  },
  {
    emoji: '8️⃣',
    emoji_name: '8️⃣',
    name: '',
    extra: '',
    value: 'White',
    button_id: 8
  },
  {
    emoji: '9️⃣',
    emoji_name: '9️⃣',
    name: '',
    extra: '',
    value: 'Black',
    button_id: 9
  },
  {
    emoji: '🇦',
    emoji_name: '🇦',
    name: '',
    extra: '',
    value: 'Gray',
    button_id: 10
  },
  {
    emoji: '🇧',
    emoji_name: '🇧',
    name: '',
    extra: '',
    value: 'Pink',
    button_id: 11
  },
  {
    emoji: '🇨',
    emoji_name: '🇨',
    name: '',
    extra: '',
    value: 'Tan',
    button_id: 12
  },
  {
    emoji: '🇩',
    emoji_name: '🇩',
    name: '',
    extra: '',
    value: 'Default Color',
    button_id: 13
  },
    { emoji: "🔵", 
    emoji_name: "🔵", 
    name: "", 
    extra: "", 
    value: 'GT Blue Red',
    button_id: 14 },
    {
      emoji: "🌈",
      emoji_name: "🌈",
      name: "",
      extra: "",
      value: "Rainbow",
      button_id: 15,
    }
]


  var message = `**:zero: Red
:one: Orange
:two: Yellow
:three: Green
:four: Aqua
:five: Blue
:six: Purple
:seven: Magenta
:eight: White
:nine: Black
:regional_indicator_a: Gray (Invisible Color in Dark Theme)
:regional_indicator_b: Pink
:regional_indicator_c: Tan
:regional_indicator_d: Default Color (Discord Gray)
🔵 Gran Turismo Blue/Red (Alternating Color)
🌈 Rainbow (Alternating Color)

:question: Use the buttons to color your username!
:question: Once you selected roles, they will gradually be added to your profile.**
:warning: Make sure that you don't have more than 2 color roles. They can overlap one another.`;

  return gtf_DISCORD.autoMessage(client, title, message, '', '', '429025543329939476', emojilist, 1);
};

module.exports.loadfeeds = function(client) {
  function drivelist(data) {
    return ('`' + data + '`')
      .split('<link>')
      .map(x => x.split('</link>')[0]).
      filter(x => x.includes("thedrive.com/news"))
  }
    function motor1list(data) {
    return ('`' + data + '`')
      .split('<link>')
      .map(x => x.split('</link>')[0])
      .slice(3);
  }
  function gtofficiallist(data) {
    return ('`' + data + '`').split('>\n\t<a href="').map(x => "https://www.gran-turismo.com" + x.split('" class=')[0]).filter(x => !x.includes("<"))
  }
   
  function gtplist(data) {
      return ('`' + data + '`')
        .split('\n')
        .filter(x => x.includes('\t\t<link>'))
        .map(
          x =>
            x
              .replace('k>', '|')
              .replace('</l', '|')
              .split('|')[1]
        );
    }
  function twitterlist(data) {
    return ('`' + data + '`')
        .split('<link>')
        .map(x => x.split('</link>')[0])
        .slice(3);
    }
  ///////////////////////////////

  var json = [{
  name: "The Drive News",
  pathname: "thedrivenews",
  link:"https://feeds.feedburner.com/thedrive/r8HVtzCpPbw",
  function: drivelist,
  channelid: "361638649718374411",
  amount: 20,
  type: "https",
  reverse: true, emoji: "🚙"
  },{
  name: "Motor 1 News",
  pathname: "motor1news",
  link:"https://www.motor1.com/rss/news/all/",
  function: motor1list,
  channelid: "760412129680424961",
  amount: 9,
  type: "https",
  reverse: true, emoji: "🚘"
  },{
  name: "GTPlanet",
  pathname: "gtpnews",
  link:"https://www.gtplanet.net/feed/",
  function: gtplist,
  channelid: "310599531777622017",
  amount: 20,
  type: "https",
  reverse: true, emoji: "📰"
  },
    {
  name: "Overtake",
  pathname: "overtakenews",
  link:"https://www.overtake.gg/feed/",
  function: gtplist,
  channelid: "1067576826882441339",
  amount: 20,
  type: "https",
  reverse: true, emoji: "📰"
  },
    {
  name: "Gran Turismo Official",
  pathname: "gtofficialnews",
  link:"https://www.gran-turismo.com/us/gt7/news/",
  function: gtofficiallist,
  channelid: "953900679393583136",
  amount: 12,
  type: "https",
  reverse: true, emoji: gtf_EMOTE.gtlogowhite
  }]

  var i = 0
  
  gtf_TOOLS.interval(function() {
    gtm_EXTRA.feed(json[i], client)
    i++
    if (i == json.length) {
      i = 0
    }
  }, 1000 * 8, json.length)


  setInterval(function() {
    var i = 0
  gtf_TOOLS.interval(function() {
    gtm_EXTRA.feed(json[i], client)
    i++
    if (i == json.length) {
      i = 0
    }
  }, 1000 * 8, json.length)

  }, 900000);

};

module.exports.galleryreacts = function(emojis, msg) {
  if (msg.guild === null) {
    return
  }
  var channel = msg.channel.name

  /*
  if (msg.content.match(/gt6/ig) || 
      msg.content.match(/g t6/ig) || 
      msg.content.match(/gt 6/ig) ||
      msg.content.match(/g t 6/ig) || 
      msg.content.match(/granturismo6/ig) ||
      msg.content.match(/gran turismo6/ig) ||
      msg.content.match(/granturismo 6/ig) || 
      msg.content.match(/gran turismo 6/ig)) {
    emojis.unshift(gtf_EMOTE.gt6tpe)
  }
  */
  
  /*
  if (msg.content.match(/gt7/ig) || 
      msg.content.match(/g t7/ig) || 
      msg.content.match(/gt 7/ig) ||
      msg.content.match(/g t 7/ig) || 
      msg.content.match(/granturismo7/ig) ||
      msg.content.match(/gran turismo7/ig) ||
      msg.content.match(/granturismo 7/ig) || 
      msg.content.match(/gran turismo 7/ig)) {
    emojis.unshift(gtf_EMOTE.gt7)
  }
  */
    /*
  if (msg.content.match(/gtf/ig) || 
      msg.content.match(/g tf/ig) || 
      msg.content.match(/gt f/ig) ||
      msg.content.match(/g t f/ig) || 
      msg.content.match(/granturismofitness/ig) ||
      msg.content.match(/gran turismofitness/ig) ||
      msg.content.match(/granturismo fitness/ig) || 
      msg.content.match(/gran turismo fitness/ig)) {
    emojis.unshift(gtf_EMOTE.gtlogoblue)
  }
  */
  
  
  if (channel.includes('meme-lobby') && (msg.attachments.size >= 1 || msg.content.includes("https://") || msg.content.includes("http://"))) {
    emojis.unshift(gtf_EMOTE.upvote)
    emojis.unshift(gtf_EMOTE.downvote)
    return
  }
  if (channel.includes('car-of-the-day') || channel.includes('location-of-the-week')) {
    emojis.unshift(gtf_EMOTE.upvote)
    emojis.unshift(gtf_EMOTE.middlevote)
    emojis.unshift(gtf_EMOTE.downvote)
    return
  }
    if (channel.includes('gtf-moments') && (msg.attachments.size >= 1 || msg.content.includes("https://") || msg.content.includes("http://"))) {
    emojis.unshift(gtf_EMOTE.gtflogo)
    return
  }
  if (channel.includes('music') && (msg.attachments.size >= 1 || msg.content.includes("https://") || msg.content.includes("http://"))) {
    emojis.unshift("🎵")
    return
  }
  if (channel.includes('updates')) {
    emojis.push("⭐");
    return
  }
  if (channel.includes('photos') && (msg.attachments.size >= 1 || msg.content.includes("https://") || msg.content.includes("http://"))) {
    //emojis.unshift(gtf_EMOTE.gtsophy)
    emojis.unshift('❤');
    return
  } else {
    return;
  }
    
};

module.exports.checkgallery = async function(client) {
 var server = client.guilds.cache.get(gtm_SERVERID);
  var channels = server.channels.cache.filter((c) => c.type === 0)
  channels.forEach(channel =>{
    var name = channel.name
    
  if (name.includes('gtf-moments')) {
    addreactions([gtf_EMOTE.gtflogo], channel);
    return
  }
if (name.includes('photos')) {
    addreactions(["❤"], channel);
}
  if (name.includes('music')) {
    addreactions(["🎵"], channel);
  }
  if (name.includes('meme-lobby')) {
    addreactions([gtf_EMOTE.upvote,gtf_EMOTE.downvote], channel);
  }
  if (name.includes('car-of-the-day') || name.includes('location-of-the-week')) {
    addreactions([gtf_EMOTE.upvote,gtf_EMOTE.middlevote, gtf_EMOTE.downvote], channel);
  }
  if (name.includes('updates')) {
    addreactions(["star"], channel);
  }  

  async function addreactions(emojis, channel) {
   channel.messages.fetch({limit: 10}).then(async (msgs) => {
     if (channel.name.includes("updates")) {
     } else {
       var msgs = msgs.filter(msg => (msg.attachments.size >= 1 || msg.content.includes("https://") || msg.content.includes("http://") || msg.embeds.length >= 1))
     }
  
    msgs.forEach(async m => {
      var list = [] 
      await m.reactions.cache.forEach(function(x){
         list.push(x._emoji.name)
      })
      var i = 0
     gtf_TOOLS.interval(function() {
       var e = emojis[i]
       if (e.includes(":")) {
         e = e.split(":")[1]
       }
       if (name.includes("car-of-the-day")) {
       }
       if (!list.includes(e)) {
         console.log('GTM: Added missing emojis.')
          m.react(emojis[i])
       }
       i++
     }, 1000, emojis.length)
      
    })
     
  })
    
  }
})
  
};

module.exports.feed = function(json, client) {
  var pathname = json["pathname"]
  var link = json["link"]
  var func = json["function"]
  var name = json["name"]
  var channelid = json["channelid"]
  var amount = json["amount"]
  var type = json["type"]
  var reverse = json["reverse"]
  var emoji = json["emoji"]

  var articlelist = { "list": [] }
  var server = client.guilds.cache.get(gtm_SERVERID);
  var channel = server.channels.cache.get(channelid);
  channel.messages.fetch().then(msgs => {
    var bot = msgs.filter(msg => msg.author.id == gtm_USERID)
    bot.forEach(m => {
      articlelist["list"].push(m.content.split("\n")[1])
    })
    funcr()
  })
  var funcr = function() {
    
    if (type == 'https') {
      var https = require('https');
    } else {
      var https = require('http');
    }
    https.get(link, {headers: {'User-agent': 'GT Fitness'}}, resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      });

      resp.on('end', () => {
        var list = gtf_TOOLS.unique(func(data)).slice(0, amount).filter(function(x) {
          if (x.includes("<html><head>")) {
            console.log("GTM: This may be blocked.")
            return false
          } else {
            return true
          }
        }).filter(x => x.includes(type + "://"))
        if (reverse) {
          list = list.reverse();
        }
        list = list.map(function(e, i) {
          return [name, e];
        });

        var rsschannel = client.channels.cache.find(channel => channel.id === channelid);

        rssfeed();

        function rssfeed() {
          rsschannel.messages.fetch().then(messages => {
            var messagess = messages.filter(msg => msg.author.id == gtm_USERID);
            list = list.filter(function(x) {
              return !articlelist['list'].some(array => array.includes(x[1]));
            });

            if (list.length == 0) {
              console.log('GTM: None from ' + name + '.');
              return
            } else {
              for (var i = 0; i < list.length; i++) {
                articlelist['list'].push(list[i][1]);
                if (articlelist['list'].length > 30) {
                  articlelist['list'] = articlelist['list'].slice(1);
                }
              }
              var send = { "list": articlelist["list"] }
              if (send === undefined || send.length == 0) {
                console.log("GTM: Dont send")
                return 0
              }
              var index = 0;
              list.map(function(x) {
               gtf_DISCORD.send(rsschannel, {content: '>>> ' + emoji + ' | __**' + x[0] + '**__\n' + x[1], type1: "CHANNEL"})
              })
              console.log("GTM: " + list.length + " news found for " + name + "!");
              if (list.length == 0) {
                return 0
              } else {
              return 1
              }
              
            }
          });
        }
      });
    });
  };
}

module.exports.checkmedals = function(emojis, client, message) {
  
  var list = [
    [gtf_EMOTE.platinummedal, 'platinum', 0x91cae1, gtf_EMOTE.platinummedal + ' __**Platinum Medal**__ ' + gtf_EMOTE.platinummedal, '**Platinum Medal**', 8],
    [gtf_EMOTE.goldmedal, 'gold', 0xffd700, gtf_EMOTE.goldmedal + ' __**Gold Medal**__ ' + gtf_EMOTE.goldmedal, '**Gold Medal**', 6],
    [gtf_EMOTE.silvermedal, 'silver', 0xaaa9ad, gtf_EMOTE.silvermedal + ' __**Silver Medal**__ ' + gtf_EMOTE.silvermedal, '**Silver Medal**', 4],
    [gtf_EMOTE.bronzemedal, 'bronze', 0xd2825f, gtf_EMOTE.bronzemedal + ' __**Bronze Medal**__ ' + gtf_EMOTE.bronzemedal, '**Bronze Medal**', 3],
  ];
  var index = Math.floor(Math.random() * list.length);
  var select = list[index];

  if (message.guild === null) {
    return
  }
  var activated = 0;
  var chance = gtf_MATH.randomInt(1, 200);
  
  if (message.channel.name.includes('debug')) {
    chance = 100
  }
  
  if (message.channel.name.includes('-lobby') || message.channel.name.includes('automotive')) {
  } else {
    return
  }
  
  if (message.channel.name.includes('vent') || message.channel.name.includes('🔞') || message.channel.name.includes('mission') || message.author.id == gtm_USERID || chance != 100) {
    return;
  }

  var channelid = message.channel.id;
  var channel = client.guilds.cache.get(gtm_SERVERID).channels.cache.get(channelid);
  if (chance) {
    emojis.push(select[0]);
  }

  channel.messages.fetch({ limit: 1 }).then(async msg => {
    var msg = msg.first();
    var check = 0;
    if (chance) {
      activated == 1;

      var filterzero = (reaction, user) => reaction.emoji.name === select[1] && 
activated == 1;
      const filter11 = await msg.createReactionCollector({ filterzero, time: 1000 * 180 });
      var activate = false;
      var timer = new Date()

      filter11.on('collect', async (r, user) => {
        var count = r.count

        if (count == select[5] && !activate) {
          activate = true;
          activated = 0
          var embed = new EmbedBuilder();

          msg.attachments.forEach(attachment => {
            const url = attachment.url;
            embed.setImage(url);
          });
          embed.setTitle(select[3]);
          if (msg.content.length == 0) {
            embed.setDescription("(None)");
          } else {
          embed.setDescription(msg.toString());
          }
          embed.setColor(select[2])
          var elapsed = gtf_DATETIME.getFormattedTime(new Date() - timer)
          embed.setFields([{name: 'Author', value:'<@' + msg.author.id + '>', inline: true},
                         {name: 'Channel', value: '<#' + channelid + '>', inline: true},
                           {name: 'Time Elapsed', value:elapsed, inline: true},
                           {name: 'Link', value:"https://discord.com/channels/" + "239493425131552778" + "/" + channelid + "/" + msg.id, inline: true}])
          var userd = msg.guild.members.cache.get(msg.author.id);
          
          embed.setAuthor({name: userd.user.username, iconURL: userd.user.displayAvatarURL()});
          var embed2 = new EmbedBuilder();
          embed2.setColor(select[2]);
          embed2.setDescription('Congrats, ' + userd.user.username + "'s message has earned the " + select[4] + '!'
            + "\n" + "**Time Elapsed:** " + elapsed);
          gtf_DISCORD.send(channel, {embeds: [embed2], type1:"CHANNEL"})
          setTimeout(function() {
            client.guilds.cache
              .get(gtm_SERVERID)
              .channels.cache.get('529376959239815168')
              .send({embeds: [embed]});
          }, 5000);
        }
      });

      filter11.on('end', async (r, user) => {
        if (!activate) {
          var count = r.size
          if (count >= select[5]) {
            activate = true;
            activated = 0
            var embed = new EmbedBuilder();

            msg.attachments.forEach(attachment => {
              const url = attachment.url;
              embed.setImage(url);
            });
          if (msg.content.length == 0) {
            embed.setDescription("(None)");
          } else {
            embed.setDescription(msg.toString());
          }
            embed.setTitle(select[3]);
            embed.setColor(select[2]);

            var elapsed = gtf_DATETIME.getFormattedTime(new Date() - timer)
             embed.setFields([{name: 'Author', value:'<@' + msg.author.id + '>', inline: true},
                           {name: 'Channel', value: '<#' + channelid + '>', inline: true},
                           {name: 'Time Elapsed', value:elapsed, inline: true},
                           {name: 'Link', value:"https://discord.com/channels/" + "239493425131552778" + "/" + channelid + "/" + msg.id, inline: true}])
            var userd = msg.guild.members.cache.get(msg.author.id);
            embed.setAuthor({name: userd.user.username, iconURL: userd.user.displayAvatarURL()});
            var embed2 = new EmbedBuilder();
            embed2.setColor(select[2]);
            embed2.setDescription('Congrats, ' + userd.user.username + "'s message has earned the " + select[4] + '!'
              + "\n" + "**Time Elapsed:** " + elapsed);
            gtf_DISCORD.send(channel, {embeds: [embed2], type1:"CHANNEL"})
            setTimeout(function() {
              client.guilds.cache
                .get(gtm_SERVERID)
                .channels.cache.get('529376959239815168')
                .send({embeds: [embed]});
            }, 5000);
            return
          }
          msg.react("❌")
        }

      });
    }
  });
};



module.exports.gtfstats = function(client) {
  var server = client.guilds.cache.get(gtm_SERVERID);
  var totmembers = server.members.fetch().then(totmembers =>{
    totmembers = totmembers.filter(member => !member.user.bot)
    var size = totmembers.size
  var ids = totmembers.map(member => member.user.id)
  var novice = 0
  var b = 0
  var a = 0
  var ib = 0
  var ia = 0
  var s = 0
  var gtf = 0
  var gtfv = 0
  ids.filter(function(x) {
    var user = server.members.cache.get(x)
    var sum = Boolean(user.roles.cache.find(r => (r.name == "N ovice"))) + Boolean(user.roles.cache.find(r => (r.name == "B License"))) + Boolean(user.roles.cache.find(r => (r.name == "A License"))) + Boolean(user.roles.cache.find(r => (r.name == "IB License")))
      + Boolean(user.roles.cache.find(r => (r.name == "IA License"))) + Boolean(user.roles.cache.find(r => (r.name == "S License"))) + Boolean(user.roles.cache.find(r => (r.name == "GTF License"))) + Boolean(user.roles.cache.find(r => (r.name == "GTF Veteran")))
    if (sum == 1) {
      novice++
    } else if (sum == 2) {
      b++
    } else if (sum == 3) {
      a++
    } else if (sum == 4) {
      ib++
    }
    else if (sum == 5) {
      ia++
    }
    else if (sum == 6) {
      s++
    }
    else if (sum == 7) {
      gtf++
    }
    else if (sum == 8) {
      gtfv++
    } else {
      return false
    }
  })

  //////////
  var categories = server.channels.cache.filter((c) => c.type === 4).size;
  var text = server.channels.cache.filter((c) => c.type === 0).size;

  var list = [["**Total Players:**", size],
  ["**Novice Players:**", novice],
  ["**B Players:**", b],
  ["**A Players:**", a],
  ["**IB Players:**", ib],
  ["**IA Players:**", ia],
  ["**S Players:**", s],
  ["**GTF (License) Players:**", gtf],
  ["**GTF Veteran Players:**", gtfv],
  [" ", " "],
  ["**Categories:**", categories],
  ["**Text Channels:**", text]]

  var currentdate = new Date();
  var datetime = "**Updated " + (currentdate.getUTCMonth() + 1) + "/"
    + currentdate.getUTCDate() + "/"
    + currentdate.getUTCFullYear() + "**"

  gtf_DISCORD.autoMessage(client, "__📊 GT Fitness Stats__", list.map(x => x.join(" ")).join("\n") + "\n\n" + datetime, '', '', '829404376413765642',[], 1)
  setTimeout(function() {
    var members = [...server.members.cache.values()]
    var latest = members.sort((a, b) => b.joinedAt - a.joinedAt)[0]

    list = [
      ["**Latest Member:**", latest.user.toString()]
    ]
    gtf_DISCORD.autoMessage(client, "__📊 GT Fitness Stats__", list.map(x => x.join(" ")).join("\n") + "\n\n" + datetime, '', '', '829404376413765642', [], 2)
   
  }, 2000)
  })
  
}

module.exports.hi = function(emojis, msg) {
  if (msg.content.length == 2 && (msg.content == "hi" || msg.content == "Hi")) {
    emojis.push(gtf_EMOTE.hi)
    return
  }
  if (msg.content.length == 3 && (msg.content == "hi!" || msg.content == "Hi!")) {
    emojis.push(gtf_EMOTE.hi)
    return
  }
};

module.exports.rainbowcolors = function(client) {
    var rainbow = [0x8012ed, 0xbf01bf, 0xed1280, 0xff4040,
    0xed7f12, 0xbfbf01,
    0x80ed12, 0x40ff40,
    0x12ed7f, 0x01bfbf,
    0x1280ed, 0x4040ff]
  var size = rainbow.length
  var role = client.guilds.cache.get(gtm_SERVERID).roles.cache.find(r => r.name === "Rainbow");

  function sin_to_hex(i, phase) {
    var sin = Math.sin(Math.PI / size * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
  }

  var place = gtf_MATH.randomInt(0,size-1)
  setInterval(function() {

    role.edit({
      color: rainbow[place]
    })
    console.log("GTM: Rainbow Color changed")
    if (place == (size - 1)) {
      place = 0;
    } else {
      place++;
    }
  }, (60 * 1000) * 5)

}

module.exports.gtcolors = function(client) {
  
  var colors = [0x4663b1, 0xf23247]
  var size = colors.length
  var role = client.guilds.cache.get(gtm_SERVERID).roles.cache.find(r => r.name === "GT Blue Red");

  function sin_to_hex(i, phase) {
    var sin = Math.sin(Math.PI / size * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? '0' + hex : hex;
  }

  var place = gtf_MATH.randomInt(0,size-1)
  setInterval(function() {

    role.edit({
      color: colors[place]
    })
    console.log("GTM: GT Color changed")
    if (place == (size - 1)) {
      place = 0;
    } else {
      place++;
    }
  }, (60 * 1000) * 6)

}

module.exports.caroftheday = function(client) {
  var cotdchannelid = "1077378348512182332"
   var currentdate = new Date();
    var datetime = (currentdate.getUTCMonth() + 1) + "/"
      + currentdate.getUTCDate() + "/"
      + currentdate.getUTCFullYear()
  
   var channel = client.channels.cache.find(channel => channel.id === cotdchannelid);
   channel.messages.fetch({limit:100}).then(messages => {
    var list = []
     
    var lastmsg = messages.filter(msg => msg.author.id == gtm_USERID).first()
    /* EMERGENCY
    var embed = new EmbedBuilder(lastmsg.embeds[0])
     embed.setTitle("🚘 __**" + "Car Of The Day (" + datetime + ")**__")
    embed.setDescription("**Volkswagen Schwimmwagen Type 166 1942** `Production`\n" + "25 hp | 2,006 lbs | 4WD | NA")
embed.setImage("https://raw.githubusercontent.com/J24681357/gtfbotimages777/master/images/cars/volkswagen/volkswagenschwimmwagentype1661942.png")
    embed.setColor(0x0151b0)
    lastmsg.edit({embeds:[embed]})
    return
     */
     
      if (typeof lastmsg === 'undefined') {
          console.log("GTM: New Car Of The Day")
            messages.filter(msg => msg.author.id == gtm_USERID).forEach(r => {
       list.push(r.embeds[0].description.split("**")[1])
     })
       newcar(list)
       return
     }
     
    var lastdate = lastmsg.embeds[0].title.split("(")[1].split(")")[0]
     
     if (lastdate != datetime) {
       console.log("GTM: New Car Of The Day!")
            messages.filter(msg => msg.author.id == gtm_USERID).forEach(r => {
       list.push(r.embeds[0].description.split("**")[1])
     })
       newcar(list)
     }
   });

  function newcar(prevcarlist) {
    var options = {}
    var theme = ""
    if (Object.keys(options).length != 0) {
      theme = "\n" + "`Theme: " + Object.values(options).join(", ") + "`"
    }
    var car = gtf_CARS.random(options,1)[0]
    /*
var car = [{
			"make": "PAL-V",
			"name": "PAL-V Liberty",
			"year": "2018",
			"type": "Production",
			"country": "Netherlands",
			"power": 100,
			"weight": 1464,
			"tires": "Sports: Hard",
			"engine": "Other",
			"drivetrain": "Other",
			"carcostm": 2,
			"aerom": 1,
			"discount": 0,
			"special": [],
			"livery": [],
			"image": [
				"https://cdn.motor1.com/images/mgl/rbzYX/s3/pal-v-liberty-flying-car-geneva-2018.webp"
			],
			"_id": 1
}][0]
    */
  
    while (prevcarlist.includes(car["name"] + " " + car["year"])) {
      car = gtf_CARS.random(options,1)[0]
    }

     var currentdate = new Date();
    var datetime = (currentdate.getUTCMonth() + 1) + "/"
      + currentdate.getUTCDate() + "/"
      + currentdate.getUTCFullYear()

    var embed = new EmbedBuilder()
    embed.setTitle("🚘 __**" + "Car Of The Day (" + datetime + ")**__")
    embed.setDescription(gtf_TOOLS.toEmoji(car["country"]) + " **" + car["name"] + " " + car["year"] + "** " + " `" + car["type"] + "`\n" + gtf_MATH.numFormat(car["power"]) + " hp | " + gtf_MATH.numFormat(car["weight"]) + " lbs | " + car["drivetrain"] + " | " + car["engine"] + theme)
    embed.setImage(car["image"][0])
    embed.setColor(0x0151b0)
    var channel = client.channels.cache.find(channel => channel.id === cotdchannelid);
    var emojilist = [
  { emoji: gtf_EMOTE.google, 
  emoji_name: "google", 
  name: 'Car Info', 
  extra: "https://www.google.com/search?q=" + car["name"].replace(/ /ig, "+") + "+" + car["year"],
  button_id: 0 }
    ]
var buttons = gtm_TOOLS.prepareButtons(emojilist, channel, { id: gtm_USERID, garage: [], settings: gtm_defaultsettings });
  gtf_DISCORD.send(channel, {embeds: [embed], type1: "CHANNEL", components:buttons})
  }
}

module.exports.locationoftheweek = function(client) {
  var totwchannelid = "1207183775721721876"
   var currentdate = new Date();
    var datetime = (currentdate.getUTCMonth() + 1) + "/"
      + currentdate.getUTCDate() + "/"
      + currentdate.getUTCFullYear()
   var weekday = currentdate.getDay();

   var channel = client.channels.cache.find(channel => channel.id === totwchannelid);
   channel.messages.fetch({limit:100}).then(messages => {
    var list = []

    var lastmsg = messages.filter(msg => msg.author.id == gtm_USERID).first()

      if (typeof lastmsg === 'undefined') {
          console.log("GTM: New Location Of The Week")
            messages.filter(msg => msg.author.id == gtm_USERID).forEach(r => {
    list.push(r.embeds[0].description.split("**")[1])
     })
       newlocation(list)
       return
     }

    var lastdate = lastmsg.embeds[0].title.split("(")[1].split(")")[0]
//
     if (lastdate != datetime && weekday == 0) {
       console.log("GTM: New Location Of The Week!")
        messages.filter(msg => msg.author.id == gtm_USERID).forEach(r => {
    list.push(r.embeds[0].description.split("**")[1])
     })
       newlocation(list)
     }
   });

  function newlocation(prevloclist) {
    var options = {}
    var theme = ""
    if (Object.keys(options).length != 0) {
      theme = "\n" + "`Theme: " + Object.values(options).join(", ") + "`"
    }
    
    var locations = gtf_TOOLS.unique(gtf_TRACKS.find(options).map(function(x) {
      x = x["name"].split(" - ")[0].split(" (")[0].replace(" Reverse", "")
      return x
    }))
    var name = gtf_TOOLS.randomItem(locations)
    var track = gtf_TRACKS.find({names:[name]},1).sort((x,y) => y["length"] - x["length"])[0]
    
    while (prevloclist.includes(name)) {
      var locations = gtf_TOOLS.unique(gtf_TRACKS.find(options).map(function(x) {
        x = x["name"].split(" - ")[0].split(" (")[0].replace(" Reverse", "")
        return x
      }))
      name = gtf_TOOLS.randomItem(locations)
      track = gtf_TRACKS.find({names:[name]},1).sort((x,y) => y["length"] - x["length"])[0]
    }

     var currentdate = new Date();
    var datetime = (currentdate.getUTCMonth() + 1) + "/"
      + currentdate.getUTCDate() + "/"
      + currentdate.getUTCFullYear()
     var weekday = currentdate.getDay();

    var embed = new EmbedBuilder()
    embed.setTitle(gtf_EMOTE.tracklogo + "__**" + "Location Of The Week (" + datetime + ")**__")
    embed.setDescription(gtf_TOOLS.toEmoji(track["country"]) + " **" + name + "** " + " `" + track["type"] + "`\n" + gtf_MATH.convertKmToMi(track["length"]) + " mi | " + gtf_MATH.numFormat(track["length"]) + " km" + "\n" +
"`Corners: " + track["corners"] + "`" 
+ theme)
    embed.setImage(track["image"])
    embed.setColor(0x0151b0)
    var channel = client.channels.cache.find(channel => channel.id === totwchannelid);
    var emojilist = [
  { emoji: gtf_EMOTE.google, 
  emoji_name: "google", 
  name: 'Track Info', 
  extra: "https://www.google.com/search?q=" + track["name"].replace(/ /ig, "+"),
  button_id: 0 }
    ]
var buttons = gtm_TOOLS.prepareButtons(emojilist, channel, { id: gtm_USERID, garage: [], settings: gtm_defaultsettings });
  gtf_DISCORD.send(channel, {embeds: [embed], type1: "CHANNEL", components:buttons})
  }
}

module.exports.locationoftheweekstats = async function(client) {
   var currentdate = new Date();
   var channel = client.channels.cache.find(channel => channel.id === "1207183775721721876");
   channel.messages.fetch({limit:100}).then(async messages => {
    var list = []
    await messages.filter(msg => msg.author.id == gtm_USERID).forEach(async r => {
      var i = 0
      var vote = {}
      
      vote["locationname"] = r.embeds[0].description.split("**")[1]
      vote["date"] = r.embeds[0].title.split("(")[1].split(")")[0]
      vote["lastupdated"] = (currentdate.getUTCMonth() + 1) + "/"
      + currentdate.getUTCDate() + "/"
      + currentdate.getUTCFullYear()
      await r.reactions.cache.forEach(function(x){
        if (i == 0) {
          vote["upvote"] = x.count - 1
        }
        if (i == 1) {
          if (x._emoji.name == "middlevote") {
          vote["middlevote"] = x.count - 1
          } else {
          vote["middlevote"] = 0
          i++
          }
        }
        if (i == 2) {
          vote["downvote"] = x.count - 1
        }
        i++
      })
      list.unshift(vote)
     })
     
     var olist = gtm_LIST_LOTW
     for (var i = 0; i < list.length; i++) {
       if (olist.filter(x => x["date"] == list[i]["date"]).length == 0) {
         olist.push(list[i])
       } else {
         var index = olist.indexOf(olist.filter(x => x["date"] == list[i]["date"])[0])
         olist[index] = list[i]
       }
     }

      fs.writeFile(gtm_TOOLS.homeDir() +"./jsonfiles/locationoftheweeklist.json", JSON.stringify(olist), function (err) {
    if (err) {
      console.log(err);
    }
  
        
  });

  })
}