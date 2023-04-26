const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controller/auth");

router.post("/authlogin", upload.none(), authController.loginAuth);

router.get("/login", authMiddleware.checkJWT, authController.loginCtrl);

router.get("/logout", authController.logoutCtrl);

module.exports = router;
