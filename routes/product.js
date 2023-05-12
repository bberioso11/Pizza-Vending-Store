const express = require("express");
const router = express.Router();
const productCtrl = require("../controller/products");

router.get("/product/:id", productCtrl.productRender);

module.exports = router;
