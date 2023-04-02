import handleErrors from "../modules/errorHandling.js";
import { generatePageList } from "../modules/utils.js";

try {
  generatePageList("photography");
} catch (e) {
  handleErrors(e);
}