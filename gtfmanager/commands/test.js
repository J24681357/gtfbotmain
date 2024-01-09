const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "test",
  title: "test",
  cooldown: 3,
  level: 0,
  channels: ["testing"],

  delete: false,
  availitoeveryone: true,
  availinmaint: false,
  requirecar: false,
  usedduringrace: true,
  usedinlobby: true,
  description: [""],
  execute(msg, query, userdata) {
    var [embed, results, query, pageargs] = gtm_TOOLS.setupCommands(embed, results, query, {
      text: "",
      list: "",
      query: query,
      selector: "",
      command: __filename.split("/").splice(-1)[0].split(".")[0],
      rows: 10,
      page: 0,
      numbers: true,
      buttons: true,
      carselectmessage: false,
      image: "",
      bimage: "",
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //

    var server = msg.guild
    gtm_TOOLS.getSite("https://www.kudosprime.com/gt7/carlist.php?range=5000", "https", next)
    function next(data) {
      var list = data.split(/data-carid=/).slice(1).map(function(x) {
        car = x.split(" alt=\"")[1].split("\"/>")[0]
        image = x.split("<img src=\"")[1].split("\"")[0]
        return [car.replace(/\s+/g, "_"), "https://www.kudosprime.com/gt7/" + image.replace("side", "big")]
      })
      complete(list)
    }

    function complete(list) {
      var select = list[Math.floor(Math.random() * list.length)]
      var image = select[1]

      var gt7car = server.stickers.cache.find(s => s.name === "Gran Turismo 7 Car");
      if (gt7car != null) {
        server.stickers.resolve(gt7car.id).delete()
      } else {
        server.stickers.create(image).then(sticker => {
          gtf_DISCORD.send(msg, { content: "D", stickers: sticker }, deletee)
          function deletee() {
            //var id = server.stickers.cache.find(s => s.name === "Gran Turismo 7 Car")
            // server.stickers.resolve(id).delete()
          }
        })
      }


    };
  }
}
