const fs = require("fs").promises;
const path = require("node:path");
const { SMUGMUG_API_KEY } = require("../creds");

const { makeDirectoryIfDoesntExist, getPageConfig, handleSpaces, replaceVariable, generateNav } = require("./build");

async function generatePageSet(pageSet, subDirectories) {
  // create directory for the files
  await makeDirectoryIfDoesntExist(["..", "build", pageSet]);

  // create the list of the pages
  let pageList = "";

  // if there are subdirectories, like AC/zelda games
  if (subDirectories) {
    for (const subDirectory of subDirectories) {
      const location = `${pageSet}/${subDirectory}`;
      await makeDirectoryIfDoesntExist(["..", "build", location]);

      const config = await getPageConfig(`${pageSet}/${subDirectory}`);

      pageList += `<h3>${handleSpaces(subDirectory, "space")}</h3><ul class="list">`;

      pageList = await generatePages(config, location, pageList);
    }
  } else {
    const config = await getPageConfig(pageSet);

    pageList += "<ul>";

    pageList = await generatePages(config, pageSet, pageList);
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

async function generatePages(configJson, location, pageList) {
  try {
    for (const page in configJson) {
      const pageConfig = configJson[page];
      const { template, title } = pageConfig;

      // create the page
      if (template) {
        await generatePage(pageConfig, location);
        console.log(`generated ${location} / ${title}`);
      } else {
        console.log(`No template for ${location} / ${title}`);
      }

      const subDirectory = location.split("/");

      // add it to the list
      pageList += `<li><a href="./${subDirectory?.[1] ? `${subDirectory[1]}/` : ""}${handleSpaces(page, "dash")}.html">${handleSpaces(page, "space")}</a></li>`;
    }

    return pageList += "</ul>";
  } catch (e) {
    console.error(e);
  }
}

async function generatePage(page, location) {
  try {
    const { date, title, images, template } = page;

    let html = await fs.readFile(path.join(__dirname, "..", "templates", `${template}.html`), "utf8");

    // page title
    html = replaceVariable("title", title, html);

    // page layout - specific to grids
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

      imageHtml += `<img src="${imageSrc}" alt="${image.alt}" id="image-${i}" title="${image.title || ""}" />`;
    };

    html = replaceVariable("images", imageHtml, html);

    // custom stuff, like AC background
    if (location.includes("animal-crossing")) {
      // etc.
    }

    // create file
    await makeDirectoryIfDoesntExist(["..", "build", location]);
    const locationPath = path.join(__dirname, `../build/${location}/${handleSpaces(title, "dash")}.html`);
    await fs.writeFile(locationPath, html);
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  generatePageSet
}