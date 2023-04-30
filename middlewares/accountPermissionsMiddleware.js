exports.accountPermission = (req, res, next) => {
  const userPosition = res.locals.position;
  if (!userPosition) {
    res.sendStatus(404);
  } else {
    next();
  }
};
