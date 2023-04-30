const express = require("express");
const multer = require("multer");
const adminCtrl = require("../controller/admin");
const productCtrl = require("../controller/products");
const customersCtrl = require("../controller/customers");
const userdataMiddleware = require("../middlewares/userdataMiddleware");

const router = express.Router();
const upload = multer();

router.use(userdataMiddleware.userData);
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

module.exports = router;
