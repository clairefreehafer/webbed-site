const { generatePhotographyPages } = require("./utils/build");
const { rmSync, existsSync, mkdirSync } = require("fs");
const path = require("node:path");

if (existsSync(path.join(__dirname, "build"))) {
  rmSync(path.join(__dirname, "build"), { recursive: true });
}
mkdirSync(path.join(__dirname, "build"));

generatePhotographyPages();

