// used to export an instance of the election bytecode and interface in order to use the methods inside the application

import web3 from "./web3";
import Election from "./build/Election.json";

export default (address) => {
  return new web3.eth.Contract(JSON.parse(Election.interface), address);
};
