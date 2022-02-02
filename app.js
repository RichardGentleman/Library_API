import express from "express";
import { bookRouter, bookIdRouter, tagsRoute } from "./routes/bookRouter.mjs";
const app = express();
app.use(express.json());

app.use(tagsRoute);

app.use(bookRouter);

app.use(bookIdRouter);

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
