const jwt = require("jsonwebtoken");

exports.checkJWT = (req, res, next) => {
  if (req.cookies.auth_token) {
    res.redirect("/");
  } else {
    next();
  }
};

exports.verifyJWT = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    req.userID = null;
    next();
  } else {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        console.log("Failed to verify token: ", err);
      }
      req.userID = decoded.userID;
      next();
    });
  }
};
