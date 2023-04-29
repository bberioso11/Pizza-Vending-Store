const dotenv = require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/authMiddleware");
const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");
const adminRoutes = require("./routes/admin");
const app = express();

app.listen(3000);

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware.verifyJWT);

app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/admin", adminRoutes);
