const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../../models/User');
const logger = require('../../config/logger');

const secretKey = process.env.JWT_SECRET_KEY;

const registerController = async (req, res) => {
  try {
    const {
      name, email, password
    } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ errors: ['Email is already registered'] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await user.save();

    const token = jwt.sign({
      // eslint-disable-next-line no-underscore-dangle
      _id: user._id, name: user.name, email: user.email,
    }, secretKey);

    res.cookie('token', token, {
      httpOnly: true,
      credentials: true,
    });

    return res.status(201).json({ token });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ errors: ['Internal server error'] });
  }
};

module.exports = registerController;
