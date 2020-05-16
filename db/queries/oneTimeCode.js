const pool = require("../connection");

function genOneTimeCode(code, cardID, electionAddress) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql:
          "insert into oneTimeCodes (code, cardID, electionAddress, valid) values (? , ?, ?, true)",
        timeout: 40000, // 40s
        values: [code, cardID, electionAddress],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

function checkIfAlreadyGenerated(cardID, electionAddress) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql:
          "select count(ID) as count from oneTimeCodes where (cardID = ? AND electionAddress = ?)",
        timeout: 40000, // 40s
        values: [cardID, electionAddress],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

function checkIfValidCode(code, cardID, electionAddress) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql:
          "select count(ID) as valid from oneTimeCodes where (code = ? AND cardID = ? AND electionAddress = ? AND valid = true)",
        timeout: 40000, // 40s
        values: [code, cardID, electionAddress],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result[0]);
      }
    )
  );
}

function useCodeToVote(code, cardID, electionAddress) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql:
          "update oneTimeCodes set valid = false where (code = ? AND cardID = ? AND electionAddress = ?)",
        timeout: 40000, // 40s
        values: [code, cardID, electionAddress],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result[0]);
      }
    )
  );
}

module.exports = {
  genOneTimeCode,
  checkIfAlreadyGenerated,
  checkIfValidCode,
  useCodeToVote,
};
