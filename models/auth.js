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
}

module.exports = Auth;
