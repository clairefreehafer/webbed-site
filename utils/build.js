const fs = require("fs").promises;

async function generateNav(html) {
  try {
    const navSplit = html.split("<nav></nav>");

    if (navSplit.length !== 2) {
      throw new Error("split html is more or less than 2 strings.");
    }

    const nav = await fs.readFile("./config/nav.json", "utf8");
    const config = JSON.parse(nav);

    let navString = "<nav><ul>";

    for (let page in config) {
      navString += `<li><a href="${config[page].href}">${page}</a></li>`;
    }

    navString += "</ul></nav>";

    return navSplit[0] + navString + navSplit[1];
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  generateNav
};