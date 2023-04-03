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

export function createSlideShow({ images }) {
  const slides = document.getElementsByClassName("slide");
  let currentSlideIndex = 0;
  const numberOfSlides = images.length;

  function handleButtonClick(n) {
    slides[currentSlideIndex].classList.remove("active");

    currentSlideIndex += n;

    if (currentSlideIndex >= numberOfSlides) {
      currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
      currentSlideIndex = numberOfSlides - 1;
    }

    const nextSlide = slides[currentSlideIndex];
    nextSlide.classList.add("active");
  }

  const nextButton = document.getElementById("next");
  nextButton.addEventListener("click", () => handleButtonClick(1));
  const prevButton = document.getElementById("prev");
  prevButton.addEventListener("click", () => handleButtonClick(-1));

  slides[0].classList.add("active");
}

export function renderImages(images, root, extraClass) {
  images.forEach((image, i) => {
    const imageEl = document.createElement("img");

    imageEl.src = image.src;
    imageEl.alt = image.alt;
    imageEl.id = `image-${i}`;

    if (extraClass) {
      imageEl.classList.add(extraClass);
    }

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