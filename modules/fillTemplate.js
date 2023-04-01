import handleErrors from "./errorHandling.js";
import { getPageConfig } from "./utils.js";

const templateIds = {
  image: "#image-", // add index to end
};

// function isCorrectTemplate(pageTemplate) {
//   const regex = /(?<=templates\/).+(?=\?)/;
//   const currentTemplate = window.location.href.match(regex);
//   return currentTemplate && currentTemplate[0] === pageTemplate;
// }

export function renderImages(images, body) {
  images.forEach((image, i) => {
    const imageEl = document.createElement("img");

    imageEl.src = image.src;
    imageEl.alt = image.alt;
    imageEl.id = `image-${i}`;

    body.appendChild(imageEl);
  });
}

async function fillTemplate(pageName, pageFolder) {
  const page = await getPageConfig(pageName, pageFolder);
  const { template, images } = page;
  console.log(template)

  // if (!isCorrectTemplate(template)) {
  //   throw new Error (`oops! wrong template! expected: ${template}`);
  // }

  document.title = `${page.name} – claire freeahfer`;

  const body = document.querySelector("body");

  // images
  renderImages(images, body)

  // styles
  if (page.styles) {

    Object.keys(page.styles).forEach(selector => {
      const el = document.querySelector(selector);
      el.setAttribute("style", page.styles[selector]);
    })
  }
}

try {
  const params = new URLSearchParams(window.location.search);

  const pageName = params.get("name");
  const pageFolder = params.get("folder");

  // fillTemplate(pageName, pageFolder);
} catch (e) {
  handleErrors(e);
}