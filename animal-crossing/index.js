import handleErrors from "../modules/errorHandling.js";
import { generatePageList, getGrassColor } from "../modules/utils.js";

try {
  generatePageList("animal-crossing/new-leaf", "new-leaf");

  const body = document.querySelector("body");
  body.style.backgroundImage = `url("/images/grass/${getGrassColor("square")}"`;
} catch (e) {
  handleErrors(e);
}