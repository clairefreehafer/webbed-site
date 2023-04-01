import handleErrors from "../modules/errorHandling.js";
import { getGrassColor, getPageConfig } from "../modules/utils.js";

async function generatePage(pageName, pageFolder) {
  let page = await getPageConfig(pageName, pageFolder);
  const { date, name } = page;

  const jsDate = new Date(date[0], date[1], date[2]);

  const body = document.querySelector("body");
  body.style.backgroundImage = `url('../images/grass/${getGrassColor("circle", jsDate)}')`;

  document.title = `${name} – claire freeahfer`;

  // images
  page.images.forEach((image, i) => {
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
