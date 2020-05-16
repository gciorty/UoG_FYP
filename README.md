# election-blockchain
FYP Blockchain evaluation voting system

Prerequesites:

- Ensure you have node v12 installed on the system (windows, mac, linux).
- Ensure you have Metamask installed on your browser (create an account if you don't have one)
- If you plan to use an Official networks get yourself a free infuraAPI project -> https://infura.io/
- Ensure you have Ethers on your accounts
- Rename config/default_default.json to default.json and add:
      - Factory is added automnatically from step 4
      - the secret for the two jwt tokens of your choice
      - infuraAPI url
      - add the mneumonic of your blockchain account
      - On dbConnection add your database details

Steps to run the application:

1. Clone the repository on your local machine
2. Locale the file /ethereum/contract/Election.sol and on line 8 edit the string to your selected Ethereum admin account
3. run the command: npm install (from terminal inside on the root folder of the projecy)
4. run the command: npm run compile
5. run the command: npm run deploy -> this will return an address of the election
6. run the command: npm run dev (compiles the application in development mode)
7. Browse to localhost:3000
