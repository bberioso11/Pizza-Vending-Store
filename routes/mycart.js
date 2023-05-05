const express = require("express");
const router = express.Router();
const mycartCtrl = require("../controller/mycart");

router.get("/mycart", mycartCtrl.mycartRender);

router.get("/api/mycart", mycartCtrl.myCart);
router.post("/api/addtocart", mycartCtrl.addtoCart);
router.post("/api/updatecart", mycartCtrl.updateCart);
router.delete("/api/removecart", mycartCtrl.removeCart);

module.exports = router;
