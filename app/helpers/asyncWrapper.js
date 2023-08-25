const asyncWrapper = (promise) => promise
  .then((data) => ([undefined, data]))
  .catch((err) => ([err]));

module.exports = asyncWrapper;
