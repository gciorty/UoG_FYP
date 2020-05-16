const pool = require("../connection");

function createNewElection(publicAddress) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql: "insert into elections (publicAddress) values (?)",
        timeout: 40000, // 40s
        values: [publicAddress],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

function getElectionIDfromAddress(publicAddress) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql: "select (ID) from elections where (publicAddress = ?)",
        timeout: 40000, // 40s
        values: [publicAddress],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

module.exports = {
  createNewElection,
  getElectionIDfromAddress,
};
