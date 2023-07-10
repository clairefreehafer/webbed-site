const fs = require("fs").promises;
const path = require("node:path");
const { SMUGMUG_API_KEY } = require("../creds");
const { generateNav, makeDirectoryIfDoesntExist, replaceVariable, getPageConfig } = require("./build");

async function generatePhotographyPages() {
  try {
    await makeDirectoryIfDoesntExist(["..", "build", "photography"]);

    const configJson = await getPageConfig("photography");

    // for the list of pages on the main page
    let listString = "<ul>";

    for (const page in configJson) {
      const pageConfig = configJson[page];
      const { template } = pageConfig;

      // create the page
      if (template) {
        generatePhotographyPage(pageConfig);
        console.log(`generated photography / ${pageConfig.title}`);
      } else {
        console.log(`No template for ${pageConfig.title}`);
      }

      // add it to the list
      listString += `<li><a href="./${page.replaceAll(" ", "-")}.html">${page}</a></li>`;
    }

    listString += "</ul>";

    // add final links list to main page
    let index = await fs.readFile(path.join(__dirname, "..", "photography", "index.html"), "utf8");
    index = replaceVariable("photographyList", listString, index);

    // add nav links
    index = generateNav(index);

    // create index
    await fs.writeFile(path.join(__dirname, "..", "build", "photography", "index.html"), index);
    console.log("generated photography / index.html")
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

      imageHtml += `<img src="${imageSrc}" alt="${image.alt}" id="image-${i}" title="${image.title || ""}" />`
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

module.exports = {
  generatePhotographyPages
};