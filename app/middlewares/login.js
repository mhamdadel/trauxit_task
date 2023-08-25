const Joi = require('joi');
// eslint-disable-next-line import/no-extraneous-dependencies
const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 6,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 5,
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: passwordComplexity(complexityOptions).required(),
});

const validateLoginRequest = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map((e) => e.message) });
  }
  next();
};

module.exports = validateLoginRequest;
