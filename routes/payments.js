const express = require("express");
const accountPermissionsMiddleware = require("../middlewares/accountPermissionsMiddleware");
const router = express.Router();

const paymentsCtrl = require("../controller/payments");

//router.use(accountPermissionsMiddleware.useridPermission);

router.post("/create-paypal-order", paymentsCtrl.paypalCreateOrder);
router.post("/capture-paypal-order", paymentsCtrl.paypalCaptureOrder);

router.post("/create-paymongo-checkout", paymentsCtrl.paymongoCreateCheckout);
router.get("/retrive-paymongo-checkout", paymentsCtrl.paymongoRetrieveCheckout);
module.exports = router;
