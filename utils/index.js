const fs = require("fs").promises;
const { generateNav, replaceVariable } = require("./build");

async function generateIndex() {
  let index = await fs.readFile("./templates/index.html", "utf8");

  index = replaceVariable("title", "home", index);
  index = generateNav(index, "home");
  index = replaceVariable("content", "", index);

  await fs.writeFile("./index.html", index);
  console.log("generated index.html");
}

module.exports = {
  generateIndex
};