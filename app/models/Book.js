const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String, required: true },
});

const bookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverPhoto: { type: String, default: '' },
  name: { type: String, required: true },
  author: {
    type: 'string',
    required: true,
  },
  categories: { type: [String], default: [] },
  popularity: { type: Number, default: 0 },
  description: { type: String, required: true },
  reviews: { type: [reviewSchema], default: [] },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
