//REMOTE 12182023
const { Client, GatewayIntentBits, Partials, Discord, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder, StringSelectMenuBuilder, ButtonBuilder, SelectMenuBuilder } = require("discord.js");
////////////////////////////////////////////////////
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

module.exports.createslashcommands = function() {
  var fs = require("fs")
var slashcommands = JSON.parse(fs.readFileSync((__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfmanager") || (__dirname.split("/").slice(0, 4).join("/") + "/").includes("gtfbot2unleahsed") ? __dirname.split("/").slice(0, 4).join("/") + "/" : __dirname.split("/").slice(0, 5).join("/") + "/" + "jsonfiles/slashcommands.json", "utf8"))
  
const rest = new REST({ version: '10' }).setToken(process.env.SECRET);
const commands = []
var keys = Object.keys(slashcommands)

for (var i = 0; i < keys.length; i++) {
  var c = slashcommands[keys[i]]
  var slashcommand = new SlashCommandBuilder()
  slashcommand.setName(c["name"])
  slashcommand.setDescription(c["description"])
  if (c["name"] == "garage") {
    c = gtf_SLASHCOMMANDS.garageoptions()
  }
  if (c["name"] == "car") {
    c["options"] = gtf_SLASHCOMMANDS.caroptions()
  }
  if (c["name"] == "wheels") {
    c["options"] = gtf_SLASHCOMMANDS.wheeloptions()
  }
  if (c["name"] == "home") {
    c["options"] = gtf_SLASHCOMMANDS.homeoptions()
  }
  for (var j = 0; j < c["options"].length; j++) {
    if (typeof c["options"][j]["required"] === 'undefined') {
      var required = false
    } else {
      var required = c["options"][j]["required"]
    }
    if (typeof c["options"][j]["choices"] === 'undefined') {
      var choices = []
    } else {
      var choices = c["options"][j]["choices"]
    }
    if (c["options"][j]["type"] == 4) {
      
    }
    var set = function(option) {
      option.setName(c["options"][j]["name"]).setDescription(c["options"][j]["description"]).setRequired(required)
      choices.map(x => option.addChoices(x))
      return option
    }
    if (c["options"][j]["type"] == 4) {
      slashcommand.addIntegerOption(option => set(option))
    } else if (c["options"][j]["type"] == 5) {
      slashcommand.addBooleanOption(option => set(option)) 
    } else if (c["options"][j]["type"] == 6) {
      slashcommand.addMentionableOption(option => set(option)) 
    } else if (c["options"][j]["type"] == 7) {
      slashcommand.addChannelOption(option => set(option)) 
    } else if (c["options"][j]["type"] == 10) {
      slashcommand.addNumberOption(option => set(option)) 
    } else if (c["options"][j]["type"] == 11) {
      slashcommand.addAttachmentOption(option => set(option))  
    } else {
    slashcommand.addStringOption(option => set(option))
     }
  }
    commands.push(slashcommand)
}
 
rest.put(
	Routes.applicationCommands(gtf_USERID),
	{ body: commands },
).then((data) => console.log(`Successfully registered ${commands.length} application global commands.`))
	.catch(console.error)

 
  /*
rest.put(Routes.applicationGuildCommands(gtf_USERID, gtf_SERVERID), { body: [] })
	.then((data) => console.log(`Successfully registered ${data.length} application guild commands.`))
	.catch(console.error)
 */
}

module.exports.caroptions = function () {
  var options = [];
options.push({
  name: "options",
  description: "Select an option.",
  type: 3,
  required: true,
  choices: [
    { name: "❗ Menu", value: "list" },
    { name: "Select All [manufacturer/type1/drivetrain1..]", value: "select" },
    { name: "Car Discounts", value: "selectused" },
    { name: "Car Search [name]", value: "search" },
    { name: "📊 Show Statistics", value: "info" },
  ],
});
  //   
var list = gtf_CARS.list("makes");
var choices = [];
var indexcarcommand = 1;
var label = ["abcdef", "fghijklm", "mnopqrs", "stvwxyz"];

var name = "manufacturer__" + label[indexcarcommand - 1];
for (var i = 0; i < list.length; i++) {
  choices.push({ name: list[i].split(",").join(" "), value: list[i].split(",").join(" ") });
  if (choices.length >= 25 || i == list.length - 1) {
    var variable = { name: name.toString(), description: "(Select All) Select a manufacturer (1 Only).", type: 3, required: false, choices: choices };
    options.push(variable);
    choices = [];
    name = "manufacturer" + "__" + label[indexcarcommand];

    indexcarcommand++;
  }
}

var choices2 = [];
var options2 = [];
var indexcarcommand = 1;

//var name = "manufacturer__" + label[indexcarcommand - 1];
  /*
for (var y = 0; y < list.length; y++) {
  choices2.push({ name: list[y].split(",").join(" "), value: list[y].split(",").join(" ") });
  if (choices2.length >= 25 || y == list.length - 1) {
    var variable = { name: name.toString(), description: "Select a manufacturer (Only 1 manufacturer).", type: 3, required: false, choices: choices2 };
    options2.push(variable);
    choices2 = [];
    name = "manufacturer" + "__" + label[indexcarcommand];
    indexcarcommand++;
  }
}

  */

var list2 = ["Production", "Aftermarket", "Race Car", "Race Car: GT4", "Race Car: GT3", "Race Car: GT2", "Race Car: GT1", "Race Car: GT500", "Race Car: GT300", "Race Car: LMP", "Formula", "Rally Car", "Concept", "Concept: VGT", "Kart"];
choices = [];
name = "type1";
for (var i = 0; i < list2.length; i++) {
  choices.push({ name: list2[i], value: list2[i] });
}
options.push({ name: name.toString(), description: "(Select All) Select a type (1 Only).", type: 3, required: false, choices: choices });

var list22 = gtf_CARS.list("countries");
choices = [];
name = "country1";
for (var i = 0; i < list22.length; i++) {
  choices.push({ name: list22[i], value: list22[i] });
}
options.push({ name: name.toString(), description: "(Select All) Select a country (1 Only).", type: 3, required: false, choices: choices });

var list3 = ["FF", "FR", "MR", "4WD", "RR"];
choices = [];
name = "drivetrain1";
for (var i = 0; i < list3.length; i++) {
  choices.push({ name: list3[i], value: list3[i] });
}
options.push({ name: name.toString(), description: "(Select All) Select a drivetrain (1 Only).", type: 3, required: false, choices: choices });

var list3 = ["NA", "TB", "SC", "TB-SC", "EV"];
choices = [];
name = "engine1";
for (var i = 0; i < list3.length; i++) {
  choices.push({ name: list3[i], value: list3[i] });
}
options.push({ name: name.toString(), description: "(Select All) Select an engine aspiration (1 Only).", type: 3, required: false, choices: choices });

var list4 = ["Truck", "SUV", "Minivan"];
choices = [];
name = "special1";
for (var i = 0; i < list4.length; i++) {
  choices.push({ name: list4[i], value: list4[i] });
}
options.push({ name: name.toString(), description: "(Select All) Select a special tag (1 Only).", type: 3, required: false, choices: choices });

options.push({
          name: "fpplimit",
          description: "(Select All) Type a number of a FPP limit to filter by.",
          type: 4,
          required: false
})
options.push({
          name: "powerlimit",
          description: "(Select All) Type a number of a power limit (HP) to filter by.",
          type: 4,
          required: false
})
  options.push({
          name: "weightlimit",
          description: "(Select All) Type a number of a weight limit (Ibs) to filter by.",
          type: 4,
          required: false
})
  
options.push({ name: "name", description: "Type the name of the car to search (Case-Insensitive).", type: 3, required: false });
options.push({
  name: "number",
  description: "Pick a number associated with the list in manufacturer (/car) or garage (/garage).",
  type: 4,
  required: false,
});
  return options
};

module.exports.garageoptions = function () {
  var options = gtf_SLASHCOMMANDS.caroptions().slice(1)
  var garage = {
      name: "garage",
      description: "🏁 Displays your garage cars.",
      options: [
        {
          name: "options",
          description: "Select an option.",
          type: 3,
          required: true,
          choices: [
            {
              name: "❗ Open Garage",
              value: "list",
            },
            {
              name: "View Current Car",
              value: "viewcurrent",
            },
            {
              name: "View Car [number]",
              value: "view",
            },
            {
              name: "Sell Car [number]",
              value: "sell",
            },
          ],
        },
        ...options,
        {
          name: "favoritesonly",
          description: "View all your favorite cars.",
          type: 3,
          required: false,
          choices: [
            {
              name: "Enable",
              value: "enable",
            },
          ],
        }
      ],
    }
  return garage
}

module.exports.wheeloptions = function () {
  var choices = [
        {
            "name": "❗ Menu",
            "value": "list"
        }]
  var list = gtf_WHEELS.list("makes")
  for (var i = 0; i < list.length; i++) {
    choices.push({name:list[i].split(",").join(" "), value:list[i].split(",").join(" ")})
  }
  return [{
      "name": "options",
      "description": "Select a wheel manufacturer.",
      "type": 3,
      "required": true,
      "choices": choices
      },
      {
      "name": "number",
      "description": "The number argument.",
      "type": 4,
      "required": false
      }]
}

module.exports.homeoptions = function () {
  var choices = []
  var options = [{
      "name": "options",
      "description": "Select an option.",
      "type": 3,
      "required": false,
      "choices": []
  }]
  var list = gtf_GTF.commandlist
  for (var i = 0; i < list.length; i++) {
    choices.push({name:list[i][1], value:list[i][0]})
  }
  options[0]["choices"] = choices
  return options
}