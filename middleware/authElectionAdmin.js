// The middleware verifies if the request to API comes from an admin account of the election factory

var HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("../ethereum/build/ElectionFactory.json");

const config = require("config");
const provider = new HDWalletProvider(
  config.get("mneumonic"),
  config.get("infuraAPI")
);

const web3 = new Web3(provider);

module.exports = async (req, res, next) => {
  try {
    const pubAddress = req.params.MetaAddress;
    const instance = new web3.eth.Contract(
      JSON.parse(compiledFactory.interface),
      "0xd505965Aea57adfD7C5CBb65E54d8b9DD818F793"
    );

    const admin = await instance.methods.admins(pubAddress).call();
    if (!admin) {
      return res
        .status(400)
        .json({ error: "You must be logged in to perform this action" });
    }
    next();
  } catch (err) {
    next(err);
  }
};
