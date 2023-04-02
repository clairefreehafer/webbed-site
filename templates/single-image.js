import handleErrors from "../modules/errorHandling.js";
import { renderImages } from "../modules/fillTemplate.js";
import { getPageConfig } from "../modules/utils.js";

// break apart into pieces to be reused in other generators
async function generatePage(pageName, pageFolder) {
  let page = await getPageConfig(pageName, pageFolder);
  const { name, images, styles } = page;

  const body = document.querySelector("body");

  document.title = `${name} – claire freeahfer`;

  const numberOfImages = images.length;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  // lay out grid based on screen aspect ratio
  if (!isLandscape) {
    body.style.gridTemplateRows = `repeat(${numberOfImages}, 1fr)`;
  } else {
    switch (numberOfImages) {
      case 1:
        // default
        break;
      case 2:
        // arrange horizontally
        body.style.gridTemplateColumns = "1fr 1fr";
        break;
      case 3:
        // ???
        break;
      case 4:
        // 2x2
        body.style.gridTemplateColumns = "1fr 1fr";
        body.style.gridTemplateRows = "1fr 1fr";
        break;
    }
  }

  renderImages(images, body);

  // apply custom styles
  if (styles) {
    Object.keys(styles).forEach(selector => {
      const el = document.querySelector(selector);
      if (!el || !el.style) {
        throw new Error ("can't apply custom styling");
      }

      Object.keys(styles[selector]).forEach(property => {
        el.style[property] = styles[selector][property];
      })
    })
  }
}

try {
  const params = new URLSearchParams(window.location.search);

  const pageName = params.get("name");
  const pageFolder = params.get("folder");

  generatePage(pageName, pageFolder).catch(e => {
    throw new Error(e);
  });
} catch (e) {
  handleErrors(e);
}
