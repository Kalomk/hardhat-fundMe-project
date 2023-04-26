import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { verify } from "../utils/verify"
import { networkConfig,developmentChains } from "../helper-hardhat-config"
const { ethers } = require("hardhat")

const deployFunWithContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore
  const { getNamedAccounts, deployments, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log("----------------------------------------------------")
  log("Deploying FunWithStorage and waiting for confirmations...")
  const funWithStorage = await deploy("FunWithStorage", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: networkConfig[network.name].blockConfirmations || 0,
  })
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(funWithStorage.address, [])
}

log("Logging storage...")
for (let i = 0; i < 4; i++) {
    log(
        `Location ${i}: ${await ethers.provider.getStorageAt(
            funWithStorage.address,
            i
        )}`
    )
}

log("____________________________")
log("logging storage array...")
const index = "0x0000000000000000000000000000000000000000000000000000000000000002"
let newKey = ethers.utils.keccak256(index)
log(await ethers.provider.getStorageAt(funWithStorage.address, newKey))
log('DEC: ' +
  parseInt(await ethers.provider.getStorageAt(funWithStorage.address, newKey)))
log("____________________________")

// log("____________________________")
// log("logging storage mapping...")
// const index2 = "0x0000000000000000000000000000000000000000000000000000000000000003"
// const key = '0x0000000000000000000000000000000000000000000000000000000000000001'
// let newKey2 = ethers.utils.keccak256(index2 + key )
// log(await ethers.provider.getStorageAt(funWithStorage.address, newKey2))
// log('DEC: ' +
//   parseInt(await ethers.provider.getStorageAt(funWithStorage.address, newKey2)))
// log("____________________________")
}

export default deployFunWithContract

deployFunWithContract.tags = ['storage']