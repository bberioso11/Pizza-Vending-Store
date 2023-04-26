const mysql = require("mysql2/promise");

class Database {
  async dbconnect() {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    return connection;
  }
}

module.exports = Database;
