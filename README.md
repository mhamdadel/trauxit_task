# trauxit task

# Books api doc

get => get all books => /books <br />
get => get a book => /books/:id <br />
get => get reviews for a book=> /books/:id/reviews <br />
patch => add review for this book => books/:id/review <br />
patch => add rate for this book => books/:id/rate <br />
get => get book => /books/:id <br />
post => create book => /books <br />
delete => delete book => books/:id <br />
patch => update book => books/:id <br />

# Auth and User api doc

post => login => /login <br />
post => register => /register <br />
post => logout => /logout <br />
post => update profile =>  /profile <br />
get => get profile => /profile <br />
get => get forget token => /forget_password/:email <br />
get => reset the passowrd => /reset_password/:token <br />

# book validation schema 

const reviews = joi.object({ <br />
  rating: joi.number().required().min(0).max(5), <br />
  comment: joi.string().required() <br />
}); <br />
 <br />
const rates = joi.object({ <br />
  rating: joi.number().required().min(0).max(5) <br />
}) <br />
 <br />
const createBook = joi.object({ <br />
  coverPhoto: joi.string(), <br />
  name: joi.string().min(5).required(), <br />
  author: joi.string().required(), <br />
  categories: joi.array().required(), <br />
  description: joi.string().required() <br />
}); <br />
 <br />
const updateBook = joi.object().keys({ <br />
  coverPhoto: createBook.extract('coverPhoto'), <br />
  name: createBook.extract('name').optional(), <br />
  author: createBook.extract('author').optional(), <br />
  categories: createBook.extract('categories').optional(), <br />
  description: createBook.extract('description').optional() <br />
});