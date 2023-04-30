const Customers = require("../models/customers");
const customers = new Customers();

exports.customersRender = async (req, res) => {
  res.render("admin/customers");
};

exports.allCustomers = async (req, res) => {
  const response = await customers.allAccounts();
  res.json(response);
};

exports.accountDetails = async (req, res) => {
  const response = await customers.accountDetails(req.params.userID);
  res.json(response);
};

exports.accountDelete = async (req, res) => {
  const response = await customers.accountDelete(req.body.userID[0]);
  res.json(response);
};

exports.accountSave = async (req, res) => {
  const response = await customers.accountSave(req.body);
  res.json(response);
};
