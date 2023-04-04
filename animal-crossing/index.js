import handleErrors from "../modules/errorHandling.js";
import { generatePageList, getGrassColor } from "../modules/utils.js";

try {
  generatePageList("animal-crossing/new-leaf", "new-leaf");

  const grassColor = getGrassColor("square");

  const body = document.querySelector("body");
  body.style.backgroundImage = `url("/images/grass/${grassColor}"`;

  const textBackground = document.querySelector("#text-background");
  textBackground.style.backgroundImage = `url("/images/sand/${grassColor}"`;
} catch (e) {
  handleErrors(e);
}