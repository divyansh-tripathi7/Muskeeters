const HDWalletProvider = require('@truffle/hdwallet-provider');
// const PrivateKeyProvider = require("truffle-privatekey-provider");
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();
const privateKey = "727e7e59c60b76b8047bc9dac8db8e957b730cfcef0f46a4a7dc22e785582da3";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    // matic: {
    //   provider: () => new HDWalletProvider(privateKey, `https://polygon-mumbai.g.alchemy.com/v2/OnaCffRR7DUuOsGggeqnxXQ0dsSn-TWY`),
    //   network_id: 80001,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true
    // },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 100000
  },

  // Configure your compilers
  
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  target: 'node',
}