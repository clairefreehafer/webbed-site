import handleErrors from "../modules/errorHandling.js";
import { applyCustomStyles, createGrid, renderImages } from "../modules/fillTemplate.js";
import { getGrassColor, getPageConfig } from "../modules/utils.js";

async function generatePage(pageName, game) {
  let page = await getPageConfig(pageName, `/animal-crossing/${game}`);
  const { date, name, images, styles } = page;

  const jsDate = new Date(date[0], date[1], date[2]);

  const body = document.querySelector("body");
  body.style.backgroundImage = `url('../images/grass/${getGrassColor("circle", jsDate)}')`;

  document.title = `${name} – claire freeahfer`;

  createGrid(page, body);

  renderImages(images, body);

  applyCustomStyles(styles);
}

try {
  const params = new URLSearchParams(window.location.search);

  const name = params.get("name");
  const game = params.get("game");
  generatePage(name, game);

} catch (e) {
  handleErrors(e);
}
