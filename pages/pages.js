import * as pages from "../modules/pages.js";

function getCurrentPageInfo() {
  const { href } = window.location;
  const splitHref = href.split("/");
  const currentPage = `${splitHref[splitHref.length - 1]}.html`;

  const pageKey = Object.keys(pages).find(key => pages[key].name === currentPage);
  const pageInfo = pages[pageKey];
  console.log(pageInfo);
}

getCurrentPageInfo()
