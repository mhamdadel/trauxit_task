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

const forgetPasswordSchema = Joi.object({
  password: passwordComplexity(complexityOptions).required(),
});

const validateForgetPasswordRequest = (req, res, next) => {
  const { error } = forgetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map((e) => e.message) });
  }
  next();
};

module.exports = validateForgetPasswordRequest;
