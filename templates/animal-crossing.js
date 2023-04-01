import handleErrors from "../modules/errorHandling.js";
import { getGrassColor, getPageConfig } from "../modules/utils.js";

// break apart into pieces to be reused in other generators
async function generatePage(pageName, pageFolder) {
  let page = await getPageConfig(pageName, pageFolder);
  const { date, name, images } = page;

  const jsDate = new Date(date[0], date[1], date[2]);

  const body = document.querySelector("body");
  body.style.backgroundImage = `url('../images/grass/${getGrassColor("circle", jsDate)}')`;

  document.title = `${name} – claire freeahfer`;

  const numberOfImages = images.length;

  // image orientation
  switch (numberOfImages) {
    case 1:
      // default
      break;
    case 2:
      if (window.matchMedia("(orientation: landscape)").matches) {
        body.style.gridTemplateColumns = "1fr 1fr";
      }
      break;
    case 3:
      // ???
      break;
    case 4:
      if (window.matchMedia("(orientation: landscape)").matches) {
        body.style.gridTemplateColumns = "1fr 1fr";
        body.style.gridTemplateRows = "1fr 1fr";
      } else {
        body.style.gridTemplateColumns = "1fr";
        body.style.gridTemplateRows = "1fr 1fr 1fr 1fr";
      }
      break;
  }

  // images
  images.forEach((image, i) => {
    const imageEl = document.createElement("img");

    imageEl.src = image.src;
    imageEl.alt = image.alt;
    imageEl.id = `image-${i}`;

    body.appendChild(imageEl);
  });
}

try {
  const params = new URLSearchParams(window.location.search);

  const pageName = params.get("name");
  const pageFolder = params.get("folder");

  generatePage(pageName, pageFolder);
} catch (e) {
  handleErrors(e);
}
