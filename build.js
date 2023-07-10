const { generatePhotographyPages } = require("./utils/photography");
const { rmSync, existsSync, mkdirSync, copyFileSync } = require("fs");
const path = require("node:path");
const { generateAnimalCrossingPages } = require("./utils/animal-crossing");

if (existsSync(path.join(__dirname, "build"))) {
  rmSync(path.join(__dirname, "build"), { recursive: true });
}
mkdirSync(path.join(__dirname, "build"));

// copy other static files for now
const filesToCopy = ["index.html", "index.js", "index.css", "not_found.html", "style.css", "neocities.png"];

for (const file of filesToCopy) {
  copyFileSync(path.join(__dirname, file), path.join(__dirname, `build/${file}`));
}

generatePhotographyPages();
generateAnimalCrossingPages();
