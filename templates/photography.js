import handleErrors from "../modules/errorHandling.js";
import { applyCustomStyles, createGrid, renderImages } from "../modules/fillTemplate.js";
import { getPageConfig } from "../modules/utils.js";

// break apart into pieces to be reused in other generators
async function generatePage(pageName, pageFolder) {
  let page = await getPageConfig(pageName, pageFolder);
  const { name, images, styles } = page;

  const body = document.querySelector("body");

  document.title = `${name} – claire freeahfer`;

  const numberOfImages = images.length;

  createGrid(numberOfImages, body);

  renderImages(images, body);

  applyCustomStyles(styles);
}

try {
  const params = new URLSearchParams(window.location.search);

  const pageName = params.get("name");
  const pageFolder = params.get("folder");

  generatePage(pageName, pageFolder);
} catch (e) {
  handleErrors(e);
}
