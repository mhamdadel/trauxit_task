const Cache = require('node-cache');

const cache = new Cache({ useClones: false });

module.exports = cache;
