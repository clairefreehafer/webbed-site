import handleErrors from "../modules/errorHandling.js";
import { applyCustomStyles, createGrid, renderImages } from "../modules/fillTemplate.js";
import { getGrassColor, getPageConfig } from "../modules/utils.js";

async function generatePage(pageTitle, game) {
  let page = await getPageConfig(pageTitle, `/animal-crossing/${game}`);
  const { date, title, images, styles } = page;

  const jsDate = new Date(date[0], date[1], date[2]);

  const body = document.querySelector("body");
  const grassShape = game === "new-leaf" ? "circle" : "triangle";
  body.style.backgroundImage = `url('../images/grass/${getGrassColor(grassShape, jsDate)}')`;

  document.title = `${title} – claire freeahfer`;

  createGrid(page, body);

  renderImages(images, body);

  applyCustomStyles(styles);
}

try {
  const params = new URLSearchParams(window.location.search);

  const title = params.get("title");
  const game = params.get("game");
  generatePage(title, game);

} catch (e) {
  handleErrors(e);
}
