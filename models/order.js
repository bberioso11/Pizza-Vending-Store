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
    try {
      const validateOrder = await this.orderValidate(uuid);
      if (!validateOrder.isSuccess) {
        return validateOrder;
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            isSuccess: true,
            message:
              "Your order is now ready. Please claim your order at the claiming area.",
          });
        }, 10000);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Order;
