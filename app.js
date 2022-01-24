const express = require("express");
const app = express();
const joi = require("joi");
app.use(express.json());

const library = [
  {
    title: "Robinson Crusoe",
    author: "Daniel Defoe",
    pages: 300,
    tags: ["adventure", "history"],
    id: 0,
  },
  {
    title: "The Unbearable Lightness of Being",
    author: "Milan Kundera",
    pages: 250,
    tags: ["philosophical", "novel"],
    id: 1,
  },
  {
    title: "Nausea",
    author: "Jean-Paul Sartre",
    pages: 120,
    tags: ["philosophical", "existentialism", "novel"],
    id: 2,
  },
];

const validateFunction = (book) => {
  const scheme = joi.object({
    title: joi.string().required(),
    author: joi.string().required(),
    pages: joi.number().optional(),
    tags: joi.array().optional(),
    id: joi.number().optional(),
  });
  return scheme.validate(book);
}

app.get("/book/tags", (req, res) => {
  const tags = [];
  library.forEach((book) => {
    tags.push(...book.tags);
  });
  let filteredTagsArray = [...new Set(tags)];
  res.status(200).send(filteredTagsArray);
});

const bookRouter = express.Router();
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

const bookIdRouter = express.Router();
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
      validateFunction(req.body).error ? res.status(405).send("New book not valid") : res.status(200).send(library);
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
      const updatedList = library.filter(book => book.id !== toBeDeleted.id);
      res.status(200).send(updatedList);
    } 
  });

app.use(bookIdRouter);

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
