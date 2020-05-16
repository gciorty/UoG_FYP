const pool = require("../connection");

function addCitizenToDB(cardID, firstName, lastName) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql:
          "insert into citizens (cardID, firstName, lastName) values (?, ?, ?)",
        timeout: 40000, // 40s
        values: [cardID, firstName, lastName],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

function checkCitizenID(cardID) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql: "select firstname, lastName from citizens where (cardID = ?)",
        timeout: 40000, // 40s
        values: [cardID],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

function getElegibleCitizens() {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql: "select count(ID) as count from citizens",
        timeout: 40000, // 40s
        values: [],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result[0]);
      }
    )
  );
}

module.exports = {
  addCitizenToDB,
  checkCitizenID,
  getElegibleCitizens,
};
