const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////

module.exports = {
  name: "course",
  title: "GTF Course Maker",
  license: "IC", 
  level: 0,
  channels: ["testing", "gtf-demo"],

  availinmaint: false,
  requireuserdata: true,
  requirecar: false,
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
      buttons: true,
      carselectmessage: false,
      image: [],
      bimage: [],
      footer: "",
      special: "",
      other: "",
    }, msg, userdata)
    //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //      //
      var coursestats = gtf_STATS.courses(userdata)

      if (query["options"] == "list") {
        delete query["number"]
        delete query["name"]

        if (coursestats.length == 0) {
          gtf_EMBED.alert({ name: "❌ No Courses", description: "You have no courses saved.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        embed.setTitle(gtf_EMOTE.tracklogo + "__My Courses (" + coursestats.length + "/" + gtf_GTF.courselimit + " Courses)__");
        info = "";
        var list = coursestats.map(function (course, index) {
          return "`📌ID:" + (index+1) + "` " + course["name"];
        });

        pageargs["list"] = list;
        pageargs["selector"] = "number";
        pageargs["query"] = query
      if (typeof query["extra"] !== "undefined") {
        pageargs["footer"] = "✅ " + query["extra"]
        query["extra"] = ""
      }
        pageargs["text"] = gtf_TOOLS.formPage(pageargs, userdata);
        gtf_TOOLS.formPages(pageargs, embed, msg, userdata);
        return;
      }
      if (query["options"] == "view") {
        var number = query["number"];
        if (!gtf_MATH.betweenInt(number, 1, coursestats.length)) {
          gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your course list.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var course = coursestats[number - 1];
        gtf_COURSEMAKER.displayCourse(course, next)

        function next(course) {
        embed.setTitle(gtf_EMOTE.tracklogo + "__GTF Course Maker__");
        
        const attachment = new AttachmentBuilder(course["image"], {name: "course.png"});
        embed.setImage("attachment://course.png");
        var lengthselect = [course["lengthkm"] + " km", course["length"] + " mi"];
        embed.setDescription("**Name:** " + course["name"] + "\n" + 
        "**Author:** " + msg.user.displayName + "\n" + 
        "**Environment:** " + course["location"] + " | " + course["surface"] + "\n" +
        "**Course Length:** " + lengthselect[userdata["settings"]["UNITS"]] + pageargs["footer"]);
             var emojilist = [
  { emoji: "🗑️", 
  emoji_name: "🗑️", 
  name: 'Remove Course', 
  extra: "",
  button_id: 0 }
]
var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);
         gtf_DISCORD.send(msg, {
          embeds: [embed],
          components: buttons,
          files: [attachment],
        }, courseviewfunc);

        function courseviewfunc(msg) {
          function deletec() {
         require(__filename.split(".")[0]).execute(msg, {options:"delete", number:parseInt(query["number"])}, userdata);
        }
        var functionlist = [deletec]
          gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
          
        }
        }
        
        return;
      }
      if (query["options"] == "rename") {
        var number = query["number"];
        var newname = query["name"]
        if (!gtf_MATH.betweenInt(number, 1, coursestats.length)) {
          gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your course list.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (query["name"] === undefined) {
          gtf_EMBED.alert({ name: "❌ Invalid Name", description: "No name has been inputted.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        if (!gtf_MATH.betweenInt(newname.length, 3, 32)) {
            gtf_EMBED.alert({ name: "❌ Invalid Name", description: "Name must be between 3 and 32 characters. (" + newname.length + ")", embed: "", seconds: 0 }, msg, userdata);
            return;
        }
        var name = coursestats[number-1]["name"]
        embed.setDescription("⚠️ Rename " + "`📌ID:" + number + "` " + "**" + name + "**" + " to " + "**" + newname + "**?");
          var emojilist = [
             { emoji: gtf_EMOTE.yes, 
              emoji_name: 'Yes', 
              name: 'Confirm', 
              extra: "Once",
              button_id: 0 }]
    var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

         gtf_DISCORD.send(msg, {embeds:[embed],components:buttons}, coursefunc)
         
         function coursefunc(msg) {
          function renamecourse() {
            gtf_STATS.renameCourse(number-1, newname, userdata);
            gtf_STATS.save(userdata)
            setTimeout(function() {require(__filename.split(".")[0]).execute(msg, {options:"list", extra:"Renamed " + "`📌ID:" + number + "` " + "**" + name + "**" + " to " + "**" + newname + "**" + "."}, userdata);
            }, 1000)
          }
          var functionlist = [renamecourse]
          gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
        }
      }
      if (query["options"] == "delete") {
        var number = query["number"];
        if (!gtf_MATH.betweenInt(number, 1, coursestats.length + 1)) {
          gtf_EMBED.alert({ name: "❌ Invalid ID", description: "This ID does not exist in your course list.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }
        var name = coursestats[number-1]["name"]
        embed.setDescription("⚠️ Delete " + "`📌ID:" + number + "` " + "**" + name + "**?");
          var emojilist = [
             { emoji: gtf_EMOTE.yes, 
              emoji_name: 'Yes', 
              name: 'Confirm', 
              extra: "Once",
              button_id: 0 }]
    var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

        gtf_DISCORD.send(msg, {embeds:[embed], components:buttons}, coursefunc2)
        
        function coursefunc2(msg) {
          function deletecourse() {
            gtf_STATS.removeCourse(number-1, userdata);  
            gtf_STATS.save(userdata)
            setTimeout(function() {require(__filename.split(".")[0]).execute(msg, {options:"list", extra:"Deleted " + "`📌ID:" + number + "` " + "**" + name + "**."}, userdata);
            }, 1000)
          }
          var functionlist = [deletecourse]
          gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata)
        }
      }
      if (query["options"] == "clear") {
        var emojilist = [{ emoji: gtf_EMOTE.yes, emoji_name: "Yes", name: "Confirm", extra: "Once", button_id: 0 }];
        var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

        embed.setDescription("⚠️ Clear all of your saved courses? This is permanent.");
        embed.setColor(0xffff00);
        gtf_DISCORD.send(msg, {embeds: [embed], components: buttons }, coursefunc3)
        
        function coursefunc3(msg) {
          function clearcourses() {
            gtf_STATS.clearCourses(userdata);
            gtf_STATS.save(userdata)
            gtf_EMBED.alert({ name: "✅ Success", description: "Course data cleared.", embed: embed, seconds: 3 }, msg, userdata);
          }
          var functionlist = [clearcourses];

          gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata);
        }
      }
      if (query["options"] == "create") {
        delete query["number"]
        
        var width = 4;
        var scale = 1;
        var curviness = 0.3;
        var maxangle = 90;
        var minsegment = 2;
        var maxsegment = 20;
        var allsegment = 0;
        var type = "circuit";
        var location = "Blank"
        var surface = "Tarmac"
        var name = ""

        if ("name" in query) {
          name = query["name"].toString();
          if (!gtf_MATH.betweenInt(name.length, 3, 30)) {
            gtf_EMBED.alert({ name: "❌ Invalid Name", description: "Name must be between 3 and 30 characters. (" + name.length + ")", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        if ("roadwidth" in query) {
          /// 2 - 8
          width = parseFloat(query["roadwidth"]);
          if (!gtf_MATH.betweenInt(width, 2, 8)) {
            gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Road width must be between 2 and 8.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        if ("allsegments" in query) {
          /// 0 - 20
          allsegment = parseFloat(query["allsegments"]);
          if (!gtf_MATH.betweenInt(allsegment, 2, 20)) {
            gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Segment lengths must be between 2 and 20.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
          minsegment = allsegment;
          maxsegment = allsegment;
          allsegment = "";
        }
        if ("maxsegment" in query) {
          maxsegment = parseFloat(query["maxsegment"]);
          if (allsegment.toString().length != 0) {
            if (!gtf_MATH.betweenInt(maxsegment, 2, 20)) {
              gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Maximum segment length must be between 2 and 20.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
          }
        }
        if ("minsegment" in query) {
          /// 0 - 20
          minsegment = parseFloat(query["minsegment"]);

          if (allsegment.toString().length != 0) {
            if (!gtf_MATH.betweenInt(minsegment, 2, 20)) {
              gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Mininum segment length must be between 2 and 20.", embed: "", seconds: 0 }, msg, userdata);
              return;
            }
          }
        }
        if ("curviness" in query) {
          /// 0.0 - 1.0
          curviness = parseFloat(query["curviness"]);
          if (!gtf_MATH.betweenInt(curviness, 0, 1)) {
            gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Curviness value must be between 0 and 1.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        if ("maxangle" in query) {
          /// 50-150
          maxangle = parseFloat(query["maxangle"]);
          if (!gtf_MATH.betweenInt(maxangle, 40, 90)) {
            gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Max Angle value must be between 50 and 150.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
        }
        if (typeof query["type"] !== 'undefined') {
          type = query["type"];
        }
        if (typeof query["location"] !== 'undefined') {
          location = query["location"];
        }

        if (typeof query["surface"] !== 'undefined') {
          surface = query["surface"];
        }

        if (maxsegment < minsegment) {
          gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Maximum segment length is lower than the minimum segment length.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }

        if (minsegment > minsegment) {
          gtf_EMBED.alert({ name: "❌ Invalid Arguments", description: "Minimum segment length is greater than the maximum segment length.", embed: "", seconds: 0 }, msg, userdata);
          return;
        }

        var t = gtf_COURSEMAKER.createCourse({
          roadWidth: width,
          min: 40,
          max: 80,
          minSegmentLength: minsegment,
          maxSegmentLength: maxsegment,
          scale: 1,
          curviness: curviness,
          maxAngle: maxangle,
          location: location,
          surface: surface,
          layout: type,
        });
        gtf_COURSEMAKER.displayCourse(t, callback)

        function callback(course) {
        course["options"] = ["Drift", course["layout"]];
        course["author"] = msg.author.id;
        course["date"] = gtf_STATS.lastOnline(userdata)

        embed.setTitle(gtf_EMOTE.tracklogo + "__GTF Course Maker__");
        const attachment = new AttachmentBuilder(course["image"], {name: "course.png"});
        embed.setImage("attachment://course.png");
        var footer = "Type = " + type + " | " +
          "Road Width = " + width + " | " + "Segments = " + minsegment + ":" + maxsegment + " | " + "Curviness = " + curviness + " | " + "Max Angle = " + maxangle;
        pageargs["footer"] = "\n\n" + "**❓ This contains course information about your procedurally generated course. The red point would be the starting point.**";
        embed.setDescription("**Name:** " + course["name"] + "\n" +
        "**Environment:** " + course["location"] + " | " + course["surface"] + "\n" +
         "**Course Length:** " + [course["lengthkm"] + "km", course["length"] + "mi"][userdata["settings"]["UNITS"]] + pageargs["footer"]);
        embed.setFooter({text: footer});

    if (coursestats.length >= gtf_GTF.courselimit) {
       var emojilist = [{ emoji: "❌", emoji_name: "❌", name: "Courses Full", extra: "Once", button_id: 0 }];
    } else {
      var emojilist = [{ emoji: "📌", emoji_name: "📌", name: "Save Course", extra: "Once", button_id: 0 }];
    }
        var buttons = gtf_TOOLS.prepareButtons(emojilist, msg, userdata);

        gtf_DISCORD.send(msg, {embeds: [embed], files: [attachment], components: buttons }, coursefunc4)
        
        function coursefunc4(msg) {
          function save() {
            if (coursestats.length >= gtf_GTF.courselimit) {
              return;
            }
    
            delete course["image"]
            gtf_STATS.addCourse(course, userdata);
            gtf_STATS.save(userdata)
            gtf_EMBED.alert({ name: "✅ Success", description: "**" + course["name"] + "**" + " has been saved to your course list.", embed: "", seconds: 0 }, msg, userdata);
            return;
          }
          var functionlist = [save];
          gtf_TOOLS.createButtons(buttons, emojilist, functionlist, msg, userdata);
        }
        }
      }
  }
};
