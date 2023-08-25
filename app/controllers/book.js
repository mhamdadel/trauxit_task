const mongoose = require('mongoose');

const logger = require('../config/logger');
const Book = require('../models/Book');
const User = require ('../models/User');

const createBook = async (obj, coverPhoto, userId) => {
    const { name, author, description, categories } = obj;
    try {
        const book = await Book.create({
            userId,
            coverPhoto,
            name,
            author,
            description,
            categories,
        });
        return book;
    } catch (err) {
        throw new Error(err);
    }
};

const deleteBook = async (id, userId) => {
    try {
        const book = await Book.findByIdAndDelete({ _id: id, userId });
        return book;
    } catch (err) {
        throw new Error(err);
    }
};

const editBook = async (id, obj, userId) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate({ _id: id, userId }, obj, {
            new: true,
            runValidators: true,

        });
        return updatedBook;
    } catch (err) {
        throw new Error(err);
    }
};

const getAllBooks = async () => {
    try {
        const books = await Book.find().exec();
        return books;
    } catch (error) {
        throw new Error(error);
    }
};

const searchBooks = async (page, bookFilter) => {
    try {
        const myfilter = {};
        const skip = (page - 1) * 10;
        const limit = 10;
        if (bookFilter.name)
            myfilter.name = { $regex: ".*" + bookFilter.name + ".*" };
        if (bookFilter.author)
            myfilter["author.firstName"] = {
                $regex: ".*" + bookFilter.author + ".*",
            };
        if (bookFilter.category)
            myfilter["categories"].$in = bookFilter.category;

        const books = await Book.aggregate([
            {
                $match: myfilter,
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]).exec();
        return books;
    } catch (error) {
        throw new Error(error);
    }
};

const getBookDetails = async (id) => {
    try {
        const book = await Book.findById(id);
        return book;
    } catch (error) {
        throw new Error(error);
    }
};

const editReview = async (bookId, update) => {
    try {
        await Book.findOneAndUpdate(
            { _id: bookId, "reviews.userId": update.userId },
            {
                $set: {
                    "reviews.$.comment": update.comment,
                    "reviews.$.rating": update.rating,
                },
            },
            { new: true },

        );

        const bID = new mongoose.Types.ObjectId(bookId);
        const avgRate = await Book.aggregate([
            { $match: { _id: bID } },
            {
                $project: {
                    avgRating: { $avg: '$reviews.rating' }
                }
            }
        ]);
        await User.findOneAndUpdate(
            { _id: update.userId, "books._id": bID },
            {
                $set: {
                    "books.$.reviews.rating": new Number(update.rating),
                    "books.$.avgRate": avgRate[0].avgRating
                },
            },
        );
        const updatedBook = await Book.findById(bookId);
        return updatedBook;
    } catch (error) {
        throw new Error(error);
    }
}

const updatedReview = async (bookId, update) => {
    try {
        const book = await getBookDetails(bookId);
        if (book) {
            const userReviewExistInBook = book.reviews?.some((review) =>
                review.userId.equals(update.userId)
            );
            if (userReviewExistInBook) {
                return editReview(bookId, update);
            } else {
                await Book.findByIdAndUpdate(
                    { _id: bookId },
                    { $push: { reviews: update } },
                    { new: true, runValidators: true }
                ).exec();
                const bID = new mongoose.Types.ObjectId(bookId);
                const avgRate = await Book.aggregate([
                    { $match: { _id: bID } },
                    {
                        $project: {
                            avgRating: { $avg: '$reviews.rating' }
                        }
                    }
                ]);
                await User.findOneAndUpdate(
                    { _id: update.userId, "books._id": bID },
                    {
                        $set: {
                            "books.$.reviews.rating": new Number(update.rating),
                            "books.$.avgRate": avgRate[0].avgRating
                        },
                    },
                );
            }
        }
    } catch (error) {
        throw new Error(error);
    }
};

const editRate = async (bookId, rating) => {
    try {
        const updatedRate = await Book.findOneAndUpdate(
            { _id: bookId, "reviews.userId": rating.userId },
            {
                $set: {
                    "reviews.$.rating": rating.rating,
                },
            },
            { new: true }
        );
        const bID = new mongoose.Types.ObjectId(bookId);
        const avgRate = await Book.aggregate([
            { $match: { _id: bID } },
            {
                $project: {
                    avgRating: { $avg: '$reviews.rating' }
                }
            }
        ]);
        await User.findOneAndUpdate(
            { _id: rating.userId, "books._id": bID },
            {
                $set: {
                    "books.$.reviews.rating": new Number(rating.rating),
                    "books.$.avgRate": avgRate[0].avgRating
                },
            },
        );
        return updatedRate;
    } catch (error) {
        throw new Error(error);
    }
};

const updateRating = async (bookId, rating) => {
    try {
        const book = await getBookDetails(bookId);
        if (book) {
            const userReviewExistInBook = book.reviews?.some((review) =>
                review.userId.equals(rating.userId)
            );
            if (userReviewExistInBook) {
                return editRate(bookId, rating);
            } else {
                throw new Error("You have to add a review to the book first!");
            }
        }
    } catch (error) {
        throw new Error(error);
    }
}

const getReviews = async (bookId) => {
    try {
        return await Book.findById(
            { _id: bookId },
            { reviews: 1, _id: 0 }
        ).exec();
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
  createBook,
  deleteBook,
  editBook,
  getAllBooks,
  getBookDetails,
  updatedReview,
  updateRating,
  getReviews,
  searchBooks,
};
