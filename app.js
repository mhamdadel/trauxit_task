const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('./app/config/database');

const app = express();

const { limiter } = require('./app/config/security');

// configuration
app.use(express.static('public'));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());

// Apply the rate limiting middleware to all requests
app.use(limiter);

// previent extended fields and set limit
app.use(express.urlencoded({ extended: false, limit: '512kb' }));
app.use(express.json({ extended: false, limit: '512kb' }));
// app.use(guardByReq);

// header security
app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy('muhammed fixed task'));

// routes
app.use(require('./routes'));

module.exports = app;
