module.exports = {
  bold: () => {
    process.stdout.write("\x1b[1m");
  },
  underline: () => {
    process.stdout.write("\x1b[4m");
  },
  reverse: () => {
    process.stdout.write("\x1b[7m");
  },
  fill: (r, g, b) => {
    process.stdout.write(`\x1b[38;2;${r};${g};${b}m`);
  },
  background: (r, g, b) => {
    process.stdout.write(`\x1b[48;2;${r};${g};${b}m`);
  },
  clear: () => {
    console.log("\033[2J");
  },
  end: () => {
    process.stdout.write("\x1b[0m")
  }
};