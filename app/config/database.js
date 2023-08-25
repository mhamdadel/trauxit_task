const mongoClient = require('mongoose');
const logger = require('./logger');

const { MONGO_URL } = process.env;
mongoClient.connect(MONGO_URL)
  .then(() => logger.info('Connected to database'))
  .catch((error) => logger.error('Error connecting to database', error));

module.exports = mongoClient;
