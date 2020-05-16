const Web3 = require("web3");
const config = require("config");
var HDWalletProvider = require("truffle-hdwallet-provider");
const InputDataDecoder = require("ethereum-input-data-decoder");
const ABIpath = "../ethereum/build/ElectionABI.json";
const ABIFile = require(ABIpath);
const decoder = new InputDataDecoder(ABIFile);

const provider = new HDWalletProvider(
  config.get("mneumonic"),
  config.get("infuraAPI")
);

const web3 = new Web3(provider);

const tx = async () => {
  txHash = "0x9dc687c46851ed21f9bb9753a2901f1355e6c2d894d29e45104cd019795deac6";
  const tx = await web3.eth.getTransaction(txHash);
  console.log(tx);
};

tx();
