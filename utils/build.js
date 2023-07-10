const fs = require("fs").promises;
const path = require("node:path");
const { existsSync } = require("fs");
const { SMUGMUG_API_KEY } = require("../creds");

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
        generatePhotographyPage(pageConfig);
      } else {
        console.log(`No template for ${pageConfig.title}`);
      }

      // add it to the list
      listString += `<li><a href="./${page.replaceAll(" ", "-")}.html">${page}</a></li>`
    }

    listString += "</ul>";

    // add final links list to main page
    let index = await fs.readFile(path.join(__dirname, "..", "photography", "index.html"), "utf8");
    index = replaceVariable("photographyList", listString, index);

    // add nav links
    index = generateNav(index);

    await makeDirectoryIfDoesntExist(["..", "build", "photography"]);
    await fs.writeFile(path.join(__dirname, "..", "build", "photography", "index.html"), index);
  } catch (error) {
    console.error(error);
  }
}

async function generatePhotographyPage(page) {
  try {
    const { template, title } = page;
    // get template HTML
    let html = await fs.readFile(path.join(__dirname, "..", "templates", `${template}.html`), "utf8");

    // page title
    html = replaceVariable("title", title, html);

    // page layout
    const { images, cols } = page;
    let styles = `body {
      /* create row for each image. */
      grid-template-rows: repeat(${images.length}, auto);
    }`;

    html = replaceVariable("styles", styles, html);

    // add images
    let imageHtml = "";

    for (let i = 0; i < images.length; i++)  {
      const image = images[i];
      let imageSrc;

      if (image.key) {
        const response = await fetch(`https://api.smugmug.com/api/v2/image/${image.key}!largestimage?APIKey=${SMUGMUG_API_KEY}&shorturis=`, {
          headers: {
            Accept: "application/json",
          },
        });

        const responseJson = await response.json();

        imageSrc = responseJson.Response.LargestImage.Url;
      } else if (image.src) {
        imageSrc = image.src;
      } else {
        throw new Error ("no image url!");
      }

      imageHtml += `<img src="${imageSrc}" alt="${image.alt}" id="image-${i}" />`
    };

    html = replaceVariable("images", imageHtml, html);

    // create file
    await makeDirectoryIfDoesntExist(["..", "build", "photography"]);
    const location = path.join(__dirname, `../build/photography/${title.replaceAll(" ", "-")}.html`);
    await fs.writeFile(location, html);
  } catch (e) {
    console.error(e);
  }
}

function generateNav(html, currentPage) {
  const nav = `
    <ul>
      <li><a href="/index.html">home</a></li>
      <li><a href="/photgraphy/index.html">photography</a></li>
      <li><a href="/animal-crossing/index.html">animal crossing</a></li>
    </ul>
  `;

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