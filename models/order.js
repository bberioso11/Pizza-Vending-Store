const Database = require("../config/database");
const Transactions = require("./transactions");
const Products = require("./products");
const products = new Products();
const transactions = new Transactions();

class Order extends Database {
  async orderValidate(uuid) {
    const connection = await this.dbconnect();
    try {
      const transaction = await transactions.transactionInfo(uuid);
      if (!transaction) {
        return {
          isSuccess: false,
          message: "Order Not Found.",
        };
      }
      if (transaction.status === "finished") {
        return {
          isSuccess: false,
          message: "This Order is Already Processed.",
        };
      }
      const invoice = await transactions.invoice(transaction.id);
      for await (const product of invoice.products) {
        const productQuantity = await products.checkQuantity(product.id);
        if (productQuantity < product.quantity) {
          return {
            isSuccess: false,
            message: `Insufficient ${product.name} Pizza stocks`,
          };
        }
      }

      return {
        isSuccess: true,
      };
    } catch (err) {
      console.log(err);
    } finally {
      connection.end();
    }
  }

  async orderCapture(uuid) {
    try {
      const transaction = await transactions.transactionInfo(uuid);
      const invoice = await transactions.invoice(transaction.id);
      return invoice.products;
    } catch (err) {
      console.log(err);
    }
  }

  async orderFinish(uuid, status) {
    try {
      const transaction = await transactions.transactionInfo(uuid);
      const invoice = await transactions.invoice(transaction.id);
      const updateQuantityPromise = invoice.products.map(async (product) => {
        return await products.updateQuantity(product.id, product.quantity);
      });
      await Promise.all(updateQuantityPromise);
      const response = await transactions.transactionUpdate(uuid, status);
      return response;
    } catch (error) {
      console.log(error);
      return {
        isSuccess: false,
        message: error,
      };
    }
  }
}

module.exports = Order;
