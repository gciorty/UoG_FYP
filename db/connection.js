// this is the connection module - it creates a pool of 10 connections to the database and
// it handles them asyncronously with promisify (this was different clients do not need to wait for others)
// inside the folder /queries all queries to each table are wrapped inside a 'promise' in order to be handled asyncronously

const util = require("util");
const mysql = require("mysql");
const config = require("config");

const pool = mysql.createPool(config.get("dbConnection"));

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed.");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections.");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused.");
    }
  }

  if (connection) connection.release();

  return;
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);

module.exports = pool;
