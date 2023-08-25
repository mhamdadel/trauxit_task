const logger = require('../../config/logger');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
async function updateProfile(req, res) {
  const { name, password } = req.body;

  const update = {};
  if (name) {
    update.name = name;
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    update.password = hashedPassword;
  }

  try {
    const updatedUser = await User.findOneAndUpdate({ email: req.user.email }, update);
    if (!updatedUser) {
      return res.status(404).json({ errors: ['User not found'] });
    }
    return res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ errors: ['Internal server error'] });
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ errors: ['User not found'] });
    }
    return res.json(user);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ errors: ['Internal server error'] });
  }
}

module.exports = {
  updateProfile,
  getProfile,
};
