const {DECIMALS,INITIAL_PRICE,developmentChains} = require('../helper-hardhat-config')

 

import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
const deployMocks: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  // If we are on a local development network, we need to deploy mocks!
  if (chainId == 31337) {
    log("Local network detected! Deploying mocks...")
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    })
    log("Mocks Deployed!")
    log("----------------------------------")
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    )
    log(
      "Please run `yarn hardhat console` to interact with the deployed smart contracts!"
    )
    log("----------------------------------")
  }
}
export default deployMocks
deployMocks.tags = ["all", "mocks"]