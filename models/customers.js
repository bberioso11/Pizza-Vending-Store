const e = require("express");
const Database = require("../config/database");

class Customers extends Database {
  async allAccounts() {
    const connection = await this.dbconnect();
    try {
      const [customers] = await connection.execute(
        `SELECT id, email, firstname, lastname FROM accounts`
      );
      return customers;
    } catch (err) {
      console.log(err);
    } finally {
      connection.end;
    }
  }

  async accountDetails(userID) {
    const connection = await this.dbconnect();
    try {
      const [details] = await connection.execute(
        `SELECT id, email, firstname, lastname FROM accounts WHERE id = ?`,
        [userID]
      );
      return details[0];
    } catch (err) {
      console.log(err);
    } finally {
      connection.end;
    }
  }

  async accountDelete(userID) {
    const connection = await this.dbconnect();
    try {
      // create a new array containing promise in each data
      const deletePromises = userID.map((id) => {
        return new Promise(async (resolve, reject) => {
          try {
            const [details] = await connection.execute(
              `DELETE FROM accounts WHERE id = ?`,
              [id]
            );
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      });

      // Combine all promises into a single promise
      return Promise.all(deletePromises)
        .then(() => {
          return { isSuccess: true, message: "Successfully deleted" };
        })
        .catch((err) => {
          return {
            isSuccess: false,
            message: "Failed to delete",
            error: err.message,
          };
        });
    } catch (err) {
      return {
        isSuccess: false,
        message: "Failed to delete",
        error: err.message,
      };
    } finally {
      connection.end;
    }
  }

  async accountSave(form) {
    const userID = form.userID;
    const firstname = form.firstname;
    const lastname = form.lastname;
    const email = form.email;
    const connection = await this.dbconnect();
    try {
      await connection.execute(
        `UPDATE accounts SET firstname = ?, lastname = ?, email = ? WHERE id = ?`,
        [firstname, lastname, email, userID]
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
}

module.exports = Customers;
