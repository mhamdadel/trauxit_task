const axios = require('axios');
// const { redisGet, redisSet, redisClient } = require('../config/redis');
const cache = require('../config/cache');
const asyncWrapper = require('../helpers/asyncWrapper');

module.exports = async function homePage(req, res, next) {
  let {
    q, media_type, page, per_page,
  } = req.query;
  q = q || undefined;
  page = Number.isNaN(Number(page)) ? 1 : page;
  media_type = media_type || 'image,video';
  per_page = (!Number.isNaN(Number(per_page)) && ((per_page > 20 || per_page < 5) ? 10 : per_page)) || 10;
  const startIndex = ((page || 1) - 1) * per_page;
  const cacheKey = {
    q,
    media_type,
    page: page,
    page_size: per_page ,
  };

  const cacheStringKey = JSON.stringify(cacheKey);

  const cachedData = await cache.get(cacheStringKey);
  if (cachedData) {
    return res.status(200).json({
      results: cachedData,
      pagination: {
        page: cacheKey.page,
        per_page: cacheKey.perPage,
      },
    });
  }
  const optionQueryString = {
    params: {
      q,
      media_type,
      page: startIndex + 1,
      page_size: per_page,
    },
  };
  const apiRequest = axios.get(`${process.env.NASA_API_URL}/search`, optionQueryString);
  const [err, data] = await asyncWrapper(apiRequest);
  if (err || data.data === undefined) return next(Error(err.message));
  await cache.set(cacheStringKey, data.data, 3600);

  return res.status(200).json({
    results: data.data,
    pagination: {
      page,
      per_page: per_page,
    },
  });
};
