// This component uses Web3 to connect to the blockchain with a provider (Http or Metamask)
// it first attemps to connect to Metamask using the brower plugin (window) or then uses the http provider using infura API
const Web3 = require('web3');

let web3; 

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // we are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
    window.addEventListener("load", async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          try {
            // Request account access if needed
            await window.ethereum.enable();
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          window.web3 = new Web3(web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
          console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
        }
      });
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/e1e6215d66654d7eb6afec59bb1d5d1c'
    );
    web3 = new Web3(provider);
}

module.exports = web3;