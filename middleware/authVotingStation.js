// This middleware verifies if the voting station is using a valid account stored on the election smart contract
// if it does not, reject the API request
var HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledElection = require("../ethereum/build/Election.json");

const config = require("config");
const provider = new HDWalletProvider(
  config.get("mneumonic"),
  config.get("infuraAPI")
);

const web3 = new Web3(provider);

module.exports = async (req, res, next) => {
  try {
    let { MetaAddress, ElectionAddress } = req.params;
    if (!MetaAddress || !ElectionAddress) {
      ElectionAddress = req.body.electionAddress;
      MetaAddress = req.body.stationAddress;
    }
    const instance = new web3.eth.Contract(
      JSON.parse(compiledElection.interface),
      ElectionAddress
    );

    const votingStation = await instance.methods
      .votingStations(MetaAddress)
      .call();
    if (!votingStation) {
      return res
        .status(400)
        .json({ error: "You are not loggin in as a voting station" });
    }
    next();
  } catch (err) {
    next(err);
  }
};
