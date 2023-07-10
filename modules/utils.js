export async function fetchPages(pageFolder) {
  return fetch(`../../${pageFolder}/pageDefinitions.json`)
    .then(response => response.json())
    .catch(e => {
      throw new Error("failed to fetch page definitions JSON " + e)
    });
}

export async function getPageConfig(pageTitle, pageFolder) {
  const pages = await fetchPages(pageFolder)
  return pages[pageTitle];
}

export async function generatePageList(path, listName) {
  const pages = await fetchPages(path);

  const list = document.querySelector(`#${listName || path}-list`);

  const listOfPages = [];

  Object.keys(pages).forEach(pageKey => {
    const page = pages[pageKey];
    const { template, title, date, icon } = page;

    const listItem = document.createElement("li");
    const link = document.createElement("a");

    if (template) {
      link.href = `/templates/${template}.html${generateTemplateParams(path, page)}`;
    } else {
      link.href = `/pages/${title}.html`;
    }

    const linkText = document.createTextNode(title);
    if (template === "animal-crossing") {
      if (icon) {
        listItem.style.backgroundImage = `url("/images/characters/${icon}.png")`;
      } else {
        const jsDate = new Date(date);
        const astrologyDateRange = getAstrologyDateRange(jsDate);
        listItem.style.backgroundImage = `url("/images/star-fragments/fragment_${astrologyDateRange}.png")`;
      }
    }

    link.appendChild(linkText);
    listItem.appendChild(link);
    listOfPages.push(listItem);
  });

  list.append(...listOfPages);
}

function generateTemplateParams(path, page) {
  if (path.includes("animal-crossing")) {
    // assuming path format `animal-crossing/game-title`
    const game = path.split("/")[1];
    return `?title=${page.title}&game=${game}`;
  }

  return `?title=${page.title}`;
}
