const assert = require("assert");
const web3 = require("../providers/web3.clique");
const Factory = require("../../ethereum/build/ElectionFactory.json");
const Election = require("../../ethereum/build/Election.json");

// Global Variables
let accounts;
let factory;
let election;
let electionAddress;

beforeEach(async () => {
  // Get account from provider
  accounts = await web3.eth.getAccounts();
  await web3.eth.personal.unlockAccount(accounts[1], "Gabriel1234!", 15000);
});

describe("POA Testing Network -> Deployment", async () => {
  it("Deploy an election factory", async () => {
    factory = await new web3.eth.Contract(JSON.parse(Factory.interface))
      .deploy({ data: "0x" + Factory.bytecode })
      .send({ from: accounts[1], gas: 1500000 });
    console.log(factory.options.address);
    assert.ok(factory.options.address);
  });

  it("Create a new test election (Set OP)", async () => {
    await factory.methods
      .createElection(
        "2020 Test Election",
        "This is an election test. Lorem Ipsum. Please"
      )
      .send({
        from: accounts[1],
        gas: 1500000,
      });
  });

  it("Obtain the newly created election address (Get OP)", async () => {
    const deployedElectionsLenght = await factory.methods
      .getDeployedElectionsLength()
      .call();
    electionAddress = await factory.methods
      .deployedElections(deployedElectionsLenght - 1)
      .call();
  });

  it("Adds two voting options (Set OP)", async () => {
    // Set Voting Option (Just 2)
    election = new web3.eth.Contract(
      JSON.parse(Election.interface),
      electionAddress
    );
    await election.methods.addVotingOption("First Option").send({
      from: accounts[1],
      gas: 500000,
    });
    await election.methods.addVotingOption("Second Option").send({
      from: accounts[1],
      gas: 500000,
    });
  });

  it("Adds a voting station (Set OP)", async () => {
    // Add Voting Station
    await election.methods.addVotingStation(accounts[1]).send({
      from: accounts[1],
      gas: 500000,
    });
  });

  it("Enable the election (Set OP)", async () => {
    await election.methods
      .enableElection()
      .send({ from: accounts[1], gas: 100000 });
  });

  it("Adds 10 votes randomly (Set OP)", async () => {
    const option1 = "First Option";
    const option2 = "Second Option";
    for (let i = 0; i < 100; i++) {
      if (Math.random() >= 0.5) {
        await election.methods
          .castVote(option1)
          .send({ from: accounts[1], gas: 1000000 });
      } else {
        await election.methods
          .castVote(option2)
          .send({ from: accounts[1], gas: 1000000 });
      }
    }
  });

  it("Finalize the election (Set OP)", async () => {
    await election.methods
      .finalizeElection()
      .send({ from: accounts[1], gas: 100000 });
  });

  it("Counts al the votes (Get OP)", async () => {
    const voters = await election.methods.getVotesLength().call();
    const encodedVotes = await Promise.all(
      Array(parseInt(voters))
        .fill()
        .map((element, index) => {
          return election.methods.Votes(index).call();
        })
    );
    assert.equal(voters, encodedVotes.length);
  });
});
