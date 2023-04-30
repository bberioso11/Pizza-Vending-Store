const Transactions = require("../models/transactions");
const transactions = new Transactions();

exports.transactionRender = (req, res) => {
  const status = req.params.status;
  if (status == "pending" || status == "finished") {
    res.render("admin/transactions");
  } else {
    res.sendStatus(404);
  }
};

exports.transactionTable = async (req, res) => {
  const status = req.params.status;
  const datatables = req.query;
  const response = await transactions.TransactionsTable(datatables, status);
  res.json(response);
};

exports.transactionDelete = async (req, res) => {
  const response = await transactions.transactionDelete(
    req.body.transactionID[0]
  );
  res.json(response);
};
