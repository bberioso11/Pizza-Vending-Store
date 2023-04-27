const Database = require("../config/database");

class Userdata extends Database {
  async userDetails(userID) {
    const connection = await this.dbconnect();
    try {
      const [userData] = await connection.execute(
        `SELECT id, email, firstname, lastname, password FROM accounts WHERE id = ?`,
        [userID]
      );
      return userData[0];
    } catch (err) {
      console.log(err);
    } finally {
      connection.end();
    }
  }
}

module.exports = Userdata;
