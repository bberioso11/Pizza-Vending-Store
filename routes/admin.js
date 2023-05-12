const express = require("express");
const multer = require("multer");
const adminCtrl = require("../controller/admin");
const productCtrl = require("../controller/products");
const customersCtrl = require("../controller/customers");
const transactionsCtrl = require("../controller/transactions");
const accountPermissionsMiddleware = require("../middlewares/accountPermissionsMiddleware");

const router = express.Router();
const upload = multer();

router.use(accountPermissionsMiddleware.positionPermission);

// Invetory
router.get("/api/inventory", productCtrl.productTable);
router.get("/api/view-product/:id", productCtrl.viewProduct);
router.post("/api/save-product", upload.none(), productCtrl.saveProduct);
router.get("/inventory", adminCtrl.inventoryCtrl);

// Customers
router.get("/api/customers", customersCtrl.allCustomers);
router.get("/api/accountdetails/:userID", customersCtrl.accountDetails);
router.delete("/api/accountdelete", customersCtrl.accountDelete);
router.post("/api/account-save", upload.none(), customersCtrl.accountSave);
router.get("/customers", customersCtrl.customersRender);

// Transactions
router.get(
  "/api/transactions-table/:status",
  transactionsCtrl.transactionTable
);
router.delete("/api/transactions-delete", transactionsCtrl.transactionDelete);
router.get("/transactions/:status", transactionsCtrl.transactionRender);

module.exports = router;
