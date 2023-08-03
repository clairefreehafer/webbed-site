const fs = require("fs").promises;

const updatedToRead = [];
const updatedCurrentlyReading = [];
const updatedRead = [];

function updateBookStatus(book) {
  if (book.started.length && book.finished.length) {
    // started & finished = read
    updatedRead.push(book);
  } else if (book.started.length) {
    // started = currently reading
    updatedCurrentlyReading.push(book);
  } else if (!book.started.length && !book.started.length) {
    // neither started nor finished = to read
    updatedToRead.push(book);
  } else {
    // something funky has happened
    console.error(`started and finished values are weird for ${book.title}`);
  }
}

function sortBooksBy(sortType, bookA, bookB) {
  if (sortType === "started") {
    const startedDateA = new Date(bookA.started);
    const startedDateB = new Date(bookB.started);

    // most recent last
    return startedDateA - startedDateB;
  } else if (sortType === "finished") {
    const finishedDateA = new Date(bookA.finished);
    const finishedDateB = new Date(bookB.finished);

    // most recent first
    return finishedDateB - finishedDateA;
  } else if (sortType === "title") {
    return bookA.title > bookB.title ? 1 : -1;
  } else {
    console.error("invalid book sort type!");
  }
}

// TODO: openLibrary api integration?

(async function organizeBooksJson() {
  const json = await fs.readFile("./books/books.json", "utf8");

  const booksJson = JSON.parse(json);

  Object.values(booksJson).forEach((list) => {
    list.forEach(updateBookStatus);
  });

  updatedCurrentlyReading.sort((bookA, bookB) => {
    return sortBooksBy("started", bookA, bookB);
  });
  updatedToRead.sort((bookA, bookB) => {
    return sortBooksBy("title", bookA, bookB);
  });
  updatedRead.sort((bookA, bookB) => {
    return sortBooksBy("finished", bookA, bookB);
  });

  const updatedBooksJson = JSON.stringify({
    currentlyReading: updatedCurrentlyReading,
    toRead: updatedToRead,
    read: updatedRead,
  });

  await fs.writeFile("./books/books.json", updatedBooksJson);
})();