// Script used to deploy a new Election Factory Contract

var HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/ElectionFactory.json");

const fs = require("fs");
const addressJSON = "../config/default.json";
const addressJSONfile = require(addressJSON);

const config = require("config");
const provider = new HDWalletProvider(
  config.get("mneumonic"),
  config.get("infuraAPI")
);

const web3 = new Web3(provider);
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "2000000" });

  console.log("Factory contract deployed to", result.options.address);

  const instance = new web3.eth.Contract(
    JSON.parse(compiledFactory.interface),
    result.options.address
  );

  console.log("Adding Administrator...");
  await instance.methods
    .addAdmin(accounts[0])
    .send({ from: accounts[0], gas: "250000" });

  addressJSONfile.factoryAddress = result.options.address;
  fs.writeFile(
    "./config/default.json",
    JSON.stringify(addressJSONfile),
    function writeJSON(err) {
      if (err) return console.log(err);
      console.log("Config file updated");
    }
  );
};
deploy();
