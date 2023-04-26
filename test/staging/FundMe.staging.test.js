const {ethers,getNamedAccounts} = require('hardhat')
const {assert} = require('chai')
import {developmentChains } from "../helper-hardhat-config"
import { network } from "hardhat"

developmentChains.includes(network.name)?
describe.skip:
describe('FundMe', async function (){
    let FundMe,deployer,MockV3Aggregator;
    const sendValue = ethers.utils.parseEther('1')
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        FundMe = await ethers.getContract('FundMe',deployer)
    })

    it('Withdraw ETH to single funder',async () =>{
        await FundMe.fund({value:sendValue})
        await FundMe.withdraw()
        const endingBalance = await FundMe.provider.getBalance(
            FundMe.address
        )
        assert.equal(endingBalance.toString(),'0')
     })
})