const joi = require('joi');


const reviews = joi.object({
  rating: joi.number().required().min(0).max(5),
  comment: joi.string().required()
});

const rates = joi.object({
  rating: joi.number().required().min(0).max(5)
})

const createBook = joi.object({
  coverPhoto: joi.string(),
  name: joi.string().min(5).required(),
  author: joi.string().required(),
  categories: joi.array().required(),
  description: joi.string().required()
});

const updateBook = joi.object().keys({
  coverPhoto: createBook.extract('coverPhoto'),
  name: createBook.extract('name').optional(),
  author: createBook.extract('author').optional(),
  categories: createBook.extract('categories').optional(),
  description: createBook.extract('description').optional()
});


module.exports = { createBook, updateBook, reviews , rates};