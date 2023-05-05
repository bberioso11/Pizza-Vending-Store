const express = require("express");
const router = express.Router();
const checkouttCtrl = require("../controller/checkout");

router.get("/checkout", checkouttCtrl.checkoutRender);

module.exports = router;
