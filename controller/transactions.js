const Transactions = require("../models/transactions");
const transactions = new Transactions();

exports.transactionRender = (req, res) => {
  const status = req.params.status;
  const userPosition = res.locals.position;
  if (userPosition === "Administrator") {
    if (status == "pending" || status == "finished") {
      res.render("admin/transactions");
    } else {
      res.sendStatus(404);
    }
  } else {
    if (status == "pending" || status == "finished") {
      res.render("transactions");
    } else {
      res.sendStatus(404);
    }
  }
};

exports.transactionTable = async (req, res) => {
  const status = req.params.status;
  const userPosition = res.locals.position;
  const userID = res.locals.userID;
  const datatables = req.query;
  if (userPosition === "Administrator") {
    const response = await transactions.adminTransactionsTable(
      datatables,
      status
    );
    res.json(response);
  } else {
    const response = await transactions.customerTransactionsTable(
      datatables,
      status,
      userID
    );
    res.json(response);
  }
};

exports.transactionDelete = async (req, res) => {
  const response = await transactions.transactionDelete(
    req.body.transactionID[0]
  );
  res.json(response);
};
