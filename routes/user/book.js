const express = require('express');
const multer = require('multer');

const fs = require('fs');

const bookController = require('../../app/controllers/book');
const httpException = require('../../app/helpers/httpException');
const isAuth = require('../../app/middlewares/authenticated');
const validationMiddleware = require('../../app/middlewares/validtionMiddleware');
const validate = require('../../app/joiSchemas/book');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    file.newName = file.fieldname + '-' + uniqueSuffix + '-' + file.originalname;
    cb(null, file.newName);
  }
})

const upload = multer({ storage: storage })

const makeBook = async (req, res, next) => {
  try {
    const book = await bookController.createBook(req.body, req?.file?.originalname, req.user._id);
    res.status(200).json({ book });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.newName, (unlinkErr) => {});
    }
    next(new httpException(400, error.message));
  }
}

const deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await bookController.getBookDetails(id, req.user._id);
    await bookController.deleteBook(id);
    if (book?.coverPhoto) {
      fs.unlinkSync('public/uploads/' + book?.coverPhoto);
    }
    res.status(200).json({ status: 'Deleted successfully' });
  } catch (error) {
    next(new httpException(400, error.message));
  }
}
const updateBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await bookController.editBook(id, req.body, req.user._id);
    res.status(200).json({ status: 'Updated successfully', updatedBook: book });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync('public/uploads/' + req.file.newName);
    }
    next(new httpException(400, error.message));
  }
}

const getBooks = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const { name, category, author } = req.query;
    const books = await bookController.searchBooks(page, { name, category, author });
    res.status(200).json(books);
  } catch (error) {
    next(new httpException(400, error.message));
  }
};

const getBook = async (req, res, next) => {
  try {
    const book = await bookController.getBookDetails(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    next(new httpException(400, error.message));
  }
};

const editReviews = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    req.body.userId = req.user._id;
    req.body.username = req.user.firstName + ' ' + req.user.lastName;
    const updatedReview = await bookController.updatedReview(bookId, req.body);
    res.status(200).json(updatedReview);
  } catch (error) {
    next(new httpException(400, error.message));
  }
};

const getReviews = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const reviews = await bookController.getReviews(bookId);
    res.status(200).json(reviews);
  } catch (error) {
    next(new httpException(400, error.message));
  }
};

const editRatings = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    req.body.userId = req.user._id;
    const rates = await bookController.updateRating(bookId, req.body);
    res.status(200).json(rates);
  } catch (error) {
    next(new httpException(400, error.message));
  }
};


router.get('/', getBooks);
router.get('/:id', getBook);
router.get('/:id/reviews', isAuth, getReviews);
router.patch('/:id/review', isAuth, upload.none(), validationMiddleware(validate.reviews), editReviews);
router.patch('/:id/rate', isAuth, upload.none(), validationMiddleware(validate.rates), editRatings);
router.get('/:id', isAuth, getBook);
router.post('/', isAuth, upload.single("coverPhoto"), validationMiddleware(validate.createBook), makeBook);
router.delete('/:id', isAuth, deleteBook);
router.patch(`/:id`, isAuth, upload.single("coverPhoto"), validationMiddleware(validate.updateBook), updateBook);

module.exports = router;