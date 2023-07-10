const fs = require("fs").promises;
const path = require("node:path");
const { generateNav } = require("./build");

async function generateIndex() {
  let index = await fs.readFile(path.join(__dirname, "..", "index.html"), "utf8");

  index = generateNav(index, "home");

  await fs.writeFile(path.join(__dirname, "..", "build", "index.html"), index);
  console.log("generated index.html")
}

module.exports = {
  generateIndex
};