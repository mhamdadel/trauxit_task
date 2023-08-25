
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const bcrypt = require('bcrypt');

const getForgetToken = async function (req, res, next) {
  const { email } = req.params;
  const { JWT_FORGRT_TOKEN } = process.env;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: ['User does not exist']});
    const token = await jwt.sign({ email }, JWT_FORGRT_TOKEN, {
      expiresIn: '6h',
    });

    return res.json(`http://localhost:4000/reset_password/${token}`);
  } catch (err) {
    next(Error(err.message));
  };

}

const resetPassword = async function (req, res, next) {
  const { token } = req.params;
  const { password } = req.body;
  const { JWT_FORGRT_TOKEN } = process.env;

  try {
    const decoded = await jwt.verify(token , JWT_FORGRT_TOKEN);
    if(!decoded) 
      return res.status(403).json({ errors: ['Token is invalid']});
    const filter = {email: decoded.email},
          update = {password: await bcrypt.hash(password, 10)};
    const updatedUser = await User.findOneAndUpdate(filter, update);
    return res.json(updatedUser);
    
  } catch (err) {
    next(Error(err.message));
  };

}

module.exports = {
  getForgetToken,
  resetPassword
}