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
}

module.exports = Products;
