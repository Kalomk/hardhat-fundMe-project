import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'hardhat-deploy'
import "@nomiclabs/hardhat-etherscan";
require('hardhat-gas-reporter')
import * as dotenv from 'dotenv'
dotenv.config()

const SEPOLIA_URL = process.env.RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHER_SCAN_API = process.env.ETHER_SCAN_API
const COIN_MARKET_API = process.env.COIN_MARKET_API

const config: HardhatUserConfig = {
  // solidity: "0.8.18",
  solidity:{
    compilers:[{version:"0.8.18"},{version:"0.7.6"}]
  },
  defaultNetwork:'hardhat',
  networks:{
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
  },
    sepolia:{
      url:SEPOLIA_URL,
      accounts:[PRIVATE_KEY!],
      chainId:11155111,
    }
  },
  etherscan:{
apiKey:ETHER_SCAN_API
  },
  gasReporter:{
noColors:true,
enabled:true,
outputFile: 'gas-report.txt',
currency:'USD',
coinmarketcap:COIN_MARKET_API
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
};

export default config;
