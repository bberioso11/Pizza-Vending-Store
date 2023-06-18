const Products = require("../models/products");
const products = new Products();

exports.checkoutRender = async (req, res) => {
  const userID = res.locals.userID;
  const myCarts = await products.filteredCart(userID);
  res.render("checkout", { myCarts });
};
