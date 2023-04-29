const Products = require("../models/products");
const products = new Products();

exports.productTable = async (req, res) => {
  const productData = await products.allProducts();
  res.json(productData);
};

exports.viewProduct = async (req, res) => {
  const productData = await products.viewProduct(req.params.id);
  res.json(productData);
};

exports.saveProduct = async (req, res) => {
  const response = await products.saveProduct(req.body);
  res.json(response);
};
