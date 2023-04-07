const fs = require("fs");

const templates = fs.readdir("./templates", (err, data) => {
  if (err) throw err;
  return data.filter(file => file.includes("html"));
});

// build nav
const navConfig = fs.readFile("./config/nav.json", "utf8", (err, data) => {
  if (err) throw err;
  return JSON.parse(nav);
});

const pagesWithLinks = [
  ""
]

// build page links
// fs.readFile("./animal-crossing/new-horizons/pageDefinitions.json", "utf8", (err, data) => {
//   if (err) throw err;
//   console.log(JSON.parse(data));
// });

// build pages
