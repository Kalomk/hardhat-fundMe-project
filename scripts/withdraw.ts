import { getNamedAccounts,ethers } from "hardhat";

async function main() {
    const {deployer} = await getNamedAccounts()
    const fundMe = await ethers.getContract('FundMe',deployer)
    console.log('Deploying proccess')
    const transactionResponse = await fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log('Withdrawed!')
}

main().then(() => process.exit(0))
.catch((error) =>{
    console.error(error)
    process.exit(1)
}
)