const { generateAnimalCrossingPages } = require("./utils/animal-crossing");
const { generateIndex } = require("./utils");
const { generatePageSet } = require("./utils/pages");

generateIndex();
generateAnimalCrossingPages();
generatePageSet("photography");
generatePageSet("zelda", ["breath-of-the-wild"]);
