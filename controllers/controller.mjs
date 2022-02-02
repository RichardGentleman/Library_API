import joi from "joi";
import { library } from "../sourceData/sourceData.mjs";

const validateFunction = (book) => {
  const scheme = joi.object({
    title: joi.string().required(),
    author: joi.string().required(),
    pages: joi.number().optional(),
    tags: joi.array().optional(),
    id: joi.number().optional(),
  });
  return scheme.validate(book);
};

export const tagsList = async (req, res) => {
  const tags = [];
  await library.forEach((book) => {
    tags.push(...book.tags);
  });
  let filteredTagsArray = [...new Set(tags)];
  res.status(200).send(filteredTagsArray);
};

export const booksList = async (req, res) => {
  const books = [];
  await library.forEach((book) => {
    books.push(book);
  });
  res.status(200).send(books);
};

export const postBook = async (req, res) => {
  const book = req.body;
  book["id"] = 0;
  (await validateFunction(book).error)
    ? res.status(405).send("New book not valid")
    : res.status(200).send(book);
};

export const getBookById = async (req, res) => {
  const book = library[req.params.id];
  if (book) {
    res.status(200).send(book);
  } else if (isNaN(req.params.id)) {
    res.status(400).send("Invalid ID format supplied");
  } else {
    res.status(404).send("Book not found");
  }
};

export const updateBookById = async (req, res) => {
  const book = library[req.params.id];
  if (book) {
    book.title = req.body.title;
    book.author = req.body.author;
    book.pages = req.body.pages;
    book.tags = req.body.tags;
    book.id = req.params.id;
    validateFunction(req.body).error
      ? res.status(405).send("New book not valid")
      : res.status(200).send(book);
  } else if (isNaN(req.params.id)) {
    res.status(400).send("Invalid ID format supplied");
  } else if (!book) {
    res.status(404).send("Book not found");
  }
};

export const deleteBookById = async (req, res) => {
  const toBeDeleted = library[req.params.id];

  if (isNaN(req.params.id)) {
    res.status(400).send("Invalid ID format supplied");
  } else if (!toBeDeleted) {
    res.status(404).send("Book not found");
  } else if (toBeDeleted) {
    res.status(200).send(toBeDeleted);
  }
};
