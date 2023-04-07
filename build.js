const { handleVariableReplacement } = require("./utils/build");
const fs = require("fs").promises;

const templateVariableRegex = new RegExp("{{ ([\\w\\d]+) }}", "g");

async function generatePage(path) {
  try {
    let html = await fs.readFile(path, "utf8");

    const matches = html.matchAll(templateVariableRegex);

    for (const match of matches) {
      const newHtml = await handleVariableReplacement(match[1]);
      html = html.replace(match[0], newHtml);
    }

    const newPath = path.replace("build-test", "build");
    await fs.writeFile(newPath, html);
  } catch (error) {
    console.error(error);
  }
}

// home page
generatePage("./build-test/index.html");