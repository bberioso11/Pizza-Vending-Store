const express = require("express");
const router = express.Router();
const mycartCtrl = require("../controller/mycart");

router.get("/mycart", mycartCtrl.mycartRender);

router.post("/api/addtocart", mycartCtrl.addtoCart);
router.post("/api/updatecart", mycartCtrl.updateCart);

module.exports = router;
