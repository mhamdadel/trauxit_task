const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const tokenFromCookies = req.cookies && req.cookies.token;

  // console.log(tokenFromHeader, tokenFromCookies, tokenFromHeader === tokenFromCookies);
  // if (!tokenFromHeader || !tokenFromCookies || tokenFromCookies !== tokenFromHeader) {
  if (!tokenFromCookies) {
    return res.status(401).json({message: 'unauthorized'});
  }

  try {
    const { JWT_SECRET_KEY } = process.env;
    const decoded = jwt.verify(tokenFromCookies, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({message: 'unauthorized'});
  }
};

module.exports = isAuth;
