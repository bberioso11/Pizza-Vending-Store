const jwt = require("jsonwebtoken");
const Auth = require("../models/auth");

const auth = new Auth();

exports.loginCtrl = async (req, res) => {
  res.render("login");
};

exports.loginAuth = async (req, res) => {
  const login = await auth.login(req.body);
  if (login.isSuccess) {
    const token = jwt.sign({ userID: 1 }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 604800,
    });
  }
  res.json(login);
};

exports.logoutCtrl = (req, res) => {
  res.clearCookie("auth_token");
  res.redirect("/");
};

exports.signupCtrl = (req, res) => {
  res.render("signup");
};

exports.signupAuth = async (req, res) => {
  const signup = await auth.signup(req.body);
  res.json(signup);
};
