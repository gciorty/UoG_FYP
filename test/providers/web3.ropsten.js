const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");
const config = require("config");
const provider = new HDWalletProvider(
  config.get("mneumonic"),
  config.get("infuraAPIRopsten")
);
const web3 = new Web3(provider);

module.exports = web3;
