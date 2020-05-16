// This module handles the return of errors for all the other middlewares

const { validationResult } = require("express-validator");

module.exports = function errorChecker(req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).json(errors);
  }
  next();
};
