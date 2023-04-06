import handleErrors from "../modules/errorHandling.js";
import { generatePageList, getAstrologyDateRange, getGrassColor } from "../modules/utils.js";

try {
  generatePageList("animal-crossing/new-horizons", "new-horizons");
  generatePageList("animal-crossing/new-leaf", "new-leaf");

  const grassColor = getGrassColor("square");
  const astrologyDateRange = getAstrologyDateRange();

  const body = document.querySelector("body");
  body.style.backgroundImage = `url("/images/grass/${grassColor}"`;

  const textBackground = document.querySelector("#text-background");
  textBackground.style.backgroundImage = `url("/images/sand/${grassColor}"`;
} catch (e) {
  const loadingEls = document.querySelectorAll(".loading");
  loadingEls.innerText = e;
  handleErrors(e);
} finally {
  const loadingEls = document.querySelectorAll(".loading");
  loadingEls.forEach(el => el.remove());
}