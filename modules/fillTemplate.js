export function createGrid(page, root) {
  const { images, cols } = page;
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;

  if (cols && isLandscape) {
    root.style.gridTemplateColumns = `repeat(${page.cols}, 1fr)`;
  } else {
    // create a row for each image
    root.style.gridTemplateRows = `repeat(${images.length}, auto)`;

  }
}

export function renderImages(images, root) {
  images.forEach((image, i) => {
    const imageEl = document.createElement("img");

    imageEl.src = image.src;
    imageEl.alt = image.alt;
    imageEl.id = `image-${i}`;

    root.appendChild(imageEl);
  });
}

function applyAllStyles(selector, styles) {
  const el = document.querySelector(selector);
  if (!el || !el.style) {
    throw new Error ("can't apply custom styling");
  }

  Object.keys(styles).forEach(property => {
    el.style[property] = styles[property];
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
        applyAllStyles(selector, styles[orientation][selector]);
      });
    } else {
      const selector = selectorOrOrientation;

      applyAllStyles(selector, styles[selector]);
    }
  });
}