const { generateNav } = require("./utils/build");

const fs = require("fs").promises;


async function generatePage(path) {
  try {
    const html = await fs.readFile(path, "utf8");

    const htmlWithNav = await generateNav(html);

    console.log(htmlWithNav)

    const newPath = path.replace("build-test", "build");
    await fs.writeFile(newPath, htmlWithNav);
  } catch (error) {
    console.error(error);
  }
}

// home page
generatePage("./build-test/index.html");