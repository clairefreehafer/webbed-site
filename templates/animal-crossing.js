/* jshint esversion: 8 */

import { getPageConfig } from "../modules/utils.js";

async function generatePage() {
  let page;

  try {
    page = await getPageConfig(pageName, pageFolder);
  } catch (e) {
    document.title = "something went wrong :(";
    console.error(e);
  }
  
  document.title = `${page.name} – claire freeahfer`;
  
  // images
  page.images.forEach((image, i) => {
    const imageEl = document.createElement("img");
    
    imageEl.src = image.src;
    imageEl.alt = image.alt;
  });
}

const params = new URLSearchParams(window.location.search);

const pageName = params.get("name");
const pageFolder = params.get("folder");

generatePage(pageName, pageFolder);