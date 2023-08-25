const express = require('express');
// routers
const bookRoutes = require('./user/book');
const userRoutes = require('./user/index');
// handle errors
const { notFound } = require('../app/controllers');
const { errorHandler } = require('../app/middlewares');

const router = express.Router();

router.use('/', userRoutes);
router.use('/books', bookRoutes);
router.all('*', notFound);
router.use(errorHandler);

module.exports = router;
