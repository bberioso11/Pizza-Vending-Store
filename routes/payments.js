const express = require("express");
const router = express.Router();

const paymentsCtrl = require("../controller/payments");

router.post("/create-paypal-order", paymentsCtrl.paypalCreateOrder);
router.post("/capture-paypal-order", paymentsCtrl.paypalCaptureOrder);

module.exports = router;
