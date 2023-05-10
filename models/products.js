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

  async addtoCart(userID, productID, quantity) {
    const productDetails = await this.productDetails(productID);
    const totalPrice = quantity * productDetails.price;

    const connection = await this.dbconnect();
    try {
      const [row] = await connection.execute(
        `SELECT COUNT(*) as total FROM cart WHERE customer_id = ? AND product_id = ?`,
        [userID, productID]
      );
      if (row[0].total === 0) {
        await connection.execute(
          `INSERT INTO cart (customer_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)`,
          [userID, productID, quantity, totalPrice]
        );
        return {
          isSuccess: true,
          message: "Successfull added to cart",
        };
      } else {
        await connection.execute(
          `UPDATE cart SET quantity = quantity + ?, total_price = total_price + ? WHERE customer_id = ? AND product_id = ?`,
          [quantity, totalPrice, userID, productID]
        );
        return {
          isSuccess: true,
          message: "Successfull updated the cart",
        };
      }
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

  async updateCart(userID, productID, quantity) {
    const productDetails = await this.productDetails(productID);
    const totalPrice = quantity * productDetails.price;

    const connection = await this.dbconnect();
    try {
      await connection.execute(
        `UPDATE cart SET quantity = ?, total_price =  ? WHERE customer_id = ? AND product_id = ?`,
        [quantity, totalPrice, userID, productID]
      );
      return {
        isSuccess: true,
        message: "Successfull updated the cart",
      };
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

  async removeCart(userID, productID) {
    const connection = await this.dbconnect();
    try {
      await connection.execute(
        `DELETE FROM cart WHERE customer_id = ? AND product_id = ?`,
        [userID, productID]
      );
      return {
        isSuccess: true,
        message: "Successfully deleted.",
      };
    } catch (err) {
      return {
        isSuccess: false,
        message: "Something wrong.",
        error: err,
      };
    } finally {
      connection.end();
    }
  }

  async myCart(userID) {
    const connection = await this.dbconnect();
    try {
      const [myCart] = await connection.execute(
        `SELECT cart.quantity, products.id AS product_id, products.name AS product_name, products.image AS product_img, products.price AS product_price FROM cart INNER JOIN products ON cart.product_id = products.id WHERE customer_id = ?`,
        [userID]
      );
      return myCart;
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

  async clearCart(userID) {
    const connection = await this.dbconnect();
    try {
      await connection.execute(`DELETE FROM cart WHERE customer_id = ?`, [
        userID,
      ]);
      return {
        isSuccess: true,
        message: "Clear Cart Successfully",
      };
    } catch (err) {
      return {
        isSuccess: false,
        message: "Something Wrong.",
        error: err,
      };
    } finally {
      connection.end();
    }
  }

  async updateQuantity(productID, quantity) {
    const connection = await this.dbconnect();
    try {
      await connection.execute(
        `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
        [quantity, productID]
      );
      return {
        isSuccess: true,
        message: "Update Product Quantity Successfully",
      };
    } catch (err) {
      return {
        isSuccess: false,
        message: "Something Wrong.",
        error: err,
      };
    } finally {
      connection.end();
    }
  }
}

module.exports = Products;
