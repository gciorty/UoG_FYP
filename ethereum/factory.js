// used to export an instance of the factory bytecode and interface in order to use the methods inside the application

import web3 from "./web3";
import ElectionFactory from "./build/ElectionFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(ElectionFactory.interface),
  "0x86EFA665a0e570F0c94F937f89f61aFD69C6122C"
);

export default instance;
