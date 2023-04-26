const Products = require("../models/products");
const products = new Products();

const index = async (req, res) => {
  const prod = await products.allProducts();
  res.render("index", { products: prod });
};

module.exports = { index };
