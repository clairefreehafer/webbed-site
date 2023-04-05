import handleErrors from "../modules/errorHandling.js";
import { generatePageList, getAstrologyDateRange, getGrassColor } from "../modules/utils.js";

try {
  generatePageList("animal-crossing/new-horizons", "new-horizons");
  generatePageList("animal-crossing/new-leaf", "new-leaf");

  const grassColor = getGrassColor("square");
  const astrologyDateRange = getAstrologyDateRange();

  const body = document.querySelector("body");
  body.style.backgroundImage = `url("/images/grass/${grassColor}"`;

  const bulletImageStyles = document.createElement("style");
  bulletImageStyles.innerText = `.list > li { background-image: url("/images/star-fragments/fragment_${astrologyDateRange}.png"); }`;
  document.head.appendChild(bulletImageStyles);

  const textBackground = document.querySelector("#text-background");
  textBackground.style.backgroundImage = `url("/images/sand/${grassColor}"`;
} catch (e) {
  handleErrors(e);
}