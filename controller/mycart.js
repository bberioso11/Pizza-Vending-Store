const Products = require("../models/products");
const products = new Products();

exports.mycartRender = async (req, res) => {
  const userID = res.locals.userID;
  const myCarts = await products.myCart(userID);
  res.render("mycart", { myCarts });
};

exports.addtoCart = async (req, res) => {
  const userID = res.locals.userID;
  const productID = req.body.productID;
  const quantity = req.body.quantity;
  if (!userID) {
    res.sendStatus(401);
  } else {
    const response = await products.addtoCart(userID, productID, quantity);
    res.json(response);
  }
};

exports.updateCart = async (req, res) => {
  const userID = res.locals.userID;
  const productID = req.body.productID;
  const quantity = req.body.quantity;
  if (!userID) {
    res.sendStatus(401);
  } else {
    const response = await products.updateCart(userID, productID, quantity);
    res.json(response);
  }
};
