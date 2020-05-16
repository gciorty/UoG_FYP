const express = require("express");
const router = express.Router();
const config = require("config");
const errorChecker = require("../middleware/errorChecker");
const { check } = require("express-validator");
const authAdmin = require("../middleware/authAdminMiddleware");
const electionFinalized = require("../middleware/electionFinalized");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(config.get("voteSecret"));
const Web3 = require("web3");
var HDWalletProvider = require("truffle-hdwallet-provider");
const provider = new HDWalletProvider(
  config.get("mneumonic"),
  config.get("infuraAPI")
);
const web3 = new Web3(provider);
const InputDataDecoder = require("ethereum-input-data-decoder");
const ABIpath = "../ethereum/utils/ElectionABI.json";
const ABIFile = require(ABIpath);
const decoder = new InputDataDecoder(ABIFile);

//@route GET /vote/test
//@desc Test API
//@access Public
router.get("/hello/", async (req, res) => {
  res.status(200).send("hello");
});

//@route POST /vote/encodeVote
//@desc checks is the request comes from
//@access Public
router.post(
  "/encodeVote",
  [
    check(
      "electionAddress",
      "Public Address of the election must be provided and at least 42 characters"
    )
      .exists()
      .isLength({ min: 10 }),
    check("stationAddress", "Provide Station address").exists(),
    check("votingOption", "Provide voting option").exists(),
    errorChecker,
    authAdmin,
  ],
  async (req, res) => {
    const { votingOption } = req.body;
    const encryptedString = cryptr.encrypt(votingOption);
    res.status(200).json({ encryptedVote: encryptedString });
  }
);

//@route POST /vote/decodeVote
//@desc checks is the request comes from
//@access Public
router.post(
  "/decodeVote",
  [
    check(
      "electionAddress",
      "Public Address of the election must be provided and at least 42 characters"
    )
      .exists()
      .isLength({ min: 10 }),
    check("encodedVote", "You must provide the encoded string of the vote")
      .exists()
      .isString(),
    errorChecker,
    electionFinalized,
  ],
  async (req, res) => {
    const { encodedVote } = req.body;
    const decryptedString = cryptr.decrypt(encodedVote);
    res.status(200).json({ decryptedVote: decryptedString });
  }
);

//@route POST /vote/decodeTransaction
//@desc checks is the request comes from
//@access Public
router.post(
  "/decodeTransaction",
  [
    check(
      "txHash",
      "Please provide your unique election code and ensure is correct"
    )
      .exists()
      .isLength({ min: 64 }),
    errorChecker,
  ],
  async (req, res) => {
    const { txHash } = req.body;
    try {
      const txResult = await web3.eth.getTransaction(txHash);
      const electionAddress = txResult.to;
      const transactionData = decoder.decodeData(txResult.input);
      const encodedVote = transactionData.inputs[0];
      res.status(200).json({ electionAddress, encodedVote });
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

module.exports = router;
