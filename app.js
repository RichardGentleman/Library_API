import express from "express";
import { library } from "./sourceData/sourceData.mjs";
import { validateFunction } from "./validation/validate.mjs";
import { bookRouter, bookIdRouter } from "./routers/bookRouter.mjs";
const app = express();
app.use(express.json());

app.get("/book/tags", (req, res) => {
  const tags = [];
  library.forEach((book) => {
    tags.push(...book.tags);
  });
  let filteredTagsArray = [...new Set(tags)];
  res.status(200).send(filteredTagsArray);
});

bookRouter
  .route("/book")
  .get((req, res) => {
    const books = [];
    library.forEach((book) => {
      books.push(book);
    });
    res.status(200).send(books);
  })
  .post((req, res) => {
  const book = req.body;
  book["id"] = 0;
  validateFunction(book).error ? res.status(405).send("New book not valid") : res.status(200).send(book);
});
app.use(bookRouter);

bookIdRouter
  .route("/book/:id")
  .get((req, res) => {
    const book = library[req.params.id];
    if (book) {
      res.status(200).send(book);
    } else if (isNaN(req.params.id)) {
      res.status(400).send("Invalid ID format supplied");
    } else {
      res.status(404).send("Book not found");
    }
  })
  .put((req, res) => {
    const book = library[req.params.id];
    if (book) {
      book.title = req.body.title;
      book.author = req.body.author;
      book.pages = req.body.pages;
      book.tags = req.body.tags;
      book.id = req.params.id;
      validateFunction(req.body).error ? res.status(405).send("New book not valid") : res.status(200).send(book);
    } else if (isNaN(req.params.id)) {
      res.status(400).send("Invalid ID format supplied");
    } else if (!book) {
      res.status(404).send("Book not found");
    }
  })
  .delete((req, res) => {
    const toBeDeleted = library[req.params.id];

    if (isNaN(req.params.id)) {
      res.status(400).send("Invalid ID format supplied");
    } else if (!toBeDeleted) {
      res.status(404).send("Book not found");
    } else if (toBeDeleted) {
      res.status(200).send(toBeDeleted);
    } 
  });

app.use(bookIdRouter);

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
