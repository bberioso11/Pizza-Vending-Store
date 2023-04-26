const jwt = require("jsonwebtoken");

const checkJWT = (req, res, next) => {
  if (req.cookies.auth_token) {
    res.redirect("/");
  }
  next();
};

const verifyJWT = (req, res, next) => {
  const token = req.cookies.auth_token;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      res.redirect("/login");
    }
    next();
  });
};

module.exports = { checkJWT };
