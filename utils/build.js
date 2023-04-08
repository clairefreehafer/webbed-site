const fs = require("fs").promises;
const path = require("node:path");
const { existsSync } = require("fs");

// const templateVariables = {
//   nav: "nav",
// };

const templateVariableRegex = new RegExp("{{ ([\\w\\d]+) }}", "g");

async function generatePhotographyPages() {
  try {
    const config = await fs.readFile(path.join(__dirname, "..", "photography", "pageDefinitions.json"), "utf8");
    const configJson = JSON.parse(config);

    // for the list of pages on the main page
    let listString = "<ul>";

    for (const page in configJson) {
      const pageConfig = configJson[page];
      const { template } = pageConfig;

      // create the page
      if (template) {
        fillTemplate(pageConfig);
      } else {

      }

      // add it to the list
      listString += `<li><a href="/build/photography/${page.replaceAll(" ", "-").html}">${page}</a></li>`
    }

    listString += "</ul>";

    // add final links list to main page
    let index = await fs.readFile(path.join(__dirname, "build-test", "photography", "index.html"), "utf8");
    index = replaceVariable("photographyList", listString, index);

    // TODO: add nav links

    await fs.writeFile(path.join(__dirname, "build", "photography", "index.html"), index);
  } catch (error) {
    console.error(error);
  }
}

async function fillTemplate(page) {
  try {
    const { template, title } = page;
    const html = await fs.readFile(path.join(__dirname, "..", "templates", `${template}.html`), "utf8");

    const templateVariables = html.matchAll(templateVariableRegex);

    for (const variable of templateVariables) {
      html = replaceVariable(variable[1]);
    }

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
    return html.replace(variable, content);
  }
  return html.replace(`{{ ${variable} }}`, content);
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

module.exports = {
  generatePhotographyPages
};