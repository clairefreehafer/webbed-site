const fs = require("fs").promises;
const path = require("node:path");
const { generateNav, makeDirectoryIfDoesntExist, replaceVariable, getPageConfig } = require("./build");

async function generateAnimalCrossingPages() {
  try {
    const config = await getPageConfig("animal-crossing/new-horizons");

    let listString = "<ul>";

    for (const page in config) {
      const pageConfig = config[page];
      // only one AC template atm
      const { template } = pageConfig;

      // create the page
      if (template) {
        // generateAnimalCrossingPage(pageConfig);
      } else {
        console.log(`No template for ${pageConfig.title}`);
      }

      // add it to the list
      listString += `<li><a href="./${page.replaceAll(" ", "-")}.html">${page}</a></li>`;
    }

    listString += "</ul>";

    // add final links list to main page
    // DEPENDS ON GAME
    let index = await fs.readFile(path.join(__dirname, "..", "animal-crossing", "index.html"), "utf8");
    // index = replaceVariable("photographyList", listString, index);

    // add nav links
    index = generateNav(index);

    // create index
    await makeDirectoryIfDoesntExist(["..", "build", "animal-crossing"]);
    await fs.writeFile(path.join(__dirname, "..", "build", "animal-crossing", "index.html"), index);
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  generateAnimalCrossingPages
};