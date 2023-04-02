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

export function applyCustomStyles(styles) {
  if (!styles) return;

  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  Object.keys(styles).forEach(selectorOrOrientation => {
    let selectors;

    if (selectorOrOrientation === "landscape" && isLandscape) {
      selectors = Object.keys(styles.landscape);
    } else if (selectorOrOrientation === "portrait" && !isLandscape) {
      selectors = Object.keys(styles.portrait);
    } else {
      selector = selectorOrOrientation;
    }

    if (selectors) {
      const orientation = selectorOrOrientation;

      selectors.forEach(selector => {
        const el = document.querySelector(selector);
        if (!el || !el.style) {
          throw new Error ("can't apply custom styling");
        }

        const elStyles = styles[orientation][selector];

        Object.keys(elStyles).forEach(property => {
          el.style[property] = elStyles[property];
        })
      });
    } else {
      const selector = selectorOrOrientation;

      const el = document.querySelector(selector);
      if (!el || !el.style) {
        throw new Error ("can't apply custom styling");
      }

      const elStyles = styles[selector];

      Object.keys(elStyles).forEach(property => {
        el.style[property] = elStyles[property];
      })
    }
  });
}