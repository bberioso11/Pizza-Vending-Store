const Database = require("../config/database");
const Products = require("./products");
const products = new Products();

class Transactions extends Database {
  async TransactionsTable(dt, status) {
    const connection = await this.dbconnect();
    try {
      const draw = dt.draw;
      const start = dt.start;
      const length = dt.length;
      const search = dt.search.value;
      const orderColumn = dt.order[0].column;
      const orderDir = dt.order[0].dir;

      let query = `SELECT sales.transaction_id, SUM(sales.total_price) as total_price, transactions.purchase_date, accounts.firstname, accounts.lastname FROM sales INNER JOIN transactions ON transactions.id = sales.transaction_id INNER JOIN accounts ON accounts.id = transactions.customer_id WHERE transactions.status = ?`;

      const [recordsTotal] = await connection.execute(
        `SELECT COUNT(*) as total FROM transactions INNER JOIN accounts ON transactions.customer_id = accounts.id WHERE status = ?`,
        [status]
      );

      if (search) {
        query += ` AND (transactions.id LIKE '%${search}%' OR accounts.firstname LIKE '%${search}%' OR accounts.lastname LIKE '%${search}%')`;
      }

      const [recordsFiltered] = await connection.execute(
        `${query} GROUP BY sales.transaction_id`,
        [status]
      );

      const [data] = await connection.execute(
        `${query} GROUP BY sales.transaction_id ORDER BY ${orderColumn} ${orderDir} LIMIT ${start}, ${length}`,
        [status]
      );
      return {
        draw: parseInt(draw),
        recordsTotal: recordsTotal[0].total,
        recordsFiltered: recordsFiltered.length,
        data: data,
      };
    } catch (err) {
      console.log(err);
      return {
        isSuccess: false,
        message: "Something wrong",
        error: err,
      };
    } finally {
      connection.end();
    }
  }

  async transactionDelete(transactionIDs) {
    const connection = await this.dbconnect();
    try {
      const deletePromises = transactionIDs.map((id) => {
        return new Promise(async (resolve, reject) => {
          try {
            await connection.execute(`DELETE FROM transactions WHERE id = ?`, [
              id,
            ]);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });

      return Promise.all(deletePromises)
        .then(() => {
          return {
            isSuccess: true,
            message: "Successfully deleted",
          };
        })
        .catch((err) => {
          return {
            isSuccess: false,
            message: "Something wrong",
            error: err,
          };
        });
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

  async invoice(transactionID) {
    const connection = await this.dbconnect();
    try {
      let productItems = [];

      // Get Transaction Info
      const [transaction] = await connection.execute(
        `SELECT * FROM transactions WHERE id = ? `,
        [transactionID]
      );

      // Get Sales
      const [sales] = await connection.execute(
        `SELECT * FROM sales WHERE transaction_id = ?`,
        [transactionID]
      );

      const productsPromise = sales.map(async (sale) => {
        try {
          const [product] = await connection.execute(
            `SELECT * FROM products WHERE id = ?`,
            [sale.product_id]
          );
          return product[0];
        } catch (err) {
          console.log(err);
        }
      });

      const products = await Promise.all(productsPromise);
      products.forEach((product) => {
        productItems.push(product);
      });

      // Get Customer Info
      const [customer] = await connection.execute(
        `SELECT id, email, firstname, lastname FROM accounts WHERE id = ?`,
        [transaction[0].customer_id]
      );

      const date = new Date(transaction[0].purchase_date);
      const purchasedDate = date.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });

      return {
        customer: customer[0],
        transaction: {
          id: transactionID,
          uuidv4: transaction[0].uuidv4,
          purchased_date: purchasedDate,
        },
        products: productItems,
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

  async createTransaction(customerID) {
    const connection = await this.dbconnect();
    try {
      // Get User Cart
      const userCarts = await products.myCart(customerID);

      // Insert Transaction
      const [transaction] = await connection.execute(
        `INSERT INTO transactions (status, customer_id, uuidv4) VALUES ('pending', ?, '')`,
        [customerID]
      );

      // Create Sales
      // Iterate User Cart
      userCarts.forEach(async (cart) => {
        await connection.execute(
          `INSERT INTO sales (transaction_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)`,
          [
            transaction.insertId,
            cart.product_id,
            cart.quantity,
            cart.quantity * cart.product_price,
          ]
        );
      });
      return {
        isSuccess: true,
        transactionID: transaction.insertId,
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
}

module.exports = Transactions;
