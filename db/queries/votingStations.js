const pool = require("../connection");

function addVotingStation(stationPublicAddress, electionID) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql:
          "insert into votingStations (publicaddress, election_ID) values (?, ?)",
        timeout: 40000, // 40s
        values: [stationPublicAddress, electionID],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

function removeVotingStation(stationPublicAddress, electionID) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql:
          "delete from votingStations where (publicAddress = ? AND election_ID=?)",
        timeout: 40000, // 40s
        values: [stationPublicAddress, electionID],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

function checkVotingStation(stationPublicAddress, electionID) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql:
          "select count(ID) from votingStations where (publicAddress=? AND election_ID = ?)",
        timeout: 40000, // 40s
        values: [stationPublicAddress, electionID],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

function getAllVotingStations(electionID) {
  return new Promise((resolve, reject) =>
    pool.query(
      {
        sql: "select publicAddress from votingStations where (election_ID = ?)",
        timeout: 40000, // 40s
        values: [electionID],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    )
  );
}

module.exports = {
  addVotingStation,
  removeVotingStation,
  checkVotingStation,
  getAllVotingStations,
};
