const Transactions = require("../models/transactions");
const transactions = new Transactions();

exports.invoiceRender = async (req, res) => {
  const transactionID = req.params.id;
  const invoice = await transactions.invoice(transactionID);
  res.render("invoice", { invoice });
};
