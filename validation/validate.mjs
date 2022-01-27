import joi from "joi";

export const validateFunction = (book) => {
    const scheme = joi.object({
      title: joi.string().required(),
      author: joi.string().required(),
      pages: joi.number().optional(),
      tags: joi.array().optional(),
      id: joi.number().optional(),
    });
    return scheme.validate(book);
  }