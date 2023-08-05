const fs = require("fs").promises;
const { replaceVariable } = require("../utils/build");

async function updateBooksPages() {
  let index = await fs.readFile(`./templates/index.html`, "utf8");
  const json = await fs.readFile("./books/books.json", "utf8");
  const booksJson = JSON.parse(json);

  // add nav to index

  // update each page based on json changes

  // maybe include a selection of each list on the index?
}