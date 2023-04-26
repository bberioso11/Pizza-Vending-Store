const Database = require("../config/database");

class Auth extends Database {
  async login(form) {
    const connection = await this.dbconnect();
    const email = form.email;
    const password = form.password;
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM accounts WHERE email = ? AND password = ?",
        [email, password]
      );
      if (rows.length === 1) {
        return {
          isSuccess: true,
          userID: rows[0].id,
        };
      }
      return {
        isSuccess: false,
      };
    } catch (err) {
      console.log("Query failed : ", err);
      return {
        isSuccess: false,
        message: err,
      };
    } finally {
      connection.end();
    }
  }

  async signup(form) {
    const { firstname, lastname, email, password } = form;
    const connection = await this.dbconnect();
    try {
      const checkEmail = await connection.execute(
        `SELECT email FROM accounts WHERE email = ?`,
        [email]
      );
      if (checkEmail[0].length != 0) {
        return {
          isSuccess: false,
          message: "Email is already registered",
        };
      }
      const insertData = await connection.execute(
        `INSERT INTO accounts (firstname, lastname, email, password) VALUES (?, ?, ?, ?)`,
        [firstname, lastname, email, password]
      );
      return {
        isSuccess: true,
        message: "Successfully created account",
      };
    } catch (err) {
      console.log(err);
      return {
        isSuccess: false,
        message: err,
      };
    } finally {
      connection.end();
    }
  }
}

module.exports = Auth;
