const Payments = require("../models/payments");
const payments = new Payments();

exports.paypalCreateOrder = async (req, res) => {
  const userID = res.locals.userID;
  if (!userID) {
    res.sendStatus(401);
  } else {
    const response = await payments.paypalCreateOrder(userID);
    res.json(response);
  }
};

exports.paypalCaptureOrder = async (req, res) => {
  const userID = res.locals.userID;
  if (!userID) {
    res.sendStatus(401);
  } else {
    const { orderID } = req.body;
    const response = await payments.paypalCapturePayment(userID, orderID);
    res.json(response);
  }
};
