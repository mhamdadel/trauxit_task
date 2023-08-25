# trauxit task

Books api doc

get => get all books => /books
get => get a book => /books/:id
get => get reviews for a book=> /books/:id/reviews
patch => add review for this book => books/:id/review
patch => add rate for this book => books/:id/rate
get => get book => /books/:id
post => create book => /books
delete => delete book => books/:id
patch => update book => books/:id

Auth and User api doc

post => login => /login
post => register => /register
post => logout => /logout
post => update profile =>  /profile
get => get profile => /profile
get => get forget token => /forget_password/:email
get => reset the passowrd => /reset_password/:token

book validation schema 
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