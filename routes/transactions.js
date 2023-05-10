const express = require("express");
const transactionsCtrl = require("../controller/transactions");
const router = express.Router();

module.exports = router;

router.get("/transactions/:status", transactionsCtrl.transactionRender);

router.get(
  "/api/transactions-table/:status",
  transactionsCtrl.transactionTable
);
