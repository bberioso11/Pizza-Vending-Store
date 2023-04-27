const Userdata = require("../models/userdata");
const userdata = new Userdata();

exports.userData = async (req, res, next) => {
  if (!req.userID) {
    res.locals.userID = null;
    res.locals.firstname = "Guest";
  } else {
    const userInfo = await userdata.userDetails(req.userID);
    res.locals.userID = userInfo.id;
    res.locals.firstname = userInfo.firstname;
    res.locals.lastname = userInfo.lastname;
    res.locals.email = userInfo.email;
  }
  next();
};
