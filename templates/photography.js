import handleErrors from "../modules/errorHandling.js";
import { applyCustomStyles, createGrid, renderImages } from "../modules/fillTemplate.js";
import { getPageConfig } from "../modules/utils.js";

async function generatePage(pageName) {
  let page = await getPageConfig(pageName, "photography");
  const { name, images, styles } = page;
  const container = document.querySelector("body");

  document.title = `${name} – claire freeahfer`;

  createGrid(page, container);
  renderImages(images, container);
  applyCustomStyles(styles);
}

try {
  const name = new URLSearchParams(window.location.search).get("name");

  generatePage(name);
} catch (e) {
  handleErrors(e);
}
