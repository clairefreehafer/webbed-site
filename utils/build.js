const fs = require("fs").promises;

const templateVariables = {
  nav: "nav",
};

async function handleVariableReplacement(variable) {
  try {
    let newHtml = "";

    switch (variable) {
      case templateVariables.nav:
        newHtml = await generateNav();
      break;
      default:
        console.error(`no matching generator for variable ${variable}`);
    }

    return newHtml;
  } catch (error) {
    console.error(error);
  }
}

async function generateNav() {
  try {
    const nav = await fs.readFile("./config/nav.json", "utf8");
    const config = JSON.parse(nav);

    let navString = "<ul>";

    for (let page in config) {
      navString += `<li><a href="${config[page].href}">${page}</a></li>`;
    }

    navString += "</ul>";

    return navString;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  handleVariableReplacement,
  generateNav
};