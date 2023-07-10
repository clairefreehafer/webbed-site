const fs = require("fs").promises;
const path = require("node:path");
const { existsSync } = require("fs");
const { SMUGMUG_API_KEY } = require("../creds");

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
      nav += `<li class="current-page">${handleSpaces(page, "space")}</li>`;
    } else {
      const link = page === "home" ? "" : `${handleSpaces(page, "dash")}/`;
      nav += `<li><a href="/${link}index.html">${handleSpaces(page, "space")}</a></li>`;
    }
  }

  nav += "</ul>";

  return replaceVariable("nav", nav, html);
}

async function fillTemplate(page) {
  try {
    const { template, title } = page;
    const html = await fs.readFile(path.join(__dirname, "..", "templates", `${template}.html`), "utf8");

    // const templateVariables = html.matchAll(templateVariableRegex);

    // for (const variable of templateVariables) {
    //   console.log(variable)
    //   html = replaceVariable(variable[1], page[variable[1]], html);
    // }

    await makeDirectoryIfDoesntExist(["..", "build", "pages"]);
    const location = path.join(__dirname, `../build/pages/${title.replaceAll(" ", "-")}.html`);
    await fs.writeFile(location, html);
  } catch (e) {
    console.error(e);
  }
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

// async function handleVariableReplacement(variable) {
//   try {
//     let newHtml = "";

//     switch (variable) {
//       case templateVariables.nav:
//         newHtml = await generateNav();
//         break;
//       case "photographyList":
//         newHtml = await generateListOfLinks("./photography/pageDefinitions.json");
//         break;
//       default:
//         console.error(`no matching generator for variable ${variable}`);
//     }

//     return newHtml;
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function generateNav() {
//   try {
//     const nav = await fs.readFile("./config/nav.json", "utf8");
//     const config = JSON.parse(nav);

//     let navString = "<ul>";

//     for (let page in config) {
//       navString += `<li><a href="${config[page].href}">${page}</a></li>`;
//     }

//     navString += "</ul>";

//     return navString;
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function generateListOfLinks(configPath) {
//   try {
//     const config = await fs.readFile(configPath, "utf8");
//     const configJson = JSON.parse(config);

//     let listString = "<ul>";

//     for (let page in configJson) {
//       console.log(page)
//       const pageConfig = configJson[page];
//       const { template } = pageConfig;

//       if (template) {
//         listString += `<li><a href="/templates/${template}.html">${page}</a></li>`;
//         // grab correct template
//         // fill out template
//         // create as page
//       }
//     }

//     listString += "</ul>";

//     return listString;
//   } catch (error) {
//     console.error(error);
//   }
// }

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
  getPageConfig
};