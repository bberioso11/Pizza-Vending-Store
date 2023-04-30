const Database = require("../config/database");

class Products extends Database {
  async allProducts() {
    const connection = await this.dbconnect();
    try {
      const [products] = await connection.execute(`SELECT * FROM products`);
      return products;
    } catch (err) {
      console.log(err);
    } finally {
      connection.end();
    }
  }

  async viewProduct(id) {
    const connection = await this.dbconnect();
    try {
      const [product] = await connection.execute(
        `SELECT * FROM products WHERE id = ?`,
        [id]
      );
      return product[0];
    } catch (err) {
      console.log(err);
    } finally {
      connection.end();
    }
  }

  async saveProduct(form) {
    const connection = await this.dbconnect();
    const productName = form.productName;
    const productID = form.productID;
    const productPrice = form.productPrice;
    const productQuantity = form.productQuantity;

    try {
      await connection.execute(
        `UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?`,
        [productName, productPrice, productQuantity, productID]
      );
      return {
        isSuccess: true,
        message: "Successfully updated",
      };
    } catch (err) {
      return {
        isSuccess: false,
        message: err,
      };
    } finally {
      connection.end();
    }
  }

  async productDetails(id) {
    const connection = await this.dbconnect();
    try {
      const [details] = await connection.execute(
        `SELECT * FROM products WHERE id = ?`,
        [id]
      );
      return details[0];
    } catch (err) {
      return {
        isSuccess: false,
        message: "Something wrong",
        error: err,
      };
    } finally {
      connection.end();
    }
  }
}

module.exports = Products;
