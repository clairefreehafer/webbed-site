/* jshint esversion: 8 */

function getRandomPage() {
  alert("i do nothing :)");
  return;
  const randomIndex = Math.floor(Math.random() * (listOfPages.length));
  window.location.href = listOfPages[randomIndex];
}

async function generatePageList(listName) {
  const pages = await fetch(`./${listName}/pageDefinitions.json`).then(response => response.json());
  console.log(pages)
  const list = document.querySelector(`#${listName}-list`);

  const listOfPages = [];

  Object.keys(pages).forEach(pageKey => {
    const page = pages[pageKey];

    const listItem = document.createElement("li");
    const link = document.createElement("a");

    if (page.template) {
      link.href = `./templates/${page.template}.html?name=${page.name}&folder=${listName}`;
    } else if (page.images.length === 1) {
      //a utomatically choose 1 image template
    } else {
      link.href = `./pages/${page.name}`;
    }

    listOfPages.push(link.href);

    const linkText = document.createTextNode(page.title || page.name);

    link.appendChild(linkText);
    listItem.appendChild(link);
    list.appendChild(listItem);
  });
}

await generatePageList("photography");
await generatePageList("new-leaf");

document.querySelector("#random").addEventListener("click", getRandomPage);
