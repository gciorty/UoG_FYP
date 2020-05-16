const Cryptr = require("cryptr");
const config = require("config");
const cryptr = new Cryptr(config.get("voteSecret"));

function encryptVote(value) {
  const encryptedString = cryptr.encrypt(value);
  return encryptedString;
}

function decryptVote() {
  const decryptedString = cryptr.decrypt(
    "2a8f364f234c3455f22ba60ac81bb350d8b9837e612c2848900343db8a157e0ed871b3e301194d9d6343928a3ea8d07c1d83c0136f942e497332bd573a878600d6904cf928085a631d7e196247558331961eb2f1148071655eacd6ed6fa0e3e4883fb992f12ddc"
  );
  console.log(decryptedString);
}

decryptVote();
