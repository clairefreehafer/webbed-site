const fs = require("fs").promises;
const { generateNav, replaceVariable, getPageConfig, handleSpaces } = require("./build");

const ANIMAL_CROSSING_GAMES = ["new-horizons", "new-leaf"];

async function generateAnimalCrossingPages() {
  try {
    let index = await fs.readFile("./animal-crossing/index.html", "utf8");

    let listString = "";

    for (const game of ANIMAL_CROSSING_GAMES) {
      const config = await getPageConfig(`animal-crossing/${game}`);

      listString += `<h3>${game.replace("-", " ")}</h3><ul class="list">`;

      for (const page in config) {
        const pageConfig = config[page];
        // only one AC template atm
        const { template, icon, date, title } = pageConfig;

        // create the page
        if (template) {
          generateAnimalCrossingPage(pageConfig, game);
          console.log(`generated animal-crossing / ${game} / ${title}`)
        } else {
          console.log(`No template for animal-crossing / ${game} / ${title}`);
        }

        // add icon
        let listItemStyle;
        if (icon) {
          listItemStyle = `background-image: url('/images/characters/${icon}.png');`;
        } else {
          const jsDate = new Date(date);
          const astrologyDateRange = getAstrologyDateRange(jsDate);
          listItemStyle = `background-image: url('/images/star-fragments/fragment_${astrologyDateRange}.png');`;
        }

        // add it to the list
        listString += `<li style="${listItemStyle}"><a href="./${game}/${page.replaceAll(" ", "-")}.html">${page}</a></li>`;
      }

      listString += "</ul>";
    }

    index = replaceVariable("animalCrossingList", listString, index);

    // add nav links
    // index = generateNav(index);

    // background images
    index = replaceVariable("grassColor", getGrassColor("square"), index);

    // create index
    await fs.writeFile("./animal-crossing/index.html", index);
    console.log("generated animal-crossing / index.html")
  } catch (error) {
    console.error(error);
  }
}

async function generateAnimalCrossingPage(page, game) {
  try {
    const { date, title, images } = page;
    let html = await fs.readFile("./templates/animal-crossing.html", "utf8");

    // page title
    html = replaceVariable("title", title, html);

    // page layout
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

    // set background
    const jsDate = new Date(date[0], date[1], date[2]);
    const grassShape = game === "new-leaf" ? "circle" : "triangle";
    html = replaceVariable("grassColor", getGrassColor(grassShape, jsDate), html);

    // create file
    await fs.writeFile(`./animal-crossing/${game}/${handleSpaces(title, "dash")}.html`, html);
  } catch (e) {
    console.error(e);
  }
}

// https://nookipedia.com/wiki/User:AlexBot2004/Grass
function getGrassColor(shape, date) {
  if (!shape) throw new Error("missing grass shape!");

  if (!date) {
    date = new Date();
  }

  let dateRange;

  const month = date.getMonth() + 1;
  const day = date.getDate();

  switch (month) {
    case 1:
      dateRange = "1210-0224";
      break;
    case 2:
      if (day <= 24) {
        dateRange = "1210-0224";
      } else {
        dateRange = "0225-0331";
      }
      break;
    case 3:
      dateRange = "0225-0331";
      break;
    case 4:
    case 5:
    case 6:
      dateRange = "0401-0722";
      break;
    case 7:
      if (day <= 22) {
        dateRange = "0401-0722";
      } else {
        dateRange = "0723-0915";
      }
      break;
    case 8:
      dateRange = "0723-0915";
      break;
    case 9:
      if (day <= 15) {
        dateRange = "0723-0915";
      } else {
        dateRange = "0916-0930";
      }
      break;
    case 10:
      if (day <= 15) {
        dateRange = "1001-1015";
      } else if (day <= 29) {
        dateRange = "1016-1029";
      } else {
        dateRange = "1030-1112";
      }
      break;
    case 11:
      if (day <= 12) {
        dateRange = "1030-1112";
      } else if (day <= 28) {
        dateRange = "1113-1128";
      } else {
        dateRange = "1129-1209";
      }
      break;
    case 12:
      if (day <= 9) {
        dateRange = "1129-1209";
      } else {
        dateRange = "1210-0224";
      }
      break;
    default:
      throw new Error ("something went wrong finding the grass color.");
  }

  return `${shape}_${dateRange}.png`;
}

const astrologyDateRanges = {
  aquarius: "0120-0218",
  pisces: "0219-0320",
  aries: "0321-0419",
  taurus: "0420-0520",
  gemini: "0521-0621",
  cancer: "0622-0722",
  leo: "0723-0822",
  capricorn: "1222-0119"
};

function getAstrologyDateRange(date) {
  if (!date) {
    date = new Date();
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();

  switch (month) {
    case 1:
      if (day <= 19) {
        return astrologyDateRanges.pisces;
      } else {
        return astrologyDateRanges.aquarius;
      }
    case 2:
      if (day <= 18) {
        return astrologyDateRanges.aquarius;
      } else {
        return astrologyDateRanges.pisces;
      }
    case 3:
      if (day <= 20) {
        return astrologyDateRanges.pisces;
      } else {
        return astrologyDateRanges.aries;
      }
    case 4:
      if (day <= 19) {
        return astrologyDateRanges.aries;
      } else {
        return astrologyDateRanges.taurus;
      }
    case 5:
      if (day <= 20) {
        return astrologyDateRanges.taurus;
      } else {
        return astrologyDateRanges.gemini;
      }
      break;
    case 6:
      if (day <= 21) {
        return astrologyDateRanges.gemini;
      } else {
        return astrologyDateRanges.cancer;
      }
      break;
    case 7:
      if (day <= 22) {
        return astrologyDateRanges.cancer;
      } else {
        return astrologyDateRanges.leo;
      }
    case 8:
      if (day <= 22) {
        return astrologyDateRanges.leo;
      } else {
        //
      }
      break;
    // case 9:
    //   if (day <= 15) {
    //     dateRange = "0723-0915";
    //   } else {
    //     dateRange = "0916-0930";
    //   }
    //   break;
    // case 10:
    //   if (day <= 15) {
    //     dateRange = "1001-1015";
    //   } else if (day <= 29) {
    //     dateRange = "1016-1029";
    //   } else {
    //     dateRange = "1030-1112";
    //   }
    //   break;
    // case 11:
    //   if (day <= 12) {
    //     dateRange = "1030-1112";
    //   } else if (day <= 28) {
    //     dateRange = "1113-1128";
    //   } else {
    //     dateRange = "1129-1209";
    //   }
    //   break;
    case 12:
      if (day <= 21) {
        //
      } else {
        return astrologyDateRanges.pisces;
      }
      break;
    default:
      throw new Error (`something went wrong finding the star fragment for ${month}/${day}.`);
  }
}

module.exports = {
  generateAnimalCrossingPages,
  generateAnimalCrossingPage,
  getGrassColor
};