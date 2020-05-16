const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authAdmin = require("../middleware/authAdminMiddleware");
const errorChecker = require("../middleware/errorChecker");
const {
  createNewElection,
  getElectionIDfromAddress,
} = require("../db/queries/elections");
const {
  addVotingStation,
  removeVotingStation,
  checkVotingStation,
  getAllVotingStations,
} = require("../db/queries/votingStations");
const {
  checkCitizenID,
  getElegibleCitizens,
} = require("../db/queries/citizens");
const {
  genOneTimeCode,
  checkIfAlreadyGenerated,
  checkIfValidCode,
  useCodeToVote,
} = require("../db/queries/oneTimeCode");

//@route GET /db/hello
//@desc Test API
//@access Public
router.get("/hello", async (req, res) => {
  res.status(200).send("Hello");
});

//@route POST /db/createElection
//@desc Allows an admin to create an election
//@access Authenticated admin
router.post(
  "/createElection",
  [
    check(
      "publicAddress",
      "Public Address of the election must be provided and at least 42 characters"
    )
      .exists()
      .isLength({ min: 10 }),
    errorChecker,
    authAdmin,
  ],
  async (req, res) => {
    const { publicAddress } = req.body;
    try {
      await createNewElection(publicAddress);
    } catch (err) {
      res.status(400).json({ error: "Could not react database" });
    }

    res.status(200).send({ publicAddress });
  }
);

//@route POST /db/getElectionID
//@desc returns the ID stored on the MySQL DB for the election address
//@access Authenticated admin
router.post(
  "/getElectionID",
  [
    check(
      "publicAddress",
      "Public Address of the election must be provided and at least 42 characters"
    )
      .exists()
      .isLength({ min: 10 }),
    errorChecker,
    authAdmin,
  ],
  async (req, res) => {
    const { publicAddress } = req.body;
    let ID = null;
    try {
      ID = await getElectionIDfromAddress(publicAddress);
    } catch (err) {
      res.status(400).json({ error: "Could not reach database" });
    }

    res.status(200).send({ electionID: ID });
  }
);

//@route POST /db/addVotingStation
//@desc returns the ID stored on the MySQL DB for the election address
//@access Authenticated admin
router.post(
  "/addVotingStation",
  [
    check(
      "publicAddress",
      "Public Address of the voting station must be provided and at least 42 characters"
    )
      .exists()
      .isLength({ min: 10 }),
    check(
      "electionID",
      "The election ID must be provided to store a copy on DB"
    )
      .exists()
      .isInt(),
    errorChecker,
    authAdmin,
  ],
  async (req, res) => {
    const { publicAddress, electionID } = req.body;
    try {
      await addVotingStation(publicAddress, electionID);
    } catch (err) {
      res.status(400).json({ error: "Could not reach database" });
    }

    res.status(200).json({ result: "success" });
  }
);

//@route POST /db/removeVotingStation
//@desc removes a voting station from the mysql db
//@access Authenticated admin
router.post(
  "/removeVotingStation",
  [
    check(
      "publicAddress",
      "Public Address of the voting station must be provided and at least 42 characters"
    )
      .exists()
      .isLength({ min: 10 }),
    check(
      "electionID",
      "The election ID must be provided to store a copy on DB"
    )
      .exists()
      .isInt(),
    errorChecker,
    authAdmin,
  ],
  async (req, res) => {
    const { publicAddress, electionID } = req.body;
    try {
      await removeVotingStation(publicAddress, electionID);
    } catch (err) {
      res.status(400).json({ error: "Could not reach database" });
    }

    res.status(200).json({ result: "success" });
  }
);

//@route POST /db/checkVotingStation
//@desc check if a voting station is already added to the election
//@access Authenticated admin
router.post(
  "/checkVotingStation",
  [
    check(
      "publicAddress",
      "Public Address of the voting station must be provided and at least 42 characters"
    )
      .exists()
      .isLength({ min: 10 }),
    check("electionID", "The election ID must be provided").exists().isInt(),
    errorChecker,
    authAdmin,
  ],
  async (req, res) => {
    const { publicAddress, electionID } = req.body;
    try {
      const count = await checkVotingStation(publicAddress, electionID);
      res.status(200).json({ count });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  }
);

//@route POST /db/getAllVotingStation
//@desc check if a voting station is already added to the election
//@access Authenticated admin
router.post(
  "/getAllVotingStations",
  [
    check("electionID", "Mandatory field for search").exists().isInt(),
    errorChecker,
    authAdmin,
  ],
  async (req, res) => {
    const { electionID } = req.body;
    try {
      const votingStations = await getAllVotingStations(electionID);
      res.status(200).json({ votingStations });
    } catch (err) {
      res.status(400);
    }
  }
);

//@route POST /db/checkCitizen
//@desc checks if a citizen is present in the authorized DB
//@access Authenticated admin
router.post(
  "/checkCitizen",
  [
    check("cardID", "CardID Mandatory Field").exists().isLength(9),
    check(
      "electionAddress",
      "Election Address must be provided and at least 42 characters"
    )
      .exists()
      .isLength({ min: 10 }),
    errorChecker,
    authAdmin,
  ],
  async (req, res) => {
    const { cardID, electionAddress } = req.body;
    try {
      const citizen = await checkCitizenID(cardID);
      if (citizen.length === 0) {
        throw new Error("Citizen not in authorised database");
      }

      const alreadyGen = await checkIfAlreadyGenerated(cardID, electionAddress);

      if (alreadyGen[0]["count"] > 0) {
        throw new Error("Citizen already obtained code for the election");
      }

      let code = { code: Math.floor(100000 + Math.random() * 900000) };
      await genOneTimeCode(code.code, cardID, electionAddress);

      res.status(200).json({ citizen, code });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

//@route POST /db/checkCcode
//@desc checks if a citizen is present in the authorized DB
//@access Authenticated admin
router.post(
  "/checkCode",
  [
    check("code", "Code Mandatory Field").exists().isLength(6),
    check("cardID", "CardID Mandatory Field").exists().isLength(9),
    check(
      "electionAddress",
      "Election Address must be provided and at least 42 characters"
    )
      .exists()
      .isLength({ min: 10 }),
    errorChecker,
    authAdmin,
  ],
  async (req, res) => {
    const { code, cardID, electionAddress } = req.body;
    try {
      const isValid = await checkIfValidCode(code, cardID, electionAddress);
      if (isValid["valid"] !== 1) {
        throw new Error("Code not valid or already used");
      }
      await useCodeToVote(code, cardID, electionAddress);
      res.status(200).send({ valid: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

//@route GET /db/citizensCount
//@desc returns the number of citizens in election
//@access Authenticated admin
router.get("/citizenCount", async (req, res) => {
  try {
    const citizens = await getElegibleCitizens();
    res.status(200).json({ citizens });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
