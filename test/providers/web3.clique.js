const Web3 = require("web3");

const provider = new Web3.providers.HttpProvider("http://51.145.142.154:8101");

web3 = new Web3(provider);

module.exports = web3;
