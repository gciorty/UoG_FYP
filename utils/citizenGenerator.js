// simply used to generate fake citizens on the database

var random = require("random-name");
const shortid = require("shortid");
const pool = require("../db/connection");

let citizens = [];

function generateCitizens() {
  for (let i = 0; i < 10; i++) {
    citizen = {
      cardID: shortid.generate(),
      firstName: random.first(),
      lastName: random.last(),
    };
    citizens.push(citizen);
  }
}

generateCitizens();

addToDB = async () => {
  try {
    let citizens = [];
    for (let i = 0; i < 10; i++) {
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
addToDB();
