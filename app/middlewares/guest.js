const jwt = require('jsonwebtoken');

const guest = (req, res, next) => {
  // const authHeader = req.headers.authorization;
  // const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const tokenFromCookies = req.cookies && req.cookies.token;
  try {
    const { JWT_SECRET_KEY } = process.env;
    const decoded = jwt.verify(tokenFromCookies, JWT_SECRET_KEY);
    if (decoded) {
      return res.status(400).send('page not found');
    }
    return next();
  } catch (error) {
    next();
  }
};

module.exports = guest;
