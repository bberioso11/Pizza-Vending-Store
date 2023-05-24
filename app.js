const dotenv = require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/authMiddleware");
const userdataMiddleware = require("./middlewares/userdataMiddleware");
const accountPermissionsMiddleware = require("./middlewares/accountPermissionsMiddleware");
const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/product");
const mycartRoutes = require("./routes/mycart");
const checkoutRoutes = require("./routes/checkout");
const paymentsRoutes = require("./routes/payments");
const invoiceRoutes = require("./routes/invoice");
const transactionsRoutes = require("./routes/transactions");
const orderRoutes = require("./routes/order");
const app = express();

app.listen(3000);

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware.verifyJWT);
app.use(userdataMiddleware.userData);

app.use("/admin", adminRoutes);
app.use("/payments", paymentsRoutes);

app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/", productRoutes);
app.use("/order", orderRoutes);

app.use(accountPermissionsMiddleware.useridPermission);
app.use("/", mycartRoutes);
app.use("/", checkoutRoutes);
app.use("/", invoiceRoutes);
app.use("/", transactionsRoutes);
