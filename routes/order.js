const express = require("express");
const orderCtrl = require("../controller/order");
const cors = require("cors");
const router = express.Router();

router.use(cors());

router.get("/validate/:uuid", orderCtrl.orderValidate);
router.get("/capture/:uuid", orderCtrl.orderCapture);

module.exports = router;
