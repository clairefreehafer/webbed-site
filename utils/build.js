const fs = require("fs").promises;
const path = require("node:path");
const { existsSync } = require("fs");

// const templateVariables = {
//   nav: "nav",
// };

const templateVariableRegex = new RegExp("{{ ([\\w\\d]+) }}", "g");

const navLinks = ["home", "photography", "animal-crossing", "zelda"];

function generateNav(html, currentPage) {
  if (!navLinks.includes(currentPage)) {
    throw new Error("current page not recognized.");
  }
  let nav = "<ul>";

  for (const page of navLinks) {
    if (page === currentPage) {
      nav += `<li class="current-page" id="${page}-link">${handleSpaces(page, "space")}</li>`;
    } else {
      const link = page === "home" ? "" : `${handleSpaces(page, "dash")}/`;
      const dots = currentPage === "home" ? "." : "..";
      nav += `<li id="${page}-link"><a href="${dots}/${link}index.html">${handleSpaces(page, "space")}</a></li>`;
    }
  }

  nav += "</ul>";

  return replaceVariable("nav", nav, html);
}

/** can pass variable with or without brackets. */
function replaceVariable(variable, content, html) {
  if (templateVariableRegex.test(variable)) {
    return html.replaceAll(variable, content);
  }
  return html.replaceAll(`{{ ${variable} }}`, content);
}

async function makeDirectoryIfDoesntExist(dirArr) {
  const dirPath = path.join(__dirname, ...dirArr)
  try {
    if (!existsSync(dirPath)) {
      await fs.mkdir(dirPath);
    }
  } catch (e) {
    console.error(e);
  }
}

async function getPageConfig(folder) {
  try {
    const config = await fs.readFile(path.join(__dirname, "..", folder, "pageDefinitions.json"), "utf8");
    return JSON.parse(config);
  } catch (error) {
    console.error(error);
  }
}

/** convert string to use dash for spaces or actual spaces */
function handleSpaces(string, dashOrSpace) {
  if (!["dash", "space"].includes(dashOrSpace)) {
    throw new Error("need to know if using dashes or spaces!")
  }
  if (dashOrSpace === "dash") {
    return string.replaceAll(" ", "-");
  } else if (dashOrSpace === "space") {
    return string.replaceAll("-", " ");
  }
}

module.exports = {
  generateNav,
  makeDirectoryIfDoesntExist,
  replaceVariable,
  getPageConfig,
  handleSpaces
};