import handleErrors from "./modules/errorHandling.js";
import { generatePageList, getGrassColor } from "./modules/utils.js";

function applyPageBackground() {
  const grassImage = getGrassColor("square");
  const body = document.querySelector("body");

  body.style.backgroundImage = `url("./images/grass/${grassImage}")`;
}

function getRandomPage() {
  alert("i do nothing :)");
  return;
  const randomIndex = Math.floor(Math.random() * (listOfPages.length));
  window.location.href = listOfPages[randomIndex];
}

try {
  // applyPageBackground();

  // generatePageList("photography");
  // generatePageList("new-leaf");

  // document.querySelector("#random").addEventListener("click", getRandomPage);
} catch(e) {
  handleErrors(e);
}
