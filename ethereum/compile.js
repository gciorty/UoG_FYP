// SCript used to compile the solidity contracts contained in the folder /contracts

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); // remove the build folders to reganerate it each time it compiles

const electionPath = path.resolve(__dirname, "contracts", "Elections.sol");
const source = fs.readFileSync(electionPath, "utf8");
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
