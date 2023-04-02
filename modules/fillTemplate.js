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

export function createGrid(numberOfImages, body) {
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  // portrait: images are in single column
  if (!isLandscape) {
    body.style.gridTemplateRows = `repeat(${numberOfImages}, 1fr)`;
  } else {
    switch (numberOfImages) {
      case 2:
        // arrange horizontally
        body.style.gridTemplateColumns = "1fr 1fr";
        break;
      case 4:
          // 2x2
          body.style.gridTemplateColumns = "1fr 1fr";
          body.style.gridTemplateRows = "1fr 1fr";
          break;
      default:
        // vertical column unless otherwise specified above or in custom styles
        body.style.gridTemplateRows = `repeat(${numberOfImages}, 1fr)`;
    }
  }
}

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