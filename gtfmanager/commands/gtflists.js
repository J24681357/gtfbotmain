const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, AttachmentBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "gtflists",
  title: "GTF Lists",
  cooldown: 3,
  level: 0,
  license: "N",
  channels: [],

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
      listsec: "",
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
    query["rankinglist"] = parseInt(query["rankinglist"])
    var list = [gtm_LIST_COTD, gtm_LIST_LOTW][query["rankinglist"] - 1]
    var title = ["GTF Car Of The Day", "GTF Location Of The Week"][query["rankinglist"] - 1]
    
    if (query["options"] == "latest_month") {
      var date = new Date()
      var month = date.getUTCMonth() + 1
      var year = date.getUTCFullYear()
      if (typeof query["sort"] == 'undefined') {
        query["sort"] = "newest"
      }
      query = { options: "list", month: month, year: year, sort: query["sort"], number: query["number"] }
    }
    var sort = query["sort"]
    var month = query["month"]
    var year = query["year"]
    var filter = ""
    if (typeof sort === 'undefined') {
      sort = "newest"
    }
    if (typeof month === 'undefined') {
      month = " All"
    }
    if (typeof year === 'undefined') {
      year = " All"
    }

    if (sort == "Sub-Zero" || sort == "Cool" || sort == "Uncool" || sort == "Seriously Uncool") {
      filter = JSON.parse(JSON.stringify(sort))
      sort = "highest_rating"
    }

    if (query["options"] == "info") {

      var total = list.length
      var rate = { "Sub-Zero": 0, "Cool": 0, "Uncool": 0, "Seriously Uncool": 0 }
      list.map(function(x) {
        rate[calculaterating(x)[1]]++
      })
      embed.setTitle("🚘 __**" + title + ": Statistics/Info**__")

      results = "**Total Days:** " + total + "\n" +
        "__Ratings__" + "\n" +
        "**100%-90%:** Sub-Zero `" + rate["Sub-Zero"] + " Times`\n" +
        "**89%-70%:** Cool `" + rate["Cool"] + " Times`\n" +
        "**69%-50%:** Uncool `" + rate["Uncool"] + " Times`\n" +
        "**49%-0%:** Seriously Uncool `" + rate["Seriously Uncool"] + " Times`" + "\n\n" + "❓ **Middle votes influence the rating. If there is more upvotes for a car than downvotes, middle votes will decrease the rating and vice versa.**"
      embed.setDescription(results)
      gtf_DISCORD.send(msg, { embeds: [embed] })
      return
    }


    var monthname = (month == " All") ? "" : " " + ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"][parseInt(month) - 1]
    var sortname = sort.split("_").map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(" ")
    var filtername = (filter == "") ? "" : " **(" + filter + ")**"

    embed.setTitle("🚘" + " __**" + title + ":" + monthname + " " + year + " (" + sortname + ")**" + filtername + "__")
    list = list.reverse()
    if (sort == "oldest") {
      list = list.sort((x, y) => new Date(x["date"]) - new Date(y["date"]))
    } else if (sort == "newest") {
      list = list.sort((x, y) => new Date(y["date"]) - new Date(x["date"]))
    } else if (sort == "most_upvotes") {
      list = list.sort((x, y) => y["upvote"] - x["upvote"])
    } else if (sort == "least_upvotes") {
      list = list.sort((x, y) => x["upvote"] - y["upvote"])
    } else if (sort == "most_downvotes") {
      list = list.sort((x, y) => y["downvote"] - x["downvote"])
    } else if (sort == "least_downvotes") {
      list = list.sort((x, y) => x["downvote"] - y["downvote"])
    } else if (sort == "highest_rating") {
      list = list.sort((x, y) => calculaterating(y)[0] - calculaterating(x)[0])
    } else if (sort == "lowest_rating") {
      list = list.sort((x, y) => calculaterating(x)[0] - calculaterating(y)[0])
    }
    if (month != " All") {
      list = list.filter(x => parseInt(x["date"].split("/")[0]) == parseInt(month))
    }
    if (year != " All") {
      list = list.filter(x => parseInt(x["date"].split("/")[2]) == parseInt(year))
    }
    if (filter != "") {
      list = list.filter(x => calculaterating(x)[1] == filter)
    }
    if (typeof query["number"] !== "undefined") {
      var select = list[query["number"] - 1]
      embed.setTitle("🚘 __**" + title + " (" + select["date"] + ")**__")
      var rating = calculaterating(select)
      results = ["**Car:** " + select["carname"], "**Location:** " + select["locationname"]][query["rankinglist"]-1] + "\n" +
        "**Rating:** " + "⭐ " + rating[0] + "% " + "`" + rating[1] + "`" + "\n\n" +
        "**Upvotes:** " + gtf_EMOTE.upvote + " " + select["upvote"] + "\n" +
        "**Middle:** " + gtf_EMOTE.middlevote + " " + select["middlevote"] + "\n" +
        "**Downvotes:** " + gtf_EMOTE.downvote + " " + select["downvote"] + "\n\n" + "**Last Updated:** " + select["lastupdated"]
      embed.setDescription(results)
      gtf_DISCORD.send(msg, { embeds: [embed] })
      return
    }

    
      delete query["number"]
      delete pageargs["query"]["number"]

      if (list.length == 0) {
        gtf_EMBED.alert({ name: "❌ No records found.", description: "There are no records for that sort/month/year", embed: "", seconds: 0 }, msg, userdata);
        return
      }
      list = list.map(function(x) {
        var rating = calculaterating(x)
        return "`" + x["date"] + "` " + "**" + [x["carname"], x["locationname"]][query["rankinglist"]-1] + "**" + "\n" +
          gtf_EMOTE.upvote + x["upvote"] + " " + gtf_EMOTE.middlevote + " " + x["middlevote"] + gtf_EMOTE.downvote + x["downvote"] + " `⭐" + rating[0] + "% | " + rating[1] + "`"
      })

      pageargs["list"] = list;
      pageargs["footer"] = "**❓ This is the rankings for the " + ["cars", "locations"][["query"]["option"] - 1] + " featured in " + title + ". Ratings are based on upvotes and downvotes. Middle votes can influence the rating in either way.**";
      pageargs["selector"] = "number"
      pageargs["text"] = gtm_TOOLS.formPage(pageargs, userdata);
      gtm_TOOLS.formPages(pageargs, embed, msg, userdata);
      return

    function calculaterating(x) {
      var percentage = Math.round(
        (x["upvote"] / (x["downvote"] + x["upvote"])) * 100
      )
      var middlevote = Math.round(
        x["middlevote"] / (x["downvote"] + x["upvote"] + x["middlevote"]) * 50
      )
      if (x["upvote"] == x["downvote"]) {
        percentage = percentage
      } else if (x["upvote"] > x["downvote"]) {
        percentage = percentage - middlevote
      } else {
        percentage = percentage + middlevote
      }

      var rating = "Seriously Uncool"
      if (percentage >= 50 && percentage < 70) {
        rating = "Uncool"
      } else if (percentage >= 70 && percentage < 90) {
        rating = "Cool"
      } else if (percentage >= 90) {
        rating = "Sub-Zero"
      }
      return [percentage, rating]
    }

  }
}
