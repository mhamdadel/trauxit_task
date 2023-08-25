const logoutController = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
};

module.exports = logoutController;
