//Functions
require(__dirname + "/gtfbot2unleahsed/" + "files/directories.js");
require(__dirname + "/gtfmanager/" + "files/directories");

require(__dirname + "/gtfbot2unleahsed/index.js");
require(__dirname + "/gtfmanager/index.js");
require(__dirname + "/gtffithusim/index.js");

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