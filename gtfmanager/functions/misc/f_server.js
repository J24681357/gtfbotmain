const {  Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports.savechannels = async function(client) {
  var gtfbot = gtf_LIST_BOT
  var fs = require("fs")
  //var channels_new = JSON.parse(fs.readFileSync('./jsonfiles/channels_new.json', 'utf8'))['channels'];
  var list = [];
    var server = client.guilds.cache.get(gtf.SERVERID)
  var channels = server.channels.cache

  for (const channel of channels.values()) {
    /*
    channeln = channels_new.filter(x => channel.id === x.id)
    if (channeln.name != channel.name) {
      console.log("not the same")
    }
    */
    
    var object = {
      position: channel.rawPosition,
      channelposition: channel.position,
      id: channel.id.toString(),
      name: channel.name,
      type: channel.type,
      permissions: channel.permissions.serialize()
    }
    if (object["type"] == 11 || object["type"] == 2) {
      continue;
    }
    list.push(object)
  }
  list = list.sort(function(x,y){return x.position - y.position})
  console.log("Channels saved.")
  fs.writeFile("./jsonfiles/channels.json", require("json-format")({"channels": list}), function (err) {
    if (err) {
      console.log(err);
    }
  })
  console.log("Channels Updated")
}