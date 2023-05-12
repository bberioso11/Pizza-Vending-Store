exports.useridPermission = (req, res, next) => {
  const userID = res.locals.userID;
  if (!userID) {
    res.sendStatus(401);
  } else {
    next();
  }
};

exports.positionPermission = (req, res, next) => {
  const position = res.locals.position;
  if (!position) {
    res.sendStatus(401);
  } else {
    next();
  }
};
