const joi = require("joi");
const fs = require("fs");

function validationMiddleware(schema) {
  return async (req, res, next) => {
    try {
      if (!schema.validate(req.body).error) next();
      else {
        if (req.file) {
          const filePath = `${req.file.destination}/${req.file.filename}`
          fs.unlinkSync(filePath);
        }
        next(schema.validate(req.body).error)
      }
    } catch (e) {
      next(e);
    }
  }
}

module.exports = validationMiddleware;