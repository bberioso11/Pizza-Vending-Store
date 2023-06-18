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

exports.paymongoCreateCheckout = async (req, res) => {
  const userID = res.locals.userID;
  const paymongoID = req.cookies.paymongoID;
  const hostname = req.hostname;
  if (!userID) {
    res.sendStatus(401);
  }
  if (paymongoID) {
    const response = await payments.paymongoRetrieveCheckout(
      userID,
      paymongoID
    );
    const checkoutURL = response.data.attributes.checkout_url;
    res.json(checkoutURL);
  } else {
    const response = await payments.paymongoCreateCheckout(userID, hostname);
    const checkoutURL = response.data.attributes.checkout_url;
    res.cookie("paymongoID", response.data.id, { maxAge: 600000 });
    res.json(checkoutURL);
  }
};

exports.paymongoRetrieveCheckout = async (req, res) => {
  const userID = res.locals.userID;
  const paymongoID = req.cookies.paymongoID;
  if (!userID || !paymongoID) {
    return res.sendStatus(401);
  }
  const response = await payments.paymongoRetrieveCheckout(userID, paymongoID);
  if (response.isSuccess) {
    res.clearCookie("paymongoID");
    res.redirect(`/invoice/${response.transactionID}`);
    res.end();
  }
};
