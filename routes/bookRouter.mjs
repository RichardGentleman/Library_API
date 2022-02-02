import express from "express";
const app = express();
import { tagsList, booksList, postBook, getBookById, updateBookById, deleteBookById } from "../controllers/controller.mjs";

export const bookRouter = express.Router();
export const bookIdRouter = express.Router();
export const tagsRoute = app.get("/book/tags", tagsList);

bookRouter
  .route("/book")
  .get(booksList)
  .post(postBook);

  bookIdRouter
  .route("/book/:id")
  .get(getBookById)
  .put(updateBookById)
  .delete(deleteBookById);