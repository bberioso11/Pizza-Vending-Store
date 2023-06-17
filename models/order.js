const Database = require("../config/database");
const Transactions = require("./transactions");
const transactions = new Transactions();

class Order extends Database {
  async orderValidate(uuid) {
    const findTransaction = await transactions.findTransaction(uuid);
    if (!findTransaction) {
      return {
        isSuccess: false,
        message: "Order Not Found.",
      };
    }
    const transactionStatus = await transactions.transactionStatus(uuid);
    if (transactionStatus === "finished") {
      return {
        isSuccess: false,
        message: "This Order is Already Processed.",
      };
    }
    return {
      isSuccess: true,
    };
  }

  async orderCapture(uuid) {
    const connection = await this.dbconnect();
    try {
      const [transaction] = await connection.execute(
        `SELECT id FROM transactions WHERE uuidv4 = ?`,
        [uuid]
      );
      const invoice = await transactions.invoice(transaction[0].id);
      return invoice.products;
    } catch (err) {
      console.log(err);
    } finally {
      connection.end();
    }
  }

  async orderFinish(uuid, status) {
    try {
      const response = await transactions.transactionUpdate(uuid, status);
      return response;
    } catch (error) {
      return {
        isSuccess: false,
        message: error,
      };
    }
  }
}

module.exports = Order;
