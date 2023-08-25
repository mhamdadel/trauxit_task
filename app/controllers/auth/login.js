const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../models/User');
const logger = require('../../config/logger');

const secretKey = process.env.JWT_SECRET_KEY;

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ errors: ['Invalid email or password'] });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ errors: ['Invalid email or password'] });
    }

    const token = jwt.sign({
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id, name: user.name, email: user.email, role: user.role
    }, secretKey);

    res.cookie('token', token, {
      httpOnly: true,
      credentials: true,
    });

    return res.json({ message: 'Login successful', token });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ errors: ['Internal server error'] });
  }
};

module.exports = loginController;
