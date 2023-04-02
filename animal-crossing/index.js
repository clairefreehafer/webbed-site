import handleErrors from "../modules/errorHandling.js";
import { generatePageList } from "../modules/utils.js";

try {
  generatePageList("/animal-crossing/new-leaf/pageDefinitions.json", "new-leaf");
} catch (e) {
  handleErrors(e);
}