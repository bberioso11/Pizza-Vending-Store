const Database = require("../config/database");

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
}

module.exports = Transactions;
