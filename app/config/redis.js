const redis = require('redis');
const logger = require('./logger');

const redisClient = redis.createClient(process.env.REDIS_PORT);

redisClient.on('connect', () => {
  logger.info('Redis connected');
});

redisClient.on('error', (error) => {
  logger.error('Redis error', error);
});

function redisGet(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function redisSet(key, value, expiration) {
  return new Promise((resolve, reject) => {
    redisClient.setex(key, expiration, value, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  redisClient,
  redisGet,
  redisSet,
};
