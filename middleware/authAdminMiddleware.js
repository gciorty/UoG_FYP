// This middleware verifies for both admin and voting station if they have a valid JWT Token
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res
        .status(400)
        .json({ error: "You must be logged in to perform this action" });
    }

    const decoded = jwt.verify(token, config.get("jwtSecret"));

    req.user = decoded.user;

    next();
  } catch (err) {
    next(err);
  }
};
