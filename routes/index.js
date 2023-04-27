const express = require("express");
const router = express.Router();
const userdataMiddleware = require("../middlewares/userdataMiddleware");
const indexCtrl = require("../controller/index");

router.get("/", userdataMiddleware.userData, indexCtrl.index);

module.exports = router;
