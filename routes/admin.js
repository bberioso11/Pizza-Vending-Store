const express = require("express");
const multer = require("multer");
const adminCtrl = require("../controller/admin");
const productCtrl = require("../controller/products");
const userdataMiddleware = require("../middlewares/userdataMiddleware");
const router = express.Router();
const upload = multer();

router.use(userdataMiddleware.userData);
router.get("/api/inventory", productCtrl.productTable);
router.get("/api/view-product/:id", productCtrl.viewProduct);
router.post("/api/save-product", upload.none(), productCtrl.saveProduct);
router.get("/inventory", adminCtrl.inventoryCtrl);

module.exports = router;
