const web3 = require("../test/providers/web3.poa");
const Factory = require("../ethereum/build/ElectionFactory.json");

deployContract = async () => {
  accounts = await web3.eth.getAccounts();
  await web3.eth.personal.unlockAccount(accounts[1], "Gabriel1234!", 15000);

  await web3.eth.sendTransaction({
    from: accounts[1],
    to: accounts[0],
    value: 900000000000000,
  });

  const bal = await web3.eth.getBalance(accounts[0]);
  console.log(bal);
  // const factory = await new web3.eth.Contract(JSON.parse(Factory.interface))
  //   .deploy({ data: "0x" + Factory.bytecode })
  //   .send({ from: accounts[1], gas: 2000000 });
  // console.log(factory.options.address);

  // await factory.methods
  //   .createElection(
  //     "2020 Test Election",
  //     "This is an election test. Lorem Ipsum. Please"
  //   )
  //   .send({
  //     from: accounts[1],
  //     gas: 2000000,
  //   });
};

deployContract();
