//Functions
require(__dirname + "/gtfbot2unleahsed/" + "files/directories");
require(__dirname + "/gtfmanager/" + "files/directories");

require(__dirname + "/gtfbot2unleahsed/index.js");
require(__dirname + "/gtfmanager/index.js");
//require(__dirname + "/gtffithusim/index.js");
//restartbot()

function restartbot() {
  console.log("Restarting bot...");
  const { exec } = require("child_process");

  exec("kill 1", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

setTimeout(function(x){
  restartbot()
}, 3600000)

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(d) { //

  log_file.write(util.format(d) + '\n');

  log_stdout.write(util.format(d) + '\n');

};