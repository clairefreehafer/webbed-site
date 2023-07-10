import handleErrors from "../modules/errorHandling.js";

function renderSlideTitle(title) {
  const titleEl = document.querySelector("#title");
  if (titleEl.firstChild) {
    titleEl.removeChild(titleEl.firstChild);
  }
  if (title) {
    const titleElText = document.createTextNode(title);
    titleEl.appendChild(titleElText);
    titleEl.style.display = "block";
  }
}

function configureSlideCount(currentSlideIndex, numberOfSlides) {
  const slideCountText = document.createTextNode(`${currentSlideIndex + 1} / ${numberOfSlides}`);

  const slideCount = document.querySelector("#slide-count");

  if (slideCount.firstChild) {
    slideCount.removeChild(slideCount.firstChild);
  }

  slideCount.appendChild(slideCountText);
}

function createSlideShow() {
  const slides = document.getElementsByTagName("img");
  let currentSlideIndex = 0;
  const numberOfSlides = slides.length;

  // prev and next buttons
  function handleButtonClick(e, n) {
    const { target } = e;
    target.disabled = true;

    const currentSlide = slides[currentSlideIndex];
    // trigger fade out
    currentSlide.classList.remove("fade-in");
    currentSlide.classList.add("fade-out");

    // wait til fade out to load next slide
    setTimeout(() => {
      currentSlide.classList.remove("active");
      currentSlide.classList.remove("fade-out");

      currentSlideIndex += n;

      // loop around if needed
      if (currentSlideIndex >= numberOfSlides) {
        currentSlideIndex = 0;
      } else if (currentSlideIndex < 0) {
        currentSlideIndex = numberOfSlides - 1;
      }

      const nextSlide = slides[currentSlideIndex];
      nextSlide.classList.add("fade-in");
      nextSlide.classList.add("active");

      const imageTitle = slides[currentSlideIndex].title;

      renderSlideTitle(imageTitle);
      configureSlideCount(currentSlideIndex, numberOfSlides)

      target.disabled = false;
    }, 1000);
  }

  const nextButton = document.getElementById("next");
  nextButton.addEventListener("click", (e) => handleButtonClick(e, 1));
  const prevButton = document.getElementById("prev");
  prevButton.addEventListener("click", (e) => handleButtonClick(e, -1));

  const imageTitle = slides[currentSlideIndex].title;
  renderSlideTitle(imageTitle);

  configureSlideCount(currentSlideIndex, numberOfSlides);

  // show the first slide
  slides[0].classList.add("active");
}

try {
  createSlideShow();
} catch (e) {
  handleErrors(e);
}
