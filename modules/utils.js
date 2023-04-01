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
export function getGrassColor(shape, date) {
  if (!shape) throw new Error("missing grass shape!");

  if (!date) {
    date = new Date();
  }

  let dateRange;

  const month = date.getMonth() + 1;
  const day = date.getDate();

  switch (month) {
    case 1:
      dateRange = "1210-0224";
      break;
    case 2:
      if (day <= 24) {
        dateRange = "1210-0224";
      } else {
        dateRange = "0225-0331";
      }
      break;
    case 3:
      dateRange = "0225-0331";
      break;
    case 4:
    case 5:
    case 6:
      dateRange = "0401-0722";
      break;
    case 7:
      if (day <= 22) {
        dateRange = "0401-0722";
      } else {
        dateRange = "0723-0915";
      }
      break;
    case 8:
      dateRange = "0723-0915";
      break;
    case 9:
      if (day <= 15) {
        dateRange = "0723-0915";
      } else {
        dateRange = "0916-0930";
      }
      break;
    case 10:
      if (day <= 15) {
        dateRange = "1001-1015";
      } else if (day <= 29) {
        dateRange = "1016-1029";
      } else {
        dateRange = "1030-1112";
      }
      break;
    case 11:
      if (day <= 12) {
        dateRange = "1030-1112";
      } else if (day <= 28) {
        dateRange = "1113-1128";
      } else {
        dateRange = "1129-1209";
      }
      break;
    case 12:
      if (day <= 9) {
        dateRange = "1129-1209";
      } else {
        dateRange = "1210-0224";
      }
      break;
  }

  return `${shape}_${dateRange}.png`;
}
