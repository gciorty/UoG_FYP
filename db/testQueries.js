const { addCitizenToDB } = require("./queries/citizens");
var random = require("random-name");
const shortid = require("shortid");

test = async () => {
  try {
    let citizens = [];
    for (let i = 0; i < 32; i++) {
      citizen = {
        cardID: shortid.generate(),
        firstName: random.first(),
        lastName: random.last(),
      };
      citizens.push(citizen);
    }
    for (let i = 0; i < citizens.length - 1; i++) {
      await addCitizenToDB(
        citizens[i].cardID,
        citizens[i].firstName,
        citizens[i].lastName
      );
    }
    // await addCitizenToDB(citizen.cardID, citizen.firstName, citizen.lastName);

    console.log("Ok ");
  } catch (err) {
    console.error(err);
  }

  process.exit();
};
test();
