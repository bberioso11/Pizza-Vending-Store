const express = require("express");
const invoiceCtrl = require("../controller/invoice");

const router = express.Router();

router.get("/invoice/:id", invoiceCtrl.invoiceRender);

module.exports = router;
