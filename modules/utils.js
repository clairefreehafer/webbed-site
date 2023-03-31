export async function fetchPages(pageFolder) {
  return fetch(`../${pageFolder}/pageDefinitions.json`)
    .then(response => response.json())
    .catch(e => {
      throw new Error("failed to fetch page definitions JSON", e)
    });
}

export async function getPageConfig(pageName, pageFolder) {
  const pages = await fetchPages(pageFolder)
  return pages[pageName];
}

const grassShapes = {
  circle: "circle",
  squiare: "square",
  triangle: "triangle"
};

// https://nookipedia.com/wiki/User:AlexBot2004/Grass
const grassDates = {
  
};

export function getGrassColor(shape, date) {
  if (!date) {
    date = Date.now();
  }
  
  
}
