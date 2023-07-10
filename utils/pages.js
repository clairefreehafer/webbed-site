const fs = require("fs").promises;
const path = require("node:path");
const { generatePhotographyPage } = require("./photography");
const { generateAnimalCrossingPage } = require("./animal-crossing");
const { makeDirectoryIfDoesntExist, getPageConfig, handleSpaces, replaceVariable, generateNav } = require("./build");

const templateGenerators = {
  "photography": generatePhotographyPage,
  "animal-crossing": generateAnimalCrossingPage
}

async function generatePageSet(pageSet, subDirectories) {
  // create directory for the files
  await makeDirectoryIfDoesntExist(["..", "build", pageSet]);

  // create the list of the pages
  let pageList = "";

  // if there are subdirectories, like AC/zelda games
  if (subDirectories) {
    for (const subDirectory of subDirectories) {
      await makeDirectoryIfDoesntExist(["..", "build", pageSet, subDirectory]);

      const config = await getPageConfig(`${pageSet}/${subDirectory}`);

      pageList += `<h3>${handleSpaces(subDirectory, "space")}</h3><ul class="list">`;

      pageList = await generatePages(config, pageList);
    }
  } else {
    const config = await getPageConfig(pageSet);

    pageList += "<ul>";

    pageList = await generatePages(config, pageList);
  }

  // add final links list to main page
  let index = await fs.readFile(path.join(__dirname, "..", pageSet, "index.html"), "utf8");
  index = replaceVariable("list", pageList, index);

  // add nav links
  index = generateNav(index, pageSet);

  // create index
  await fs.writeFile(path.join(__dirname, "..", "build", pageSet, "index.html"), index);
  console.log(`generated page ${pageSet} / index.html`);
}

async function generatePages(configJson, pageList) {
  try {
    for (const page in configJson) {
      const pageConfig = configJson[page];
      const { template, title } = pageConfig;

      // create the page
      if (template) {
        const templateGenerator = templateGenerators[template] || generatePhotographyPage;
        await templateGenerator(pageConfig);
        console.log(`generated ${title}`);
      } else {
        console.log(`No template for ${title}`);
      }

      // add it to the list
      pageList += `<li><a href="./${handleSpaces(page, "dash")}.html">${handleSpaces(page, "space")}</a></li>`;
    }

    return pageList += "</ul>";
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  generatePageSet
}