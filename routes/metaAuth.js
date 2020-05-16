const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const authElectionAdmin = require("../middleware/authElectionAdmin");
const authVotingStation = require("../middleware/authVotingStation");
const MetaAuth = require("meta-auth");
const metaAuth = new MetaAuth({
  banner: "E-Vote Login Verification",
});

//@route GET /auth/test
//@desc Test API
//@access Public
router.get("/hello/:MetaAddress", authElectionAdmin, async (req, res) => {
  res.status(200).send("hello");
});

//@route GET /auth/:publicaddress
//@desc receives the account public address and sends challenge msg to sign
//@access Public (middleware verifies if address is admin of the system)
router.get(
  "/challengeRequest/:MetaAddress",
  [authElectionAdmin, metaAuth],
  (req, res) => {
    // Request a message from the server
    if (req.metaAuth && req.metaAuth.challenge) {
      res.send(req.metaAuth.challenge);
    }
  }
);

//@route GET /auth/:originalMessage/:signedMessage
//@desc the middleware stores the address of the request and then verifies if
//@desc signed message comes from the same public address it requested it
//@access Public
router.get(
  "/challengeVerify/:MetaMessage/:MetaSignature",
  metaAuth,
  (req, res) => {
    if (req.metaAuth && req.metaAuth.recovered) {
      // Signature matches the cache address/challenge
      // Authentication is valid, assign JWT, etc.
      try {
        const payload = {
          publicAddress: req.metaAuth.recovered,
          date: new Date(),
        };
        const token = jwt.sign(payload, config.get("jwtSecret"), {
          expiresIn: "120m",
        });
        if (!token)
          throw new Error("Could not create token, please try again later");
        res.status(200).json({
          address: req.metaAuth.recovered,
          token,
        });
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      // Sig did not match, invalid authentication
      res.status(401).json({ Error: "signature does not match" });
    }
  }
);

//@route GET /auth/checkAccess
//@desc Verifies if the authenticated client has a valid jsonwebtoken
//@access Public
router.get("/checkAccess", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    res.status(200).json({ decoded });
  } catch (err) {
    res.status(401).json({ Error: err });
  }
});

//@route GET /auth/:publicaddress
//@desc receives the account public address and sends challenge msg to sign
//@access Public (middleware verifies if address is admin of the system)
router.get(
  "/stationchallengeRequest/:MetaAddress&:ElectionAddress",
  [authVotingStation, metaAuth],
  (req, res) => {
    //Request a message from the server
    if (req.metaAuth && req.metaAuth.challenge) {
      res.send(req.metaAuth.challenge);
    }
  }
);

module.exports = router;
