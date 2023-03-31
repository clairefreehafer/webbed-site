/* jshint esversion: 8 */
import { getPageConfig } from "./utils.js";

const templateIds = {
  image: "#image-", // add index to end
};

function isCorrectTemplate(pageTemplate) {
  const regex = /(?<=templates\/).+(?=\?)/;
  const currentTemplate = window.location.href.match(regex);
  return currentTemplate && currentTemplate[0] === pageTemplate;
}

async function fillTemplate(pageName, pageFolder) {
  let page;

  try {
    page = await getPageConfig(pageName, pageFolder);
  } catch (e) {
    document.title = "something went wrong :(";
    console.error(e);
  }
  
  if (!isCorrectTemplate(page.template)) {
    document.title = "oops! wrong template!";
    console.error("oops! wrong template!");
  }
  
  document.title = `${page.name} – claire freeahfer`;
  
  const body = document.querySelector("body");
  
  // images
  page.images.forEach((image, i) => {
    const imageEl = document.querySelector(`${templateIds.image}${i}`);
    
    imageEl.src = image.src;
    imageEl.alt = image.alt;
    
    body.appendChild(imageEl);
  });
  
  // styles
  if (page.styles) {
    
    Object.keys(page.styles).forEach(selector => {
      const el = document.querySelector(selector);
      el.setAttribute("style", page.styles[selector]);
    })
  }
}

const params = new URLSearchParams(window.location.search);

const pageName = params.get("name");
const pageFolder = params.get("folder");

fillTemplate(pageName, pageFolder);