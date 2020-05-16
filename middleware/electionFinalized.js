// This middleware is used to check if an election is finalised, and if it is not, it stops the API route
// Used to check the votes at the end of an election

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
    let { electionAddress } = req.body;

    const instance = new web3.eth.Contract(
      JSON.parse(compiledElection.interface),
      electionAddress
    );

    const finalized = await instance.methods.finalized().call();
    if (!finalized) {
      return res.status(400).json({ error: "The election is not finalized" });
    }
    next();
  } catch (err) {
    next(err);
  }
};
