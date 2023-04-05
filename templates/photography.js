import handleErrors from "../modules/errorHandling.js";
import { applyCustomStyles, createGrid, renderImages } from "../modules/fillTemplate.js";
import { getPageConfig } from "../modules/utils.js";

async function generatePage(pageTitle) {
  let page = await getPageConfig(pageTitle, "photography");
  const { title, images, styles } = page;
  const container = document.querySelector("body");

  document.title = `${title} – claire freeahfer`;

  createGrid(page, container);
  renderImages(images, container);
  applyCustomStyles(styles);
}

try {
  const title = new URLSearchParams(window.location.search).get("title");

  generatePage(title);
} catch (e) {
  handleErrors(e);
}
